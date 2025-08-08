import { createLogger, LoggerConfigOptions } from '@repo/logger';

// Cấu hình logger cho server app
const loggerConfig: LoggerConfigOptions = {
    serviceName: 'pos-server',
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    enableConsole: true,
    enableLoki: false,
    defaultMeta: {
        version: process.env.APP_VERSION || '1.0.0',
        nodeEnv: process.env.NODE_ENV
    }
};

// Khởi tạo logger instance
const logger = createLogger(loggerConfig);

// Export logger instance
export default logger;

// Export các helper functions để log theo context
export const createContextLogger = (context: string) => {
    return {
        info: (message: string, meta?: Record<string, any>) => {
            logger.info(message, { ...meta, context });
        },
        error: (message: string, meta?: Record<string, any>) => {
            logger.error(message, { ...meta, context });
        },
        warn: (message: string, meta?: Record<string, any>) => {
            logger.warn(message, { ...meta, context });
        },
        debug: (message: string, meta?: Record<string, any>) => {
            logger.debug(message, { ...meta, context });
        }
    };
};

// Export types
export type { LoggerInstance } from '@repo/logger';
