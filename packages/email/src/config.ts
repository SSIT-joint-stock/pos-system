import { config } from 'dotenv';
import { EmailConfig } from './types';
import path from 'path';

// Load .env file (chỉ cho local development)
if (process.env.NODE_ENV !== 'production') {
    config({ path: '../../.env' }); // Giả sử .env nằm ở root monorepo
}

export const defaultConfig: EmailConfig = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    notificationEmail: process.env.EMAIL_NOTI || '',
    templatePath: path.join(process.cwd(), 'templates'),
    defaultFrom: process.env.EMAIL_USER || '',
};

export function createEmailConfig(config: Partial<EmailConfig> = {}): EmailConfig {
    return {
        ...defaultConfig,
        ...config,
    };
} 