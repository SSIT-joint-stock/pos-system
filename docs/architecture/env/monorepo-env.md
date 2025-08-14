# Mô hình khuyến nghị

```
repo/
  .env.example             # mẫu, commit
  .env.development         # dùng chung DEV (không chứa secret nặng)
  .env.test
  .env                     # (tuỳ) cho local default

  apps/
    web/                   # Next/Vite…
      .env.local           # riêng máy dev (không commit)
    api/
      .env.local
    worker/
      .env.local

  packages/
    config-env/            # (package trung tâm) parse + export config typed (MongoDB, Redis, MinIO, JWT...)
      src/env.ts
```

# Quy tắc “Single Source of Truth”

* **Không** nhồi hết vào root `.env` rồi hardcode ở app.
* Dùng **một package config** (ví dụ `@repo/config-env`) để đọc `.env`, validate và **export** config typed cho toàn monorepo.
* App chỉ `import { env } from '@repo/config-env'`. Hạn chế đọc `process.env` trực tiếp rải rác (có thể giữ giai đoạn chuyển tiếp ở một số file cấu hình server như hiện tại).

# Thứ tự ưu tiên (đề xuất)

1. Biến process đã tồn tại (CI/CD, container)
2. `.env.local` tại app (ghi đè máy dev)
3. `.env.development` (root, dùng chung dev)
4. `.env` (root, nếu có)
5. Default cứng (ít dùng, tránh)

> Với **Next.js/Vite**: chỉ biến có prefix `NEXT_PUBLIC_` / `VITE_` mới được đưa lên client. Tránh rò rỉ!

# Package `config-env` (TypeScript + Zod) — phù hợp MongoDB/Redis/MinIO/JWT hiện tại

Tạo 1 package dùng ở mọi nơi:

```ts
// packages/config-env/src/env.ts
import 'dotenv/config';
import { z } from 'zod';

// Hỗ trợ cả DB_MONGO_URI, MONGODB_URI, DATABASE_URL (ưu tiên theo thứ tự)
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
  DEFAULT_EXPIRE: z.coerce.number().default(3600),
  TZ: z.string().default('Asia/Ho_Chi_Minh'),
  ENABLED_CACHE: z.enum(['true', 'false']).default('true'),

  // Database (MongoDB replica set cho transaction)
  DB_MONGO_URI: z.string().min(1).default(resolvedMongoUrl || 'mongodb://admin:password@127.0.0.1:27017/pos?replicaSet=rs0&authSource=admin'),

  // Redis
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),

  // MinIO
  MINIO_ENDPOINT: z.string().default('127.0.0.1'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_USE_SSL: z.enum(['true', 'false']).default('false'),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_BUCKET_NAME: z.string().default('assets'),
  MINIO_URL: z.string().default('http://localhost:9000'),

  // JWT/Session
  AUTH_ACCESS_EXPIRE: z.coerce.number().default(3600),
  AUTH_REFRESH_EXPIRE: z.coerce.number().default(604800),
  AUTH_SESSION_EXPIRE: z.coerce.number().default(604800),
  SESSION_SECRET: z.string().default('secret'),
  REFRESH_SECRET: z.string().default('refresh_secret'),
  JWT_ACCESS_SECRET: z.string().default('access-secret-key'),
  JWT_REFRESH_SECRET: z.string().default('refresh-secret-key'),
  JWT_ACCESS_EXPIRY: z.string().default('1d'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  JWT_ISSUER: z.string().default('localhost:8080'),
  JWT_AUDIENCE: z.string().default('localhost:8080'),

  // Email
  EMAIL_SERVICE: z.string().default('gmail'),
  EMAIL_USER: z.string().email(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_NOTI: z.string().email().optional(),
  EMAIL_TEST_RECIPIENT: z.string().email().optional(),

  // Telegram
  TELEGRAM_RECIPIENT_ID: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),

  // Frontend (Next.js) — chỉ biến có NEXT_PUBLIC_ mới được đưa lên client
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_DOMAIN_TYPE: z.enum(['retail', 'restaurant']).optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid env:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
```

Ở app:

```ts
// apps/server/api/src/main.ts (ví dụ)
import { env } from '@repo/config-env';
app.listen(env.SERVER_PORT, () => console.log(`API on :${env.SERVER_PORT}`));
```

# Dành cho Turborepo (quan trọng kẻo cache “sai sai”)

* Khi build/test, **env ảnh hưởng kết quả** phải được đưa vào **hash key**.
* Khai báo ở `turbo.json` cho từng task:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "env": [
        "NODE_ENV",
        "DB_MONGO_URI",
        "MONGODB_URI",
        "DATABASE_URL",
        "REDIS_HOST",
        "REDIS_PORT",
        "MINIO_ENDPOINT",
        "MINIO_PORT",
        "MINIO_USE_SSL",
        "NEXT_PUBLIC_API_URL",
        "NEXT_PUBLIC_DOMAIN_TYPE"
      ]
    }
  }
}
```

* Ý tưởng: đổi `DATABASE_URL` thì cache build không được tái dùng bừa bãi.

# Với Docker / docker-compose

* Không bake secret vào image. Dùng `env_file` + biến runtime:

```yaml
services:
  api:
    build: ./apps/server/api
    env_file:
      - ./.env.development
    environment:
      - SERVER_PORT=8080
      - DB_MONGO_URI=${DB_MONGO_URI}  # hoặc MONGODB_URI/DATABASE_URL
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
      - MINIO_ENDPOINT=${MINIO_ENDPOINT}
      - MINIO_PORT=${MINIO_PORT}
