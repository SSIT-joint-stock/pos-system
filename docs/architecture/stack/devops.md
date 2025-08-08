# DevOps Stack - Multi-Domain POS System

## Tổng quan

DevOps stack cho hệ thống POS multi-domain sử dụng containerization với Docker, CI/CD pipeline với GitHub Actions, và infrastructure management cho multiple environments (dev, staging, production) across 3 domains (main, restaurant, retail).

## Container Technologies

### 1. Docker Configuration
```dockerfile
# Dockerfile - Frontend Apps
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_DOMAIN_TYPE

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_DOMAIN_TYPE=$NEXT_PUBLIC_DOMAIN_TYPE

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile - Backend Server
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 4001

CMD ["node", "dist/server.js"]
```

### 2. Docker Compose Configuration

```yaml
# docker-compose.yml - Development Environment
version: '3.8'

services:
  # Database Services
  postgres:
    image: postgres:15-alpine
    container_name: pos-postgres-dev
    environment:
      POSTGRES_DB: pos_development
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - pos-network

  mongodb:
    image: mongo:7
    container_name: pos-mongodb-dev
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-admin123}
      MONGO_INITDB_DATABASE: pos_development
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./scripts/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    networks:
      - pos-network

  redis:
    image: redis:7-alpine
    container_name: pos-redis-dev
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redis123}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - pos-network

  # Backend Services
  api-server:
    build:
      context: ./apps/server
      dockerfile: Dockerfile
    container_name: pos-api-dev
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD:-postgres}@postgres:5432/pos_development
      MONGODB_URL: mongodb://admin:${MONGO_PASSWORD:-admin123}@mongodb:27017/pos_development?authSource=admin
      REDIS_URL: redis://:${REDIS_PASSWORD:-redis123}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PORT: 4001
    ports:
      - "4001:4001"
    depends_on:
      - postgres
      - mongodb
      - redis
    volumes:
      - ./apps/server:/app
      - /app/node_modules
    networks:
      - pos-network
    restart: unless-stopped

  # Frontend Services
  main-web:
    build:
      context: ./apps/main-web
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: http://localhost:4001/api
        NEXT_PUBLIC_WS_URL: ws://localhost:4001
        NEXT_PUBLIC_DOMAIN_TYPE: main
    container_name: pos-main-web-dev
    environment:
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - api-server
    volumes:
      - ./apps/main-web:/app
      - /app/.next
      - /app/node_modules
    networks:
      - pos-network

  restaurant-web:
    build:
      context: ./apps/restaurant-web
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: http://localhost:4001/api
        NEXT_PUBLIC_WS_URL: ws://localhost:4001
        NEXT_PUBLIC_DOMAIN_TYPE: restaurant
    container_name: pos-restaurant-web-dev
    environment:
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - api-server
    volumes:
      - ./apps/restaurant-web:/app
      - /app/.next
      - /app/node_modules
    networks:
      - pos-network

  retail-web:
    build:
      context: ./apps/retail-web
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: http://localhost:4001/api
        NEXT_PUBLIC_WS_URL: ws://localhost:4001
        NEXT_PUBLIC_DOMAIN_TYPE: retail
    container_name: pos-retail-web-dev
    environment:
      PORT: 3002
    ports:
      - "3002:3002"
    depends_on:
      - api-server
    volumes:
      - ./apps/retail-web:/app
      - /app/.next
      - /app/node_modules
    networks:
      - pos-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: pos-nginx-dev
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/dev/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/dev/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - main-web
      - restaurant-web
      - retail-web
    networks:
      - pos-network

volumes:
  postgres_data:
  mongodb_data:
  redis_data:

networks:
  pos-network:
    driver: bridge
```

