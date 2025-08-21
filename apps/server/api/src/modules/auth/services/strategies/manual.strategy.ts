import bcrypt from "bcryptjs";
import _, { now } from "lodash";
import jwt from 'jsonwebtoken';
// repo
import { env } from "@repo/config-env";
import { UserProvider } from "@repo/database";
import { BadRequestError, ForbiddenError } from "@repo/types/response";
// shared
import { UserRepository } from "@shared/repositories/user.repository";
import { BcryptUtils } from "@shared/utils/bcrypt";
import { TokenService } from "@shared/services/token.service";
// modules
import {
  type LoginCredentials,
  type AuthResult,
  type ManualAuthStrategy,
  RegisterCredentials,
  PickUserFields,
} from "@modules/auth/interfaces/auth.interface";
import { CreateCodeUtils } from "@/shared/utils/code";
import { log } from "console";
import EmailService from "@/shared/services/email.service";
import { buildVerifyLink } from "@/shared/utils/verify-link";
import { buildEmailTemplate } from "@/shared/services/email/email-template";

export class ManualStrategy implements ManualAuthStrategy {
  public readonly name = "manual" as const;
  private readonly users = new UserRepository();
  private readonly bcrypt = new BcryptUtils();
  private readonly tokenService = new TokenService();
  private readonly createCode = new CreateCodeUtils();
  private readonly tokenBuilder;

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
    this.tokenBuilder = new TokenService().builder()
      .withIssuer(env.JWT_ISSUER)
      .withAudience(env.JWT_AUDIENCE)
      .withAccessSecret(env.JWT_ACCESS_SECRET)
      .withAccessExpiresIn(env.JWT_ACCESS_EXPIRY)
      .withRefreshSecret(env.JWT_REFRESH_SECRET)
      .withRefreshExpiresIn(env.JWT_REFRESH_EXPIRY)
      .withVerifySecret(env.JWT_VERIFY_SECRET)
      .withVerifyExpiresIn(env.JWT_VERIFY_EXPIRY)
  }

  canHandle(): boolean {
    return true;
  }

  // login
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const user = await this.users.findByEmailOrUsername(
      credentials.usernameOrEmail
    );
    if (!user || !user.passwordHash) {
      throw new BadRequestError(this.errorMessages.INVALID_CREDENTIALS);
    }
    const comparePassword = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );
    if (!comparePassword) {
      throw new BadRequestError(this.errorMessages.INVALID_CREDENTIALS);
    }
    if (user.emailVerified === false) {
      throw new BadRequestError(
        this.errorMessages.USER_NOT_ACTIVE,
        "EMAIL_NOT_VERIFIED", // code
        { reason: "EMAIL_NOT_VERIFIED" } // details (tùy chọn)
        // "/api/v1/auth/verify-code"
      );
    }

    // generate token
    const { accessToken, refreshToken } = this.tokenBuilder
      .withSubject(user.id) // chỉ thay đổi subject động
      .buildPair({});

    // update user last login at
    await this.users.update(user.id, { lastLoginAt: new Date() });

    return {
      user: _.pick(user, PickUserFields),
      accessToken,
      refreshToken,
    };
  }

  // register
  async register(credentials: RegisterCredentials): Promise<AuthResult> {
    const existingUser = await this.users.findByEmail(credentials.email);
    if (existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_ALREADY_EXISTS);
    }

    const otp = this.createCode.createCode();
    const otpExpired = this.createCode.setCodeExpiry();
    const expiryMinutes = this.createCode.getExpiryMinutes()

    const signEmailVerifyToken = this.tokenBuilder
      .withSubject(credentials.email) // chỉ thay đổi subject động
      .buildEmailVerifyToken({});
    const link = buildVerifyLink(signEmailVerifyToken)

    // const { subject, htmlBody, textBody } = emailVerifyTemplate(otp, expiryMinutes, link)
    const { subject, htmlBody, textBody } = buildEmailTemplate({ type: "verify", otp, minutes: expiryMinutes, link })

    await EmailService.sendEmail(
      htmlBody,
      {
        to: credentials.email,
        subject: subject,
        cc: [],
        bcc: [],
        priority: 'high',
      },
      textBody
    )

    const user = await this.users.create({
      email: credentials.email,
      username: await this.users.generateUsername(credentials.email),
      passwordHash: await this.bcrypt.hash(credentials.password),
      provider: UserProvider.EMAIL,
      firstName: null,
      lastName: null,
      phone: null,
      avatar: null,
      verificationCode: otp,
      verificationCodeExpired: otpExpired,
      resetToken: null,
    });

    return {
      user: _.pick(user, PickUserFields),
    };
  }

  async verifyCodeByEmailLink(token: string) {
    const payload = jwt.verify(token, env.JWT_VERIFY_SECRET)
    const email = String(payload.sub).trim().toLowerCase();
    const existingUser = await this.users.findByEmail(email);
    if (!payload?.sub) {
      throw new BadRequestError("Token không hợp lệ (thiếu email)", "INVALID_TOKEN");
    }
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }
    if (existingUser.emailVerified) {
      throw new BadRequestError("Tài khoản đã được xác thực trước đó", "ALREADY_VERIFIED");
    }

    if (!existingUser.isActive) {
      throw new BadRequestError("Tài khoản đã bị khóa", "USER_NOT_ACTIVE");
    }
    await this.users.verifyEmail(existingUser.id);
  }

  async verifyCode(email: string, verificationCode: string) {
    const existingUser = await this.users.findByEmail(email);
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }
    if (existingUser.verificationCode !== verificationCode) {
      throw new BadRequestError(this.errorMessages.USER_WRONG_CODE);
    }
    if (
      !existingUser.verificationCodeExpired ||
      Date.now() > new Date(existingUser.verificationCodeExpired).getTime()
    ) {
      throw new BadRequestError(this.errorMessages.USER_CODE_EXPIRED);
    }
    await this.users.verifyEmail(existingUser.id);
    return {
      user: _.pick(existingUser, PickUserFields)
    };
  }

  async reSendVerificationCode(email: string) {
    const existingUser = await this.users.findByEmail(email);
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }
    const otp = this.createCode.createCode();
    const otpExpired = this.createCode.setCodeExpiry();
    const expiryMinutes = this.createCode.getExpiryMinutes()

    const prevSent = existingUser.verificationCodeExpired
      ? new Date(existingUser.verificationCodeExpired).getTime()
      : null;
    // Lấy thời điểm hiện tại
    const now = Date.now();

    // Nếu đã từng gửi và chưa qua 5 giây thì chặn
    if (prevSent !== null && now - prevSent < 5000) {
      throw new BadRequestError(this.errorMessages.USER_TOO_FAST);
    }

    await this.users.update(existingUser.id, {
      verificationCode: otp,
      verificationCodeExpired: otpExpired,
    });

    const signEmailVerifyToken = this.tokenBuilder
      .withSubject(email) // chỉ thay đổi subject động
      .buildEmailVerifyToken({});
    const link = buildVerifyLink(signEmailVerifyToken)

    // const { subject, htmlBody, textBody } = emailVerifyTemplate(otp, expiryMinutes, link)
    const { subject, htmlBody, textBody } = buildEmailTemplate({ type: "verify", otp, minutes: expiryMinutes, link })

    await EmailService.sendEmail(
      htmlBody,
      {
        to: email,
        subject: subject,
        cc: [],
        bcc: [],
        priority: 'high',
      },
      textBody
    )
    return {
      user: _.pick(existingUser, PickUserFields),
      accessToken: "",
      refreshToken: "",
    };
  }
  async forgotPassword(email: string) {
    const existingUser = await this.users.findByEmail(email);
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }
    const resetTokenValue = this.createCode.setResetToken();

    await this.users.update(existingUser.id, { resetToken: resetTokenValue });
    const resetLink = `${env.BASE_URL}/api/v1/auth/reset-password?resetToken=${resetTokenValue}`;
    const link = resetLink;

    const { subject, htmlBody, textBody } = buildEmailTemplate({ type: "reset", link })

    await EmailService.sendEmail(
      htmlBody,
      {
        to: email,
        subject: subject,
        cc: [],
        bcc: [],
        priority: 'high',
      },
      textBody
    )
    return {
      user: _.pick(existingUser, PickUserFields),
    };
  }
  async resetPassword(newPassword: string, resetToken: string) {
    const existingUser = await this.users.findByResetToken(resetToken);
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }

    await this.users.update(existingUser.id, {
      passwordHash: await this.bcrypt.hash(newPassword),
      passwordChangedAt: new Date(),
    });
    return {
      user: _.pick(existingUser, PickUserFields),
    };
  }
}
