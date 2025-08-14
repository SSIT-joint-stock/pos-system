import { createLogger, type LoggerConfigOptions } from '@repo/logger';
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
export const createContextLogger = (context: string, contextMeta?: Record<string, unknown>) => {
    return {
        info: (message: string, meta?: Record<string, unknown>) => {
            logger.info(message, { ...meta, context, ...contextMeta });
        },
        error: (message: string, meta?: Record<string, unknown>) => {
            logger.error(message, { ...meta, context, ...contextMeta });
        },
        warn: (message: string, meta?: Record<string, unknown>) => {
            logger.warn(message, { ...meta, context, ...contextMeta });
        },
        debug: (message: string, meta?: Record<string, unknown>) => {
            logger.debug(message, { ...meta, context, ...contextMeta });
        }
    };
};

// Export types
export type { LoggerInstance } from '@repo/logger';
export interface ILogger {
    info(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    debug(message: string, meta?: Record<string, unknown>): void;
}
