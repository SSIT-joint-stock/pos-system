import bcrypt from "bcryptjs";
import _, { now } from "lodash";
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
import { sendVerificationCode } from "@/shared/utils/sendEmail";
import { CreateCodeUtils } from "@/shared/utils/code";
import { log } from "console";
import { EmailServiceSingleton } from "@/shared/services/email.service";

export class ManualStrategy implements ManualAuthStrategy {
  public readonly name = "manual" as const;
  private readonly users = new UserRepository();
  private readonly bcrypt = new BcryptUtils();
  private readonly tokenService = new TokenService();
  private readonly createCode = new CreateCodeUtils();

  private readonly errorMessages = {
    INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác",
    USER_NOT_FOUND: "Tài khoản không tồn tại",
    USER_NOT_ACTIVE: "Tài khoản chưa được kích hoạt",
    USER_ALREADY_EXISTS: "Tài khoản đã tồn tại",
    USER_WRONG_CODE: "Mã OTP không đúng.",
    USER_CODE_EXPIRED: "Mã otp quá hạn ",
    USER_TOO_FAST: "Người dùng thao tác quá nhanh, Doi 5s de gui lai",
  };

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
    const { accessToken, refreshToken } = this.tokenService
      .builder()
      .withIssuer(env.JWT_ISSUER)
      .withAudience(env.JWT_AUDIENCE)
      .withSubject(user.id)
      .withAccessSecret(env.JWT_ACCESS_SECRET)
      .withAccessExpiresIn(env.JWT_ACCESS_EXPIRY)
      .withRefreshSecret(env.JWT_REFRESH_SECRET)
      .withRefreshExpiresIn(env.JWT_REFRESH_EXPIRY)
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
    const otpExpired = this.createCode.setCodeExpiry;
    const emailQueueService = EmailServiceSingleton.getInstance()
    const htmlBody =
      `
            <b>Chào mừng bạn đến với hệ thống của chúng tôi!</b><br><br>
            <p>Vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản của bạn:</p>
            <h2 style="text-align: center; color: #4CAF50;">${otp}</h2>
            <p>Mã OTP này sẽ hết hạn trong ${otpExpired} phút.</p>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <hr>
            <p style="font-size: 12px; color: #777;">Nếu bạn không yêu cầu đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    `
    const textBody = "Đây là email được gửi từ eraPos"
    await emailQueueService.sendEmail(
      htmlBody,
      {
        // to: process.env.EMAIL_TEST_RECIPIENT,
        to: credentials.email,
        subject: 'Xác thực đăng nhập',
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
      verificationCodeExpired: otpExpired(),
      resetToken: null,
    });

    return {
      user: _.pick(user, PickUserFields),
      accessToken: "",
      refreshToken: "",
    };
  }

  async verifyCode(email: string, verificationCode: string) {
    const existingUser = await this.users.findByEmail(email);
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }
    if (existingUser.verificationCode !== verificationCode) {
      throw new Error(this.errorMessages.USER_WRONG_CODE);
    }
    if (
      !existingUser.verificationCodeExpired ||
      Date.now() > new Date(existingUser.verificationCodeExpired).getTime()
    ) {
      throw new Error(this.errorMessages.USER_CODE_EXPIRED);
    }
    const user = await this.users.verifyEmail(existingUser.id);
    return {
      user: _.pick(user, PickUserFields),
      accessToken: "",
      refreshToken: "",
    };
  }

  async reSendVerificationCode(email: string) {
    const existingUser = await this.users.findByEmail(email);
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }
    const otp = this.createCode.createCode();
    const otpExpired = this.createCode.setCodeExpiry;

    const prevSent = existingUser.verificationCodeExpired
      ? new Date(existingUser.verificationCodeExpired).getTime()
      : null;
    // Lấy thời điểm hiện tại
    const now = Date.now();

    // Nếu đã từng gửi và chưa qua 5 giây thì chặn
    if (prevSent !== null && now - prevSent < 5000) {
      throw new Error(this.errorMessages.USER_TOO_FAST);
    }

    await this.users.update(existingUser.id, {
      verificationCode: otp,
      verificationCodeExpired: otpExpired(),
    });
    await sendVerificationCode(
      email,
      // 'xuanhoa0379367667@gmail.com',
      "Xác thực đăng nhập",
      `
            <b>Chào mừng bạn đến với hệ thống của chúng tôi!</b><br><br>
            <p>Vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản của bạn:</p>
            <h2 style="text-align: center; color: #4CAF50;">${otp}</h2>
            <p>Mã OTP này sẽ hết hạn trong ${otpExpired} phút.</p>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <hr>
            <p style="font-size: 12px; color: #777;">Nếu bạn không yêu cầu đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
        `
    );
    return {
      user: _.pick(existingUser, PickUserFields),
      accessToken: "",
      refreshToken: "",
    };

    // async forgotPassword(email: string) {

    // }
  }
  async forgotPassword(email: string) {
    const existingUser = await this.users.findByEmail(email);
    if (!existingUser) {
      throw new ForbiddenError(this.errorMessages.USER_NOT_FOUND);
    }
    const resetTokenValue = this.createCode.setResetToken();

    await this.users.update(existingUser.id, { resetToken: resetTokenValue });
    const resetLink = `${env.BASE_URL}/api/v1/auth/resetPassword?resetToken=${resetTokenValue}`;
    await sendVerificationCode(
      email,
      // 'xuanhoa0379367667@gmail.com',
      "Yêu cầu đổi mật khẩu",
      `
        <b>Xin chào!</b><br><br>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <p>Vui lòng nhấp vào liên kết dưới đây để thay đổi mật khẩu:</p>
        <p style="text-align: center;">
          <a href="${resetLink}" 
            style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                    color: white; text-decoration: none; border-radius: 5px;">
            Đổi mật khẩu
          </a>
        </p>
        <p>Liên kết này sẽ hết hạn sau <strong>15 phút</strong>.</p>
        <p>Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này.</p>
        <hr>
        <p style="font-size: 12px; color: #777;">
          Đây là email tự động, vui lòng không trả lời.
        </p>
      `
    );
    return {
      user: _.pick(existingUser, PickUserFields),
      accessToken: "",
      refreshToken: "",
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
      accessToken: "",
      refreshToken: "",
    };
  }
}
