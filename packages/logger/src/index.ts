import winston from 'winston';
import { loadConfig } from './config';
import { createConsoleTransport } from './transports/console.transport';
import { createLokiTransport } from './transports/loki.transport';
// import { createFileTransport } from './transports/file.transport'; // (Optional)
import { LoggerConfigOptions, LoggerInstance } from './types';

export function createLogger(options: LoggerConfigOptions): LoggerInstance {
  // Load và merge cấu hình
  const config = loadConfig(options);

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
}

// Export các type cần thiết
export * from './types';