import {
  type OAuthAuthStrategy,
  type OAuthInitParams,
  type OAuthCallbackParams,
  type AuthResult,
  PickUserFields,
} from "../../interfaces/auth.interface";
import _, { now } from "lodash";
import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "@/shared/repositories/user.repository";

import dotenv from "dotenv";
import { CreateCodeUtils } from "@/shared/utils/createCode";

dotenv.config();

export class OAuthStrategy implements OAuthAuthStrategy {
  public readonly name = "oauth" as const;
  private readonly users = new UserRepository();
  private readonly createCode = new CreateCodeUtils();

  private readonly oauth2Client: InstanceType<typeof OAuth2Client>;

  constructor() {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error("Missing CLIENT_ID or CLIENT_SECRET in .env");
    }
    this.oauth2Client = new OAuth2Client(clientId, clientSecret);
  }

  canHandle(): boolean {
    return true;
  }

  async init(
    params: OAuthInitParams
  ): Promise<{ authUrl: string; state?: string }> {
    const { provider, redirectUri, state } = params;

    if (provider !== "google") {
      throw new Error("Only Google OAuth is supported");
    }

    // Cấu hình scope (quyền truy cập)
    const scopes = ["profile", "email", "openid"];

    // Tạo URL đăng nhập Google
    const authorizeUrl = this.oauth2Client.generateAuthUrl({
      redirect_uri: redirectUri,
      scope: scopes,
      state: state,
      access_type: "offline", // Để lấy refresh token nếu cần
    });

    return { authUrl: authorizeUrl, state };
  }

  async callback(params: OAuthCallbackParams): Promise<AuthResult> {
    const { code, redirectUri, state } = params;

    if (!code) {
      throw new Error("Authorization code missing");
    }

    try {
      // Đổi code lấy token
      const { tokens } = await this.oauth2Client.getToken({
        code,
        redirect_uri: redirectUri,
      });

      // Lưu token vào oauth2Client để dùng sau
      this.oauth2Client.setCredentials(tokens);

      // Lấy thông tin người dùng từ id_token
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: tokens.id_token!,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error("Failed to get user info");
      }
      const providerId = payload.sub; // ID từ Google, lưu vào providerId
      const email = payload.email || "";
      const username = await this.users.generateUsername(email);
      const firstName = payload.given_name || null;
      const lastName = payload.family_name || null;
      const avatar = payload.picture || null;
      const emailVerified = payload.email_verified || false;

      let user = await this.users.findByProviderId(providerId);
      if (user) {
        // Cập nhật thông tin nếu đã tồn tại
        user = await this.users.update(user.id, {
          providerId, // Cập nhật providerId nếu khác
          email,
          username,
          firstName,
          lastName,
          avatar,
          emailVerified,
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        // Tạo người dùng mới nếu chưa tồn tại
        user = await this.users.create({
          providerId, // Lưu providerId
          email,
          username,
          firstName,
          lastName,
          avatar,
          phone: null,
          passwordHash: null,
          provider: "GOOGLE",
          verificationCode: null,
          verificationCodeExpired: null,
          resetToken: null,
        });
      }
      // Trả về AuthResult với các thuộc tính từ PickUserFields
      return {
        user: _.pick(user, PickUserFields),
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };
    } catch (error) {
      throw new Error(
        `OAuth callback failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
