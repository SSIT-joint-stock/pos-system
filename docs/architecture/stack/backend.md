# Backend Tech Stack - Multi-Domain POS System

## Tổng quan

Backend stack cho hệ thống POS multi-domain sử dụng Node.js với architecture hiện đại, hỗ trợ multiple business domains (restaurant, retail) với microservices pattern, real-time communication, và scalable database solutions.

## Core Technologies

### 1. Runtime & Framework
```json
{
  "node": ">=18",
  "express": "^4.21.0",
  "typescript": "^5.3.3",
  "body-parser": "^1.20.3",
  "cors": "^2.8.5",
  "cookie-parser": "^1.4.7"
}
```

**Node.js 18+:**
- ESM support
- Performance improvements
- Built-in test runner
- Fetch API support

**Express.js:**
- Lightweight web framework
- Middleware ecosystem
- RESTful API support
- Multi-domain routing

### 2. Database & ORM
```json
{
  "@prisma/client": "^6.0.1",
  "prisma": "^6.0.1",
  "sequelize": "^6.37.5",
  "sequelize-cli": "^6.6.2",
  "mongoose": "^8.8.1",
  "mongodb": "^6.11.0",
  "pg": "^8.13.1",
  "pg-hstore": "^2.3.4"
}
```

**Database Stack:**
- **Prisma**: Modern ORM with type safety
- **Sequelize**: Traditional ORM for SQL databases
- **Mongoose**: MongoDB object modeling
- **PostgreSQL**: Primary relational database
- **MongoDB**: NoSQL database for flexible schemas

### 3. Authentication & Security
```json
{
  "jsonwebtoken": "^9.0.2",
  "jwt-decode": "^2.2.0",
  "bcrypt": "^5.1.1",
  "bcryptjs": "^3.0.2",
  "express-validator": "^6.4.0",
  "zod": "^3.23.7"
}
```

**Security Features:**
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation with Zod & express-validator
- CORS protection
- Rate limiting support

## Real-time & Background Processing

### 1. WebSocket Communication
```json
{
  "socket.io": "^4.8.0",
  "@types/socket.io": "^2.1.4"
}
```

**Socket.IO Features:**
- Real-time order updates
- Kitchen display integration
- Live inventory tracking
- Multi-room support for tenants
- Fallback to polling

### 2. Job Queue & Scheduling
```json
{
  "bullmq": "^5.56.9",
  "node-cron": "^3.0.3",
  "cron-parser": "^5.1.0",
  "ioredis": "^5.4.1"
}
```

**Background Processing:**
- **BullMQ**: Redis-based job queue
- **Node-cron**: Task scheduling
- **Redis**: Cache & queue storage
- **Worker processes**: Export, reports, cleanup

### 3. File Processing & Export
```json
{
  "multer": "^1.4.5-lts.1",
  "archiver": "^7.0.1",
  "exceljs": "^4.4.0",
  "docx": "^9.5.1",
  "xlsx": "^0.18.5",
  "fast-csv": "^5.0.2"
}
```

**File Operations:**
- Multi-format export (Excel, Word, CSV)
- File upload handling
- Archive creation
- Bulk data processing

## Utility Libraries

### 1. Data Processing
```json
{
  "lodash": "^4.17.21",
  "dayjs": "^1.11.13",
  "flexsearch": "^0.7.43",
  "p-limit": "^6.1.0",
  "uuid": "^10.0.0"
}
```

### 2. HTTP Client
```json
{
  "axios": "^1.7.7"
}
```

### 3. Environment & Configuration
```json
{
  "dotenv": "^16.4.5"
}
```

## Development & Testing

### 1. Build Tools
```json
{
  "tsup": "^8.3.5",
  "tsc-alias": "^1.8.10",
  "concurrently": "^8.2.2"
}
```

### 2. Testing Framework
```json
{
  "jest": "^29.7.0",
  "ts-jest": "^29.2.5",
  "@faker-js/faker": "^9.3.0"
}
```

### 3. Monitoring & Debugging
```json
{
  "blessed": "^0.1.81",
  "blessed-contrib": "^4.11.0",
  "node-addon-api": "^8.1.0"
}
```

## Monorepo Packages

```json
{
  "@repo/database": "*",
  "@repo/locale": "*",
  "@repo/logger": "*",
  "@repo/orm": "*"
}
```

## Project Structure

