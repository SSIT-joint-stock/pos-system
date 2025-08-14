import winston from 'winston';
import { LoggerConfigOptions } from '../types';
import { getFormatters } from '../formatters';

export const createConsoleTransport = (config: Required<LoggerConfigOptions>): winston.transport | null => {
  if (!config.enableConsole) {
    return null;
  }
  return new winston.transports.Console({
    level: config.logLevel,
    format: getFormatters(config), // Sử dụng formatter chung, nó sẽ tự biết là dev hay prod
    handleExceptions: true, // Bắt unhandled exceptions
    handleRejections: true, // Bắt unhandled rejections
  });
};