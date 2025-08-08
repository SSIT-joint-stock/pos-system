import { config } from 'dotenv';
import { TelegramConfig } from './types';

// Load .env file (only for local development)
if (process.env.NODE_ENV !== 'production') {
    config({ path: '../../.env' });
}

export const defaultConfig: TelegramConfig = {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    recipientId: process.env.TELEGRAM_RECIPIENT_ID || '',
    defaultParseMode: 'HTML',
};

export function createTelegramConfig(config: Partial<TelegramConfig> = {}): TelegramConfig {
    return {
        ...defaultConfig,
        ...config,
    };
} 