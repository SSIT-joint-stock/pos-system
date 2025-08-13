import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), process.env.ENV_FILE || ".env"),
});

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL ?? "mongodb://127.0.0.1:27017/pos",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret",
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES ?? "15m",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES ?? "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
};
