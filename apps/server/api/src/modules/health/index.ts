/**
 * Health Module
 * Provides health check endpoints and system status monitoring
 * 
 * This module implements:
 * - Repository Pattern for data access
 * - Service Layer for business logic
 * - Controller Pattern for request handling
 * - Strategy Pattern for different health check types
 */

// Export controllers
export { HealthController } from './controllers/health.controller';

// Export services
export { HealthService } from './services/health.service';

// Export repositories
export { HealthRepository } from './repositories/health.repository';

// Export validations
export { healthCheckSchema } from './validations/health.validation';

// Export types
export type { HealthStatus, HealthCheckResult, SystemMetrics } from './interfaces/health.interface';

// Export routes
export { healthRoutes } from './routes/health.routes';
