import Redis, { type Redis as RedisClient, type RedisOptions } from "ioredis";
import config from "@shared/config/app.config";
import { createContextLogger } from "@shared/utils/logger";

export const logger = createContextLogger('RedisService');


export class RedisServiceSingleton {
  private static instance: RedisServiceSingleton | null = null;
  private client!: RedisClient;

  private constructor() {}

  public static getInstance(): RedisServiceSingleton {
    if (!RedisServiceSingleton.instance) {
      RedisServiceSingleton.instance = new RedisServiceSingleton();
      RedisServiceSingleton.instance.initialize();
    }
    return RedisServiceSingleton.instance;
  }

  private initialize(options?: RedisOptions): void {
    const initializedOptions: RedisOptions = {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      ...options,
    };

    this.client = new Redis(initializedOptions);

    this.client.on("connect", () => {
      logger.info("[Redis]: Connected");
    });
    this.client.on("ready", () => {
      logger.info("[Redis]: Ready");
    });
    this.client.on("error", (err) => {
      logger.error("[Redis]: Error", err);
    });
    this.client.on("reconnecting", () => {
      logger.warn("[Redis]: Reconnecting...");
    });
    this.client.on("end", () => {
      logger.info("[Redis]: Connection closed");
    });
  }

  public async connect(): Promise<void> {
    if (!this.client.status || this.client.status === "end") {
      this.initialize();
    }
    if (this.client.status !== "ready" && this.client.status !== "connecting") {
      await this.client.connect();
    }
  }

  public getClient(): RedisClient {
    return this.client;
  }

  // Convenience helpers
  public async set(key: string, value: string, expireSeconds?: number): Promise<"OK" | null> {
    if (typeof expireSeconds === "number" && expireSeconds > 0) {
      return this.client.set(key, value, "EX", expireSeconds);
    }
    return this.client.set(key, value);
  }

  public async get<T>(key: string): Promise<T | null> {
    return this.client.get(key) as unknown as T;
  }

  public async del(key: string | string[]): Promise<number> {
    return this.client.del(key as any);
  }

  public async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.client.status !== "end") {
      await this.client.quit();
    }
  }
}

export const RedisService = RedisServiceSingleton.getInstance();
export default RedisService;


