import type { Response, NextFunction } from "express";
import { BaseController } from "@shared/interfaces/controller-base.interface";
import { AuthService } from "@modules/auth/services/auth.service";
import {
  loginSchema,
  registerSchema,
  type RegisterInput,
  type LoginInput,
  verifyCodeSchema,
  reSendVerificationCodeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  VerifyCodeInput,
  ReSendVerifyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@modules/auth/validations/auth.validation";
import { ApiResponse, BadRequestError } from "@repo/types/response";
import { RegisterWithAuth, RequestWithTenant } from "@shared/types/request";

export class ManualAuthController extends BaseController {
  private service = new AuthService();

  async execute(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const action = req.action;
    switch (action) {
      case "login":
        await this.handleLogin(req, res, next);
        break;
      case "register":
        await this.handleRegister(req, res, next);
        break;
      case "verify-code":
        await this.handleVerifyCode(req, res, next);
        break;
      case "resend-code":
        await this.handleReSendVerificationCode(req, res, next);
        break;
      case "forgot-password":
        await this.handleForgotPassword(req, res, next);
        break;
      case "reset-password":
        await this.handleResetPassword(req, res, next);
        break;
      default:
        throw new BadRequestError("Invalid action");
    }
  }

  private async handleLogin(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const data = this.validate<LoginInput>(req.body, loginSchema);
    const result = await this.service.login(data);
    this.sendResponse(res, ApiResponse.success(result, "Login successful"));
  }

  private async handleRegister(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // res.json("asdsaasd");
    const data = this.validate<RegisterInput>(req.body, registerSchema);
    const result = await this.service.register(data);
    // this.sendResponse(res, ApiResponse.success(result, "Register successful"));
    res.status(200).json(result);
  }
  private async handleVerifyCode(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const data = this.validate<VerifyCodeInput>(req.body, verifyCodeSchema);
    const result = await this.service.verifyCode(
      data.email,
      data.verificationCode
    );
    this.sendResponse(
      res,
      ApiResponse.success(result, "Verify code successful")
    );
  }

  private async handleReSendVerificationCode(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const data = this.validate<ReSendVerifyInput>(
      req.body,
      reSendVerificationCodeSchema
    );
    // Service hiện nhận (email, verificationCode). Nếu bạn đổi service sang chỉ cần email, cập nhật dòng dưới:
    const result = await this.service.reSendVerificationCode(
      data.email,
      // nếu không có verificationCode trong body, truyền '' hoặc undefined theo chữ ký hàm hiện tại
      (data as any).verificationCode ?? ""
    );
    this.sendResponse(
      res,
      ApiResponse.success(result, "Resend verification code successful")
    );
  }

  private async handleForgotPassword(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const data = this.validate<ForgotPasswordInput>(
      req.body,
      forgotPasswordSchema
    );
    const result = await this.service.forgotPassword(data.email);
    this.sendResponse(
      res,
      ApiResponse.success(result, "Forgot password email sent")
    );
  }

  private async handleResetPassword(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const data = this.validate<ResetPasswordInput>(
      req.body,
      resetPasswordSchema
    );
    const result = await this.service.resetPassword(
      data.newPassword,
      data.resetToken
    );
    this.sendResponse(
      res,
      ApiResponse.success(result, "Reset password successful")
    );
  }
}

export class OAuthAuthController extends BaseController {
  private service = new AuthService();

  async execute(req: RegisterWithAuth, res: Response): Promise<void> {
    const { action } = req;
    switch (action) {
      case "oauth_init":
        await this.handleOAuthInit(req, res);
        break;
      case "oauth_callback":
        await this.handleOAuthCallback(req, res);
        break;
      default:
        throw new BadRequestError("Invalid action");
    }
  }

  private async handleOAuthInit(
    req: RegisterWithAuth,
    res: Response
  ): Promise<void> {
    // TODO: Implement OAuth init
    this.sendResponse(res, ApiResponse.success(null, "OAuth init successful"));
  }

  private async handleOAuthCallback(
    req: RegisterWithAuth,
    res: Response
  ): Promise<void> {
    // TODO: Implement OAuth callback
    this.sendResponse(
      res,
      ApiResponse.success(null, "OAuth callback successful")
    );
  }
}