```
apps/
├── server/                    # Main API server
├── workers/                   # Background workers
│   ├── export/               # Export worker
│   ├── scheduler/            # Cron job worker
│   └── notification/         # Notification worker
└── websocket/                # WebSocket server

packages/
├── database/                 # Database configurations
├── logger/                   # Logging utilities
├── orm/                      # ORM models & utilities
└── locale/                   # Internationalization
├── module/
│   ├── product/               # Product module
│   ├── order/                 # Order module
│   └── customer/              # Customer module
```

## Package.json Configuration

### Main Server Package.json
```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "Multi-domain POS backend system",
  "main": "server.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "dev": "set NODE_ENV=development&&set PORT=4001&&tsup --watch --onSuccess \"node --inspect --max-old-space-size=8194 dist/server.js\"",
    "dev:worker": "set NODE_ENV=development&&set PORT=4001&&tsup --watch --onSuccess \"node --inspect --max-old-space-size=8194 dist/workers/export/index.js\"",
    "start": "node dist/server.js",
    "build": "tsup && tsc-alias",
    "test": "jest",
    "worker:export": "node dist/workers/export/index.js",
    "worker:export:dev": "set NODE_ENV=development&&set WORKER_TYPE=export&&tsup --watch --onSuccess \"node --inspect dist/workers/export/index.js\"",
    "dev:migrate:up": "set NODE_ENV=development&&npx sequelize-cli db:migrate",
    "dev:migrate:undo": "set NODE_ENV=development&&npx sequelize-cli db:migrate:undo",
    "prod:migrate:up": "set NODE_ENV=production && npx sequelize-cli db:migrate",
    "prod:migrate:undo": "set NODE_ENV=production && npx sequelize-cli db:migrate:undo"
  },
  "dependencies": {
    "@prisma/client": "^6.0.1",
    "@repo/database": "*",
    "@repo/locale": "*",
    "@repo/logger": "*",
    "@repo/orm": "*",
    "archiver": "^7.0.1",
    "axios": "^1.7.7",
    "bcrypt": "^5.1.1",
    "bcryptjs": "^3.0.2",
    "blessed": "^0.1.81",
    "blessed-contrib": "^4.11.0",
    "body-parser": "^1.20.3",
    "bullmq": "^5.56.9",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "cron-parser": "^5.1.0",
    "dayjs": "^1.11.13",
    "docx": "^9.5.1",
    "dotenv": "^16.4.5",
    "exceljs": "^4.4.0",
    "express": "^4.21.0",
    "express-validator": "^6.4.0",
    "fast-csv": "^5.0.2",
    "flexsearch": "^0.7.43",
    "ioredis": "^5.4.1",
    "jsonwebtoken": "^9.0.2",
    "jwt-decode": "^2.2.0",
    "lodash": "^4.17.21",
    "mongodb": "^6.11.0",
    "mongoose": "^8.8.1",
    "multer": "^1.4.5-lts.1",
    "node-addon-api": "^8.1.0",
    "node-cron": "^3.0.3",
    "p-limit": "^6.1.0",
    "pg": "^8.13.1",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.5",
    "socket.io": "^4.8.0",
    "uuid": "^10.0.0",
    "xlsx": "^0.18.5",
    "zod": "^3.23.7"
  },
  "devDependencies": {
    "@faker-js/faker": "^9.3.0",
    "@types/archiver": "^6.0.3",
    "@types/bcrypt": "^5.0.2",
    "@types/body-parser": "^1.19.0",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.6",
    "@types/crypto-js": "^3.1.44",
    "@types/express": "^4.17.6",
    "@types/ioredis": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/jsonwebtoken": "^8.3.9",
    "@types/jwt-decode": "^2.2.1",
    "@types/mongoose": "^5.11.97",
    "@types/multer": "^1.4.12",
    "@types/node-cron": "^3.0.11",
    "@types/socket.io": "^2.1.4",
    "@types/uuid": "^10.0.0",
    "concurrently": "^8.2.2",
    "jest": "^29.7.0",
    "prisma": "^6.0.1",
    "sequelize-cli": "^6.6.2",
    "ts-jest": "^29.2.5",
    "tsc-alias": "^1.8.10",
    "tsup": "^8.3.5",
    "typescript": "^5.3.3"
  }
}
```

## Database Configuration

### Prisma Schema Example
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Multi-tenant models
model Account {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  tenants   Tenant[]
  
  @@map("accounts")
}

model Tenant {
  id           String      @id @default(cuid())
  accountId    String
  businessType BusinessType
  subdomain    String      @unique
  account      Account     @relation(fields: [accountId], references: [id])
  
  @@map("tenants")
}

enum BusinessType {
  RESTAURANT
  RETAIL
}
```

### Redis Configuration
```typescript
// config/redis.ts
import { Redis } from 'ioredis';

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};

