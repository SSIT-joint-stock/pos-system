import { ManualStrategy } from './strategies/manual.strategy';
import { OAuthStrategy } from './strategies/oauth.strategy';
import type { AuthProvider, AuthStrategy } from '../interfaces/auth.interface';

export class AuthStrategyFactory {
  private static strategies = new Map<AuthProvider, () => AuthStrategy>();

  static {
    AuthStrategyFactory.register('manual', () => new ManualStrategy());
    AuthStrategyFactory.register('oauth', () => new OAuthStrategy());
  }

  static create(provider: AuthProvider): AuthStrategy {
    const factory = this.strategies.get(provider);
    if (!factory) {
      throw new Error(`Unsupported auth provider: ${String(provider)}`);
    }
    return factory();
  }

  static register(provider: AuthProvider, factory: () => AuthStrategy): void {
    this.strategies.set(provider, factory);
  }

  static listProviders(): AuthProvider[] {
    return Array.from(this.strategies.keys()) as AuthProvider[];
  }
}


