import { IBaseController } from "./../../../shared/interfaces/controller-base.interface";
import type { Response, NextFunction } from "express";
import { BaseController } from "@shared/interfaces/controller-base.interface";
import { AuthService } from "@modules/auth/services/auth.service";
import ms from "ms";
import {
  loginSchema,
  registerSchema,
  type RegisterInput,
  LoginInput,
  verifyCodeSchema,
  reSendVerificationCodeSchema,
  businessSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  VerifyCodeInput,
  ReSendVerifyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  BusinessInfoInput,
} from "@modules/auth/validations/auth.validation";
import { ApiResponse, BadRequestError } from "@repo/types/response";
import { RegisterWithAuth, RequestWithTenant } from "@shared/types/request";
import { jwtAccessUtils } from "@/shared/middleware/auth.middleware";
import { env } from "@repo/config-env";

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
      case "verify-code-by-email-link":
        await this.handleVerifyCodeByEmailLink(req, res, next);
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
      case "refresh":
        await this.handleRefresh(req, res, next);
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
    console.log(data)

    const result = await this.service.login(data);
    res.setHeader("Authorization", `Bearer ${result.accessToken}`);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_REFRESH_EXPIRY),
    });

    this.sendResponse(res, ApiResponse.success(result, "Login successful"));
  }

  private async handleRefresh(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const accessToken = jwtAccessUtils.generateToken({ id: req.userId }, {});
    res.status(200).json({ accessToken });
  }

  private async handleRegister(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const data = this.validate<RegisterInput>(req.body, registerSchema);
    const result = await this.service.register(data);
    this.sendResponse(res, ApiResponse.success(result, "Register successful"));
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

  private async handleVerifyCodeByEmailLink(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = req.query.token;
    if (typeof token !== "string") {
      throw new BadRequestError("Invalid or missing token");
    }
    await this.service.verifyCodeByEmailLink(token);

    //fix this: redirect to login page FE
    // return res.redirect(`${env.BASE_URL}/api/v1/auth/login`);
    return res.redirect(`https://google.com`);
  }

  private async handleReSendVerificationCode(
    req: RegisterWithAuth,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const email = String(req.query.email)
    const data = this.validate<ReSendVerifyInput>(
      { email },
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
    const resetToken = String(req.query.resetToken)
    const newPassword = req.body.newPassword
    const data = this.validate<ResetPasswordInput>(
      { resetToken, newPassword },
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

export class BusinessController extends BaseController {
  private service = new AuthService();
  async execute(req: RegisterWithAuth, res: Response): Promise<void> {
    // Validate request body
    const businessInfo = this.validate<BusinessInfoInput>(
      req.body,
      businessSchema
    );

    // Thêm business info
    const result = await this.service.addBusinessInfor(businessInfo);

    // Gửi response chuẩn
    this.sendResponse(
      res,
      ApiResponse.success(result, "Business info added successfully")
    );
  }
}
