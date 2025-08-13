import type { Request } from 'express';

export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}

export interface AuthResult {
    userId: string;
    accessToken: string;
    refreshToken?: string;
}

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


