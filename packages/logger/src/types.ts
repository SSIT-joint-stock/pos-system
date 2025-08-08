import winston from 'winston';

export interface LoggerConfigOptions {
  serviceName: string; // Tên service, ví dụ: 'frontend-app', 'user-service'
  logLevel?: string;    // 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
  env?: string;         // 'development', 'production', 'staging'
  loki?: {
    url?: string;
    username?: string;
    password?: string;
    batchInterval?: number;
    batchSize?: number;
    labels?: Record<string, string>; // Các label mặc định cho Loki
  };
  enableConsole?: boolean;
  enableLoki?: boolean;
  enableFile?: boolean; // Tùy chọn
  filePath?: string;    // Tùy chọn
  defaultMeta?: Record<string, any>; // Metadata mặc định cho mọi log entry
}

export type LoggerInstance = winston.Logger;