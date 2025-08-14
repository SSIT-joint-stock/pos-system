# Singleton Pattern Implementation

## Tổng quan

Singleton Pattern là một design pattern thuộc nhóm Creational Patterns, đảm bảo rằng một class chỉ có một instance duy nhất trong toàn bộ ứng dụng và cung cấp global access point đến instance đó.

## Đặc điểm

- **Unique Instance**: Chỉ một instance duy nhất tồn tại
- **Global Access**: Có thể truy cập từ bất kỳ đâu trong ứng dụng
- **Lazy Initialization**: Instance được tạo khi cần thiết
- **Thread Safety**: Đảm bảo an toàn trong môi trường multi-thread

## Lợi ích

- **Resource Management**: Tiết kiệm tài nguyên hệ thống
- **Shared State**: Chia sẻ trạng thái giữa các phần của ứng dụng
- **Configuration Management**: Quản lý cấu hình toàn cục
- **Connection Pooling**: Quản lý kết nối database/cache

## Nhược điểm

- **Global State**: Có thể tạo ra coupling không mong muốn
- **Testing Difficulty**: Khó mock và test
- **Hidden Dependencies**: Dependency không rõ ràng
- **Violates Single Responsibility**: Quản lý cả lifecycle và business logic

## Cấu trúc cơ bản

```typescript
// Basic Singleton Implementation
class BasicSingleton {
  private static instance: BasicSingleton;
  private constructor() {}

  public static getInstance(): BasicSingleton {
    if (!BasicSingleton.instance) {
      BasicSingleton.instance = new BasicSingleton();
    }
    return BasicSingleton.instance;
  }

  public someMethod(): void {
    console.log('Singleton method called');
  }
}

// Thread-safe Singleton (for environments that support it)
class ThreadSafeSingleton {
  private static instance: ThreadSafeSingleton;
  private static readonly lock = {};

  private constructor() {}

  public static getInstance(): ThreadSafeSingleton {
    if (!ThreadSafeSingleton.instance) {
      // In a real multi-threaded environment, you'd use proper locking
      ThreadSafeSingleton.instance = new ThreadSafeSingleton();
    }
    return ThreadSafeSingleton.instance;
  }
}

// Generic Singleton Base Class
abstract class Singleton {
  private static instances: Map<any, any> = new Map();

  constructor() {
    const constructor = this.constructor;
    if (Singleton.instances.has(constructor)) {
      return Singleton.instances.get(constructor);
    }
    Singleton.instances.set(constructor, this);
  }
}
```

## Ví dụ thực tế 1: Logger Singleton

### 1. Basic Logger Implementation

```typescript
// types/logger.types.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  source?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  filename?: string;
  maxFileSize?: number;
  maxFiles?: number;
  format?: 'json' | 'text';
}
```

