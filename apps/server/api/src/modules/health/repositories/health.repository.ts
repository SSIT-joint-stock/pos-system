import { 
  HealthCheckResult, 
  SystemMetrics, 
  HealthStatus,
  IHealthRepository 
} from '@modules/health/interfaces/health.interface';
import os from 'os';

/**
 * Health Repository Implementation
 * Provides concrete implementation for health data access
 * Uses Singleton pattern for shared instance
 */
export class HealthRepository implements IHealthRepository {
  private static instance: HealthRepository;
  private healthCheckResults: HealthCheckResult[] = [];
  private startTime: number = Date.now();

  /**
   * Private constructor for Singleton pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): HealthRepository {
    if (!HealthRepository.instance) {
      HealthRepository.instance = new HealthRepository();
    }
    return HealthRepository.instance;
  }

  /**
   * Get system metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      uptime: process.uptime(),
      memory: {
        used: usedMem,
        total: totalMem,
        percentage: (usedMem / totalMem) * 100
      },
      cpu: {
        usage: 0, // Would need additional library for CPU usage
        load: os.loadavg()
      },
      disk: {
        used: 0, // Would need additional library for disk usage
        total: 0,
        percentage: 0
      },
      network: {
        connections: 0, // Would need to track active connections
        requests: 0 // Would need to track request count
      }
    };
  }

  /**
   * Get application uptime
   */
  async getUptime(): Promise<number> {
    return process.uptime();
  }

  /**
   * Get application version
   */
  async getVersion(): Promise<string> {
    return process.env.npm_package_version || '1.0.0';
  }

  /**
   * Store health check result
   */
  async storeHealthCheckResult(result: HealthCheckResult): Promise<void> {
    this.healthCheckResults.push(result);
    
    // Keep only last 1000 results to prevent memory issues
    if (this.healthCheckResults.length > 1000) {
      this.healthCheckResults = this.healthCheckResults.slice(-1000);
    }
  }

  /**
   * Get recent health check results
   */
  async getRecentHealthChecks(limit: number = 10): Promise<HealthCheckResult[]> {
    return this.healthCheckResults
      .slice(-limit)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get health check history
   */
  async getHealthCheckHistory(
    startDate: Date,
    endDate: Date,
    checkName?: string
  ): Promise<HealthCheckResult[]> {
    return this.healthCheckResults.filter(result => {
      const resultDate = new Date(result.timestamp);
      const matchesDateRange = resultDate >= startDate && resultDate <= endDate;
      const matchesName = checkName ? result.name === checkName : true;
      return matchesDateRange && matchesName;
    });
  }

  /**
   * Get overall health status
   */
  async getOverallHealthStatus(): Promise<HealthStatus> {
    const recentChecks = await this.getRecentHealthChecks(10);
    
    if (recentChecks.length === 0) {
      return HealthStatus.UNKNOWN;
    }

    const unhealthyCount = recentChecks.filter(
      check => check.status === HealthStatus.UNHEALTHY
    ).length;

    const degradedCount = recentChecks.filter(
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

  /**
   * Clear old health check data
   */
  async clearOldHealthData(olderThan: Date): Promise<void> {
    this.healthCheckResults = this.healthCheckResults.filter(
      result => new Date(result.timestamp) > olderThan
    );
  }
}

/**
 * Factory for creating health repository instances
 * Implements Factory Pattern for repository creation
 */
export class HealthRepositoryFactory {
  /**
   * Create a new health repository instance
   */
  static create(): IHealthRepository {
    return HealthRepository.getInstance();
  }

  /**
   * Create a mock health repository for testing
   */
  static createMock(): IHealthRepository {
    return {
      getSystemMetrics: async () => ({
        uptime: 3600,
        memory: { used: 1024, total: 2048, percentage: 50 },
        cpu: { usage: 25, load: [1.5, 1.2, 1.0] },
        disk: { used: 512, total: 1024, percentage: 50 },
        network: { connections: 10, requests: 100 }
      }),
      getUptime: async () => 3600,
      getVersion: async () => '1.0.0',
      storeHealthCheckResult: async () => {},
      getRecentHealthChecks: async () => [],
      getHealthCheckHistory: async () => [],
      getOverallHealthStatus: async () => HealthStatus.HEALTHY,
      clearOldHealthData: async () => {}
    };
  }
} 