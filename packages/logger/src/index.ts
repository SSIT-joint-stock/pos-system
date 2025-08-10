import winston from 'winston';
import { loadConfig } from './config';
import { createConsoleTransport } from './transports/console.transport';
import { createLokiTransport } from './transports/loki.transport';
import { LoggerConfigOptions, LoggerConfigSchema, LoggerInstance } from './types';

/**
 * Create a logger instance with the given options.
 * @param options - The configuration options for the logger.
 * @returns A logger instance.
 */
export function createLogger(options: LoggerConfigOptions): LoggerInstance {
  try {
    const validatedConfig = LoggerConfigSchema.safeParse(options);

    // Validate failed, throw error
    if (!validatedConfig.success) {
      throw new Error(`Invalid logger configuration: ${validatedConfig.error.message}`);
    }

    // Load và merge cấu hình
    const config = loadConfig(validatedConfig.data);

    const transports: winston.transport[] = [];

    const consoleTransport = createConsoleTransport(config);
    if (consoleTransport) {
      transports.push(consoleTransport);
    }

    const lokiTransport = createLokiTransport(config);
    if (lokiTransport) {
      transports.push(lokiTransport);
    }

    // const fileTransport = createFileTransport(config); // (Optional)
    // if (fileTransport) {
    //   transports.push(fileTransport);
    // }

    if (transports.length === 0) {
      // Fallback to basic console if no transports are enabled (e.g., during very early init or misconfiguration)
      console.warn('[Logger] No transports enabled. Falling back to basic console logging.');
      transports.push(new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), winston.format.simple())
      }));
    }

    const logger = winston.createLogger({
      level: config.logLevel,
      levels: winston.config.npm.levels, // Standard levels
      defaultMeta: { // Các metadata mặc định sẽ được thêm vào mỗi log entry
        service: config.serviceName,
        environment: config.env,
        ...(config.defaultMeta || {}),
      },
      transports,
      exitOnError: false, // Không thoát process khi có lỗi không bắt được (winston sẽ log)
    });

    // Log một thông báo khởi tạo để kiểm tra
    logger.info(`Logger initialized for service: ${config.serviceName} in ${config.env} environment. Log level: ${config.logLevel}`);
    if (config.enableLoki && config.loki.url) {
      console.log(`Loki transport configured for ${config.loki.url}`);
    }
    if (config.enableConsole) {
      console.log(`Console transport enabled.`);
    }

    logger.info('Test log for Loki', { test: true });

    return logger;
  } catch (error) {
    throw new Error(`Failed to create logger for service ${options.serviceName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export các type cần thiết
export * from './types';