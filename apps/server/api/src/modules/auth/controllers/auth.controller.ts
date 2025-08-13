// auth.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  AuthService,
  AuthServiceFactory,
} from "@modules/auth/services/auth.service";
import { BaseController } from "@/shared/interfaces/controller-base.interface";
import { IAuthService } from "../interfaces/auth.interface";
import AsyncMiddleware from "@/shared/utils/async-handler";
import { authMiddleware } from "@/shared/middleware/auth.middleware";
export class AuthController extends BaseController {
  private AuthService: IAuthService;

  constructor(private readonly authService: IAuthService) {
    super();
    this.authService = authService || AuthServiceFactory.create();
  }

  async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { action } = req.query;

    switch (action) {
      case "regiter":
        await this.register(req, res);
      case "login":
        await this.login(req, res);
    }
  }

  public handle(): (req: Request, res: Response, next: NextFunction) => void {
    // must to do this for middleware
    return AsyncMiddleware.asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        // Validate tenant context
        this.authMiddleware;
        // Execute the specific controller logic
        await this.execute(req, res, next);
      }
    );
  }

  public async authMiddleware(req: Request, res: Response, next: NextFunction) {
    authMiddleware;
  }

  async register(req: Request, res: Response) {
    const { type, ...data } = req.body;
    console.log(req.body);
    console.log(type);
    try {
      const authService = new AuthService();
      const result = await authService.register(type, data);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    const { type, ...data } = req.body;

    try {
      const authService = new AuthService();

      const result = await authService.login(type, data);
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true, // ngăn JS phía client đọc token
        secure: process.env.NODE_ENV === "production", // chỉ gửi qua HTTPS khi production
        maxAge: Number(process.env.JWT_ACCESS_EXPIRY),
        sameSite: "strict",
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: Number(process.env.JWT_REFRESH_EXPIRY),
        sameSite: "strict",
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  }
}

export class AuthControllerFactory {
  /**
   * Create a new health controller instance
   */
  static create(): AuthController {
    const authService = new AuthService();
    return new AuthController(authService);
  }

  /**
   * Create a health controller with custom service
   */
  static createWithService(AuthService: IAuthService): AuthController {
    return new AuthController(AuthService);
  }

  /**
   * Create a mock health controller for testing
   */
  // static createMock(): AuthController {
  //   const mockService = HealthServiceFactory.createMock();
  //   return new HealthController(mockService);
  // }
}
