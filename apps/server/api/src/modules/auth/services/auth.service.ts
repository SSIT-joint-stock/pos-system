import { ManualRegisterStrategy } from "@modules/auth/strategies/ManualRegisterStrategy";
import { AuthType, IAuthService } from "../interfaces/auth.interface";
import { ManualLoginStrategy } from "../strategies/ManualLoginStrategy";

export class AuthService implements IAuthService {
  private loginStrategies: Record<string, any>;
  private registerStrategies: Record<string, any>;

  constructor() {
    this.loginStrategies = {
      MANUAL: new ManualLoginStrategy(),
      // oauth: new OAuthLoginStrategy(),              //oauth not done yet
    };

    this.registerStrategies = {
      MANUAL: new ManualRegisterStrategy(),
      // oauth: new OAuthRegisterStrategy(),            //oauth not done yet
    };
  }

  async login(type: AuthType, data: any) {
    const strategy = this.loginStrategies[type];
    if (!strategy) throw new Error(`Login type ${type} not supported`);
    return await strategy.findUser(data);
  }

  async register(type: AuthType, data: any) {
    const strategy = this.registerStrategies[type];
    if (!strategy) throw new Error(`Register type ${type} not supported`);
    return await strategy.createUser(data);
  }
}

export class AuthServiceFactory {
  /**
   * Create a new health service instance
   */
  static create(): IAuthService {
    return new AuthService();
  }

  // /**
  //  * Create a health service with custom repository
  //  */
  // static createWithRepository(repository: IHealthRepository): IHealthService {
  //   return new HealthService(repository);
  // }

  // /**
  //  * Create a health service with custom registry
  //  */
  // static createWithRegistry(registry: HealthCheckRegistry): IHealthService {
  //   return new HealthService(undefined, registry);
  // }

  // /**
  //  * Create a mock health service for testing
  //  */
  // static createMock(): IHealthService {
  //   return {
  //     performHealthCheck: async () => ({
  //       status: HealthStatus.HEALTHY,
  //       timestamp: new Date().toISOString(),
  //       version: '1.0.0',
  //       checks: [],
  //       uptime: 3600
  //     }),
  //     getSystemMetrics: async () => ({
  //       uptime: 3600,
  //       memory: { used: 1024, total: 2048, percentage: 50 },
  //       cpu: { usage: 25, load: [1.5, 1.2, 1.0] },
  //       disk: { used: 512, total: 1024, percentage: 50 },
  //       network: { connections: 10, requests: 100 }
  //     }),
  //     getHealthCheckHistory: async () => [],
  //     registerHealthCheck: () => {},
  //     unregisterHealthCheck: () => {}
  //   };
  // }
}
