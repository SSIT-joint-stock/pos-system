# @repo/dto

Type definitions and DTOs for inter-service communication in the POS system, including data transfer objects for products, sales, inventory, and messaging services.

## Features

- 📦 Type definitions for POS entities (products, sales, customers, inventory)
- 📧 Email and Telegram messaging DTOs with BullMQ queue support
- 🔄 Data transfer objects for API communication
- 📊 Queue configuration for background job processing
- 🛡️ Type-safe interfaces for multi-tenant POS operations

## Installation

```bash
npm install @repo/dto
```

## Usage

### Basic Message Queue Setup

```typescript
import { Queue, Worker } from 'bullmq';
import { 
  EmailJob, 
  EmailQueueData, 
  EmailWorkerResult,
  QueueConfig 
} from '@repo/dto';

// Queue configuration
const queueConfig: QueueConfig = {
  name: 'email-queue',
  prefix: 'pos',
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
};

// Create queue
const emailQueue = new Queue<EmailQueueData>(queueConfig.name, {
  prefix: queueConfig.prefix,
  defaultJobOptions: queueConfig.defaultJobOptions
});

// Create worker
const emailWorker = new Worker<EmailQueueData, EmailWorkerResult>(
  queueConfig.name,
  async (job) => {
    // Process email job
    const { payload } = job.data;
    // ... handle email sending
    return {
      success: true,
      response: {
        success: true,
        timestamp: Date.now(),
        to: payload.options.to,
        subject: payload.options.subject
      }
    };
  },
  {
    prefix: queueConfig.prefix,
    concurrency: 5
  }
);
```

### POS-Specific Examples

#### Sending Customer Receipts Through Queue

```typescript
import { EmailPayload, EmailQueueData } from '@repo/dto';

const receiptEmailPayload: EmailPayload = {
  message: 'Customer receipt for purchase',
  options: {
    to: 'customer@example.com',
    subject: 'Receipt - Your Purchase',
    template: 'receipt',
    context: {
      customerName: 'John Doe',
      orderNumber: 'ORD-2024-001',
      items: [
        { name: 'Coffee Beans', quantity: 2, price: 15.99 },
        { name: 'Milk', quantity: 1, price: 3.99 }
      ],
      total: 35.97,
      storeName: 'Premium Coffee Shop'
    },
    priority: 'medium',
    category: 'CUSTOMER',
    isHtml: true
  }
};

const jobData: EmailQueueData = {
  jobId: 'receipt-2024-001',
  payload: receiptEmailPayload
};

await emailQueue.add('send-receipt', jobData);
```

#### Sending Inventory Alerts Through Queue

```typescript
import { TelegramPayload, TelegramQueueData } from '@repo/dto';

const inventoryAlertPayload: TelegramPayload = {
  message: 'Low stock alert for inventory management',
  options: {
    parseMode: 'HTML',
    priority: 'high',
    category: 'INVENTORY',
    recipientId: 'manager-channel-id'
  }
};

const jobData: TelegramQueueData = {
  jobId: 'inventory-alert-2024-001',
  payload: inventoryAlertPayload
};

await telegramQueue.add('send-inventory-alert', jobData);
```

#### Sending Sales Reports Through Queue

```typescript
import { EmailPayload, EmailQueueData } from '@repo/dto';

const salesReportPayload: EmailPayload = {
  message: 'Daily sales report for management',
  options: {
    to: ['owner@pos.example.com', 'manager@pos.example.com'],
    subject: 'Daily Sales Report - January 15, 2024',
    template: 'daily-report',
    context: {
      date: '2024-01-15',
      totalSales: 1250.00,
      transactionCount: 45,
      topProducts: ['Coffee Beans', 'Milk', 'Sugar'],
      averageOrderValue: 27.78
    },
    priority: 'medium',
    category: 'REPORT',
    isHtml: true
  }
};

const jobData: EmailQueueData = {
  jobId: 'sales-report-2024-01-15',
  payload: salesReportPayload
};

await emailQueue.add('send-sales-report', jobData);
```

### Type Definitions

#### Base Types

```typescript
type MessagePriority = 'low' | 'medium' | 'high';
type MessageCategory = 'CUSTOMER' | 'INVENTORY' | 'SALES' | 'SYSTEM' | 'REPORT' | 'SECURITY' | 'BACKUP';

interface BaseMessageOptions {
  priority?: MessagePriority;
  category?: MessageCategory;
  disableNotification?: boolean;
}

interface BaseMessagePayload {
  message: string;
  options?: BaseMessageOptions;
}
```

#### Email Types

```typescript
interface EmailOptions extends BaseMessageOptions {
  to: string | string[];
  subject: string;
  cc?: string | string[];
  bcc?: string | string[];
  template?: string;
  context?: Record<string, any>;
  isHtml?: boolean;
  isMarkdown?: boolean;
}

interface EmailPayload extends BaseMessagePayload {
  options: EmailOptions;
}
```

#### Telegram Types

```typescript
interface TelegramOptions extends BaseMessageOptions {
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  recipientId?: string;
  replyToMessageId?: number;
}

interface TelegramPayload extends BaseMessagePayload {
  options: TelegramOptions;
}
```

#### POS Entity Types

```typescript
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  category: string;
  stockQuantity: number;
  reorderLevel: number;
  tenantId: string;
}

interface Sale {
  id: string;
  customerId?: string;
  items: SaleItem[];
  total: number;
  tax: number;
  discount: number;
  finalTotal: number;
  paymentMethod: string;
  cashierId: string;
  tenantId: string;
  createdAt: Date;
}

interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  tenantId: string;
}
```

### Queue Configuration

```typescript
interface QueueConfig {
  name: string;
  prefix?: string;
  defaultJobOptions?: {
    attempts?: number;
    backoff?: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete?: boolean | number;
    removeOnFail?: boolean | number;
  };
}

interface WorkerConfig extends QueueConfig {
  concurrency?: number;
  limiter?: {
    max: number;
    duration: number;
  };
}
```

## POS-Specific Message Categories

### Customer Communications
- **Receipts**: Purchase confirmations with itemized details
- **Order Confirmations**: Order status updates
- **Welcome Emails**: New customer onboarding
- **Promotional Messages**: Special offers and discounts

### Inventory Management
- **Low Stock Alerts**: Notifications when products are running low
- **Out of Stock**: Immediate alerts for zero inventory
- **Restock Confirmations**: Supplier order confirmations
- **Inventory Reports**: Daily/weekly inventory summaries

### Sales & Revenue
- **Daily Sales Reports**: End-of-day summaries for management
- **Weekly/Monthly Reports**: Period-based analytics
- **Revenue Alerts**: Milestone achievements
- **Top Products**: Best-selling items analysis

### System Operations
- **Backup Status**: Database backup confirmations
- **System Health**: Performance and uptime monitoring
- **Error Alerts**: Critical system issues
- **Maintenance Notifications**: Scheduled maintenance updates

## Best Practices

1. **Job IDs**: Always provide unique job IDs to prevent duplicate processing
2. **Error Handling**: Handle both queue errors and processing errors
3. **Retries**: Configure appropriate retry strategies for different message types
4. **Monitoring**: Use the response types to track message delivery status
5. **Cleanup**: Configure `removeOnComplete` and `removeOnFail` based on your needs
6. **POS Context**: Include relevant POS information in message contexts
7. **Tenant Isolation**: Ensure all DTOs include tenant information for multi-tenant support

## Contributing

This is a private package. Please follow the monorepo's contribution guidelines.

## License

Private - All rights reserved. 