import { type LoginCredentials, type AuthResult, type ManualAuthStrategy, type OAuthAuthStrategy, type IAuthService, RegisterCredentials, type AuthProvider, OAuthInitParams, OAuthCallbackParams, AuthStrategy } from '../interfaces/auth.interface';
import { AuthStrategyFactory } from './auth.factory';
export class AuthService implements IAuthService {
    private readonly manual: ManualAuthStrategy;
    private readonly oauth: OAuthAuthStrategy;

    constructor() {
        this.manual = AuthStrategyFactory.create('manual') as ManualAuthStrategy;
        this.oauth = AuthStrategyFactory.create('oauth') as OAuthAuthStrategy;
    }

    // login
    async login(credentials: LoginCredentials): Promise<AuthResult> {
        return this.manual.login(credentials);
    }

    // register
    async register(credentials: RegisterCredentials): Promise<AuthResult> {
        return this.manual.register(credentials);
    }

    // oauth init
    async oauthInit(params: OAuthInitParams): Promise<{ authUrl: string; state?: string }> {
        return this.oauth.init(params);
    }

    // oauth callback
    async oauthCallback(params: OAuthCallbackParams): Promise<AuthResult> {
        return this.oauth.callback(params);
    }

    getStrategy<T extends AuthProvider>(strategy: T): T extends 'manual' ? ManualAuthStrategy : T extends 'oauth' ? OAuthAuthStrategy : never {
        return AuthStrategyFactory.create(strategy) as T extends 'manual' ? ManualAuthStrategy : T extends 'oauth' ? OAuthAuthStrategy : never;
    }
}

export default new AuthService();


