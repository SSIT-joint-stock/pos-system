import { Worker, Job, ConnectionOptions } from 'bullmq';
import { createLogger, LoggerInstance } from '@repo/logger';
import { TelegramQueueData, TelegramWorkerResult } from '@repo/dto';
import { TelegramWorkerConfig, createWorkerConfig } from './config';
import { TelegramService } from '@repo/telegram';

export class TelegramWorker {
    private worker: Worker<TelegramQueueData, TelegramWorkerResult>;
    private telegram: TelegramService;
    public logger: LoggerInstance;
    private config: TelegramWorkerConfig;
    private isRunning: boolean = false;
    private isPolling: boolean = false;

    constructor(config: Partial<TelegramWorkerConfig> = {}) {
        this.config = createWorkerConfig(config);
        this.logger = createLogger({
            serviceName: 'TelegramWorker',
            enableConsole: true,
            enableLoki: true,
            logLevel: 'debug',
            env: process.env.NODE_ENV || 'development',
            defaultMeta: {
                component: 'worker-core',
                version: process.env.npm_package_version
            },
            loki: {
                url: process.env.LOKI_URL || 'http://localhost:7100',
                username: process.env.LOKI_USERNAME,
                password: process.env.LOKI_PASSWORD,
                labels: {
                    service: 'telegram-workers',
                    subcomponent: 'worker-instance'
                }
            }
        });
        this.initializeServices();
    }

    private initializeServices() {
        if (!this.config.botToken) {
            throw new Error('Telegram Bot Token is not configured');
        }

        // Initialize Telegram service
        this.telegram = new TelegramService({
            botToken: this.config.botToken,
            recipientId: this.config.defaultRecipientId
        });

        // Initialize worker
        const connection: ConnectionOptions = {
            host: this.config.redis.host,
            port: this.config.redis.port,
            password: this.config.redis.password
        };

        this.worker = new Worker<TelegramQueueData, TelegramWorkerResult>(
            this.config.worker.name,
            async (job) => this.processJob(job),
            {
                connection,
                concurrency: this.config.worker.concurrency,
                limiter: this.config.worker.limiter,
                removeOnComplete: {
                    count: 100
                },
                removeOnFail: {
                    count: 1000
                }
            }
        );

        this.setupWorkerHandlers();
        this.logger.info('Telegram Worker initialized');
    }

    private setupWorkerHandlers() {
        this.worker.on('completed', (job) => {
            this.logger.info('Job completed successfully', {
                jobId: job.id,
                recipientId: job.data.payload.options.recipientId
            });
        });

        this.worker.on('failed', async (job, error) => {
            this.logger.error('Job failed', {
                jobId: job?.id,
                error: error.message,
                data: job?.data
            });

            if (this.config.adminChatId && job) {
                await this.sendErrorNotification(job, error);
            }
        });

        this.worker.on('error', (error) => {
            this.logger.error('Worker error', { error: error.message });
        });
    }

    private async sendErrorNotification(job: Job<TelegramQueueData>, error: Error) {
        try {
            const { payload } = job.data;
            const errorMessage = this.formatErrorMessage(job, error, payload);

            const bot = this.telegram.getBot();
            await bot.telegram.sendMessage(this.config.adminChatId!, errorMessage, {
                parse_mode: 'MarkdownV2',
                disable_notification: false
            });

            this.logger.info('Error notification sent to admin', {
                adminChatId: this.config.adminChatId,
                jobId: job.id
            });
        } catch (notifyError) {
            this.logger.error('Failed to send error notification', {
                error: notifyError instanceof Error ? notifyError.message : 'Unknown error'
            });
        }
    }

    private formatErrorMessage(job: Job<TelegramQueueData>, error: Error, payload: any): string {
        let message = `❌ *Telegram Notification Failed*\n\n`;
        message += `*Job ID:* \`${job.id}\`\n`;
        message += `*Error:* \`${error.message}\`\n`;
        message += `*Timestamp:* \`${new Date().toISOString()}\`\n\n`;
        message += `*Recipient ID:* \`${payload.options.recipientId || 'N/A'}\`\n`;
        message += `*Priority:* \`${payload.options.priority || 'N/A'}\`\n`;
        message += `*Category:* \`${payload.options.category || 'N/A'}\`\n`;

        // Add truncated original message
        if (payload.message) {
            const truncatedMessage = payload.message.substring(0, 200) +
                (payload.message.length > 200 ? '...' : '');
            message += `\n*Original Message:*\n\`\`\`\n${truncatedMessage}\n\`\`\``;
        }

        return message;
    }

