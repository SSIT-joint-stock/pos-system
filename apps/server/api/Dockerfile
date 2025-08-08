FROM node:20 AS base

# 1. Install dependencies
FROM base AS builder
WORKDIR /app
COPY package.json ./
COPY packages/design-system/package.json ./packages/design-system/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/core-ui/package.json ./packages/core-ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/server/api/package.json ./apps/server/api/

# Install all dependencies, including those of workspaces
RUN npm ci

# 2. Build backend application
COPY . .
RUN npm run build --filter=@pos/server-api

# 3. Production image
FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV===production

# Copy built application
COPY --from=builder /app/apps/server/api/dist ./apps/server/api/dist
COPY --from=builder /app/node_modules ./node_modules

# Set the working directory for the app
WORKDIR /app/apps/server/api

EXPOSE 4001
CMD ["node", "dist/index.js"]