```

* Prod: dùng **secret manager** (Doppler, Vault, AWS Secrets Manager, GCP Secret Manager, 1Password…) → container lấy lúc runtime. `.env` chỉ cho dev.

# CI/CD

* Không push `.env`. Commit **`.env.example`** đầy đủ key (không giá trị nhạy cảm).
* Thiết lập secret ở CI (GitHub Actions/GitLab) và inject qua `env`.
* Chạy bước **validate env** sớm:

```bash
pnpm -F @repo/config-env test-env   # script nhỏ gọi schema.parse
```

# Frontend (Next.js/Vite)

* Chỉ expose biến có prefix (`NEXT_PUBLIC_`/`VITE_`).
* **Đừng** import nhầm server secret vào code chạy client. Nếu chia `server.ts` & `client.ts` trong `config-env`, càng an toàn.
* Với Next.js: biến **được inline lúc build**, thay đổi env sau build có thể **không** phản ánh (trừ biến runtime đọc từ server). Cân nhắc **Runtime Config** hoặc đọc từ API.

# Các lỗi phổ biến & cách tránh

1. **Rò rỉ secret lên client**: dùng prefix đúng; tách module config server/client.
2. **Build dùng cache cũ khi env đổi**: khai báo `env` ở `turbo.json` cho task liên quan.
3. **Env không đồng nhất giữa app**: mọi app import từ `@repo/config-env`; hạn chế dùng `process.env` trực tiếp.
4. **.env bị ghi đè khó hiểu**: ghi rõ thứ tự load; dùng `dotenv-flow` nếu bạn cần `.env.development.local`/`.env.production`.
5. **Thiếu `.env.example`**: team onboard chậm; hãy cập nhật ngay khi thêm biến mới.
6. **Đặt secret trong `.env.development` commit lên git**: chỉ để non-secret (host, port). Secret dev cho vào `.env.local` (gitignore).
7. **Next.js không nhận biến**: thiếu prefix hoặc chạy `next dev` mà không restart sau khi thêm biến.
8. **Worker/API khác nhau dùng cùng `DATABASE_URL`**: tách DB hoặc schema; tối thiểu là **pooling** hợp lý.
9. **Windows shell khác nhau**: khi set env trong script, ưu tiên file `.env` + `dotenv` thay vì `export`/`set`.

# Mẫu `.env.example` (MongoDB + Redis + MinIO)

```dotenv
# Core
NODE_ENV=development
SERVER_PORT=8080
BASE_URL=http://localhost:8080
CLIENT_URL=http://localhost:3000
DEFAULT_EXPIRE=3600
TZ=Asia/Ho_Chi_Minh
ENABLED_CACHE=true

# MongoDB (ưu tiên DB_MONGO_URI > MONGODB_URI > DATABASE_URL)
DB_MONGO_URI=mongodb://admin:password@127.0.0.1:27017/pos?replicaSet=rs0&authSource=admin

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# MinIO
MINIO_ENDPOINT=127.0.0.1
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=assets
MINIO_URL=http://localhost:9000

# JWT/Session
SESSION_SECRET=change_me_long_random
REFRESH_SECRET=change_me_refresh
AUTH_ACCESS_EXPIRE=3600
AUTH_REFRESH_EXPIRE=604800
AUTH_SESSION_EXPIRE=604800
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=7d
JWT_ISSUER=localhost:8080
JWT_AUDIENCE=localhost:8080

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your@email.com
EMAIL_PASSWORD=app_password
EMAIL_NOTI=notify@email.com
EMAIL_TEST_RECIPIENT=test@email.com

# Telegram
TELEGRAM_RECIPIENT_ID=
TELEGRAM_BOT_TOKEN=

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_DOMAIN_TYPE=retail
```

# Checklist nhanh để triển khai

* [ ] Tạo `packages/config-env` + Zod validate (như ví dụ trên, ưu tiên MongoDB).
* [ ] Viết `.env.example` đầy đủ (MongoDB/Redis/MinIO/JWT...).
* [ ] Root `.env.development` cho giá trị **không nhạy cảm** dùng chung.
* [ ] `.env.local` tại từng app cho secret dev (gitignore).
* [ ] Khai báo `env` (và `dotenv` nếu dùng) trong `turbo.json` cho các task build/test.
* [ ] CI: inject secret qua môi trường, chạy bước validate env trước build.
* [ ] Prod: dùng secret manager; không đóng gói secret vào image.

Tài liệu này đã được điều chỉnh theo cấu hình hiện tại (MongoDB thay Postgres, Redis/MinIO, biến Next.js công khai). Nếu cần, có thể mở rộng `@repo/config-env` để tách riêng config cho server/client.
