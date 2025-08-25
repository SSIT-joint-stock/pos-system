import { RegisterWithAuth } from "@/shared/types/request";
import {
  type LoginCredentials,
  type AuthResult,
  type ManualAuthStrategy,
  type OAuthAuthStrategy,
  type IAuthService,
  RegisterCredentials,
  type AuthProvider,
  OAuthInitParams,
  OAuthCallbackParams,
  AuthStrategy,
  IBusinessInfor,
} from "../interfaces/auth.interface";
import { BusinessInforService } from "./auth.business.builder";
import { AuthStrategyFactory } from "./auth.factory";
import { UserRepository } from "@/shared/repositories/user.repository";
import { ForbiddenError } from "@repo/types/response";
import { TenantRepository } from "@/shared/repositories/tenant.repository";
import { addIssueToContext } from "zod";
export class AuthService implements IAuthService {
  private readonly manual: ManualAuthStrategy;
  private readonly oauth: OAuthAuthStrategy;
  private readonly businessInforService = new BusinessInforService();
  private readonly users = new UserRepository();
  private readonly tenant = new TenantRepository();

  private readonly errorMessages = {
    INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác",
    USER_NOT_FOUND: "Tài khoản không tồn tại",
    USER_NOT_ACTIVE: "Tài khoản chưa được kích hoạt",
    USER_ALREADY_EXISTS: "Tài khoản đã tồn tại",
    USER_WRONG_CODE: "Mã OTP không đúng.",
    USER_CODE_EXPIRED: "Mã otp quá hạn ",
    USER_TOO_FAST: "Người dùng thao tác quá nhanh, Doi 5s de gui lai",
  };

  constructor() {
    this.manual = AuthStrategyFactory.create("manual") as ManualAuthStrategy;
    this.oauth = AuthStrategyFactory.create("oauth") as OAuthAuthStrategy;
  }

  // login
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    return this.manual.login(credentials);
  }

  // register
  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    return this.manual.register(credentials);
  }

  //verify otp
  async verifyCode(email: string, verificationCode: string) {
    return this.manual.verifyCode(email, verificationCode);
  }

  async verifyCodeByEmailLink(token: string) {
    this.manual.verifyCodeByEmailLink(token)
  }

  //resend otp
  async reSendVerificationCode(email: string, verificationCode: string) {
    return this.manual.reSendVerificationCode(email, verificationCode);
  }

  //forgot password
  async forgotPassword(email: string) {
    return this.manual.forgotPassword(email);
  }

  //reset password
  async resetPassword(newPassword: string, resetToken: string) {
    return this.manual.resetPassword(newPassword, resetToken);
  }

  // oauth init
  async oauthInit(
    params: OAuthInitParams
  ): Promise<{ authUrl: string; state?: string }> {
    return this.oauth.init(params);
  }

  // oauth callback
  async oauthCallback(params: OAuthCallbackParams): Promise<AuthResult> {
    return this.oauth.callback(params);
  }

  async addBusinessInfor(businessInfor: IBusinessInfor) {
    const existingUser = await this.users.findById(businessInfor.userId);
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }
    await this.tenant.addBusinessInfo(businessInfor.userId, businessInfor)
    // const existingUser = await this.users.findById(businessInfor.userId);
    // if (existingUser) {
    //   throw new ForbiddenError(this.errorMessages.USER_ALREADY_EXISTS);
    // }
    // const tenant = await this.tenant.addBusinessInfo( businessInfor);

    return this.businessInforService
      .builder()
      .withAddress(businessInfor.address)
      .withName(businessInfor.name)
      .withPhone(businessInfor.phone)
      .withTaxCode(businessInfor.taxCode)
      .build();
  }

  getStrategy<T extends AuthProvider>(
    strategy: T
  ): T extends "manual"
    ? ManualAuthStrategy
    : T extends "oauth"
    ? OAuthAuthStrategy
    : never {
    return AuthStrategyFactory.create(strategy) as T extends "manual"
      ? ManualAuthStrategy
      : T extends "oauth"
      ? OAuthAuthStrategy
      : never;
  }
}

export default new AuthService();
