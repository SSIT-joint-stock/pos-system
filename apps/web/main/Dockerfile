FROM node:20-alpine AS base

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

# Install all dependencies, including those of workspaces
RUN npm ci

# 2. Build Next.js application
COPY . .
RUN npm run build --filter=@pos/web-main

# 3. Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built Next.js application
COPY --from=builder /app/apps/web/main/.next/standalone ./apps/web/main/.next/standalone
COPY --from=builder /app/apps/web/main/.next/static ./apps/web/main/.next/static
COPY --from=builder /app/apps/web/main/public ./apps/web/main/public
COPY --from=builder /app/node_modules ./node_modules

# Set the working directory for the app
WORKDIR /app/apps/web/main

EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]