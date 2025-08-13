import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import {
  ApiResponse,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@repo/types/response";
import AsyncMiddleware from "@shared/utils/async-handler";

/**
 * Base Controller Interface
 * Defines the contract for all controllers in the POS system
 * Follows the Template Method pattern for consistent request handling
 */
export interface IBaseController {
  /**
   * Main execution method that handles the request
   * This is the template method that orchestrates the request flow
   */
  execute(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * Creates an Express middleware function that wraps the execute method
   * Provides error handling and consistent request processing
   */
  handle(): (req: Request, res: Response, next: NextFunction) => void;

  /**
   * Sends a standardized API response
   */
  sendResponse<T>(res: Response, response: ApiResponse<T>): void;

  /**
   * Validates request data against a Zod schema
   * Throws ValidationError if validation fails
   */
  validate<T>(data: T, schema: ZodSchema<T>): T;

  /**
   * Extracts and validates pagination parameters from query
   */
  getPaginationParams(req: Request): {
    page: number;
    limit: number;
    offset: number;
  };

  /**
   * Extracts tenant ID from request headers
   * Throws AuthenticationError if tenant ID is missing
   */
  getTenantId(req: Request): string;

  /**
   * Extracts user ID from request (after authentication)
   * Throws AuthenticationError if user ID is missing
   */
  getUserId(req: Request): string;
}

/**
 * Base Controller Abstract Class
 * Provides default implementation of the IBaseController interface
 * Uses Template Method pattern for consistent request handling
 */
export abstract class BaseController implements IBaseController {
  /**
   * Template method that defines the request handling flow
   * Subclasses must implement the specific business logic
   */
  abstract execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  /**
   * Creates Express middleware with error handling
   * Implements the Template Method pattern
   */
  public handle(): (req: Request, res: Response, next: NextFunction) => void {
    return AsyncMiddleware.asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        // Validate tenant context
        this.getTenantId(req);

        // Execute the specific controller logic
        await this.execute(req, res, next);
      }
    );
  }

  /**
   * Sends standardized API response
   */
  public sendResponse<T>(res: Response, response: ApiResponse<T>): void {
    res.status(200).json(response);
  }

  /**
   * Validates data against Zod schema
   * Throws ValidationError if validation fails
   */
  public validate<T>(data: T, schema: ZodSchema<T>): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ValidationError(
        result.error.flatten().fieldErrors as Record<string, string[]>
      );
    }
    return result.data;
  }

  /**
   * Extracts and validates pagination parameters
   */
  public getPaginationParams(req: Request): {
    page: number;
    limit: number;
    offset: number;
  } {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string) || 20)
    );
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  /**
   * Extracts tenant ID from request headers
   */
  public getTenantId(req: Request): string {
    const tenantId = req.headers["x-tenant-id"] as string;
    if (!tenantId) {
      throw new UnauthorizedError("Tenant ID is required", "TENANT_REQUIRED");
    }
    return tenantId;
  }

  /**
   * Extracts user ID from request (after authentication)
   */
  public getUserId(req: Request): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("User ID is required", "USER_REQUIRED");
    }
    return userId;
  }
}

/**
 * CRUD Controller Interface
 * Extends base controller with common CRUD operations
 */
export interface ICrudController<T> extends IBaseController {
  /**
   * Get all resources with pagination and filtering
   */
  getAll(req: Request, res: Response): Promise<void>;

  /**
   * Get a single resource by ID
   */
  getById(req: Request, res: Response): Promise<void>;

  /**
   * Create a new resource
   */
  create(req: Request, res: Response): Promise<void>;

  /**
   * Update an existing resource
   */
  update(req: Request, res: Response): Promise<void>;

  /**
   * Delete a resource
   */
  delete(req: Request, res: Response): Promise<void>;
}

/**
 * Abstract CRUD Controller
 * Provides default implementation for common CRUD operations
 */
export abstract class BaseCrudController<T>
  extends BaseController
  implements ICrudController<T>
{
  /**
   * Execute method that routes to appropriate CRUD operation
   */
  async execute(req: Request, res: Response): Promise<void> {
    switch (req.method) {
      case "GET":
        if (req.params.id) {
          await this.getById(req, res);
        } else {
          await this.getAll(req, res);
        }
        break;
      case "POST":
        await this.create(req, res);
        break;
      case "PUT":
      case "PATCH":
        await this.update(req, res);
        break;
      case "DELETE":
        await this.delete(req, res);
        break;
      default:
        throw new BadRequestError("Method not allowed", "METHOD_NOT_ALLOWED");
    }
  }

  /**
   * Default implementations that can be overridden by subclasses
   */
  async getAll(req: Request, res: Response): Promise<void> {
    throw new NotFoundError("Method not implemented", "NOT_IMPLEMENTED");
  }

  async getById(req: Request, res: Response): Promise<void> {
    throw new NotFoundError("Method not implemented", "NOT_IMPLEMENTED");
  }

  async create(req: Request, res: Response): Promise<void> {
    throw new NotFoundError("Method not implemented", "NOT_IMPLEMENTED");
  }

  async update(req: Request, res: Response): Promise<void> {
    throw new NotFoundError("Method not implemented", "NOT_IMPLEMENTED");
  }

  async delete(req: Request, res: Response): Promise<void> {
    throw new NotFoundError("Method not implemented", "NOT_IMPLEMENTED");
  }
}
