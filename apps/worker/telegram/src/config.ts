import { config } from 'dotenv';
import type { QueueConfig, WorkerConfig } from '@repo/dto';
import type { LoggerConfigOptions } from '@repo/logger';

// Load .env file (only for local development)
if (process.env.NODE_ENV !== 'production') {
    config({ path: '../../.env.production' });
} else {
    config({ path: '../../.env.production' });
}

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
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    defaultRecipientId: process.env.TELEGRAM_RECIPIENT_ID || '',
    adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID ? parseInt(process.env.TELEGRAM_ADMIN_CHAT_ID, 10) : undefined,
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD
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

export const loggerConfig: LoggerConfigOptions = { 
    serviceName: 'TelegramWorkerApp',
    enableConsole: true,
    enableLoki: true,
    logLevel: 'debug',
    env: process.env.NODE_ENV || 'development',
    defaultMeta: {
        component: 'worker',
        version: process.env.npm_package_version
    },
    loki: {
        url: process.env.LOKI_URL || 'http://localhost:7100',
        username: process.env.LOKI_USERNAME,
        password: process.env.LOKI_PASSWORD,
        labels: {
            service: 'telegram-workers',
            environment: process.env.NODE_ENV || 'development'
        }
    }
}

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
