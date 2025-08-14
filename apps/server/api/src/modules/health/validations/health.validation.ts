import { z } from 'zod';
import { HealthStatus } from '../interfaces/health.interface';

/**
 * Health Module Validation Schemas
 * Uses Zod for runtime validation following API structure rules
 */

/**
 * Health check request validation schema
 */
export const healthCheckSchema = z.object({
  includeMetrics: z.boolean().optional().default(false),
  timeout: z.number().min(1000).max(30000).optional().default(5000),
  checks: z.array(z.string()).optional().default([])
});

/**
 * Health check result validation schema
 */
export const healthCheckResultSchema = z.object({
  name: z.string().min(1),
  status: z.nativeEnum(HealthStatus),
  message: z.string().optional(),
  details: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
  duration: z.number().min(0)
});

/**
 * System metrics validation schema
 */
export const systemMetricsSchema = z.object({
  uptime: z.number().min(0),
  memory: z.object({
    used: z.number().min(0),
    total: z.number().min(0),
    percentage: z.number().min(0).max(100)
  }),
  cpu: z.object({
    usage: z.number().min(0).max(100),
    load: z.array(z.number().min(0))
  }),
  disk: z.object({
    used: z.number().min(0),
    total: z.number().min(0),
    percentage: z.number().min(0).max(100)
  }),
  network: z.object({
    connections: z.number().min(0),
    requests: z.number().min(0)
  })
});

/**
 * Health check response validation schema
 */
export const healthCheckResponseSchema = z.object({
  status: z.nativeEnum(HealthStatus),
  timestamp: z.string().datetime(),
  version: z.string(),
  checks: z.array(healthCheckResultSchema),
  metrics: systemMetricsSchema.optional(),
  uptime: z.number().min(0)
});

/**
 * Database health check result validation schema
 */
export const databaseHealthResultSchema = healthCheckResultSchema.extend({
  details: z.object({
    connectionPool: z.object({
      total: z.number().min(0),
      idle: z.number().min(0),
      active: z.number().min(0)
    }),
    responseTime: z.number().min(0),
    lastQueryTime: z.string().datetime()
  })
});

/**
 * External service health check result validation schema
 */
export const externalServiceHealthResultSchema = healthCheckResultSchema.extend({
  details: z.object({
    endpoint: z.string().url(),
    responseTime: z.number().min(0),
    statusCode: z.number().min(100).max(599),
    lastCheck: z.string().datetime()
  })
});

/**
 * Health check configuration validation schema
 */
export const healthCheckConfigSchema = z.object({
  enabled: z.boolean(),
  interval: z.number().min(1000).max(300000), // 1 second to 5 minutes
  timeout: z.number().min(1000).max(30000), // 1 second to 30 seconds
  retries: z.number().min(0).max(5),
  threshold: z.number().min(1).max(10)
});

/**
 * Type exports for TypeScript
 */
export type HealthCheckRequest = z.infer<typeof healthCheckSchema>;
export type HealthCheckResult = z.infer<typeof healthCheckResultSchema>;
export type SystemMetrics = z.infer<typeof systemMetricsSchema>;
export type HealthCheckResponse = z.infer<typeof healthCheckResponseSchema>;
export type DatabaseHealthResult = z.infer<typeof databaseHealthResultSchema>;
export type ExternalServiceHealthResult = z.infer<typeof externalServiceHealthResultSchema>;
export type HealthCheckConfig = z.infer<typeof healthCheckConfigSchema>; 