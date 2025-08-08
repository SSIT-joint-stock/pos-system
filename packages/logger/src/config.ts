import dotenv from 'dotenv';
import { LoggerConfigOptions } from './types';

// Load .env file (chỉ cho local development)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '../../.env' }); // Giả sử .env nằm ở root monorepo
} else {
  dotenv.config({ path: '../../.env.production' }); // Giả sử .env nằm ở root monorepo
}

export function loadConfig(options: Partial<LoggerConfigOptions> = {}): Required<LoggerConfigOptions> {
  const defaults: Required<LoggerConfigOptions> = {
    serviceName: options.serviceName || process.env.SERVICE_NAME || 'unknown-service',
    logLevel: options.logLevel || process.env.LOG_LEVEL || 'info',
    env: options.env || process.env.NODE_ENV || 'development',
    loki: {
      url: options.loki?.url || process.env.LOKI_URL || '',
      username: options.loki?.username || process.env.LOKI_USERNAME || undefined,
      password: options.loki?.password || process.env.LOKI_PASSWORD || undefined,
      batchInterval: options.loki?.batchInterval || 5000, // Gửi log mỗi 5s
      batchSize: options.loki?.batchSize || 100,        // Hoặc khi đủ 100 log
      labels: {
        service: options.serviceName || process.env.SERVICE_NAME || 'unknown-service',
        environment: options.env || process.env.NODE_ENV || 'development',
        ...(options.loki?.labels || {}),
      },
    },
    enableConsole: options.enableConsole ?? (process.env.NODE_ENV !== 'production' || process.env.ENABLE_CONSOLE_LOG === 'true'),
    enableLoki: options.enableLoki ?? (!!(options.loki?.url || process.env.LOKI_URL)),
    enableFile: options.enableFile ?? false,
    filePath: options.filePath || './logs/app.log',
    defaultMeta: options.defaultMeta || {},
  };

  return defaults;
}