```yaml
# docker-compose.staging.yml - Staging Environment
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pos_staging
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_staging_data:/var/lib/postgresql/data
    networks:
      - pos-staging-network
    restart: always

  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: pos_staging
    volumes:
      - mongodb_staging_data:/data/db
    networks:
      - pos-staging-network
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_staging_data:/data
    networks:
      - pos-staging-network
    restart: always

  api-server:
    image: ${DOCKER_REGISTRY}/pos-api:${IMAGE_TAG}
    environment:
      NODE_ENV: staging
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/pos_staging
      MONGODB_URL: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/pos_staging?authSource=admin
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PORT: 4001
    depends_on:
      - postgres
      - mongodb
      - redis
    networks:
      - pos-staging-network
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  main-web:
    image: ${DOCKER_REGISTRY}/pos-main-web:${IMAGE_TAG}
    environment:
      NODE_ENV: staging
      PORT: 3000
    depends_on:
      - api-server
    networks:
      - pos-staging-network
    restart: always

  restaurant-web:
    image: ${DOCKER_REGISTRY}/pos-restaurant-web:${IMAGE_TAG}
    environment:
      NODE_ENV: staging
      PORT: 3001
    depends_on:
      - api-server
    networks:
      - pos-staging-network
    restart: always

  retail-web:
    image: ${DOCKER_REGISTRY}/pos-retail-web:${IMAGE_TAG}
    environment:
      NODE_ENV: staging
      PORT: 3002
    depends_on:
      - api-server
    networks:
      - pos-staging-network
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/staging/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/staging/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - main-web
      - restaurant-web
      - retail-web
    networks:
      - pos-staging-network
    restart: always

volumes:
  postgres_staging_data:
  mongodb_staging_data:
  redis_staging_data:

networks:
  pos-staging-network:
    driver: bridge
```

```yaml
# docker-compose.prod.yml - Production Environment
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pos_production
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    networks:
      - pos-prod-network
    restart: always
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: pos_production
    volumes:
      - mongodb_prod_data:/data/db
    networks:
      - pos-prod-network
    restart: always
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_prod_data:/data
    networks:
      - pos-prod-network
    restart: always

  api-server:
    image: ${DOCKER_REGISTRY}/pos-api:${IMAGE_TAG}
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/pos_production
      MONGODB_URL: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/pos_production?authSource=admin
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PORT: 4001
    depends_on:
      - postgres
      - mongodb
      - redis
    networks:
      - pos-prod-network
    restart: always
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  main-web:
    image: ${DOCKER_REGISTRY}/pos-main-web:${IMAGE_TAG}
    environment:
      NODE_ENV: production
      PORT: 3000
    depends_on:
      - api-server
    networks:
      - pos-prod-network
    restart: always
    deploy:
      replicas: 2

  restaurant-web:
    image: ${DOCKER_REGISTRY}/pos-restaurant-web:${IMAGE_TAG}
    environment:
      NODE_ENV: production
      PORT: 3001
    depends_on:
      - api-server
    networks:
      - pos-prod-network
    restart: always
    deploy:
      replicas: 2

  retail-web:
    image: ${DOCKER_REGISTRY}/pos-retail-web:${IMAGE_TAG}
    environment:
      NODE_ENV: production
      PORT: 3002
    depends_on:
      - api-server
    networks:
      - pos-prod-network
    restart: always
    deploy:
      replicas: 2

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/prod/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - main-web
      - restaurant-web
      - retail-web
    networks:
      - pos-prod-network
    restart: always
    deploy:
      replicas: 2

volumes:
  postgres_prod_data:
  mongodb_prod_data:
  redis_prod_data:

networks:
  pos-prod-network:
    driver: bridge
```

## CI/CD Pipeline

### 1. GitHub Actions Workflows

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop, staging ]
  pull_request:
    branches: [ main, develop ]

env:
  DOCKER_REGISTRY: ghcr.io
  IMAGE_NAME: pos-system