```typescript
// logger/Logger.ts
import * as fs from 'fs';
import * as path from 'path';
import { LogLevel, LogEntry, LoggerConfig } from '../types/logger.types';

export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logStream?: fs.WriteStream;

  private constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      filename: 'app.log',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: 'json',
      ...config
    };

    this.initializeFileLogging();
  }

  public static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  private initializeFileLogging(): void {
    if (this.config.enableFile && this.config.filename) {
      const logDir = path.dirname(this.config.filename);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      this.logStream = fs.createWriteStream(this.config.filename, { flags: 'a' });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatMessage(entry: LogEntry): string {
    if (this.config.format === 'json') {
      return JSON.stringify({
        timestamp: entry.timestamp.toISOString(),
        level: LogLevel[entry.level],
        message: entry.message,
        source: entry.source,
        metadata: entry.metadata
      });
    } else {
      const timestamp = entry.timestamp.toISOString();
      const level = LogLevel[entry.level].padEnd(5);
      const source = entry.source ? `[${entry.source}]` : '';
      const metadata = entry.metadata ? `\n${JSON.stringify(entry.metadata, null, 2)}` : '';
      return `${timestamp} ${level} ${source} ${entry.message}${metadata}`;
    }
  }

  private writeLog(entry: LogEntry): void {
    const formattedMessage = this.formatMessage(entry);

    // Console logging
    if (this.config.enableConsole) {
      const consoleMethod = this.getConsoleMethod(entry.level);
      consoleMethod(formattedMessage);
    }

    // File logging
    if (this.config.enableFile && this.logStream) {
      this.logStream.write(formattedMessage + '\n');
    }
  }

  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  public debug(message: string, metadata?: Record<string, any>, source?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.writeLog({
        timestamp: new Date(),
        level: LogLevel.DEBUG,
        message,
        metadata,
        source
      });
    }
  }

  public info(message: string, metadata?: Record<string, any>, source?: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.writeLog({
        timestamp: new Date(),
        level: LogLevel.INFO,
        message,
        metadata,
        source
      });
    }
  }

  public warn(message: string, metadata?: Record<string, any>, source?: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.writeLog({
        timestamp: new Date(),
        level: LogLevel.WARN,
        message,
        metadata,
        source
      });
    }
  }

  public error(message: string, error?: Error, metadata?: Record<string, any>, source?: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorMetadata = error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...metadata
      } : metadata;

      this.writeLog({
        timestamp: new Date(),
        level: LogLevel.ERROR,
        message,
        metadata: errorMetadata,
        source
      });
    }
  }

  public setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  public getLevel(): LogLevel {
    return this.config.level;
  }

  public async rotateLogs(): Promise<void> {
    if (!this.config.enableFile || !this.config.filename) return;

    const stats = await fs.promises.stat(this.config.filename).catch(() => null);
    if (!stats || stats.size < this.config.maxFileSize!) return;

    // Close current stream
    if (this.logStream) {
      this.logStream.end();
    }

    // Rotate files
    for (let i = this.config.maxFiles! - 1; i > 0; i--) {
      const oldFile = `${this.config.filename}.${i}`;
      const newFile = `${this.config.filename}.${i + 1}`;
      
      try {
        await fs.promises.access(oldFile);
        await fs.promises.rename(oldFile, newFile);
      } catch {
        // File doesn't exist, continue
      }
    }

    // Move current log to .1
    await fs.promises.rename(this.config.filename, `${this.config.filename}.1`);

    // Reinitialize logging
    this.initializeFileLogging();
  }

  public async shutdown(): Promise<void> {
    return new Promise((resolve) => {
      if (this.logStream) {
        this.logStream.end(resolve);
      } else {
        resolve();
      }
    });
  }
}

// Export convenience instance
export const logger = Logger.getInstance();
```

## Ví dụ thực tế 2: Database Connection Singletons

### 1. Mongoose Connection Singleton

```typescript
// database/MongooseConnection.ts
import mongoose, { Connection } from 'mongoose';
import { logger } from '../logger/Logger';

export interface MongoConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
  retryAttempts?: number;
  retryDelay?: number;
}

export class MongooseConnection {
  private static instance: MongooseConnection;
  private connection: Connection | null = null;
  private isConnecting: boolean = false;
  private config: MongoConfig;

  private constructor(config: MongoConfig) {
    this.config = {
      retryAttempts: 5,
      retryDelay: 5000,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      },
      ...config
    };

    this.setupEventListeners();
  }

  public static getInstance(config?: MongoConfig): MongooseConnection {
    if (!MongooseConnection.instance) {
      if (!config) {
        throw new Error('MongoConfig is required for first-time initialization');
      }
      MongooseConnection.instance = new MongooseConnection(config);
    }
    return MongooseConnection.instance;
  }

  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully', { 
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        database: mongoose.connection.name 
      }, 'MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', error, {}, 'MongoDB');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected', {}, 'MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected', {}, 'MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  public async connect(): Promise<Connection> {
    if (this.connection && this.connection.readyState === 1) {
      return this.connection;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      return new Promise((resolve, reject) => {
        const checkConnection = () => {
          if (this.connection && this.connection.readyState === 1) {
            resolve(this.connection);
          } else if (!this.isConnecting) {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    this.isConnecting = true;

    try {
      await this.connectWithRetry();
      this.connection = mongoose.connection;
      this.isConnecting = false;
      return this.connection;
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  private async connectWithRetry(): Promise<void> {
    let attempt = 0;

    while (attempt < this.config.retryAttempts!) {
      try {
        logger.info(`Attempting to connect to MongoDB (attempt ${attempt + 1}/${this.config.retryAttempts})`, {}, 'MongoDB');
        
        await mongoose.connect(this.config.uri, this.config.options);
        return;
      } catch (error) {
        attempt++;
        logger.error(`MongoDB connection attempt ${attempt} failed`, error as Error, {}, 'MongoDB');

        if (attempt >= this.config.retryAttempts!) {
          throw new Error(`Failed to connect to MongoDB after ${this.config.retryAttempts} attempts`);
        }

        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      logger.info('MongoDB disconnected gracefully', {}, 'MongoDB');
    }
  }

  public getConnection(): Connection | null {
    return this.connection;
  }

  public isConnected(): boolean {
    return this.connection?.readyState === 1;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.connection) return false;
      
      // Ping the database
      const admin = this.connection.db.admin();
      await admin.ping();
      return true;
    } catch (error) {
      logger.error('MongoDB health check failed', error as Error, {}, 'MongoDB');
      return false;
    }
  }
}

// Export convenience instance
export const mongoConnection = () => MongooseConnection.getInstance();
```

