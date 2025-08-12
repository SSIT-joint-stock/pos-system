import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  type ObjectIdentifier,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '@shared/config/app.config';
import {
  type StorageStrategy,
  type UploadOptions,
  type ObjectInfo,
  type StorageConnectionOptions,
} from '../interfaces/storage.interface';
import { baseStorageConnectionOptionsSchema } from '../validations/storage.validation';

export class R2StorageStrategy implements StorageStrategy<StorageConnectionOptions> {
  private client!: S3Client;
  private bucketName!: string;
  private publicBaseUrl?: string;
  private options!: StorageConnectionOptions;

  constructor(options: StorageConnectionOptions) {
    const validated = this.validateConnectionOptions(options);
    this.options = validated;
    this.bucketName = validated.bucketName;
    this.publicBaseUrl = validated.publicBaseUrl;

    this.client = new S3Client({
      region: 'auto',
      endpoint: `${validated.useSSL ?? true ? 'https' : 'http'}://${validated.endPoint}${validated.port ? `:${validated.port}` : ''}`,
      credentials: {
        accessKeyId: validated.accessKey,
        secretAccessKey: validated.secretKey,
      },
    });
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
    const put = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      Body: data as any,
      ContentType: options?.contentType,
      CacheControl: options?.cacheControl,
      Metadata: options?.metadata,
      ACL: options?.acl === 'public-read' ? 'public-read' : undefined,
    } as any);

    const result = await this.client.send(put);
    return { key: objectKey, etag: result.ETag, url: await this.getPublicUrl(objectKey) };
  }

  async download(objectKey: string): Promise<Readable> {
    const get = new GetObjectCommand({ Bucket: this.bucketName, Key: objectKey });
    const result = await this.client.send(get);
    return result.Body as Readable;
  }

  async delete(objectKey: string): Promise<void> {
    const del = new DeleteObjectCommand({ Bucket: this.bucketName, Key: objectKey });
    await this.client.send(del);
  }

  async deleteMany(objectKeys: string[]): Promise<void> {
    if (objectKeys.length === 0) return;
    const objects: ObjectIdentifier[] = objectKeys.map((Key) => ({ Key }));
    const cmd = new DeleteObjectsCommand({ Bucket: this.bucketName, Delete: { Objects: objects, Quiet: true } });
    await this.client.send(cmd);
  }

  async exists(objectKey: string): Promise<boolean> {
    try {
      const head = new HeadObjectCommand({ Bucket: this.bucketName, Key: objectKey });
      await this.client.send(head);
      return true;
    } catch {
      return false;
    }
  }

  async list(prefix?: string): Promise<string[]> {
    const list = new ListObjectsV2Command({ Bucket: this.bucketName, Prefix: prefix });
    const result = await this.client.send(list);
    return (result.Contents || []).map((o) => o.Key!).filter(Boolean) as string[];
  }

  async stat(objectKey: string): Promise<ObjectInfo> {
    const head = new HeadObjectCommand({ Bucket: this.bucketName, Key: objectKey });
    const result = await this.client.send(head);
    return {
      key: objectKey,
      size: result.ContentLength,
      lastModified: result.LastModified || undefined,
      etag: result.ETag,
      contentType: result.ContentType,
      metadata: (result.Metadata as Record<string, string>) || undefined,
    };
  }

  async getPresignedUrl(objectKey: string, expiresSeconds: number = 86400): Promise<string> {
    const get = new GetObjectCommand({ Bucket: this.bucketName, Key: objectKey });
    return getSignedUrl(this.client, get, { expiresIn: expiresSeconds });
  }

  async getPresignedUploadUrl(objectKey: string, expiresSeconds: number = 86400): Promise<string> {
    const put = new PutObjectCommand({ Bucket: this.bucketName, Key: objectKey });
    return getSignedUrl(this.client, put, { expiresIn: expiresSeconds });
  }

  getPublicUrl(objectKey: string): string {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl.replace(/\/$/, '')}/${objectKey}`;
    }
    const endpoint = (config as any).R2_ENDPOINT || this.options.endPoint;
    return `https://${this.bucketName}.${endpoint}/${objectKey}`;
  }
}

export default R2StorageStrategy;


