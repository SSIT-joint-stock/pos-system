import { 
  IHealthRepository, 
  IHealthCheckStrategy,
  IHealthCheckRegistry,
  HealthCheckResult,
  HealthCheckResponse,
  SystemMetrics,
  HealthStatus,
  HealthCheckRequest,
  IHealthService
} from '../interfaces/health.interface';
import { HealthRepositoryFactory } from '../repositories/health.repository';

/**
 * Health Check Registry Implementation
 * Manages different types of health checks using Strategy Pattern
 */
export class HealthCheckRegistry implements IHealthCheckRegistry {
  private strategies: Map<string, IHealthCheckStrategy> = new Map();

  register(strategy: IHealthCheckStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  unregister(name: string): void {
    this.strategies.delete(name);
  }

  get(name: string): IHealthCheckStrategy | undefined {
    return this.strategies.get(name);
  }

  getAll(): IHealthCheckStrategy[] {
    return Array.from(this.strategies.values());
  }

  async executeAll(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];
    
    for (const strategy of this.strategies.values()) {
      try {
        const result = await strategy.execute();
        results.push(result);
      } catch (error) {
        results.push({
          name: strategy.name,
          status: HealthStatus.UNHEALTHY,
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          duration: 0
        });
      }
    }

    return results;
  }
}

/**
 * Database Health Check Strategy
 * Implements Strategy Pattern for database health checks
 */
export class DatabaseHealthCheckStrategy implements IHealthCheckStrategy {
  name = 'database';

  async execute(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // This would be replaced with actual database connection check
      // For now, we'll simulate a database check
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const duration = Date.now() - startTime;
      
      return {
        name: this.name,
        status: HealthStatus.HEALTHY,
        message: 'Database connection is healthy',
        timestamp: new Date().toISOString(),
        duration,
        details: {
          connectionPool: {
            total: 10,
            idle: 8,
            active: 2
          },
          responseTime: duration,
          lastQueryTime: new Date().toISOString()
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        name: this.name,
        status: HealthStatus.UNHEALTHY,
        message: error instanceof Error ? error.message : 'Database connection failed',
        timestamp: new Date().toISOString(),
        duration
      };
    }
  }
}

/**
 * External Service Health Check Strategy
 * Implements Strategy Pattern for external service health checks
 */
export class ExternalServiceHealthCheckStrategy implements IHealthCheckStrategy {
  name = 'external-service';

  async execute(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // This would be replaced with actual external service check
      // For now, we'll simulate an external service check
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const duration = Date.now() - startTime;
      
      return {
        name: this.name,
        status: HealthStatus.HEALTHY,
        message: 'External service is responding',
        timestamp: new Date().toISOString(),
        duration,
        details: {
          endpoint: 'https://api.example.com/health',
          responseTime: duration,
          statusCode: 200,
          lastCheck: new Date().toISOString()
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        name: this.name,
        status: HealthStatus.UNHEALTHY,
        message: error instanceof Error ? error.message : 'External service check failed',
        timestamp: new Date().toISOString(),
        duration
      };
    }
  }
}

/**
 * Memory Health Check Strategy
 * Implements Strategy Pattern for memory health checks
 */
export class MemoryHealthCheckStrategy implements IHealthCheckStrategy {
  name = 'memory';

  async execute(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const memUsage = process.memoryUsage();
      const totalMem = require('os').totalmem();
      const freeMem = require('os').freemem();
      const usedMem = totalMem - freeMem;
      const memoryPercentage = (usedMem / totalMem) * 100;
      
      const duration = Date.now() - startTime;
      
      let status = HealthStatus.HEALTHY;
      let message = 'Memory usage is normal';
      
      if (memoryPercentage > 90) {
        status = HealthStatus.UNHEALTHY;
        message = 'Memory usage is critical';
      } else if (memoryPercentage > 80) {
        status = HealthStatus.DEGRADED;
        message = 'Memory usage is high';
      }
      
      return {
        name: this.name,
        status,
        message,
        timestamp: new Date().toISOString(),
        duration,
        details: {
          used: usedMem,
          total: totalMem,
          percentage: memoryPercentage,
          heapUsed: memUsage.heapUsed,
          heapTotal: memUsage.heapTotal
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        name: this.name,
        status: HealthStatus.UNHEALTHY,
        message: error instanceof Error ? error.message : 'Memory check failed',
        timestamp: new Date().toISOString(),
        duration
      };
    }
  }
}