### 2. Prisma Connection Singleton

```typescript
// database/PrismaConnection.ts
import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/Logger';

export interface PrismaConfig {
  databaseUrl?: string;
  logLevel?: 'info' | 'query' | 'warn' | 'error';
  errorFormat?: 'pretty' | 'colorless' | 'minimal';
  maxConnections?: number;
  queryTimeout?: number;
}

export class PrismaConnection {
  private static instance: PrismaConnection;
  private client: PrismaClient | null = null;
  private isConnecting: boolean = false;
  private config: PrismaConfig;

  private constructor(config: PrismaConfig = {}) {
    this.config = {
      logLevel: 'warn',
      errorFormat: 'colorless',
      maxConnections: 10,
      queryTimeout: 30000,
      ...config
    };
  }

  public static getInstance(config?: PrismaConfig): PrismaConnection {
    if (!PrismaConnection.instance) {
      PrismaConnection.instance = new PrismaConnection(config);
    }
    return PrismaConnection.instance;
  }

  public async connect(): Promise<PrismaClient> {
    if (this.client) {
      return this.client;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      return new Promise((resolve, reject) => {
        const checkConnection = () => {
          if (this.client) {
            resolve(this.client);
          } else if (!this.isConnecting) {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    this.isConnecting = true;

    try {
      logger.info('Initializing Prisma Client', {}, 'Prisma');

      this.client = new PrismaClient({
        datasources: this.config.databaseUrl ? {
          db: { url: this.config.databaseUrl }
        } : undefined,
        log: [
          { level: this.config.logLevel!, emit: 'event' },
          { level: 'error', emit: 'event' }
        ],
        errorFormat: this.config.errorFormat
      });

      // Setup event listeners
      this.setupEventListeners();

      // Test connection
      await this.client.$connect();
      
      logger.info('Prisma Client connected successfully', {}, 'Prisma');
      this.isConnecting = false;
      
      return this.client;
    } catch (error) {
      this.isConnecting = false;
      logger.error('Failed to connect Prisma Client', error as Error, {}, 'Prisma');
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.client) return;

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      this.client.$on('query', (e) => {
        logger.debug('Prisma Query', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
          target: e.target
        }, 'Prisma');
      });
    }

    // Log errors
    this.client.$on('error', (e) => {
      logger.error('Prisma Error', e as any, {}, 'Prisma');
    });

    // Log warnings
    this.client.$on('warn', (e) => {
      logger.warn('Prisma Warning', { message: e.message }, 'Prisma');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect();
      this.client = null;
      logger.info('Prisma Client disconnected gracefully', {}, 'Prisma');
    }
  }

  public getClient(): PrismaClient | null {
    return this.client;
  }

  public isConnected(): boolean {
    return this.client !== null;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.client) return false;
      
      // Simple query to test connection
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Prisma health check failed', error as Error, {}, 'Prisma');
      return false;
    }
  }

  // Utility methods for common operations
  public async transaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
    options?: { timeout?: number }
  ): Promise<T> {
    if (!this.client) {
      throw new Error('Prisma client not connected');
    }

    return this.client.$transaction(fn, {
      timeout: options?.timeout || this.config.queryTimeout
    });
  }

  public async executeRaw(query: string, ...values: any[]): Promise<any> {
    if (!this.client) {
      throw new Error('Prisma client not connected');
    }

    return this.client.$executeRawUnsafe(query, ...values);
  }

  public async queryRaw(query: string, ...values: any[]): Promise<any> {
    if (!this.client) {
      throw new Error('Prisma client not connected');
    }

    return this.client.$queryRawUnsafe(query, ...values);
  }
}

// Export convenience instance
export const prisma = () => PrismaConnection.getInstance().getClient();
export const prismaConnection = () => PrismaConnection.getInstance();
```