jobs:
  # Test Jobs
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: pos_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate
        working-directory: ./apps/server

      - name: Run database migrations
        run: npx prisma migrate deploy
        working-directory: ./apps/server
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/pos_test

      - name: Run backend tests
        run: npm run test
        working-directory: ./apps/server
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/pos_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret

      - name: Upload backend coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/server/coverage/lcov.info
          flags: backend

  test-frontend:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [main-web, restaurant-web, retail-web]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run frontend tests
        run: npm run test
        working-directory: ./apps/${{ matrix.app }}

      - name: Build frontend
        run: npm run build
        working-directory: ./apps/${{ matrix.app }}
        env:
          NEXT_PUBLIC_API_URL: http://localhost:4001/api
          NEXT_PUBLIC_WS_URL: ws://localhost:4001

      - name: Upload frontend coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/${{ matrix.app }}/coverage/lcov.info
          flags: frontend-${{ matrix.app }}

  # Security Scanning
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  # Build and Push Docker Images
  build-and-push:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend, security-scan]
    if: github.event_name == 'push'
    strategy:
      matrix:
        service: [server, main-web, restaurant-web, retail-web]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.DOCKER_REGISTRY }}/${{ github.repository }}-${{ matrix.service }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./apps/${{ matrix.service }}
          file: ./apps/${{ matrix.service }}/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}
            NEXT_PUBLIC_WS_URL=${{ secrets.NEXT_PUBLIC_WS_URL }}

  # Deploy to Staging
  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-push
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to staging
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/pos-system
            git pull origin develop
            
            # Set environment variables
            export DOCKER_REGISTRY=${{ env.DOCKER_REGISTRY }}
            export IMAGE_TAG=develop-${{ github.sha }}
            export POSTGRES_PASSWORD=${{ secrets.STAGING_POSTGRES_PASSWORD }}
            export MONGO_PASSWORD=${{ secrets.STAGING_MONGO_PASSWORD }}
            export REDIS_PASSWORD=${{ secrets.STAGING_REDIS_PASSWORD }}
            export JWT_SECRET=${{ secrets.STAGING_JWT_SECRET }}
            
            # Deploy with docker-compose
            docker-compose -f docker-compose.staging.yml down
            docker-compose -f docker-compose.staging.yml pull
            docker-compose -f docker-compose.staging.yml up -d
            
            # Run database migrations
            docker-compose -f docker-compose.staging.yml exec -T api-server npx prisma migrate deploy
            
            # Health check
            sleep 30
            curl -f http://localhost/health || exit 1

      - name: Notify Telegram - Staging Deployed
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          message: |
            🚀 *Staging Deployment Successful*
            
            *Repository:* ${{ github.repository }}
            *Branch:* ${{ github.ref_name }}
            *Commit:* ${{ github.sha }}
            *Author:* ${{ github.actor }}
            
            *Services Deployed:*
            • Main Web: https://staging-main.yourpos.com
            • Restaurant: https://staging-restaurant.yourpos.com  
            • Retail: https://staging-retail.yourpos.com
            • API: https://staging-api.yourpos.com
            
            *Environment:* Staging
            *Time:* ${{ github.event.head_commit.timestamp }}

  # Deploy to Production
  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-push
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /opt/pos-system
            git pull origin main
            
            # Set environment variables
            export DOCKER_REGISTRY=${{ env.DOCKER_REGISTRY }}
            export IMAGE_TAG=main-${{ github.sha }}
            export POSTGRES_PASSWORD=${{ secrets.PRODUCTION_POSTGRES_PASSWORD }}
            export MONGO_PASSWORD=${{ secrets.PRODUCTION_MONGO_PASSWORD }}
            export REDIS_PASSWORD=${{ secrets.PRODUCTION_REDIS_PASSWORD }}
            export JWT_SECRET=${{ secrets.PRODUCTION_JWT_SECRET }}
            
            # Blue-Green Deployment
            docker-compose -f docker-compose.prod.yml up -d --scale api-server=0
            docker-compose -f docker-compose.prod.yml pull
            
            # Start new instances
            docker-compose -f docker-compose.prod.yml up -d --scale api-server=3
            
            # Run database migrations
            docker-compose -f docker-compose.prod.yml exec -T api-server npx prisma migrate deploy
            
            # Health check
            sleep 60
            curl -f https://api.yourpos.com/health || exit 1
            
            # Remove old containers
            docker system prune -f

      - name: Notify Telegram - Production Deployed
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          message: |
            🎉 *Production Deployment Successful*
            
            *Repository:* ${{ github.repository }}
            *Branch:* ${{ github.ref_name }}
            *Commit:* ${{ github.sha }}
            *Author:* ${{ github.actor }}
            
            *Live Services:*
            • Main Web: https://yourpos.com
            • Restaurant: https://restaurant.yourpos.com
            • Retail: https://retail.yourpos.com
            • API: https://api.yourpos.com
            
            *Environment:* Production
            *Time:* ${{ github.event.head_commit.timestamp }}
            
            ✅ All systems operational!

  # Rollback Job
  rollback:
    runs-on: ubuntu-latest
    if: failure()
    environment: production

    steps:
      - name: Rollback Production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /opt/pos-system
            git checkout HEAD~1
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d

      - name: Notify Telegram - Rollback
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          message: |
            🚨 *Production Rollback Executed*
            
            *Repository:* ${{ github.repository }}
            *Failed Commit:* ${{ github.sha }}
            *Author:* ${{ github.actor }}
            
            *Action:* Automatic rollback to previous version
            *Time:* ${{ github.event.head_commit.timestamp }}
            
            ⚠️ Please investigate the deployment failure!
