import winston from 'winston';
// ESM import for winston-loki if needed, or adjust based on your setup
import LokiTransport from 'winston-loki'; // This might cause issues with CJS/ESM
// const LokiTransport = require('winston-loki'); // Use require for CJS compatibility if issues arise

import { LoggerConfigOptions } from '../types';
import { getFormatters } from '../formatters';

export const createLokiTransport = (config: Required<LoggerConfigOptions>): winston.transport | null => {
  if (!config.enableLoki || !config.loki.url) {
    console.warn('[Logger] Loki transport disabled or LOKI_URL not set.');
    return null;
  }

  const lokiConfig: any = {
    host: config.loki.url,
    json: true, // Gửi log dưới dạng JSON
    batching: true,
    batchInterval: config.loki.batchInterval,
    batchSize: config.loki.batchSize,
    labels: config.loki.labels, // service, environment, etc.
    level: config.logLevel,
    format: getFormatters(config), // Sử dụng JSON formatter
    handleExceptions: true,
    handleRejections: true,
  };

  if (config.loki.username && config.loki.password) {
    lokiConfig.basicAuth = `${config.loki.username}:${config.loki.password}`;
  }
  
  // Thêm thông báo khi tạo Loki transport để dễ debug
  console.info(`[Logger] Loki transport enabled. Target: ${config.loki.url}, Labels: ${JSON.stringify(config.loki.labels)}`);


  return new LokiTransport(lokiConfig);
};