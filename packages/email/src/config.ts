import { env } from '@repo/config-env';
import path from 'path';
import { z } from 'zod';

import { EmailConfig } from './types';


export const defaultConfig: EmailConfig = {
    service: env.EMAIL_SERVICE || 'gmail',
    user: env.EMAIL_USER || '',
    password: env.EMAIL_PASSWORD || '',
    notificationEmail: env.EMAIL_NOTI || '',
    templatePath: path.join(process.cwd(), 'templates'),
    defaultFrom: env.EMAIL_USER || '',
};

const validateConfig = (config: EmailConfig) => {
    const schema = z.object({
        service: z.string().min(1).default('gmail'),
        user: z.string().email(),
        password: z.string().min(1),
        notificationEmail: z.string().email(),
        templatePath: z.string().optional(),
        defaultFrom: z.string().email(),
    });
    const result = schema.safeParse(config);
    if (!result.success) {
        throw new Error('Invalid email config: ' + result.error.message);
    }
    return result.data;
};

export function createEmailConfig(config: Partial<EmailConfig> = {}): EmailConfig {
    return validateConfig({
        ...defaultConfig,
        ...config,
    });
} 