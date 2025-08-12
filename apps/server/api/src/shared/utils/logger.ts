import { createLogger, LoggerConfigOptions } from '@repo/logger';
import config from '@shared/config/app.config';

// Cấu hình logger cho server app
const loggerConfig: LoggerConfigOptions = {
    serviceName: 'pos-server',
    env: config.NODE_ENV || 'development',
    logLevel: config.LOG_LEVEL || 'info',
    enableConsole: true,
    enableLoki: false,
    enableFile: false,
    filePath: '',
    defaultMeta: {
        version: process.env.APP_VERSION || '1.0.0',
        nodeEnv: config.NODE_ENV
    }
};

// Khởi tạo logger instance
const logger = createLogger(loggerConfig);

// Export logger instance
export default logger;

// Export các helper functions để log theo context
export const createContextLogger = (context: string, meta?: Record<string, any>) => {
    return {
        info: (message: string, meta?: Record<string, any>) => {
            logger.info(message, { ...meta, context, ...meta });
        },
        error: (message: string, meta?: Record<string, any>) => {
            logger.error(message, { ...meta, context, ...meta });
        },
        warn: (message: string, meta?: Record<string, any>) => {
            logger.warn(message, { ...meta, context, ...meta });
        },
        debug: (message: string, meta?: Record<string, any>) => {
            logger.debug(message, { ...meta, context, ...meta });
        }
    };
};

// Export types
export type { LoggerInstance } from '@repo/logger';
export interface ILogger {
    info(message: string, meta?: Record<string, any>): void;
    error(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    debug(message: string, meta?: Record<string, any>): void;
}