### 3. Redis Connection Singleton

```typescript
// database/RedisConnection.ts
import { Redis, RedisOptions } from 'ioredis';
import { logger } from '../logger/Logger';

export interface RedisConfig extends RedisOptions {
  retryAttempts?: number;
  retryDelay?: number;
  keyPrefix?: string;
}

export class RedisConnection {
  private static instance: RedisConnection;
  private client: Redis | null = null;
  private subscriber: Redis | null = null;
  private publisher: Redis | null = null;
  private isConnecting: boolean = false;
  private config: RedisConfig;

  private constructor(config: RedisConfig) {
    this.config = {
      retryAttempts: 5,
      retryDelay: 1000,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxLoadingTimeout: 0,
      ...config
    };
  }

  public static getInstance(config?: RedisConfig): RedisConnection {
    if (!RedisConnection.instance) {
      if (!config) {
        throw new Error('RedisConfig is required for first-time initialization');
      }
      RedisConnection.instance = new RedisConnection(config);
    }
    return RedisConnection.instance;
  }

  public async connect(): Promise<Redis> {
    if (this.client && this.client.status === 'ready') {
      return this.client;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      return new Promise((resolve, reject) => {
        const checkConnection = () => {
          if (this.client && this.client.status === 'ready') {
            resolve(this.client);
          } else if (!this.isConnecting) {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    this.isConnecting = true;

    try {
      logger.info('Connecting to Redis...', {}, 'Redis');

      this.client = new Redis(this.config);
      this.setupEventListeners(this.client, 'main');

      await this.client.connect();
      
      logger.info('Redis connected successfully', {
        host: this.config.host || 'localhost',
        port: this.config.port || 6379,
        db: this.config.db || 0
      }, 'Redis');

      this.isConnecting = false;
      return this.client;
    } catch (error) {
      this.isConnecting = false;
      logger.error('Failed to connect to Redis', error as Error, {}, 'Redis');
      throw error;
    }
  }

  public async getSubscriber(): Promise<Redis> {
    if (!this.subscriber || this.subscriber.status !== 'ready') {
      logger.info('Creating Redis subscriber connection...', {}, 'Redis');
      
      this.subscriber = new Redis(this.config);
      this.setupEventListeners(this.subscriber, 'subscriber');
      await this.subscriber.connect();
    }
    return this.subscriber;
  }

  public async getPublisher(): Promise<Redis> {
    if (!this.publisher || this.publisher.status !== 'ready') {
      logger.info('Creating Redis publisher connection...', {}, 'Redis');
      
      this.publisher = new Redis(this.config);
      this.setupEventListeners(this.publisher, 'publisher');
      await this.publisher.connect();
    }
    return this.publisher;
  }

  private setupEventListeners(client: Redis, connectionType: string): void {
    client.on('connect', () => {
      logger.info(`Redis ${connectionType} connecting...`, {}, 'Redis');
    });

    client.on('ready', () => {
      logger.info(`Redis ${connectionType} ready`, {}, 'Redis');
    });

    client.on('error', (error) => {
      logger.error(`Redis ${connectionType} error`, error, {}, 'Redis');
    });

    client.on('close', () => {
      logger.warn(`Redis ${connectionType} connection closed`, {}, 'Redis');
    });

    client.on('reconnecting', (time) => {
      logger.info(`Redis ${connectionType} reconnecting in ${time}ms...`, {}, 'Redis');
    });

    client.on('end', () => {
      logger.warn(`Redis ${connectionType} connection ended`, {}, 'Redis');
    });

    // Graceful shutdown
    const shutdown = async () => {
      await this.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }

  public async disconnect(): Promise<void> {
    const disconnectPromises: Promise<void>[] = [];

    if (this.client) {
      disconnectPromises.push(this.client.disconnect());
    }

    if (this.subscriber) {
      disconnectPromises.push(this.subscriber.disconnect());
    }

    if (this.publisher) {
      disconnectPromises.push(this.publisher.disconnect());
    }

    await Promise.all(disconnectPromises);

    this.client = null;
    this.subscriber = null;
    this.publisher = null;

    logger.info('Redis connections closed gracefully', {}, 'Redis');
  }

  public getClient(): Redis | null {
    return this.client;
  }

  public isConnected(): boolean {
    return this.client?.status === 'ready';
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.client) return false;
      
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Redis health check failed', error as Error, {}, 'Redis');
      return false;
    }
  }

  // Utility methods for common Redis operations
  public async set(key: string, value: string | number | Buffer, ttl?: number): Promise<'OK'> {
    const client = await this.connect();
    if (ttl) {
      return client.setex(key, ttl, value);
    }
    return client.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    const client = await this.connect();
    return client.get(key);
  }

  public async del(key: string | string[]): Promise<number> {
    const client = await this.connect();
    return client.del(key);
  }

  public async exists(key: string): Promise<number> {
    const client = await this.connect();
    return client.exists(key);
  }

  public async expire(key: string, seconds: number): Promise<number> {
    const client = await this.connect();
    return client.expire(key, seconds);
  }

  public async hset(key: string, field: string, value: string): Promise<number> {
    const client = await this.connect();
    return client.hset(key, field, value);
  }

  public async hget(key: string, field: string): Promise<string | null> {
    const client = await this.connect();
    return client.hget(key, field);
  }

  public async publish(channel: string, message: string): Promise<number> {
    const publisher = await this.getPublisher();
    return publisher.publish(channel, message);
  }

  public async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    const subscriber = await this.getSubscriber();
    subscriber.subscribe(channel);
    subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        callback(message);
      }
    });
  }
}

// Export convenience instance
export const redis = () => RedisConnection.getInstance();
export const redisConnection = () => RedisConnection.getInstance();
```