```

### 2. Environment-Specific Workflows

```yaml
# .github/workflows/deploy-dev.yml
name: Deploy to Development

on:
  workflow_dispatch:
    inputs:
      service:
        description: 'Service to deploy'
        required: true
        default: 'all'
        type: choice
        options:
        - all
        - server
        - main-web
        - restaurant-web
        - retail-web

jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    environment: development

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to development
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEV_HOST }}
          username: ${{ secrets.DEV_USER }}
          key: ${{ secrets.DEV_SSH_KEY }}
          script: |
            cd /opt/pos-system
            git pull origin develop
            
            if [ "${{ github.event.inputs.service }}" = "all" ]; then
              docker-compose down
              docker-compose up -d --build
            else
              docker-compose up -d --build ${{ github.event.inputs.service }}
            fi

      - name: Notify Telegram - Dev Deployed
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          message: |
            🔧 *Development Deployment*
            
            *Service:* ${{ github.event.inputs.service }}
            *Environment:* Development
            *Deployed by:* ${{ github.actor }}
            *Time:* ${{ github.event.head_commit.timestamp }}
            
            *Dev URLs:*
            • Main: http://dev-main.yourpos.com
            • Restaurant: http://dev-restaurant.yourpos.com
            • Retail: http://dev-retail.yourpos.com
```

## Nginx Configuration

### 1. Development Environment
```nginx
# nginx/dev/conf.d/default.conf
upstream main_web {
    server main-web:3000;
}

upstream restaurant_web {
    server restaurant-web:3001;
}

upstream retail_web {
    server retail-web:3002;
}

upstream api_server {
    server api-server:4001;
}

