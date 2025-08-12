import { Readable } from 'stream';
import { Client, type ClientOptions } from 'minio';
import config from '@shared/config/app.config';
import { type StorageStrategy, type UploadOptions, type ObjectInfo, type StorageConnectionOptions } from '../interfaces/storage.interface';
import { baseStorageConnectionOptionsSchema } from '../validations/storage.validation';

export class R2StorageStrategy implements StorageStrategy<StorageConnectionOptions> {
  private client!: Client;
  private bucketName!: string;
  private publicBaseUrl?: string;

  constructor(options: StorageConnectionOptions) {
    const defaultOptions: StorageConnectionOptions = {
      endPoint: ((config as any).R2_ENDPOINT as string) || 'r2.cloudflarestorage.com',
      port: ((config as any).R2_PORT as number) || 443,
      useSSL: true,
      accessKey: (config as any).R2_ACCESS_KEY as string,
      secretKey: (config as any).R2_SECRET_KEY as string,
      bucketName: (config as any).R2_BUCKET_NAME as string,
      publicBaseUrl: (config as any).R2_PUBLIC_URL as string | undefined,
    };

    const merged = { ...defaultOptions, ...(options || {}) };

    this.bucketName = merged.bucketName;
    this.publicBaseUrl = merged.publicBaseUrl;

    const clientOptions: ClientOptions = {
      endPoint: merged.endPoint,
      port: merged.port ?? 443,
      useSSL: merged.useSSL ?? true,
      accessKey: merged.accessKey,
      secretKey: merged.secretKey,
    };

    this.client = new Client(clientOptions);
  }

  async init(options: StorageConnectionOptions): Promise<void> {
    // R2 buckets must exist already; attempt to stat bucket by listing with limit
    try {
      // no-op to validate connection
      await this.client.bucketExists(this.bucketName);
    } catch {
      // Let actual operations surface errors
    }
  }

  async validateConnectionOptions(options: StorageConnectionOptions): Promise<StorageConnectionOptions> {
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
    const meta: Record<string, string> | undefined = {
      ...(options?.contentType ? { 'Content-Type': options.contentType } : {}),
      ...(options?.cacheControl ? { 'Cache-Control': options.cacheControl } : {}),
      ...(options?.metadata ?? {}),
    };
    const result = await this.client.putObject(this.bucketName, objectKey, data as any, undefined, meta);
    return { key: objectKey, etag: (result as any).etag, url: await this.getPublicUrl(objectKey) };
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
    const stat = await this.client.statObject(this.bucketName, objectKey);
    return {
      key: objectKey,
      size: (stat as any).size,
      lastModified: (stat as any).lastModified,
      etag: (stat as any).etag,
      contentType: (stat as any).metaData?.['content-type'] ?? (stat as any).metaData?.['Content-Type'],
      metadata: (stat as any).metaData as Record<string, string> | undefined,
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
    // Best-effort default: https://<bucket>.<endpoint>/<key>
    const endPoint = (this.client as any).transport?.host || (config as any).R2_ENDPOINT;
    return `https://${this.bucketName}.${endPoint}/${objectKey}`;
  }
}

export default R2StorageStrategy;


