import { Readable } from 'stream';
import { Client, type ClientOptions } from 'minio';
import config from '@shared/config/app.config';
import { type StorageStrategy, type UploadOptions, type ObjectInfo, StorageConnectionOptions } from '../interfaces/storage.interface';
import { baseStorageConnectionOptionsSchema } from '../validations/storage.validation';

export class MinioStorageStrategy implements StorageStrategy<StorageConnectionOptions> {
    private client!: Client;
    private bucketName!: string;
    private publicBaseUrl?: string;
    private options: StorageConnectionOptions;

    constructor(options: StorageConnectionOptions) {
        const validatedOptions = this.validateConnectionOptions(options);
        this.options = validatedOptions;
        this.bucketName = validatedOptions.bucketName;
        this.publicBaseUrl = validatedOptions.publicBaseUrl;
        const clientOptions: ClientOptions = {
            endPoint: validatedOptions.endPoint,
            port: validatedOptions.port ?? undefined,
            useSSL: validatedOptions.useSSL ?? false,
            accessKey: validatedOptions.accessKey,
            secretKey: validatedOptions.secretKey,
        };

        this.client = new Client(clientOptions);
    }

    validateConnectionOptions(options: StorageConnectionOptions): StorageConnectionOptions {
        const validatedOptions = baseStorageConnectionOptionsSchema.safeParse(options);
        if (!validatedOptions.success) {
            throw new Error(validatedOptions.error.message);
        }
        return validatedOptions.data;
    }

    async upload(
        objectKey: string,
        data: Readable | Buffer | string,
        options?: UploadOptions
    ): Promise<{ key: string; etag?: string; url?: string }> {
        const metadata: Record<string, string> | undefined = {
            ...(options?.contentType ? { 'Content-Type': options.contentType } : {}),
            ...(options?.cacheControl ? { 'Cache-Control': options.cacheControl } : {}),
            ...(options?.metadata ?? {}),
        };

        const result = await this.client.putObject(
            this.bucketName,
            objectKey,
            data as any,
            undefined,
            metadata
        );
        return { key: objectKey, etag: (result as any).etag, url: this.getPublicUrl(objectKey) };
    }

    async download(objectKey: string): Promise<Readable> {
        return this.client.getObject(this.bucketName, objectKey);
    }

    async delete(objectKey: string): Promise<void> {
        await this.client.removeObject(this.bucketName, objectKey);
    }

    async deleteMany(objectKeys: string[]): Promise<void> {
        if (objectKeys.length === 0) return;
        await this.client.removeObjects(this.bucketName, objectKeys);
    }

    async exists(objectKey: string): Promise<boolean> {
        try {
            await this.client.statObject(this.bucketName, objectKey);
            return true;
        } catch (error: any) {
            const code = error?.code || error?.name || '';
            if (code === 'NotFound' || code === 'NoSuchKey' || code === 'NotFoundError') return false;
            return false;
        }
    }

    async list(prefix?: string): Promise<string[]> {
        const names: string[] = [];
        const stream = this.client.listObjects(this.bucketName, prefix, false);
        return new Promise((resolve, reject) => {
            stream.on('data', (obj: any) => {
                if (obj.name) names.push(obj.name);
            });
            stream.on('end', () => resolve(names));
            stream.on('error', (err: unknown) => reject(err));
        });
    }

    async stat(objectKey: string): Promise<ObjectInfo> {
        const stat = (await this.client.statObject(this.bucketName, objectKey)) as any;
        return {
            key: objectKey,
            size: stat.size,
            lastModified: stat.lastModified,
            etag: stat.etag,
            contentType: stat.metaData?.['content-type'] ?? stat.metaData?.['Content-Type'],
            metadata: stat.metaData as Record<string, string> | undefined,
        };
    }

    async getPresignedUrl(objectKey: string, expiresSeconds: number = 86400): Promise<string> {
        return this.client.presignedGetObject(this.bucketName, objectKey, expiresSeconds);
    }

    async getPresignedUploadUrl(objectKey: string, expiresSeconds: number = 86400): Promise<string> {
        return this.client.presignedPutObject(this.bucketName, objectKey, expiresSeconds);
    }

    getPublicUrl(objectKey: string): string {
        if (this.publicBaseUrl) {
            return `${this.publicBaseUrl.replace(/\/$/, '')}/${objectKey}`;
        }
        const protocol = this.options.useSSL ?? ((config as any).MINIO_USE_SSL === 'true' || (config as any).MINIO_USE_SSL === true) ? 'https' : 'http';
        const endPoint = this.options.endPoint ?? (config as any).MINIO_ENDPOINT;
        const port = this.options.port ?? (config as any).MINIO_PORT;
        const host = port ? `${endPoint}:${port}` : endPoint;
        return `${protocol}://${host}/${this.bucketName}/${objectKey}`;
    }
}

export default MinioStorageStrategy;


