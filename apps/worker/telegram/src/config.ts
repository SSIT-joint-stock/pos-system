
import type { QueueConfig, WorkerConfig } from '@repo/dto';
import { createLogger, LoggerConfigOptions } from '@repo/logger';
import { env } from '@repo/config-env';

export interface TelegramWorkerConfig {
    botToken: string;
    defaultRecipientId: string;
    adminChatId?: number;
    redis: {
        host: string;
        port: number;
        password?: string;
    };
    queue: QueueConfig;
    worker: WorkerConfig;
}

export const defaultConfig: TelegramWorkerConfig = {
    botToken: env.TELEGRAM_BOT_TOKEN || '',
    defaultRecipientId: env.TELEGRAM_RECIPIENT_ID || '',
    adminChatId: env.TELEGRAM_RECIPIENT_ID ? parseInt(env.TELEGRAM_RECIPIENT_ID, 10) : undefined,
    redis: {
        host: env.REDIS_HOST || 'localhost',
        port: env.REDIS_PORT || 6379,
        password: env.REDIS_PASSWORD
    },
    queue: {
        name: 'telegram-notifications',
        prefix: 'pos',
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: 100,
            removeOnFail: 1000
        }
    },
    worker: {
        name: 'telegram-notifications',
        prefix: 'pos',
        concurrency: 5,
        limiter: {
            max: 30,
            duration: 1000
        }
    }
};

export const logger = createLogger({ 
    serviceName: 'TelegramWorker',
    enableConsole: true,
    enableLoki: env.ENABLE_LOKI === 'true',
    logLevel: env.LOG_LEVEL || 'info' as LoggerConfigOptions['logLevel'],
    env: env.NODE_ENV || 'development' as LoggerConfigOptions['env'],
    defaultMeta: {
        component: 'worker',
        version: process.env.npm_package_version
    },
    enableFile: false,
    filePath: './logs/telegram-worker.log',
    loki: {
        url: env.LOKI_URL || 'http://localhost:7100',
        username: env.LOKI_USERNAME,
        password: env.LOKI_PASSWORD,
        labels: {
            service: 'telegram-workers',
            environment: env.NODE_ENV || 'development'
        },
        batchInterval: 5000,
        batchSize: 100,
    }
});

export function createWorkerConfig(config: Partial<TelegramWorkerConfig> = {}): TelegramWorkerConfig {
    return {
        ...defaultConfig,
        ...config,
        redis: {
            ...defaultConfig.redis,
            ...config.redis
        },
        queue: {
            ...defaultConfig.queue,
            ...config.queue
        },
        worker: {
            ...defaultConfig.worker,
            ...config.worker
        }
    };
} 
