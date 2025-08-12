import { Readable } from 'stream';

export interface UploadOptions {
    contentType?: string;
    metadata?: Record<string, string>;
    cacheControl?: string;
    acl?: 'private' | 'public-read';
}

export interface ObjectInfo {
    key: string;
    size?: number;
    lastModified?: Date;
    etag?: string;
    contentType?: string;
    metadata?: Record<string, string>;
}

export type StorageProvider = 'minio' | 'r2';

export interface StorageConnectionOptions {
    endPoint: string;
    port?: number;
    useSSL?: boolean;
    accessKey: string;
    secretKey: string;
    bucketName: string;
    publicBaseUrl?: string; // Optional CDN/public domain for getPublicUrl
}

export abstract class StorageStrategy<T extends StorageConnectionOptions> {
    /**
     * Validates the connection to the storage provider
     * @param options - Optional connection options
     */
    abstract validateConnectionOptions(options: T): T;

    /**
     * Uploads data to the storage provider
     * @param objectKey - The key to store the data under
     * @param data - The data to upload
     * @param options - Optional upload options
     * @returns An object containing the key, etag, and URL
     */
    abstract upload(
        objectKey: string,
        data: Readable | Buffer | string,
        options?: UploadOptions
    ): Promise<{ key: string; etag?: string; url?: string }>;

    /**
     * Downloads data from the storage provider
     * @param objectKey - The key of the object to download
     * @returns A readable stream of the data
     */
    abstract download(objectKey: string): Promise<Readable>;


    /**
     * Deletes an object from the storage provider
     * @param objectKey - The key of the object to delete
     */
    abstract delete(objectKey: string): Promise<void>;


    /**
     * Deletes multiple objects from the storage provider
     * @param objectKeys - The keys of the objects to delete
     */
    abstract deleteMany(objectKeys: string[]): Promise<void>;


    /**
     * Checks if an object exists in the storage provider
     * @param objectKey - The key of the object to check
     * @returns True if the object exists, false otherwise
     */
    abstract exists(objectKey: string): Promise<boolean>;


    /**
     * Lists objects in the storage provider
     * @param prefix - Optional prefix to filter objects
     * @returns An array of object keys
     */
    abstract list(prefix?: string): Promise<string[]>;


    /**
     * Gets information about an object in the storage provider
     * @param objectKey - The key of the object to get information about
     * @returns An object containing information about the object
     */
    abstract stat(objectKey: string): Promise<ObjectInfo>;


    /**
     * Gets a presigned URL for an object in the storage provider
     * @param objectKey - The key of the object to get a presigned URL for
     * @param expiresSeconds - The number of seconds the URL should be valid for
     * @returns A presigned URL
     */
    abstract getPresignedUrl(objectKey: string, expiresSeconds?: number): Promise<string>;


    /**
     * Gets a presigned upload URL for an object in the storage provider
     * @param objectKey - The key of the object to get a presigned upload URL for
     * @param expiresSeconds - The number of seconds the URL should be valid for
     * @returns A presigned upload URL
     */
    abstract getPresignedUploadUrl(
        objectKey: string,
        expiresSeconds?: number
    ): Promise<string>;

    /**
     * Gets a public URL for an object in the storage provider
     * @param objectKey - The key of the object to get a public URL for
     * @returns A public URL
     */
    abstract getPublicUrl(objectKey: string): string | Promise<string>;
}

export interface IStorageService {
    upload(objectKey: string, data: Readable | Buffer | string, options?: UploadOptions): Promise<{ key: string; etag?: string; url?: string }>;
    download(objectKey: string): Promise<Readable>;
    delete(objectKey: string): Promise<void>;
    deleteMany(objectKeys: string[]): Promise<void>;
    exists(objectKey: string): Promise<boolean>;
    list(prefix?: string): Promise<string[]>;
    stat(objectKey: string): Promise<ObjectInfo>;
    getPresignedUrl(objectKey: string, expiresSeconds?: number): Promise<string>;
    getPresignedUploadUrl(objectKey: string, expiresSeconds?: number): Promise<string>;
    getPublicUrl(objectKey: string): string | Promise<string>;
}