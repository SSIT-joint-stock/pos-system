/**
 * Health Module Interfaces
 * Defines all interfaces and types for health check functionality
 * Consolidates all health-related contracts in one place
 */

/**
 * Health status enumeration
 */
export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  UNKNOWN = 'unknown'
}

/**
 * Health check result interface
 */
export interface HealthCheckResult {
  name: string;
  status: HealthStatus;
  message?: string;
  details?: Record<string, any>;
  timestamp: string;
  duration: number; // in milliseconds
}

/**
 * System metrics interface
 */
export interface SystemMetrics {
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    load: number[];
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    connections: number;
    requests: number;
  };
}

/**
 * Health check request interface
 */
export interface HealthCheckRequest {
  includeMetrics?: boolean;
  timeout?: number;
  checks?: string[];
}

/**
 * Health check response interface
 */
export interface HealthCheckResponse {
  status: HealthStatus;
  timestamp: string;
  version: string;
  checks: HealthCheckResult[];
  metrics?: SystemMetrics;
  uptime: number;
}

/**
 * Health check strategy interface
 * Implements Strategy Pattern for different health check types
 */
export interface IHealthCheckStrategy {
  name: string;
  execute(): Promise<HealthCheckResult>;
}

/**
 * Health check registry interface
 * Manages different types of health checks
 */
export interface IHealthCheckRegistry {
  register(strategy: IHealthCheckStrategy): void;
  unregister(name: string): void;
  get(name: string): IHealthCheckStrategy | undefined;
  getAll(): IHealthCheckStrategy[];
  executeAll(): Promise<HealthCheckResult[]>;
}

/**
 * Health repository interface
 * Defines the contract for health data access
 * Implements Repository Pattern for data abstraction
 */
export interface IHealthRepository {
  /**
   * Get system metrics
   */
  getSystemMetrics(): Promise<SystemMetrics>;

  /**
   * Get application uptime
   */
  getUptime(): Promise<number>;

  /**
   * Get application version
   */
  getVersion(): Promise<string>;

  /**
   * Store health check result
   */
  storeHealthCheckResult(result: HealthCheckResult): Promise<void>;

  /**
   * Get recent health check results
   */
  getRecentHealthChecks(limit?: number): Promise<HealthCheckResult[]>;

  /**
   * Get health check history
   */
  getHealthCheckHistory(
    startDate: Date,
    endDate: Date,
    checkName?: string
  ): Promise<HealthCheckResult[]>;

  /**
   * Get overall health status
   */
  getOverallHealthStatus(): Promise<HealthStatus>;

  /**
   * Clear old health check data
   */
  clearOldHealthData(olderThan: Date): Promise<void>;
}

/**
 * Health service interface
 * Defines the contract for health service operations
 */
export interface IHealthService {
  /**
   * Perform health check
   */
  performHealthCheck(request: HealthCheckRequest): Promise<HealthCheckResponse>;

  /**
   * Get system metrics
   */
  getSystemMetrics(): Promise<SystemMetrics>;

  /**
   * Get health check history
   */
  getHealthCheckHistory(
    startDate: Date,
    endDate: Date,
    checkName?: string
  ): Promise<HealthCheckResult[]>;

  /**
   * Register a new health check strategy
   */
  registerHealthCheck(strategy: IHealthCheckStrategy): void;

  /**
   * Unregister a health check strategy
   */
  unregisterHealthCheck(name: string): void;
}

/**
 * Database health check result
 */
export interface DatabaseHealthResult extends HealthCheckResult {
  details: {
    connectionPool: {
      total: number;
      idle: number;
      active: number;
    };
    responseTime: number;
    lastQueryTime: string;
  };
}

/**
 * External service health check result
 */
export interface ExternalServiceHealthResult extends HealthCheckResult {
  details: {
    endpoint: string;
    responseTime: number;
    statusCode: number;
    lastCheck: string;
  };
}

/**
 * Memory health check result
 */
export interface MemoryHealthResult extends HealthCheckResult {
  details: {
    used: number;
    total: number;
    percentage: number;
    heapUsed: number;
    heapTotal: number;
  };
}

/**
 * Health check configuration
 */