export const redis = new Redis(redisConfig);
```

## Background Jobs Setup

### BullMQ Queue Configuration
```typescript
// jobs/queue.ts
import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis';

// Export queue
export const exportQueue = new Queue('export', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Worker for export jobs
export const exportWorker = new Worker(
  'export',
  async (job) => {
    const { type, tenantId, data } = job.data;
    
    switch (type) {
      case 'orders-export':
        return await exportOrders(tenantId, data);
      case 'products-export':
        return await exportProducts(tenantId, data);
      case 'reports-export':
        return await exportReports(tenantId, data);
      default:
        throw new Error(`Unknown export type: ${type}`);
    }
  },
  { connection: redis }
);

// Job processors
async function exportOrders(tenantId: string, data: any) {
  // Implementation for orders export
  console.log(`Exporting orders for tenant: ${tenantId}`);
}

async function exportProducts(tenantId: string, data: any) {
  // Implementation for products export
  console.log(`Exporting products for tenant: ${tenantId}`);
}

async function exportReports(tenantId: string, data: any) {
  // Implementation for reports export
  console.log(`Exporting reports for tenant: ${tenantId}`);
}
```

### Cron Jobs Setup
```typescript
// jobs/scheduler.ts
import * as cron from 'node-cron';
import { cronParser } from 'cron-parser';

export class SchedulerService {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  scheduleJob(name: string, schedule: string, task: () => void) {
    // Validate cron expression
    try {
      cronParser.parseExpression(schedule);
    } catch (error) {
      throw new Error(`Invalid cron expression: ${schedule}`);
    }

    // Stop existing job if exists
    if (this.jobs.has(name)) {
      this.jobs.get(name)?.stop();
    }

    // Schedule new job
    const scheduledTask = cron.schedule(schedule, task, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set(name, scheduledTask);
    scheduledTask.start();

    console.log(`Scheduled job: ${name} with schedule: ${schedule}`);
  }

  stopJob(name: string) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      console.log(`Stopped job: ${name}`);
    }
  }

  listJobs() {
    return Array.from(this.jobs.keys());
  }
}

// Initialize scheduled jobs
export function initializeScheduledJobs() {
  const scheduler = new SchedulerService();

  // Daily backup at 2 AM
  scheduler.scheduleJob('daily-backup', '0 2 * * *', async () => {
    console.log('Running daily backup...');
    // Backup implementation
  });

  // Hourly cleanup of expired sessions
  scheduler.scheduleJob('cleanup-sessions', '0 * * * *', async () => {
    console.log('Cleaning up expired sessions...');
    // Cleanup implementation
  });

  // Weekly reports generation
  scheduler.scheduleJob('weekly-reports', '0 6 * * 1', async () => {
    console.log('Generating weekly reports...');
    // Reports generation implementation
  });

  return scheduler;
}
```

## WebSocket Implementation

### Socket.IO Server Setup
```typescript
// websocket/server.ts
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URLS?.split(',') || ["http://localhost:3000"],
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

// Namespace for different business types
const restaurantNamespace = io.of('/restaurant');
const retailNamespace = io.of('/retail');

// Restaurant events
restaurantNamespace.on('connection', (socket) => {
  console.log(`Restaurant client connected: ${socket.id}`);
  
  socket.on('join-tenant', (tenantId: string) => {
    socket.join(`tenant:${tenantId}`);
    console.log(`Socket ${socket.id} joined tenant ${tenantId}`);
  });

  socket.on('order-update', (data) => {
    // Broadcast order updates to all clients in tenant room
    socket.to(`tenant:${data.tenantId}`).emit('order-updated', data);
  });

  socket.on('kitchen-update', (data) => {
    // Broadcast kitchen updates
    socket.to(`tenant:${data.tenantId}`).emit('kitchen-updated', data);
  });

  socket.on('disconnect', () => {
    console.log(`Restaurant client disconnected: ${socket.id}`);
  });
});

// Retail events
retailNamespace.on('connection', (socket) => {
  console.log(`Retail client connected: ${socket.id}`);
  
  socket.on('join-tenant', (tenantId: string) => {
    socket.join(`tenant:${tenantId}`);
  });

  socket.on('inventory-update', (data) => {
    socket.to(`tenant:${data.tenantId}`).emit('inventory-updated', data);
  });

  socket.on('pos-transaction', (data) => {
    socket.to(`tenant:${data.tenantId}`).emit('transaction-completed', data);
  });

  socket.on('disconnect', () => {
    console.log(`Retail client disconnected: ${socket.id}`);
  });
});

