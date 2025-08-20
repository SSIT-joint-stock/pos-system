import winston from 'winston';
import { LoggerConfigOptions } from './types';

const { combine, timestamp, printf, errors, json, splat, metadata, simple } = winston.format;

// Custom formatter để có thể thêm các trường tùy ý và xử lý Error object
const customFormat = (config: Required<LoggerConfigOptions>) => printf(({ level, message, timestamp, service, env, ...meta }) => {
  let logObject: Record<string, unknown> = {
    timestamp,
    level,
    message,
    service: service || config.serviceName, // Đảm bảo serviceName luôn có
    env: env || config.env,                 // Đảm bảo env luôn có
    ...meta,                                // Bao gồm cả metadata từ splat() và defaultMeta
  };

  // Xử lý Error object
  if (meta.error instanceof Error) {
    logObject.error = {
      message: meta.error.message,
      stack: meta.error.stack,
      name: meta.error.name,
      ...(meta.error as unknown as Record<string, unknown>), // Ghi thêm các properties khác của error (nếu có)
    };
  } else if (typeof meta.error === 'object' && meta.error !== null) {
     // Nếu error là object nhưng không phải Error instance (ví dụ từ JSON.parse)
    logObject.error = meta.error;
  }


  // Xóa trường metadata thừa nếu dùng winston.format.metadata()
  if (meta.metadata) {
    logObject = { ...logObject, ...meta.metadata };
    delete logObject.metadata; // Xóa key 'metadata' sau khi đã merge
  }


  return JSON.stringify(logObject);
});


export const getFormatters = (config: Required<LoggerConfigOptions>) => {
  const baseFormat = [
    errors({ stack: true }), // Capture stack trace
    timestamp(),
    splat(), // Cho phép truyền object vào message: logger.info('User %s logged in', userId, { data: '...' })
    metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'service', 'env'] }) // Gộp tất cả các key còn lại vào metadata
  ];


  if (config.env === 'development' && config.enableConsole) {
    // Format đẹp cho console ở development
    return combine(
      ...baseFormat,
      winston.format.colorize(),
      printf(({ level, message, timestamp, service, env, ...meta }) => {
        let logString = `${timestamp} [${service}@${env}] ${level}: ${message}`;
        const metaString = JSON.stringify(meta.metadata || meta, null, 2);
        if (metaString !== '{}' && metaString !== 'null') {
          logString += `\n${metaString}`;
        }
        return logString;
      })
    );
  }


  // Format JSON cho production hoặc khi không phải dev console
  return combine(
    ...baseFormat,
    customFormat(config) // Dùng JSON formatter
  );
};