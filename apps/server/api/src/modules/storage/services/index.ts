import { Readable } from 'stream';
import { type StorageStrategy, type StorageProvider, type StorageConnectionOptions, type UploadOptions, IStorageService } from '../interfaces/storage.interface';
import { StorageStrategyFactory } from './storage.service';
import { createContextLogger, ILogger } from '@/shared/utils/logger';

/**
 * StorageService is a wrapper around the StorageStrategy class that provides a unified interface for all storage providers.
 * It is used to upload, download, delete, and list objects in the storage provider.
 * It is also used to get presigned URLs for objects in the storage provider.
 * It is also used to get public URLs for objects in the storage provider.
 * It is also used to get information about objects in the storage provider.
 * It is also used to initialize the storage provider.
 */
export class StorageService implements IStorageService {
    private storageStrategy: StorageStrategy<StorageConnectionOptions>;
    private provider: StorageProvider;
    private logger: ILogger;

    constructor(provider: StorageProvider, options: StorageConnectionOptions) {
        this.storageStrategy = StorageStrategyFactory.createStrategy(provider, options);
        this.provider = provider;
        this.logger = createContextLogger('StorageService', { provider });
    }

    async upload(objectKey: string, data: Readable | Buffer | string, options?: UploadOptions) {
        try {
            return this.storageStrategy.upload(objectKey, data, options);
        } catch (error) {
            this.logger.error(`Error uploading object ${objectKey}`, { error, objectKey, scope: 'upload' });
            throw error;
        }
    }

    async download(objectKey: string) {
        try {
            return this.storageStrategy.download(objectKey);
        } catch (error) {
            this.logger.error(`Error downloading object ${objectKey}`, { error, objectKey, scope: 'download' });
            throw error;
        }
    }

    async delete(objectKey: string) {
        try {
            return this.storageStrategy.delete(objectKey);
        } catch (error) {
            this.logger.error(`Error deleting object ${objectKey}`, { error, objectKey, scope: 'delete' });
            throw error;
        }
    }

    async deleteMany(objectKeys: string[]) {
        try {
            return this.storageStrategy.deleteMany(objectKeys);
        } catch (error) {
            this.logger.error(`Error deleting objects ${objectKeys}`, { error, objectKeys, scope: 'deleteMany' });
            throw error;
        }
    }

    async exists(objectKey: string) {
        try {
            return this.storageStrategy.exists(objectKey);
        } catch (error) {
            this.logger.error(`Error checking if object ${objectKey} exists`, { error, objectKey, scope: 'exists' });
            throw error;
        }
    }

    async list(prefix?: string) {
        try {
            return this.storageStrategy.list(prefix);
        } catch (error) {
            this.logger.error(`Error listing objects with prefix ${prefix}`, { error, prefix, scope: 'list' });
            throw error;
        }
    }

    async stat(objectKey: string) {
        try {
            return this.storageStrategy.stat(objectKey);
        } catch (error) {
            this.logger.error(`Error getting stat for object ${objectKey}`, { error, objectKey, scope: 'stat' });
            throw error;
        }
    }

    async getPresignedUrl(objectKey: string, expiresSeconds?: number) {
        try {
            return this.storageStrategy.getPresignedUrl(objectKey, expiresSeconds);
        } catch (error) {
            this.logger.error(`Error getting presigned URL for object ${objectKey}`, { error, objectKey, scope: 'getPresignedUrl' });
            throw error;
        }
    }

    async getPresignedUploadUrl(objectKey: string, expiresSeconds?: number) {
        try {
            return this.storageStrategy.getPresignedUploadUrl(objectKey, expiresSeconds);
        } catch (error) {
            this.logger.error(`Error getting presigned upload URL for object ${objectKey}`, { error, objectKey, scope: 'getPresignedUploadUrl' });
            throw error;
        }
    }

    async getPublicUrl(objectKey: string) {
        try {
            return this.storageStrategy.getPublicUrl(objectKey);
        } catch (error) {
            this.logger.error(`Error getting public URL for object ${objectKey}`, { error, objectKey, scope: 'getPublicUrl' });
            throw error;
        }
    }
}