export { server };
```

## Domain-Specific Services

### Restaurant Service
```typescript
// services/restaurant-service.ts
import { PrismaClient } from '@prisma/client';
import { io } from '../websocket/server';

export class RestaurantService {
  constructor(private prisma: PrismaClient) {}

  async createOrder(tenantId: string, orderData: any) {
    const order = await this.prisma.restaurantOrder.create({
      data: {
        ...orderData,
        tenantId,
        status: 'PENDING'
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    // Emit real-time update
    io.of('/restaurant').to(`tenant:${tenantId}`).emit('new-order', order);

    return order;
  }

  async updateOrderStatus(orderId: string, status: string, tenantId: string) {
    const order = await this.prisma.restaurantOrder.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    // Emit status update
    io.of('/restaurant').to(`tenant:${tenantId}`).emit('order-status-updated', {
      orderId,
      status,
      order
    });

    return order;
  }

  async getKitchenOrders(tenantId: string) {
    return this.prisma.restaurantOrder.findMany({
      where: {
        tenantId,
        status: {
          in: ['CONFIRMED', 'PREPARING']
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }
}
```

### Retail Service
```typescript
// services/retail-service.ts
import { PrismaClient } from '@prisma/client';
import { io } from '../websocket/server';

export class RetailService {
  constructor(private prisma: PrismaClient) {}

  async processTransaction(tenantId: string, transactionData: any) {
    const result = await this.prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.retailOrder.create({
        data: {
          ...transactionData,
          tenantId,
          status: 'COMPLETED'
        }
      });

      // Update inventory
      for (const item of transactionData.items) {
        await tx.inventory.update({
          where: {
            productId: item.productId
          },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });

    // Emit real-time updates
    io.of('/retail').to(`tenant:${tenantId}`).emit('transaction-completed', result);
    io.of('/retail').to(`tenant:${tenantId}`).emit('inventory-updated', {
      tenantId,
      timestamp: new Date()
    });

    return result;
  }

  async updateInventory(productId: string, quantity: number, tenantId: string) {
    const inventory = await this.prisma.inventory.update({
      where: { productId },
      data: { quantity },
      include: {
        product: true
      }
    });

    // Emit inventory update
    io.of('/retail').to(`tenant:${tenantId}`).emit('inventory-updated', {
      productId,
      quantity,
      inventory
    });

    return inventory;
  }
}
```

## API Structure

### Express App Setup
```typescript
// server.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { server } from './websocket/server';
import { initializeScheduledJobs } from './jobs/scheduler';
import { exportWorker } from './jobs/queue';

// Routes
import authRoutes from './routes/auth';
import restaurantRoutes from './routes/restaurant';
import retailRoutes from './routes/retail';
import adminRoutes from './routes/admin';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URLS?.split(',') || ["http://localhost:3000"],
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/retail', retailRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message
  });
});

// Initialize services
const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  
  // Initialize background services
  initializeScheduledJobs();
  console.log(`⏰ Scheduled jobs initialized`);
  
  console.log(`🔄 Background workers ready`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  // Close workers
  await exportWorker.close();
  
  // Close database connections
  await prisma.$disconnect();
  
  // Close server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

## Key Features & Benefits

### 1. **Multi-Domain Architecture**
- Domain-specific services (Restaurant, Retail)
- Tenant isolation at database level
- Shared infrastructure with business logic separation
- WebSocket namespaces per domain

### 2. **Real-time Capabilities**
- Live order updates for kitchen displays
- Real-time inventory tracking
- POS transaction broadcasting
- Multi-room support for tenant isolation

### 3. **Background Processing**
- BullMQ for reliable job queuing
- Scheduled tasks with node-cron
- Export workers for large datasets
- Retry mechanisms and error handling

### 4. **Database Flexibility**
- Prisma for type-safe database operations
- Multi-database support (PostgreSQL, MongoDB)
- Migration and seeding scripts
- Connection pooling and optimization

### 5. **Security & Validation**
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation with Zod
- CORS and security headers

### 6. **File Processing**
- Multi-format export capabilities
- File upload handling with Multer
- Archive creation and compression
- CSV/Excel data processing

### 7. **Developer Experience**
- TypeScript for type safety
- Hot reload with tsup
- Comprehensive testing with Jest
- Docker containerization ready
- Monitoring and debugging tools

### 8. **Scalability Features**
- Redis for caching and sessions
- Queue-based background processing
- WebSocket scaling with Redis adapter
- Microservices-ready architecture

Kiến trúc backend này cung cấp foundation mạnh mẽ cho hệ thống POS multi-domain với khả năng xử lý real-time, background processing, và scalability cao.