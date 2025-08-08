import Redis, { type Redis as RedisClient, type RedisOptions } from "ioredis";
import config from "@shared/config/app.config";

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

  private initialize(): void {
    const options: RedisOptions = {
      host: config.redisHost,
      port: config.redisPort,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    };

    this.client = new Redis(options);

    this.client.on("connect", () => {
      console.info(new Date(), "[Redis]: Connected");
    });
    this.client.on("ready", () => {
      console.info(new Date(), "[Redis]: Ready");
    });
    this.client.on("error", (err) => {
      console.error(new Date(), "[Redis]: Error", err);
    });
    this.client.on("reconnecting", () => {
      console.warn(new Date(), "[Redis]: Reconnecting...");
    });
    this.client.on("end", () => {
      console.info(new Date(), "[Redis]: Connection closed");
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