## Database Factory và Manager

```typescript
// database/DatabaseManager.ts
import { MongooseConnection } from './MongooseConnection';
import { PrismaConnection } from './PrismaConnection';
import { RedisConnection } from './RedisConnection';
import { logger } from '../logger/Logger';

export interface DatabaseConfig {
  mongodb?: {
    uri: string;
    options?: any;
  };
  postgres?: {
    url: string;
    config?: any;
  };
  redis?: {
    host: string;
    port: number;
    password?: string;
  };
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private mongoConnection?: MongooseConnection;
  private prismaConnection?: PrismaConnection;
  private redisConnection?: RedisConnection;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async initializeMongoDB(config: DatabaseConfig['mongodb']): Promise<void> {
    if (!config) throw new Error('MongoDB config is required');
    
    this.mongoConnection = MongooseConnection.getInstance({
      uri: config.uri,
      options: config.options
    });
    
    await this.mongoConnection.connect();
    logger.info('MongoDB initialized successfully', {}, 'DatabaseManager');
  }

  public async initializePostgreSQL(config: DatabaseConfig['postgres']): Promise<void> {
    if (!config) throw new Error('PostgreSQL config is required');
    
    this.prismaConnection = PrismaConnection.getInstance({
      databaseUrl: config.url,
      ...config.config
    });
    
    await this.prismaConnection.connect();
    logger.info('PostgreSQL initialized successfully', {}, 'DatabaseManager');
  }

  public async initializeRedis(config: DatabaseConfig['redis']): Promise<void> {
    if (!config) throw new Error('Redis config is required');
    
    this.redisConnection = RedisConnection.getInstance(config);
    await this.redisConnection.connect();
    logger.info('Redis initialized successfully', {}, 'DatabaseManager');
  }

  public async initializeAll(config: DatabaseConfig): Promise<void> {
    const promises: Promise<void>[] = [];

    if (config.mongodb) {
      promises.push(this.initializeMongoDB(config.mongodb));
    }

    if (config.postgres) {
      promises.push(this.initializePostgreSQL(config.postgres));
    }

    if (config.redis) {
      promises.push(this.initializeRedis(config.redis));
    }

    await Promise.all(promises);
    logger.info('All databases initialized successfully', {}, 'DatabaseManager');
  }

  public async healthCheck(): Promise<{
    mongodb: boolean;
    postgresql: boolean;
    redis: boolean;
  }> {
    const [mongodb, postgresql, redis] = await Promise.all([
      this.mongoConnection?.healthCheck() ?? Promise.resolve(false),
      this.prismaConnection?.healthCheck() ?? Promise.resolve(false),
      this.redisConnection?.healthCheck() ?? Promise.resolve(false)
    ]);

    return { mongodb, postgresql, redis };
  }

  public async shutdown(): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.mongoConnection) {
      promises.push(this.mongoConnection.disconnect());
    }

    if (this.prismaConnection) {
      promises.push(this.prismaConnection.disconnect());
    }

    if (this.redisConnection) {
      promises.push(this.redisConnection.disconnect());
    }

    await Promise.all(promises);
    logger.info('All database connections closed', {}, 'DatabaseManager');
  }

  // Getters for connections
  public getMongo() { return this.mongoConnection; }
  public getPrisma() { return this.prismaConnection; }
  public getRedis() { return this.redisConnection; }
}

// Export convenience instance
export const databaseManager = DatabaseManager.getInstance();
```