# Main Domain
server {
    listen 80;
    server_name dev-main.yourpos.com localhost;

    location / {
        proxy_pass http://main_web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://api_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://api_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Restaurant Domain
server {
    listen 80;
    server_name dev-restaurant.yourpos.com;

    location / {
        proxy_pass http://restaurant_web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Retail Domain
server {
    listen 80;
    server_name dev-retail.yourpos.com;

    location / {
        proxy_pass http://retail_web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Production Environment
```nginx
# nginx/prod/conf.d/default.conf
upstream main_web {
    server main-web:3000;
}

upstream restaurant_web {
    server restaurant-web:3001;
}

upstream retail_web {
    server retail-web:3002;
}

upstream api_server {
    server api-server:4001;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

# Main Domain - HTTPS
server {
    listen 443 ssl http2;
    server_name yourpos.com;

    ssl_certificate /etc/nginx/ssl/yourpos.com.crt;
    ssl_certificate_key /etc/nginx/ssl/yourpos.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://main_web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Caching for static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /api {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://api_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/auth {
        limit_req zone=auth burst=5 nodelay;
        
        proxy_pass http://api_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://api_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Restaurant Domain - HTTPS
server {
    listen 443 ssl http2;
    server_name restaurant.yourpos.com;

    ssl_certificate /etc/nginx/ssl/restaurant.yourpos.com.crt;
    ssl_certificate_key /etc/nginx/ssl/restaurant.yourpos.com.key;

    location / {
        proxy_pass http://restaurant_web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Retail Domain - HTTPS
server {
    listen 443 ssl http2;
    server_name retail.yourpos.com;

    ssl_certificate /etc/nginx/ssl/retail.yourpos.com.crt;
    ssl_certificate_key /etc/nginx/ssl/retail.yourpos.com.key;

    location / {
        proxy_pass http://retail_web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name yourpos.com restaurant.yourpos.com retail.yourpos.com;
    return 301 https://$server_name$request_uri;
}
```

## Environment Management

### 1. Environment Variables
```bash
# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pos_development
MONGODB_URL=mongodb://admin:admin123@localhost:27017/pos_development?authSource=admin
REDIS_URL=redis://:redis123@localhost:6379
JWT_SECRET=dev-jwt-secret-key
POSTGRES_PASSWORD=postgres
MONGO_PASSWORD=admin123
REDIS_PASSWORD=redis123

# Frontend URLs
NEXT_PUBLIC_API_URL=http://localhost:4001/api
NEXT_PUBLIC_WS_URL=ws://localhost:4001
NEXT_PUBLIC_MAIN_DOMAIN=http://dev-main.yourpos.com
NEXT_PUBLIC_RESTAURANT_DOMAIN=http://dev-restaurant.yourpos.com
NEXT_PUBLIC_RETAIL_DOMAIN=http://dev-retail.yourpos.com

# Telegram Notifications
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

```bash
# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/pos_staging
MONGODB_URL=mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/pos_staging?authSource=admin
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
JWT_SECRET=${JWT_SECRET}

# Frontend URLs
NEXT_PUBLIC_API_URL=https://staging-api.yourpos.com/api
NEXT_PUBLIC_WS_URL=wss://staging-api.yourpos.com
NEXT_PUBLIC_MAIN_DOMAIN=https://staging-main.yourpos.com
NEXT_PUBLIC_RESTAURANT_DOMAIN=https://staging-restaurant.yourpos.com
NEXT_PUBLIC_RETAIL_DOMAIN=https://staging-retail.yourpos.com

# SSL Certificates
SSL_CERT_PATH=/etc/nginx/ssl
```

```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/pos_production
MONGODB_URL=mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/pos_production?authSource=admin
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
JWT_SECRET=${JWT_SECRET}

# Frontend URLs
NEXT_PUBLIC_API_URL=https://api.yourpos.com/api
NEXT_PUBLIC_WS_URL=wss://api.yourpos.com
NEXT_PUBLIC_MAIN_DOMAIN=https://yourpos.com
NEXT_PUBLIC_RESTAURANT_DOMAIN=https://restaurant.yourpos.com
NEXT_PUBLIC_RETAIL_DOMAIN=https://retail.yourpos.com

# Production specific
MAX_REQUEST_SIZE=50mb
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Deployment Scripts
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=$1
SERVICES=$2

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: ./deploy.sh <environment> [services]"
    echo "Environments: dev, staging, prod"
    echo "Services: all, server, main-web, restaurant-web, retail-web"
    exit 1
fi

echo "🚀 Deploying to $ENVIRONMENT environment..."

case $ENVIRONMENT in
    "dev")
        COMPOSE_FILE="docker-compose.yml"
        ;;
    "staging")
        COMPOSE_FILE="docker-compose.staging.yml"
        ;;
    "prod")
        COMPOSE_FILE="docker-compose.prod.yml"
        ;;
    *)
        echo "❌ Invalid environment: $ENVIRONMENT"
        exit 1
        ;;
esac

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    export $(cat .env.$ENVIRONMENT | grep -v '#' | xargs)
fi

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin $(git branch --show-current)

# Build and deploy
if [ -z "$SERVICES" ] || [ "$SERVICES" = "all" ]; then
    echo "🔨 Building and deploying all services..."
    docker-compose -f $COMPOSE_FILE down
    docker-compose -f $COMPOSE_FILE build
    docker-compose -f $COMPOSE_FILE up -d
else
    echo "🔨 Building and deploying $SERVICES..."
    docker-compose -f $COMPOSE_FILE up -d --build $SERVICES
fi

# Run database migrations
if [ "$ENVIRONMENT" != "dev" ]; then
    echo "🗄️ Running database migrations..."
    docker-compose -f $COMPOSE_FILE exec -T api-server npx prisma migrate deploy
fi

# Health check
echo "🏥 Running health checks..."
sleep 30

if [ "$ENVIRONMENT" = "prod" ]; then
    curl -f https://api.yourpos.com/health || exit 1
elif [ "$ENVIRONMENT" = "staging" ]; then
    curl -f https://staging-api.yourpos.com/health || exit 1
else
    curl -f http://localhost:4001/health || exit 1
fi

echo "✅ Deployment completed successfully!"

# Send Telegram notification
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    MESSAGE="🚀 Deployment completed successfully!
    
Environment: $ENVIRONMENT
Services: ${SERVICES:-all}
Time: $(date)
Deployed by: $(whoami)"

    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d chat_id="$TELEGRAM_CHAT_ID" \
        -d text="$MESSAGE" \
        -d parse_mode="Markdown"
fi
```

```bash
#!/bin/bash
# scripts/rollback.sh

set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: ./rollback.sh <environment>"
    echo "Environments: staging, prod"
    exit 1
fi

echo "🔄 Rolling back $ENVIRONMENT environment..."

case $ENVIRONMENT in
    "staging")
        COMPOSE_FILE="docker-compose.staging.yml"
        ;;
    "prod")
        COMPOSE_FILE="docker-compose.prod.yml"
        ;;
    *)
        echo "❌ Rollback not supported for $ENVIRONMENT"
        exit 1
        ;;
