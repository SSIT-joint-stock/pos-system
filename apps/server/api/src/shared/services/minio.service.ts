// apps/server/api/src/shared/services/minio.service.ts
import { BucketItemStat, Client, type ClientOptions, CopyConditions, type CopyConditions as CopyConditionsType } from 'minio';
import { type Readable } from 'stream';
import config from '@shared/config/app.config';
import { createContextLogger } from '@shared/utils/logger';

export const logger = createContextLogger('MinIOService');

export class MinIOServiceSingleton {
  private static instance: MinIOServiceSingleton | null = null;
  private client!: Client;
  private bucketName: string;

  private constructor() {
    this.bucketName = config.MINIO_BUCKET_NAME;
  }

  public static getInstance(): MinIOServiceSingleton {
    if (!MinIOServiceSingleton.instance) {
      MinIOServiceSingleton.instance = new MinIOServiceSingleton();
      MinIOServiceSingleton.instance.initialize();
    }
    return MinIOServiceSingleton.instance;
  }

  private initialize(options?: Partial<ClientOptions>): void {
    const initializedOptions: ClientOptions = {
      endPoint: config.MINIO_ENDPOINT,
      port: config.MINIO_PORT,
      useSSL: config.MINIO_USE_SSL === 'true',
      accessKey: config.MINIO_ACCESS_KEY,
      secretKey: config.MINIO_SECRET_KEY,
      ...options,
    };

    this.client = new Client(initializedOptions);
    logger.info('[MinIO]: Client initialized');
  }

  public async connect(): Promise<void> {
    try {
      // Test connection by checking if bucket exists
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName);
        logger.info(`[MinIO]: Bucket '${this.bucketName}' created`);
      }
      logger.info('[MinIO]: Connected and bucket ready');
    } catch (error) {
      logger.error('[MinIO]: Connection error', error);
      throw error;
    }
  }

  public getClient(): Client {
    return this.client;
  }

  public getBucketName(): string {
    return this.bucketName;
  }

  // Convenience helpers
  public async uploadObject(
    objectName: string,
    stream: Readable | Buffer | string,
    size?: number,
    metaData?: Record<string, string>
  ): Promise<string> {
    try {
      const result = await this.client.putObject(
        this.bucketName,
        objectName,
        stream,
        size,
        metaData
      );
      logger.info(`[MinIO]: Uploaded object '${objectName}'`);
      return result.etag;
    } catch (error) {
      logger.error(`[MinIO]: Upload error for '${objectName}'`, error);
      throw error;
    }
  }

  public async downloadObject(objectName: string): Promise<Readable> {
    try {
      const stream = await this.client.getObject(this.bucketName, objectName);
      logger.info(`[MinIO]: Downloaded object '${objectName}'`);
      return stream;
    } catch (error) {
      logger.error(`[MinIO]: Download error for '${objectName}'`, error);
      throw error;
    }
  }

  public async deleteObject(objectName: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, objectName);
      logger.info(`[MinIO]: Deleted object '${objectName}'`);
    } catch (error) {
      logger.error(`[MinIO]: Delete error for '${objectName}'`, error);
      throw error;
    }
  }

  public async deleteObjects(objectNames: string[]): Promise<void> {
    try {
      await this.client.removeObjects(this.bucketName, objectNames);
      logger.info(`[MinIO]: Deleted ${objectNames.length} objects`);
    } catch (error) {
      logger.error('[MinIO]: Bulk delete error', error);
      throw error;
    }
  }

  public async listObjects(prefix?: string, recursive: boolean = false): Promise<string[]> {
    try {
      const objectNames: string[] = [];
      const stream = this.client.listObjects(this.bucketName, prefix, recursive);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (obj.name) objectNames.push(obj.name);
        });
        stream.on('end', () => {
          logger.info(`[MinIO]: Listed ${objectNames.length} objects`);
          resolve(objectNames);
        });
        stream.on('error', (error) => {
          logger.error('[MinIO]: List objects error', error);
          reject(error);
        });
      });
    } catch (error) {
      logger.error('[MinIO]: List objects error', error);
      throw error;
    }
  }

  public async getObjectInfo(objectName: string): Promise<BucketItemStat> {
    try {
      const stat = await this.client.statObject(this.bucketName, objectName);
      logger.info(`[MinIO]: Got info for object '${objectName}'`);
      return stat;
    } catch (error) {
      logger.error(`[MinIO]: Stat error for '${objectName}'`, error);
      throw error;
    }
  }

  public async getPresignedUrl(
    objectName: string,
    expiry: number = 24 * 60 * 60, // 24 hours default
    reqParams?: Record<string, string>
  ): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(
        this.bucketName,
        objectName,
        expiry,
        reqParams
      );
      logger.info(`[MinIO]: Generated presigned URL for '${objectName}'`);
      return url;
    } catch (error) {
      logger.error(`[MinIO]: Presigned URL error for '${objectName}'`, error);
      throw error;
    }
  }

  public async getPresignedUploadUrl(
    objectName: string,
    expiry: number = 24 * 60 * 60 // 24 hours default
  ): Promise<string> {
    try {
      const url = await this.client.presignedPutObject(
        this.bucketName,
        objectName,
        expiry
      );
      logger.info(`[MinIO]: Generated presigned upload URL for '${objectName}'`);
      return url;
    } catch (error) {
      logger.error(`[MinIO]: Presigned upload URL error for '${objectName}'`, error);
      throw error;
    }
  }

  public async copyObject(
    sourceObject: string,
    destObject: string,
    conditions?: CopyConditionsType
  ): Promise<void> {
    try {
      const conds = new CopyConditions();
      if (conditions) {
        Object.assign(conds, conditions);
      }
      
      await this.client.copyObject(
        this.bucketName,
        destObject,
        `/${this.bucketName}/${sourceObject}`,
        conds
      );
      logger.info(`[MinIO]: Copied '${sourceObject}' to '${destObject}'`);
    } catch (error) {
      logger.error(`[MinIO]: Copy error from '${sourceObject}' to '${destObject}'`, error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.client.bucketExists(this.bucketName);
      return true;
    } catch (error) {
      logger.error('[MinIO]: Health check failed', error);
      return false;
    }
  }
}

export const MinIOService = MinIOServiceSingleton.getInstance();
export default MinIOService;