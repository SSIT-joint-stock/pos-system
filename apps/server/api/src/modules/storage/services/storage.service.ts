import { MinioStorageStrategy } from './minio.service';
import { R2StorageStrategy } from './r2.service';
import {
  type StorageStrategy,
  type StorageProvider,
  type StorageConnectionOptions,
} from '@modules/storage/interfaces/storage.interface';

export class StorageStrategyFactory {
  private static strategies = new Map<
    StorageProvider,
    (options: StorageConnectionOptions) => StorageStrategy<StorageConnectionOptions>
  >();

  static {
    // Default providers
    StorageStrategyFactory.registerStrategy('minio', (options: StorageConnectionOptions) => new MinioStorageStrategy(options));
    StorageStrategyFactory.registerStrategy('r2', (options: StorageConnectionOptions) => new R2StorageStrategy(options));
  }

  static createStrategy(
    provider: StorageProvider,
    options: StorageConnectionOptions
  ): StorageStrategy<StorageConnectionOptions> {
    const factory = this.strategies.get(provider);
    if (!factory) {
      throw new Error(`Unsupported storage provider: ${String(provider)}`);
    }
    return factory(options);
  }

  static registerStrategy(
    provider: StorageProvider,
    factory: (options: StorageConnectionOptions) => StorageStrategy<StorageConnectionOptions>
  ): void {
    StorageStrategyFactory.strategies.set(provider, factory);
  }

  static getSupportedProviders(): StorageProvider[] {
    return Array.from(StorageStrategyFactory.strategies.keys()) as StorageProvider[];
  }

  static isSupported(provider: StorageProvider): boolean {
    return StorageStrategyFactory.strategies.has(provider);
  }
}