    private async processJob(job: Job<TelegramQueueData>): Promise<TelegramWorkerResult> {
        const { payload } = job.data;

        try {
            this.logger.info('Processing job', {
                jobId: job.id,
                recipientId: payload.options.recipientId
            });

            const result = await this.telegram.sendMessage(
                payload.message,
                payload.options
            );

            return {
                success: true,
                response: {
                    ...result,
                    timestamp: Date.now()
                }
            };
        } catch (error) {
            this.logger.error('Failed to process job', {
                jobId: job.id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return {
                success: false,
                error: error as Error
            };
        }
    }

    public async start(): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('Worker is already running');
            return;
        }

        try {
            // 1. Xóa Webhook để đảm bảo không có xung đột nếu bạn không dùng webhook
            //    và muốn một instance khác chạy polling.
            const bot = this.telegram.getBot(); // Lấy instance Telegraf
            try {
                await bot.telegram.deleteWebhook({ drop_pending_updates: true });
                this.logger.info('Attempted to delete any existing webhook.');
            } catch (webhookError: any) {
                // Lỗi có thể xảy ra nếu không có webhook nào được đặt, hoặc bot không có quyền
                // Chúng ta có thể log lỗi này nhưng không nên làm dừng quá trình khởi động worker
                this.logger.warn('Could not delete webhook (this might be normal if none was set)', { error: webhookError.message });
            }

            // 2. KHÔNG launch bot ở đây. Worker này chỉ xử lý jobs từ queue.
            //    this.telegram.launch() hoặc bot.launch() sẽ bắt đầu polling.
            //    Việc lắng nghe lệnh/tin nhắn đến nên ở một instance bot riêng.

            // 3. Chỉ cần đảm bảo kết nối tới Telegram API hoạt động (ví dụ: getMe)
            //    Điều này đã được thực hiện trong TelegramService.verifyConnection() nếu bạn muốn dùng.
            //    Hoặc, một lệnh sendMessage đơn giản cũng có thể xác nhận điều này.
            const botInfo = await bot.telegram.getMe();
            this.logger.info(`Successfully connected to Telegram as bot: ${botInfo.username}`);


            // Chỉ cần worker chạy để lắng nghe queue
            // this.worker.run(); // BullMQ Worker tự động chạy khi được khởi tạo và không bị đóng.
            // Không cần gọi worker.run() một cách tường minh trừ khi bạn có logic đặc biệt.
            // Worker sẽ bắt đầu xử lý jobs ngay khi có job trong queue.

            this.isRunning = true;
            this.logger.info('Telegram Worker started and is ready to process jobs from the queue.');

        } catch (error: any) {
            this.logger.error('Failed to start Telegram Worker', {
                error: error.message,
                stack: error.stack,
            });
            throw error;
        }
    }

    public async stop(): Promise<void> {
        if (!this.isRunning) {
            this.logger.warn('Worker is not running or already stopped.');
            return;
        }
        try {
            await this.worker.close(); // Đóng BullMQ worker
            // Không cần gọi this.telegram.stop() vì chúng ta không launch() nó trong worker này
            this.isRunning = false;
            this.logger.info('Telegram Worker stopped successfully.');
        } catch (error: any) {
            this.logger.error('Failed to stop Telegram Worker', { error: error.message });
            throw error;
        }
    }
}

// // Handle process termination gracefully
// if (require.main === module) {
//     const worker = new TelegramWorker();
    
//     process.on('SIGINT', async () => {
//         worker.logger.info('Received SIGINT signal');
//         await worker.stop();
//         process.exit(0);
//     });

//     process.on('SIGTERM', async () => {
//         worker.logger.info('Received SIGTERM signal');
//         await worker.stop();
//         process.exit(0);
//     });

//     // Start the worker
//     worker.start()
//         .then(() => worker.logger.info('Telegram Worker started successfully for job processing'))
//         .catch(error => {
//             worker.logger.error('Failed to start Telegram Worker for job processing:', error);
//             // Attempt to stop the worker even if start failed partially
//             worker.stop().catch(stopError => {
//                 worker.logger.error('Failed to stop worker during error handling:', stopError);
//             });
//             process.exit(1);
//         });
// } 