/**
 * Health Service Implementation
 * Provides business logic for health check operations
 * Uses Dependency Injection pattern
 */
export class HealthService implements IHealthService {
  private repository: IHealthRepository;
  private registry: HealthCheckRegistry;

  constructor(
    repository?: IHealthRepository,
    registry?: HealthCheckRegistry
  ) {
    this.repository = repository || HealthRepositoryFactory.create();
    this.registry = registry || new HealthCheckRegistry();
    
    // Register default health check strategies
    this.registerDefaultStrategies();
  }

  /**
   * Register default health check strategies
   */
  private registerDefaultStrategies(): void {
    this.registry.register(new DatabaseHealthCheckStrategy());
    this.registry.register(new ExternalServiceHealthCheckStrategy());
    this.registry.register(new MemoryHealthCheckStrategy());
  }

  /**
   * Perform health check
   */
  async performHealthCheck(request: HealthCheckRequest): Promise<HealthCheckResponse> {
    const startTime = Date.now();
    
    // Execute health checks
    let checks: HealthCheckResult[];
    
    if (request.checks && request.checks.length > 0) {
      // Execute specific checks
      checks = [];
      for (const checkName of request.checks) {
        const strategy = this.registry.get(checkName);
        if (strategy) {
          const result = await strategy.execute();
          checks.push(result);
        }
      }
    } else {
      // Execute all checks
      checks = await this.registry.executeAll();
    }

    // Store results
    for (const check of checks) {
      await this.repository.storeHealthCheckResult(check);
    }

    // Determine overall status
    const overallStatus = this.determineOverallStatus(checks);

    // Get additional data if requested
    let metrics: SystemMetrics | undefined;
    if (request.includeMetrics) {
      metrics = await this.getSystemMetrics();
    }

    const uptime = await this.repository.getUptime();
    const version = await this.repository.getVersion();

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version,
      checks,
      metrics,
      uptime
    };
  }

  /**
   * Get system metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.repository.getSystemMetrics();
  }

  /**
   * Get health check history
   */
  async getHealthCheckHistory(
    startDate: Date,
    endDate: Date,
    checkName?: string
  ): Promise<HealthCheckResult[]> {
    return this.repository.getHealthCheckHistory(startDate, endDate, checkName);
  }

  /**
   * Register a new health check strategy
   */
  registerHealthCheck(strategy: IHealthCheckStrategy): void {
    this.registry.register(strategy);
  }

  /**
   * Unregister a health check strategy
   */
  unregisterHealthCheck(name: string): void {
    this.registry.unregister(name);
  }

  /**
   * Determine overall health status from individual check results
   */
  private determineOverallStatus(checks: HealthCheckResult[]): HealthStatus {
    if (checks.length === 0) {
      return HealthStatus.UNKNOWN;
    }

    const unhealthyCount = checks.filter(
      check => check.status === HealthStatus.UNHEALTHY
    ).length;

    const degradedCount = checks.filter(
      check => check.status === HealthStatus.DEGRADED
    ).length;

    if (unhealthyCount > 0) {
      return HealthStatus.UNHEALTHY;
    }

    if (degradedCount > 0) {
      return HealthStatus.DEGRADED;
    }

    return HealthStatus.HEALTHY;
  }
}

/**
 * Factory for creating health service instances
 * Implements Factory Pattern for service creation
 */
export class HealthServiceFactory {
  /**
   * Create a new health service instance
   */
  static create(): IHealthService {
    return new HealthService();
  }

  /**
   * Create a health service with custom repository
   */
  static createWithRepository(repository: IHealthRepository): IHealthService {
    return new HealthService(repository);
  }

  /**
   * Create a health service with custom registry
   */
  static createWithRegistry(registry: HealthCheckRegistry): IHealthService {
    return new HealthService(undefined, registry);
  }

  /**
   * Create a mock health service for testing
   */
  static createMock(): IHealthService {
    return {
      performHealthCheck: async () => ({
        status: HealthStatus.HEALTHY,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        checks: [],
        uptime: 3600
      }),
      getSystemMetrics: async () => ({
        uptime: 3600,
        memory: { used: 1024, total: 2048, percentage: 50 },
        cpu: { usage: 25, load: [1.5, 1.2, 1.0] },
        disk: { used: 512, total: 1024, percentage: 50 },
        network: { connections: 10, requests: 100 }
      }),
      getHealthCheckHistory: async () => [],
      registerHealthCheck: () => {},
      unregisterHealthCheck: () => {}
    };
  }
} 