## Express App Usage

```typescript
// app.ts
import express from 'express';
import { logger } from './logger/Logger';
import { databaseManager } from './database/DatabaseManager';

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await databaseManager.healthCheck();
    const overallHealth = Object.values(dbHealth).some(status => status);

    res.status(overallHealth ? 200 : 503).json({
      status: overallHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      databases: dbHealth
    });
  } catch (error) {
    logger.error('Health check failed', error as Error, {}, 'HealthCheck');
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: (error as Error).message
    });
  }
});

// Initialize databases
async function initializeApp() {
  try {
    await databaseManager.initializeAll({
      mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp',
      },
      postgres: {
        url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/myapp',
      },
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, { port: PORT }, 'Server');
    });
  } catch (error) {
    logger.error('Failed to initialize application', error as Error, {}, 'App');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...', {}, 'App');
  await databaseManager.shutdown();
  await logger.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...', {}, 'App');
  await databaseManager.shutdown();
  await logger.shutdown();
  process.exit(0);
});

initializeApp();

export default app;
```

## Testing

```typescript
// tests/Singleton.test.ts
import { Logger } from '../src/logger/Logger';
import { MongooseConnection } from '../src/database/MongooseConnection';

describe('Singleton Patterns', () => {
  describe('Logger Singleton', () => {
    test('should return same instance', () => {
      const logger1 = Logger.getInstance();
      const logger2 = Logger.getInstance();
      
      expect(logger1).toBe(logger2);
    });

    test('should log messages correctly', () => {
      const logger = Logger.getInstance();
      const consoleSpy = jest.spyOn(console, 'info');
      
      logger.info('Test message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Database Connection Singletons', () => {
    test('should return same MongooseConnection instance', () => {
      const config = { uri: 'mongodb://localhost:27017/test' };
      const conn1 = MongooseConnection.getInstance(config);
      const conn2 = MongooseConnection.getInstance();
      
      expect(conn1).toBe(conn2);
    });
  });
});
```

## Kết luận

Singleton Pattern trong ví dụ này:

1. **Resource Management**: Quản lý hiệu quả kết nối database và logging
2. **Global Access**: Truy cập dễ dàng từ bất kỳ đâu trong ứng dụng
3. **Connection Pooling**: Tối ưu hóa kết nối database
4. **Centralized Configuration**: Cấu hình tập trung cho toàn bộ ứng dụng
5. **Thread Safety**: Xử lý an toàn trong môi trường async

**Lưu ý khi sử dụng Singleton:**
- Chỉ sử dụng khi thực sự cần shared state
- Cẩn thận với testing và mocking
- Xem xét dependency injection alternatives
- Đảm bảo proper cleanup khi shutdown