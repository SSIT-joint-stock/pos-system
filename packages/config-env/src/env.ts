// import 'dotenv/config';
import { z } from 'zod';

// Resolve Mongo connection string từ nhiều biến có thể
const resolvedMongoUrl =
  process.env.DB_MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  '';

const schema = z.object({
  // Core
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SERVER_PORT: z.coerce.number().default(8080),
  BASE_URL: z.string().default('http://localhost:8080'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  APP_SECRET: z.string().default('example'),
  DEFAULT_EXPIRE: z.coerce.number().default(3600),
  TZ: z.string().default('Asia/Ho_Chi_Minh'),
  ENABLED_CACHE: z.enum(['true', 'false']).default('false'),

  // Logging & Observability
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('debug'),
  LOKI_URL: z.string().default('http://localhost:7100'),
  ENABLE_LOKI: z.enum(['true', 'false']).default('false'),
  LOKI_USERNAME: z.string().optional(),
  LOKI_PASSWORD: z.string().optional(),

  // Database (MongoDB replica set cho transaction)
  MONGODB_HOST: z.string().default('127.0.0.1'),
  MONGODB_PORT: z.coerce.number().default(27017),
  MONGODB_ROOT_USERNAME: z.string().default('admin'),
  MONGODB_ROOT_PASSWORD: z.string().default('password'),
  MONGODB_DB: z.string().default('pos'),
  MONGODB_AUTH_SOURCE: z.string().default('admin'),
  MONGODB_REPLICA_SET: z.string().default('rs0'),
  MONGODB_URI: z.string().min(1).default(
    resolvedMongoUrl ||
      'mongodb://admin:password@127.0.0.1:27017/pos?replicaSet=rs0&authSource=admin'
  ),
  DATABASE_URL: z.string().min(1).default(
    resolvedMongoUrl ||
      'mongodb://admin:password@127.0.0.1:27017/pos?replicaSet=rs0&authSource=admin'
  ),
  // Legacy support
  DB_MONGO_URI: z.string().optional(),

  // Redis
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // MinIO
  MINIO_ENDPOINT: z.string().default('127.0.0.1'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_CONSOLE_PORT: z.coerce.number().default(9001),
  MINIO_USE_SSL: z.enum(['true', 'false']).default('false'),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_BUCKET_NAME: z.string().default('assets'),
  MINIO_URL: z.string().default('http://localhost:9000'),

  // R2
  R2_ENDPOINT: z.string().default('r2.cloudflarestorage.com'),
  R2_PORT: z.coerce.number().default(443),
  R2_USE_SSL: z.enum(['true', 'false']).default('true'),
  R2_ACCESS_KEY: z.string().default('minio'),
  R2_SECRET_KEY: z.string().default('minio123'),
  R2_BUCKET_NAME: z.string().default('assets'),
  R2_PUBLIC_URL: z.string().default('https://r2.cloudflarestorage.com'),

  // JWT/Session/Security
  AUTH_ACCESS_EXPIRE: z.coerce.number().default(3600),
  AUTH_REFRESH_EXPIRE: z.coerce.number().default(604800),
  AUTH_SESSION_EXPIRE: z.coerce.number().default(604800),
  SESSION_SECRET: z.string().default('example'),
  REFRESH_SECRET: z.string().default('example'),
  JWT_ACCESS_SECRET: z.string().default('example'),
  JWT_REFRESH_SECRET: z.string().default('example'),
  JWT_ACCESS_EXPIRY: z.string().default('1d'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  JWT_ISSUER: z.string().default('localhost:8080'),
  JWT_AUDIENCE: z.string().default('localhost:8080'),
  HASH_SECRET: z.string().default('example'),

  // Email
  EMAIL_SERVICE: z.string().default('gmail'),
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_NOTI: z.string().email().optional(),
  EMAIL_TEST_RECIPIENT: z.string().email().optional(),

  // Telegram
  TELEGRAM_RECIPIENT_ID: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),

  // Staff/Admin mặc định
  STAFF_EMAIL: z.string().email().default('admin@ssit.company'),
  STAFF_PASSWORD: z.string().default('Admin@123'),
  STAFF_NAME: z.string().default('Admin'),

  // Frontend (Next.js) — chỉ biến có NEXT_PUBLIC_* được đưa lên client
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_DOMAIN_TYPE: z.enum(['retail', 'restaurant']).optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid env:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export type Env = z.infer<typeof schema>;
export const env: Env = parsed.data;