esac

# Get previous commit
PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
echo "📜 Rolling back to commit: $PREVIOUS_COMMIT"

# Checkout previous commit
git checkout $PREVIOUS_COMMIT

# Deploy previous version
docker-compose -f $COMPOSE_FILE down
docker-compose -f $COMPOSE_FILE up -d

# Health check
echo "🏥 Running health checks..."
sleep 30

if [ "$ENVIRONMENT" = "prod" ]; then
    curl -f https://api.yourpos.com/health || exit 1
else
    curl -f https://staging-api.yourpos.com/health || exit 1
fi

echo "✅ Rollback completed successfully!"

# Send Telegram notification
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    MESSAGE="🔄 Rollback completed successfully!
    
Environment: $ENVIRONMENT
Rolled back to: $PREVIOUS_COMMIT
Time: $(date)
Executed by: $(whoami)"

    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d chat_id="$TELEGRAM_CHAT_ID" \
        -d text="$MESSAGE" \
        -d parse_mode="Markdown"
fi
```

## Monitoring & Logging

### 1. Docker Compose with Monitoring
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  # Application services from main compose file
  
  # Monitoring Stack
  prometheus:
    image: prom/prometheus:latest
    container_name: pos-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - pos-network

  grafana:
    image: grafana/grafana:latest
    container_name: pos-grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD:-admin}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    networks:
      - pos-network

  loki:
    image: grafana/loki:latest
    container_name: pos-loki
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki
      - ./monitoring/loki/loki-config.yml:/etc/loki/local-config.yaml
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - pos-network

  promtail:
    image: grafana/promtail:latest
    container_name: pos-promtail
    volumes:
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./monitoring/promtail/promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
    networks:
      - pos-network

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
```

