import winston from 'winston';
import { z } from 'zod';

// Schema cho Loki configuration
const LokiConfigSchema = z.object({
  url: z.string().url().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  batchInterval: z.number().positive().default(5000),
  batchSize: z.number().positive().default(100),
  labels: z.record(z.string()).optional().default({}),
}).optional();

// Schema cho Logger configuration
export const LoggerConfigSchema = z.object({
  serviceName: z.string().min(1, 'Service name is required'),
  logLevel: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  env: z.enum(['development', 'test', 'production', 'staging']).default('development'),
  loki: LokiConfigSchema,
  enableConsole: z.boolean().default(true),
  enableLoki: z.boolean().default(false),
  enableFile: z.boolean().default(false),
  filePath: z.string().default('./logs/app.log'),
  defaultMeta: z.record(z.any()).default({}),
}).refine((data) => {
  if (data.enableLoki && !data.loki?.url && !data.loki?.username && !data.loki?.password) {
    return false;
  }
  return true;
}, {
  message: 'Loki URL or username and password are required when enableLoki is true',
});


export type LoggerConfigOptions = z.infer<typeof LoggerConfigSchema>;


export type LoggerInstance = winston.Logger;