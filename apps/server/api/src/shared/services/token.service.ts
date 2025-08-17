import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken";

type Primitive = string | number | boolean | null;

export interface TokenMeta {
  issuer?: string;
  audience?: string | string[];
  subject?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
}

export class JwtBuilder<TPayload extends object = JwtPayload> {
  private accessSecret?: string; // secret for the access token
  private refreshSecret?: string; // secret for the refresh token
  private accessExpiresIn?: string; // expires in for the access token
  private refreshExpiresIn?: string; // expires in for the refresh token
  private issuer?: string; // issuer of the token (e.g. "https://api.example.com")
  private audience?: string | string[]; // audience of the token (e.g. "https://api.example.com")
  private subject?: string; // subject of the token (e.g. "user_id")
  private additionalOptions: Partial<SignOptions> = {}; // additional options for the token

  withAccessSecret(secret: string): this {
    this.accessSecret = secret;
    return this;
  }
  withRefreshSecret(secret: string): this {
    this.refreshSecret = secret;
    return this;
  }
  withAccessExpiresIn(expiresIn: string): this {
    this.accessExpiresIn = expiresIn;
    return this;
  }
  withRefreshExpiresIn(expiresIn: string): this {
    this.refreshExpiresIn = expiresIn;
    return this;
  }
  withIssuer(issuer: string): this {
    this.issuer = issuer;
    return this;
  }
  withAudience(audience: string | string[]): this {
    this.audience = audience;
    return this;
  }
  withSubject(subject: string): this {
    this.subject = subject;
    return this;
  }
  withOptions(options: Partial<SignOptions>): this {
    this.additionalOptions = { ...this.additionalOptions, ...options };
    return this;
  }

  buildAccessToken(payload: TPayload): string {
    if (!this.accessSecret || !this.accessExpiresIn)
      throw new Error("ACCESS_CONFIG_MISSING");
    return jwt.sign(payload, this.accessSecret, {
      algorithm: "HS256",
      expiresIn: this.accessExpiresIn,
      issuer: this.issuer,
      audience: this.audience,
      subject: this.subject,
      ...this.additionalOptions,
    }) as string;
  }

  buildRefreshToken(payload: TPayload): string {
    if (!this.refreshSecret || !this.refreshExpiresIn)
      throw new Error("REFRESH_CONFIG_MISSING");
    return jwt.sign(payload, this.refreshSecret, {
      algorithm: "HS256",
      expiresIn: this.refreshExpiresIn,
      issuer: this.issuer,
      audience: this.audience,
      subject: this.subject,
      ...this.additionalOptions,
    }) as string;
  }

  buildPair(payload: TPayload, withRefresh = true): TokenPair {
    const accessToken = this.buildAccessToken(payload);
    const refreshToken = withRefresh
      ? this.buildRefreshToken(payload)
      : undefined;
    return { accessToken, refreshToken };
  }
}

export class TokenService {
  builder<T extends object = JwtPayload>(): JwtBuilder<T> {
    return new JwtBuilder<T>();
  }
}

export default TokenService;
