import { Worker, Job, ConnectionOptions } from 'bullmq';
import { EmailService, EmailOptions } from '@repo/email';
import { createLogger, LoggerInstance } from '@repo/logger';
import { EmailQueueData, EmailWorkerResult, EmailPayload, EmailOptions as DtoEmailOptions } from '@repo/dto';
import { EmailWorkerConfig, createWorkerConfig } from './config';

export class EmailWorker {
    public logger: LoggerInstance;
    private worker: Worker<EmailQueueData, EmailWorkerResult>;
    private emailService: EmailService;
    private config: EmailWorkerConfig;
    private isRunning: boolean = false;

    constructor(config: Partial<EmailWorkerConfig> = {}) {
        this.config = createWorkerConfig(config);
        this.logger = createLogger({
            serviceName: 'EmailWorker',
            enableConsole: true,
            enableLoki: !!this.config.loki?.url,
            logLevel: this.config.logLevel || 'info',
            env: process.env.NODE_ENV || 'development',
            defaultMeta: {
                component: 'email-worker-core',
                version: process.env.npm_package_version,
            },
            loki: this.config.loki,
        });

        console.log("this.config.emailService", this.config);

        this.emailService = new EmailService(this.config.emailService);

        const connection: ConnectionOptions = {
            host: this.config.redisHost,
            port: this.config.redisPort,
            password: this.config.redisPassword,
            // Add other necessary ConnectionOptions here if defined in config
        };

        this.worker = new Worker<EmailQueueData, EmailWorkerResult>(
            this.config.worker.name,
            async (job) => this.processJob(job),
            {
                connection,
                concurrency: this.config.worker.concurrency,
                limiter: this.config.worker.limiter,
                removeOnComplete: this.config.worker.removeOnComplete,
                removeOnFail: this.config.worker.removeOnFail,
            }
        );

        this.setupWorkerHandlers();
        this.logger.info('Email Worker initialized');
    }

    private setupWorkerHandlers(): void {
        this.worker.on('completed', (job, result) => {
            this.logger.info('Email job completed successfully', {
                jobId: job.id,
                recipient: job.data.payload.options.to,
                subject: job.data.payload.options.subject,
                messageId: result.response?.messageId,
            });
        });

        this.worker.on('failed', async (job, error) => {
            this.logger.error('Email job failed', {
                jobId: job?.id,
                recipient: job?.data.payload.options.to,
                subject: job?.data.payload.options.subject,
                error: error.message,
                stack: error.stack,
                data: job?.data,
            });

            // Optionally, send a notification to an admin email if configured
            if (this.config.adminEmail && job) {
                try {
                    const subject = `Email Job Failed: ${job.id}`;
                    let body = `Email Job ID: ${job.id} for recipient(s) ${job.data.payload.options.to} failed.\n`;
                    body += `Subject: ${job.data.payload.options.subject}\n`;
                    body += `Error: ${error.message}\n\n`;
                    body += `Timestamp: ${new Date().toISOString()}\n`;
                    body += `Job Data: ${JSON.stringify(job.data, null, 2)}`;
                    
                    await this.emailService.sendMail({
                        to: this.config.adminEmail!,
                        subject: subject,
                        text: body, // Send as plain text for admin notifications for simplicity
                    });
                    this.logger.info('Sent failure notification to admin email', { adminEmail: this.config.adminEmail, jobId: job.id });
                } catch (notifyError: any) {
                    this.logger.error('Failed to send error notification to admin email', {
                        error: notifyError.message,
                        originalJobId: job.id,
                    });
                }
            }
        });

        this.worker.on('error', (error) => {
            this.logger.error('Email worker encountered an error', { 
                error: error.message,
                stack: error.stack 
            });
        });
    }

    private async processJob(job: Job<EmailQueueData>): Promise<EmailWorkerResult> {
        const { payload } = job.data;
        this.logger.info('Processing email job', {
            jobId: job.id,
            recipient: payload.options.to,
            subject: payload.options.subject,
        });

        const serviceMailOptions: EmailOptions = {
            to: payload.options.to,
            from: payload.options.from || this.config.defaultFromEmail || this.config.emailService.defaultFrom,
            cc: payload.options.cc,
            bcc: payload.options.bcc,
            subject: payload.options.subject,
            attachments: payload.options.attachments,
            template: payload.options.template,
            context: payload.options.context,
        };

        if (payload.options.isHtml) {
            serviceMailOptions.html = payload.message;
        } else if (payload.options.isMarkdown) {
            serviceMailOptions.text = payload.message;
        } else {
            serviceMailOptions.text = payload.message;
        }

        try {
            const serviceCallResult = await this.emailService.sendMail(serviceMailOptions);

            if (serviceCallResult.success) {
                return {
                    success: true,
                    response: {
                        success: true,
                        messageId: serviceCallResult.messageId,
                        timestamp: Date.now(),
                        to: Array.isArray(serviceMailOptions.to) ? serviceMailOptions.to.join(', ') : serviceMailOptions.to,
                        subject: serviceMailOptions.subject,
                    },
                };
            }
            const error = serviceCallResult.error || new Error('Email sending failed as reported by EmailService without specific error object');
            this.logger.error('Email sending failed as reported by EmailService', {
                jobId: job.id,
                error: error.message,
                messageId: serviceCallResult.messageId, 
            });
            return {
                success: false,
                error: error,
            };

        } catch (error: any) {
            this.logger.error('Exception during email job processing', {
                jobId: job.id,
                error: error.message,
                stack: error.stack,
            });
            const processedError = error instanceof Error ? error : new Error(String(error.message || 'Unknown error during job processing'));
            return {
                success: false,
                error: processedError,
            };
        }
    }

    public async start(): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('Email Worker is already running.');
            return;
        }
        try {
            if (typeof this.emailService.verifyConnection === 'function') {
                const connected = await this.emailService.verifyConnection();
                if (!connected) {
                    this.logger.error('Failed to verify connection to email service. Worker will start but may not send emails.');
                } else {
                    this.logger.info('Successfully connected to the email service.');
                }
            }            
            this.isRunning = true;
            this.logger.info(`Email Worker started. Listening to queue: ${this.config.worker.name}`);
        } catch (error: any) {
            this.logger.error('Failed to start Email Worker', {
                error: error.message,
                stack: error.stack,
            });
            throw error; 
        }
    }

    public async stop(): Promise<void> {
        if (!this.isRunning) {
            this.logger.warn('Email Worker is not running or already stopped.');
            return;
        }
        try {
            await this.worker.close();
            this.isRunning = false;
            this.logger.info('Email Worker stopped successfully.');
        } catch (error: any) {
            this.logger.error('Failed to stop Email Worker', { 
                error: error.message,
                stack: error.stack 
            });
            throw error;
        }
    }
} 