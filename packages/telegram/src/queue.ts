import { Queue, ConnectionOptions } from 'bullmq';
import { createLogger } from '@repo/logger';
import { 
    TelegramQueueData, 
    TelegramPayload,
    TelegramOptions,
    TelegramResponse 
} from '@repo/dto';
import { TelegramConfig } from './types';

export interface TelegramQueueConfig extends TelegramConfig {
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
}

interface QueueConfig {
    name: string;
    prefix: string;
    attempts: number;
    backoffDelay: number;
    removeOnComplete: number | boolean;
    removeOnFail: number | boolean;
}

const DEFAULT_QUEUE_CONFIG: QueueConfig = {
    name: 'telegram-notifications',
    prefix: 'leloi',
    attempts: 3,
    backoffDelay: 5000,
    removeOnComplete: 100,
    removeOnFail: 1000
};

/**
 * Service responsible for enqueueing Telegram messages to be processed by a worker
 */
export class TelegramQueueService {
    private queue: Queue<TelegramQueueData>;
    private config: TelegramQueueConfig;
    private queueConfig: QueueConfig;
    private logger = createLogger({ serviceName: 'TelegramQueueService' });

    constructor(config: TelegramQueueConfig) {
        this.config = config;
        this.queueConfig = {
            ...DEFAULT_QUEUE_CONFIG,
            ...config.queue
        };

        if (!this.config.botToken) {
            this.logger.error('Telegram Bot Token is not configured');
            throw new Error('Telegram Bot Token is required');
        }

        // Initialize queue connection
        const connection: ConnectionOptions = {
            host: this.config.redis.host,
            port: this.config.redis.port,
            password: this.config.redis.password
        };

        // Initialize queue
        this.queue = new Queue<TelegramQueueData>(this.queueConfig.name, {
            connection,
            defaultJobOptions: {
                attempts: this.queueConfig.attempts,
                backoff: {
                    type: 'exponential',
                    delay: this.queueConfig.backoffDelay
                },
                removeOnComplete: this.queueConfig.removeOnComplete,
                removeOnFail: this.queueConfig.removeOnFail
            }
        });

        this.logger.info('Telegram Queue Service initialized', {
            queueName: this.queueConfig.name,
            redisHost: this.config.redis.host
        });
    }

    /**
     * Enqueue a message to be sent via Telegram
     */
    public async sendMessage(
        message: string,
        options: TelegramOptions = {}
    ): Promise<{ success: boolean; jobId?: string; error?: string }> {
        try {
            // Use defaultRecipientId if recipientId is not provided
            const effectiveRecipientId = options.recipientId || this.config.recipientId;

            if (!effectiveRecipientId) {
                throw new Error('Recipient ID is required');
            }

            const payload: TelegramPayload = {
                message,
                options: {
                    ...options,
                    recipientId: effectiveRecipientId
                }
            };

            const queueData: TelegramQueueData = {
                jobId: crypto.randomUUID(),
                payload
            };

            const job = await this.queue.add('send-message', queueData, {
                jobId: queueData.jobId
            });

            this.logger.info('Message enqueued successfully', {
                jobId: job.id,
                recipientId: effectiveRecipientId
            });

            return {
                success: true,
                jobId: job.id
            };
        } catch (error) {
            this.logger.error('Failed to enqueue message', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Get the status of a message
     */
    public async getMessageStatus(jobId: string): Promise<TelegramResponse | null> {
        try {
            const job = await this.queue.getJob(jobId);
            
            if (!job) {
                return null;
            }

            const state = await job.getState();
            const result = job.returnvalue as TelegramResponse;

            if (state === 'completed' && result) {
                return result;
            }

            return null;
        } catch (error) {
            this.logger.error('Failed to get message status', {
                jobId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return null;
        }
    }

    /**
     * Close the queue and cleanup resources
     */
    public async close(): Promise<void> {
        try {
            await this.queue.close();
            this.logger.info('Queue service closed successfully');
        } catch (error) {
            this.logger.error('Failed to close queue service', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
} 