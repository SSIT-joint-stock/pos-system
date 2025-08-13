import bcrypt from "bcryptjs";
import _ from "lodash";
// repo
import { env } from "@repo/config-env";
import { UserProvider } from "@repo/database";
import { BadRequestError, ForbiddenError } from "@repo/types/response";
// shared
import {
  UserRepository,
} from "@shared/repositories/user.repository";
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

export class ManualStrategy implements ManualAuthStrategy {
  public readonly name = "manual" as const;
  private readonly users = new UserRepository();
  private readonly bcrypt = new BcryptUtils();
  private readonly tokenService = new TokenService();

  private readonly errorMessages = {
    INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác",
    USER_NOT_FOUND: "Tài khoản không tồn tại",
    USER_NOT_ACTIVE: "Tài khoản chưa được kích hoạt",
    USER_ALREADY_EXISTS: "Tài khoản đã tồn tại",
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
    const user = await this.users.create({
      email: credentials.email,
      username: await this.users.generateUsername(credentials.email),
      passwordHash: await this.bcrypt.hash(credentials.password),
      provider: UserProvider.EMAIL,
      firstName: null,
      lastName: null,
      phone: null,
      avatar: null,
    });
    return {
      user: _.pick(user, PickUserFields),
      accessToken: "",
      refreshToken: "",
    };
  }
}
