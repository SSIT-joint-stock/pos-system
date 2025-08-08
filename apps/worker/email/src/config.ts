import { ConnectionOptions } from 'bullmq';
import { EmailConfig } from '@repo/email';
import { config } from 'dotenv';

// Load .env file (only for local development)
if (process.env.NODE_ENV !== 'production') {
    config({ path: '../../.env.production' });
} else {
    config({ path: '../../.env.production' });
}
/**
 * Configuration for the BullMQ queue and worker specific to emails.
 */
export interface WorkerQueueConfig {
  name: string;
  concurrency: number;
  limiter?: {
    max: number;
    duration: number;
  };
  removeOnComplete?: {
    count: number; // Keep last X jobs
    age?: number; // Keep jobs for Y seconds
  };
  removeOnFail?: {
    count: number;
    age?: number;
  };
}

/**
 * Configuration for the Email Worker application.
 */
export interface EmailWorkerConfig {
  // Directly include fields that make up ConnectionOptions for BullMQ
  redisHost: string;
  redisPort: number;
  redisPassword?: string;
  // Add other ConnectionOptions fields here if needed, e.g., db, family, etc.
  // For simplicity, keeping it to host, port, password for now.

  worker: WorkerQueueConfig;
  emailService: EmailConfig;
  defaultFromEmail?: string;
  adminEmail?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  loki?: {
    url: string;
    username?: string;
    password?: string;
    labels?: Record<string, string>;
  };
}

const DEFAULT_WORKER_QUEUE_NAME = 'email-notifications';
const DEFAULT_CONCURRENCY = 5;

/**
 * Creates the configuration for the Email Worker.
 * Merges default values with provided partial configuration and environment variables.
 */
export function createWorkerConfig(config: Partial<EmailWorkerConfig> = {}): EmailWorkerConfig {
  return {
    redisHost: process.env.REDIS_HOST || config.redisHost || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '', 10) || config.redisPort || 6379,
    redisPassword: process.env.REDIS_PASSWORD || config.redisPassword,
    worker: {
      name: process.env.EMAIL_QUEUE_NAME || config.worker?.name || DEFAULT_WORKER_QUEUE_NAME,
      concurrency: parseInt(process.env.EMAIL_WORKER_CONCURRENCY || '', 10) || config.worker?.concurrency || DEFAULT_CONCURRENCY,
      removeOnComplete: config.worker?.removeOnComplete || { count: 100, age: 24 * 3600 },
      removeOnFail: config.worker?.removeOnFail || { count: 1000, age: 7 * 24 * 3600 },
      limiter: config.worker?.limiter,
    },
    emailService: {
      service: process.env.EMAIL_SERVICE_PROVIDER || config.emailService?.service || 'gmail',
      user: process.env.EMAIL_USER || config.emailService?.user || '',
      password: process.env.EMAIL_PASSWORD || config.emailService?.password || '',
      defaultFrom: process.env.EMAIL_DEFAULT_FROM || config.emailService?.defaultFrom || 'noreply@example.com',
      templatePath: process.env.EMAIL_TEMPLATE_PATH || config.emailService?.templatePath || './email-templates',
      notificationEmail: process.env.EMAIL_ADMIN_EMAIL || config.emailService?.notificationEmail || 'admin@example.com',
    },
    defaultFromEmail: process.env.EMAIL_DEFAULT_FROM || config.defaultFromEmail,
    adminEmail: process.env.EMAIL_ADMIN_EMAIL || config.adminEmail,
    logLevel: (process.env.LOG_LEVEL as EmailWorkerConfig['logLevel']) || config.logLevel || 'info',
    loki: {
      url: process.env.LOKI_URL || config.loki?.url || 'http://localhost:7100',
      username: process.env.LOKI_USERNAME || config.loki?.username,
      password: process.env.LOKI_PASSWORD || config.loki?.password,
      labels: { service: 'email-workers', ...(config.loki?.labels || {}) },
    },
  };
} 