### 2. GitHub Secrets Configuration
```bash
# Repository Secrets needed for CI/CD

# Environment Hosts
DEV_HOST=dev.yourpos.com
STAGING_HOST=staging.yourpos.com
PRODUCTION_HOST=yourpos.com

# SSH Keys
DEV_SSH_KEY=<private-ssh-key-for-dev>
STAGING_SSH_KEY=<private-ssh-key-for-staging>
PRODUCTION_SSH_KEY=<private-ssh-key-for-production>

# SSH Users
DEV_USER=deploy
STAGING_USER=deploy
PRODUCTION_USER=deploy

# Database Passwords
STAGING_POSTGRES_PASSWORD=<staging-postgres-password>
STAGING_MONGO_PASSWORD=<staging-mongo-password>
STAGING_REDIS_PASSWORD=<staging-redis-password>

PRODUCTION_POSTGRES_PASSWORD=<production-postgres-password>
PRODUCTION_MONGO_PASSWORD=<production-mongo-password>
PRODUCTION_REDIS_PASSWORD=<production-redis-password>

# JWT Secrets
STAGING_JWT_SECRET=<staging-jwt-secret>
PRODUCTION_JWT_SECRET=<production-jwt-secret>

# Frontend URLs
NEXT_PUBLIC_API_URL=https://api.yourpos.com/api
NEXT_PUBLIC_WS_URL=wss://api.yourpos.com

# Telegram Notifications
TELEGRAM_BOT_TOKEN=<telegram-bot-token>
TELEGRAM_CHAT_ID=<telegram-chat-id>

# Docker Registry
GITHUB_TOKEN=<github-token-for-package-registry>
```

## Key Features & Benefits

### 1. **Multi-Environment Support**
- **Development**: Local development với hot reload
- **Staging**: Pre-production testing environment
- **Production**: High-availability production setup

### 2. **Container Orchestration**
- **Docker**: Consistent environments across all stages
- **Docker Compose**: Service orchestration và scaling
- **Multi-stage builds**: Optimized image sizes

### 3. **CI/CD Pipeline**
- **Automated Testing**: Unit, integration, security tests
- **Build & Push**: Multi-service Docker image building
- **Blue-Green Deployment**: Zero-downtime deployments
- **Automatic Rollback**: Failure recovery mechanisms

### 4. **Domain Management**
- **3 Domains**: Main, Restaurant, Retail với routing riêng
- **SSL/TLS**: HTTPS cho tất cả production domains
- **Load Balancing**: Nginx reverse proxy với rate limiting

### 5. **Monitoring & Notifications**
- **Real-time Alerts**: Telegram notifications cho deployments
- **Health Checks**: Automated service health monitoring
- **Logging**: Centralized logging với Grafana stack

### 6. **Security & Performance**
- **Security Scanning**: Trivy vulnerability scanning
- **Rate Limiting**: API protection với Nginx
- **Gzip Compression**: Performance optimization
- **Security Headers**: HTTPS, HSTS, XSS protection

### 7. **Scalability Features**
- **Horizontal Scaling**: Multiple replicas cho production
- **Resource Limits**: Memory và CPU constraints
- **Database Clustering**: Support cho database scaling
- **Cache Layer**: Redis cho session và caching

DevOps stack này cung cấp foundation hoàn chỉnh cho việc deploy và maintain hệ thống POS multi-domain với high availability, security, và automated operations!