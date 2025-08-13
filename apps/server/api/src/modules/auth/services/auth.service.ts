import { type LoginCredentials, type AuthResult, type ManualAuthStrategy, type OAuthAuthStrategy, type IAuthService } from '../interfaces/auth.interface';
import { ManualStrategy } from './strategies/manual.strategy';
import { OAuthStrategy } from './strategies/oauth.strategy';

export class AuthService implements IAuthService {
    private manual: ManualAuthStrategy;
    private oauth: OAuthAuthStrategy;

    constructor() {
        this.manual = new ManualStrategy();
        this.oauth = new OAuthStrategy();
    }

    async login(credentials: LoginCredentials): Promise<AuthResult> {
        return this.manual.login(credentials);
    }

    getOAuth() {
        return this.oauth;
    }
}