export interface HealthCheckConfig {
  enabled: boolean;
  interval: number; // in milliseconds
  timeout: number; // in milliseconds
  retries: number;
  threshold: number; // failure threshold before marking as unhealthy
}

/**
 * Health check strategy template interface
 * Base interface for implementing health check strategies
 */
export interface IHealthCheckStrategyTemplate extends IHealthCheckStrategy {
  readonly description: string;
  readonly timeout: number;
  readonly retries: number;
}

/**
 * Health check factory interface
 * Factory pattern for creating health check components
 */
export interface IHealthCheckFactory {
  createStrategy(name: string): IHealthCheckStrategy | undefined;
  createRepository(): IHealthRepository;
  createService(repository?: IHealthRepository, registry?: IHealthCheckRegistry): IHealthService;
  createRegistry(): IHealthCheckRegistry;
}

/**
 * Health check monitoring interface
 * For continuous health monitoring
 */
export interface IHealthCheckMonitor {
  /**
   * Start monitoring
   */
  start(): void;

  /**
   * Stop monitoring
   */
  stop(): void;

  /**
   * Get monitoring status
   */
  isRunning(): boolean;

  /**
   * Get monitoring configuration
   */
  getConfig(): HealthCheckConfig;

  /**
   * Update monitoring configuration
   */
  updateConfig(config: Partial<HealthCheckConfig>): void;
}

/**
 * Health check notification interface
 * For alerting when health checks fail
 */
export interface IHealthCheckNotifier {
  /**
   * Send notification for unhealthy status
   */
  notifyUnhealthy(result: HealthCheckResult): Promise<void>;

  /**
   * Send notification for degraded status
   */
  notifyDegraded(result: HealthCheckResult): Promise<void>;

  /**
   * Send notification for recovery
   */
  notifyRecovery(result: HealthCheckResult): Promise<void>;
}

/**
 * Health check metrics interface
 * For collecting and aggregating health check metrics
 */
export interface IHealthCheckMetrics {
  /**
   * Record health check result
   */
  recordResult(result: HealthCheckResult): void;

  /**
   * Get metrics summary
   */
  getSummary(timeRange?: { start: Date; end: Date }): {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
    averageResponseTime: number;
    successRate: number;
  };

  /**
   * Get metrics for specific check
   */
  getCheckMetrics(checkName: string, timeRange?: { start: Date; end: Date }): {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
    averageResponseTime: number;
    successRate: number;
    lastCheck: HealthCheckResult | null;
  };
}

/**
 * Health check validation interface
 * For validating health check configurations and results
 */
export interface IHealthCheckValidator {
  /**
   * Validate health check configuration
   */
  validateConfig(config: HealthCheckConfig): { isValid: boolean; errors: string[] };

  /**
   * Validate health check result
   */
  validateResult(result: HealthCheckResult): { isValid: boolean; errors: string[] };

  /**
   * Validate health check request
   */
  validateRequest(request: HealthCheckRequest): { isValid: boolean; errors: string[] };
}

/**
 * Health check cache interface
 * For caching health check results
 */
export interface IHealthCheckCache {
  /**
   * Get cached result
   */
  get(key: string): HealthCheckResult | null;

  /**
   * Set cached result
   */
  set(key: string, result: HealthCheckResult, ttl?: number): void;

  /**
   * Clear cache
   */
  clear(): void;

  /**
   * Get cache statistics
   */
  getStats(): {
    hits: number;
    misses: number;
    size: number;
    keys: string[];
  };
}

/**
 * Health check scheduler interface
 * For scheduling periodic health checks
 */
export interface IHealthCheckScheduler {
  /**
   * Schedule health check
   */
  schedule(checkName: string, interval: number, strategy: IHealthCheckStrategy): void;

  /**
   * Unschedule health check
   */
  unschedule(checkName: string): void;

  /**
   * Get scheduled checks
   */
  getScheduledChecks(): Array<{
    name: string;
    interval: number;
    lastRun: Date | null;
    nextRun: Date | null;
  }>;

  /**
   * Start scheduler
   */
  start(): void;

  /**
   * Stop scheduler
   */
  stop(): void;
} 