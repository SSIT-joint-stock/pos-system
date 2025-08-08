FROM node:20-alpine AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

# Install dependencies required for building
FROM base AS builder
RUN apk update && \
    apk add --no-cache libc6-compat git

# Set working directory
WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy root package.json and workspace files
COPY . .

# Prune the workspace to include telegram-workers and its dependencies
RUN turbo prune --scope=telegram-workers --docker

# Install dependencies
FROM base AS installer
RUN apk update && \
    apk add --no-cache libc6-compat

WORKDIR /app

# Copy package.json and lockfile
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

# Generate a fresh package-lock.json and then install dependencies
RUN npm install --package-lock-only && npm ci && npm install -g turbo

# Copy source code including workspace packages
COPY --from=builder /app/out/full/ .

# Build the project and its dependencies
RUN turbo build

# Production image
FROM base AS runner
WORKDIR /app

# Install concurrently globally before switching to non-root user
RUN npm install -g concurrently

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy necessary files from installer
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/packages ./packages
COPY --from=installer /app/apps/telegram-workers/dist ./apps/telegram-workers/dist
COPY --from=installer /app/apps/telegram-workers/package.json ./apps/telegram-workers/package.json

# Set permissions for the nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set environment to production
ENV NODE_ENV=production

# Start the service
CMD ["concurrently", "node ./apps/telegram-workers/dist/main-bot-service.js", "node ./apps/telegram-workers/dist/index.js"]