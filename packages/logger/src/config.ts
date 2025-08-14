import dotenv from 'dotenv';
import { LoggerConfigOptions } from './types';


export function loadConfig(options: Partial<LoggerConfigOptions> = {}): Required<LoggerConfigOptions> {
  const defaults: Required<LoggerConfigOptions> = {
    serviceName: options.serviceName || 'unknown-service',
    logLevel: options.logLevel || 'info' as LoggerConfigOptions['logLevel'],
    env: options.env || 'development' as LoggerConfigOptions['env'],
    loki: {
      url: options.loki?.url || '',
      username: options.loki?.username || undefined,
      password: options.loki?.password || undefined,
      batchInterval: options.loki?.batchInterval || 5000, // Gửi log mỗi 5s
      batchSize: options.loki?.batchSize || 100,        // Hoặc khi đủ 100 log
      labels: {
        service: options.serviceName || 'unknown-service',
        environment: options.env|| 'development',
        ...(options.loki?.labels || {}),
      },
    },
    enableConsole: options.enableConsole ?? true,
    enableLoki: options.enableLoki ?? false,
    enableFile: options.enableFile ?? false,
    filePath: options.filePath || './logs/app.log',
    defaultMeta: options.defaultMeta || {},
  };

  return defaults;
}