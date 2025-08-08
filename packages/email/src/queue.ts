import { Queue, ConnectionOptions, Job } from 'bullmq';
import { createLogger, LoggerInstance } from '@repo/logger';
import { 
    EmailQueueData, 
    EmailPayload,
    EmailOptions as DtoEmailOptions, // DTO version of EmailOptions
    EmailResponse as DtoEmailResponse // DTO version of EmailResponse
} from '@repo/dto';
import { EmailConfig } from './types'; // Corrected: Import EmailConfig from ./types

/**
 * Configuration specific to the Email Queue Service.
 */
export interface EmailQueueServiceConfig extends EmailConfig { // Extends the service's EmailConfig from ./types
    redis: {
        host: string;
        port: number;
        password?: string;
    };
    queue?: Partial<{
        name: string;
        prefix: string;
        attempts: number;
        backoffDelay: number;
        removeOnComplete: number | boolean;
        removeOnFail: number | boolean;
    }>;
    logLevel?: 'debug' | 'info' | 'warn' | 'error'; // Added logLevel directly here
}

/**
 * Internal simplified queue configuration structure.
 */
interface InternalQueueConfig {
    name: string;
    prefix: string;
    attempts: number;
    backoffDelay: number;
    removeOnComplete: number | boolean;
    removeOnFail: number | boolean;
}

const DEFAULT_EMAIL_QUEUE_CONFIG: InternalQueueConfig = {
    name: 'email-notifications', // Default queue name for emails
    prefix: 'leloi-email',      // Default prefix for email queue
    attempts: 3,
    backoffDelay: 10000, // Slightly longer backoff for emails, e.g., 10 seconds
    removeOnComplete: 200, // Keep more completed email jobs if needed for audit
    removeOnFail: 2000     // Keep more failed email jobs for investigation
};

/**
 * Service responsible for enqueueing email messages to be processed by a worker.
 */
export class EmailQueueService {
    private queue: Queue<EmailQueueData, DtoEmailResponse>; // Worker returns DtoEmailResponse
    private config: EmailQueueServiceConfig;
    private internalQueueConfig: InternalQueueConfig;
    private logger: LoggerInstance;

    constructor(config: EmailQueueServiceConfig) {
        this.config = config;
        this.logger = createLogger({ 
            serviceName: 'EmailQueueService',
            ...(this.config.logLevel && { logLevel: this.config.logLevel }) 
        });
        
        this.internalQueueConfig = {
            ...DEFAULT_EMAIL_QUEUE_CONFIG,
            ...(config.queue || {}),
        };

        if (!this.config.user || !this.config.password) { // Basic check for email service auth
            this.logger.warn('Email service user/password might not be fully configured for EmailQueueService init.');
            // Not throwing an error as the queue service itself only needs Redis mostly.
        }

        const connection: ConnectionOptions = {
            host: this.config.redis.host,
            port: this.config.redis.port,
            password: this.config.redis.password,
        };

        this.queue = new Queue<EmailQueueData, DtoEmailResponse>(this.internalQueueConfig.name, {
            connection,
            defaultJobOptions: {
                attempts: this.internalQueueConfig.attempts,
                backoff: {
                    type: 'exponential',
                    delay: this.internalQueueConfig.backoffDelay,
                },
                removeOnComplete: this.internalQueueConfig.removeOnComplete,
                removeOnFail: this.internalQueueConfig.removeOnFail,
            },
            // prefix: this.internalQueueConfig.prefix
        });

        this.logger.info('Email Queue Service initialized', {
            queueName: this.internalQueueConfig.name,
            redisHost: this.config.redis.host,
        });
    }

    /**
     * Enqueue an email to be sent.
     * @param htmlBody HTML content of the email.
     * @param options Options for sending the email (to, subject, etc.).
     * @param textBody Optional plain text content of the email.
     */
    public async sendEmail(
        htmlBody: string, 
        options: DtoEmailOptions, // DTO EmailOptions from @repo/dto
        textBody?: string
    ): Promise<{ success: boolean; jobId?: string; error?: string }> {
        try {
            if (!options.to || !options.subject) {
                throw new Error('Recipient (to) and subject are required to send an email.');
            }

            const payload: EmailPayload = {
                message: htmlBody, // DTO EmailPayload uses `message` for main content
                options: {
                    ...options,
                    from: options.from || this.config.defaultFrom, // Use service default if not provided
                    isHtml: true, // Explicitly set based on parameter
                },
                // textBody can be part of EmailPayload if DTO is updated, or handled by worker
                // For now, assuming worker can derive text from HTML or it's less critical for this basic send.
                // If textBody is important, EmailPayload in DTO should accommodate it.
            };
            
            if (textBody) {
                // If you want to pass textBody explicitly, EmailPayload DTO would need a field for it.
                // Or, adjust the worker to handle it. For now, `message` is htmlBody.
                // A common pattern is to have `html` and `text` fields in the payload.
                // Let's assume for now the `message` field is primary and `isHtml` denotes its type.
                // To include textBody, one might add: payload.textBody = textBody; if DTO supports
            }

            const queueData: EmailQueueData = {
                jobId: crypto.randomUUID(), // Generate a unique ID for the job
                payload,
            };

            const job = await this.queue.add('send-email', queueData, {
                jobId: queueData.jobId, // Use the generated UUID as BullMQ jobId
                priority: options.priority ? this.mapPriority(options.priority) : undefined,
            });

            this.logger.info('Email enqueued successfully', {
                jobId: job.id,
                recipient: options.to,
                subject: options.subject,
            });

            return {
                success: true,
                jobId: job.id,
            };
        } catch (error: any) {
            this.logger.error('Failed to enqueue email', {
                error: error.message,
                stack: error.stack,
            });
            return {
                success: false,
                error: error.message,
            };
        }
    }
    
    private mapPriority(priority: DtoEmailOptions['priority']): number | undefined {
        if (!priority) return undefined;
        // BullMQ priorities: 1 (highest) to MAX_INT. Lower number = higher priority.
        const mapping = {
            'high': 10,
            'medium': 50,
            'low': 100,
        };
        return mapping[priority] || 50; // Default to medium if unknown
    }

    /**
     * Get the status and result of a sent email job.
     */
    public async getEmailStatus(jobId: string): Promise<DtoEmailResponse | null> {
        try {
            const job = await this.queue.getJob(jobId);
            if (!job) {
                this.logger.warn('Email job not found', { jobId });
                return null;
            }

            const state = await job.getState();
            if (state === 'completed') {
                // The returnvalue of the job is DtoEmailResponse as defined in Queue generic
                return job.returnvalue as DtoEmailResponse; 
            }
            
            this.logger.info('Current email job state', { jobId, state });
            // For non-completed states, you might want to return partial info or just null
            // For example, if failed, job.failedReason would be available.
            // For now, only returning result for completed jobs.
            return null; 
        } catch (error: any) {
            this.logger.error('Failed to get email job status', {
                jobId,
                error: error.message,
            });
            return null;
        }
    }

    /**
     * Close the queue and cleanup resources.
     */
    public async close(): Promise<void> {
        try {
            await this.queue.close();
            this.logger.info('Email Queue Service closed successfully');
        } catch (error: any) {
            this.logger.error('Failed to close Email Queue Service', {
                error: error.message,
            });
            throw error;
        }
    }
} 