import { Request, Response, NextFunction } from 'express';
import { BaseController } from '@shared/interfaces/controller-base.interface';
import { 
  IHealthService, 
  HealthCheckRequest,
  HealthCheckResponse,
  SystemMetrics,
  HealthCheckResult
} from '@modules/health/interfaces/health.interface';
import { healthCheckSchema } from '@modules/health/validations/health.validation';
import { HealthServiceFactory } from '@modules/health/services/health.service';
import { ApiResponse } from '@repo/types/response';

/**
 * Health Controller
 * Handles HTTP requests for health check endpoints
 * Implements Controller Pattern with Template Method
 */
export class HealthController extends BaseController {
  private healthService: IHealthService;

  constructor(healthService?: IHealthService) {
    super();
    this.healthService = healthService || HealthServiceFactory.create();
  }

  /**
   * Main execution method that routes requests to appropriate handlers
   * Implements Template Method pattern
   */
  async execute(req: Request, res: Response): Promise<void> {
    const { action } = req.query;

    switch (action) {
      case 'metrics':
        await this.getMetrics(req, res);
        break;
      case 'history':
        await this.getHistory(req, res);
        break;
      case 'status':
        await this.getStatus(req, res);
        break;
      default:
        await this.performHealthCheck(req, res);
        break;
    }
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(req: Request, res: Response): Promise<void> {
    try {
      // Validate request parameters
      const requestData = this.validate(req.query, healthCheckSchema);
      
      // Perform health check
      const result = await this.healthService.performHealthCheck(requestData);
      
      // Send response
      this.sendResponse(
        res,
        ApiResponse.success(
          result,
          'Health check completed successfully'
        )
      );
    } catch (error) {
      // Error handling is done by the base controller
      throw error;
    }
  }

  /**
   * Get system metrics
   */
  private async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await this.healthService.getSystemMetrics();
      
      this.sendResponse(
        res,
        ApiResponse.success(
          metrics,
          'System metrics retrieved successfully'
        )
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get health check history
   */
  private async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, checkName } = req.query;
      
      // Validate date parameters
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24 hours ago
      const end = endDate ? new Date(endDate as string) : new Date();
      const check = checkName as string | undefined;
      
      const history = await this.healthService.getHealthCheckHistory(start, end, check);
      
      this.sendResponse(
        res,
        ApiResponse.success(
          history,
          'Health check history retrieved successfully'
        )
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current system status
   */
  private async getStatus(req: Request, res: Response): Promise<void> {
    try {
      // Perform a quick health check for status
      const result = await this.healthService.performHealthCheck({
        includeMetrics: false,
        timeout: 2000,
        checks: []
      });
      
      // Return only essential status information
      const status = {
        status: result.status,
        timestamp: result.timestamp,
        version: result.version,
        uptime: result.uptime,
        checksCount: result.checks.length,
        healthyChecks: result.checks.filter(check => check.status === 'healthy').length
      };
      
      this.sendResponse(
        res,
        ApiResponse.success(
          status,
          'System status retrieved successfully'
        )
      );
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Factory for creating health controller instances
 * Implements Factory Pattern for controller creation
 */
export class HealthControllerFactory {
  /**
   * Create a new health controller instance
   */
  static create(): HealthController {
    return new HealthController();
  }

  /**
   * Create a health controller with custom service
   */
  static createWithService(healthService: IHealthService): HealthController {
    return new HealthController(healthService);
  }

  /**
   * Create a mock health controller for testing
   */
  static createMock(): HealthController {
    const mockService = HealthServiceFactory.createMock();
    return new HealthController(mockService);
  }
} 