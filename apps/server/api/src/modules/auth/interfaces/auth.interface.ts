import type { Request } from 'express';
import type { UserEntity } from '@shared/repositories/user.repository';

export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface AuthResult {
    user: Pick<UserEntity, (typeof PickUserFields)[number]>;
    accessToken: string;
    refreshToken?: string;
}

export const PickUserFields = ['id', 'email', 'username', 'isActive', 'emailVerified', 'firstName', 'lastName', 'avatar', 'lastLoginAt', 'createdAt', 'updatedAt'] as const;

export interface OAuthInitParams {
    provider: 'google' | 'facebook' | 'github';
    redirectUri: string;
    state?: string;
}

export interface OAuthCallbackParams {
    provider: 'google' | 'facebook' | 'github';
    code: string;
    state?: string;
    redirectUri: string;
}

export interface AuthStrategy {
    name: 'manual' | 'oauth';
    canHandle(req: Request): boolean;
}

export interface ManualAuthStrategy extends AuthStrategy {
    name: 'manual';
    login(credentials: LoginCredentials): Promise<AuthResult>;
    register(credentials: RegisterCredentials): Promise<AuthResult>;
}

export interface OAuthAuthStrategy extends AuthStrategy {
    name: 'oauth';
    init(params: OAuthInitParams): Promise<{ authUrl: string; state?: string }>;
    callback(params: OAuthCallbackParams): Promise<AuthResult>;
}

export type AuthProvider = 'manual' | 'oauth';

export interface IAuthService {
    login(credentials: LoginCredentials): Promise<AuthResult>;
    oauthInit?(params: OAuthInitParams): Promise<{ authUrl: string; state?: string }>;
    oauthCallback?(params: OAuthCallbackParams): Promise<AuthResult>;
}


