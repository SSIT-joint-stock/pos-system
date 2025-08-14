import { env } from '@repo/config-env';
import { TelegramConfig } from './types';
import { z } from 'zod';

export const defaultConfig: TelegramConfig = {
    botToken: env.TELEGRAM_BOT_TOKEN || '',
    recipientId: env.TELEGRAM_RECIPIENT_ID || '',
    defaultParseMode: 'HTML',
};

const validateConfig = (config: TelegramConfig) => {
    const schema = z.object({
        botToken: z.string().min(1),
        recipientId: z.string().min(1),
        defaultParseMode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).default('HTML'),
    });
    const result = schema.safeParse(config);
    if (!result.success) {
        throw new Error('Invalid telegram config: ' + result.error.message);
    }
    return result.data;
};

export function createTelegramConfig(config: Partial<TelegramConfig> = {}): TelegramConfig {
    return validateConfig({
        ...defaultConfig,
        ...config,
    });
} 