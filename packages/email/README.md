# @repo/email

A powerful email service package for POS system communications, including customer receipts, staff notifications, and business reports.

## Features

- 📧 Send emails with HTML or plain text for POS communications
- 📝 Markdown to HTML conversion for formatted reports
- 🎨 Handlebars template support for receipts and notifications
- 📎 Attachment support for invoices and reports
- 👥 CC and BCC support for multi-recipient communications
- 🔔 Notification emails for system alerts and business updates
- ✅ Connection verification
- 📊 Comprehensive logging with @repo/utils

## Installation

Since this is a private package in a monorepo, make sure you have access to the repository and the dependencies are properly set up.

```bash
# From your project root
npm install @repo/email
```

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
EMAIL_SERVICE=gmail    # Email service provider (e.g., gmail, outlook)
EMAIL_USER=           # Your email address
EMAIL_PASSWORD=       # Your email password or app-specific password
EMAIL_NOTI=          # Email address for notifications
```

## Basic Usage

### Initialize the Service

```typescript
import { EmailService } from '@repo/email';

// Using default configuration from environment variables
const emailService = new EmailService();

// Or with custom configuration
const emailService = new EmailService({
  service: 'gmail',
  user: 'your-email@gmail.com',
  password: 'your-password',
  notificationEmail: 'notifications@example.com',
  templatePath: '/path/to/templates',
  defaultFrom: 'noreply@pos.example.com'
});
```

### Send Customer Receipt

```typescript
await emailService.sendMail({
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
    storeName: 'Premium Coffee Shop',
    date: new Date().toLocaleDateString()
  }
});
```

### Send Staff Notifications

```typescript
// Low stock alert to manager
await emailService.sendMail({
  to: 'manager@pos.example.com',
  subject: 'Low Stock Alert - Premium Coffee Beans',
  html: `
    <h2>Low Stock Alert</h2>
    <p><strong>Product:</strong> Premium Coffee Beans</p>
    <p><strong>Current Stock:</strong> 5 units</p>
    <p><strong>Reorder Level:</strong> 10 units</p>
    <p><a href="https://pos.example.com/inventory">View Inventory</a></p>
  `
});

// Daily sales report
await emailService.sendMail({
  to: ['owner@pos.example.com', 'manager@pos.example.com'],
  subject: 'Daily Sales Report - January 15, 2024',
  template: 'daily-report',
  context: {
    date: '2024-01-15',
    totalSales: 1250.00,
    transactionCount: 45,
    topProducts: ['Coffee Beans', 'Milk', 'Sugar'],
    averageOrderValue: 27.78
  }
});
```

### Send Business Reports

```typescript
// Weekly inventory report
await emailService.sendMail({
  to: 'owner@pos.example.com',
  subject: 'Weekly Inventory Report',
  template: 'inventory-report',
  context: {
    week: 'Jan 15-21, 2024',
    lowStockItems: [
      { name: 'Coffee Beans', current: 5, reorder: 10 },
      { name: 'Milk', current: 8, reorder: 15 }
    ],
    outOfStockItems: ['Sugar'],
    totalValue: 2500.00
  },
  attachments: [
    {
      filename: 'inventory-report.pdf',
      path: '/path/to/inventory-report.pdf'
    }
  ]
});

// Monthly financial summary
await emailService.sendMail({
  to: 'accountant@pos.example.com',
  subject: 'Monthly Financial Summary - January 2024',
  template: 'financial-summary',
  context: {
    month: 'January 2024',
    revenue: 35000.00,
    expenses: 28000.00,
    profit: 7000.00,
    growthRate: 12.5
  }
});
```

### Send System Notifications

```typescript
// Backup completion notification
await emailService.sendNotification(
  'Database Backup Completed',
  'The daily database backup has been completed successfully at ' + new Date().toLocaleString()
);

// System maintenance notification
await emailService.sendMail({
  to: 'admin@pos.example.com',
  subject: 'System Maintenance Scheduled',
  html: `
    <h2>System Maintenance Notice</h2>
    <p><strong>Date:</strong> January 20, 2024</p>
    <p><strong>Time:</strong> 2:00 AM - 4:00 AM</p>
    <p><strong>Duration:</strong> 2 hours</p>
    <p>The POS system will be temporarily unavailable during this maintenance window.</p>
  `
});
```

### Send Customer Communications

```typescript
// Welcome email for new customers
await emailService.sendMail({
  to: 'newcustomer@example.com',
  subject: 'Welcome to Premium Coffee Shop!',
  template: 'welcome',
  context: {
    customerName: 'Jane Smith',
    storeName: 'Premium Coffee Shop',
    discountCode: 'WELCOME10',
    storeHours: '7 AM - 8 PM Daily'
  }
});

// Order confirmation
await emailService.sendMail({
  to: 'customer@example.com',
  subject: 'Order Confirmation - ORD-2024-002',
  template: 'order-confirmation',
  context: {
    orderNumber: 'ORD-2024-002',
    customerName: 'John Doe',
    items: [
      { name: 'Coffee Beans', quantity: 1, price: 15.99 },
      { name: 'Coffee Mug', quantity: 2, price: 12.99 }
    ],
    total: 41.97,
    estimatedDelivery: '2-3 business days'
  }
});
```

## API Reference

### EmailService

#### Constructor Options

```typescript
interface EmailConfig {
  service: string;         // Email service provider
  user: string;           // Email username
  password: string;       // Email password
  notificationEmail: string; // Address for notifications
  templatePath?: string;  // Path to email templates
  defaultFrom?: string;   // Default sender address
}
```

#### Methods

##### `sendMail(options: EmailOptions): Promise<EmailResponse>`

```typescript
interface EmailOptions {
  to: string | string[];      // Recipient(s)
  cc?: string | string[];     // CC recipient(s)
  bcc?: string | string[];    // BCC recipient(s)
  from?: string;              // Sender address
  subject: string;            // Email subject
  text?: string;              // Plain text or markdown content
  html?: string;              // HTML content
  template?: string;          // Template name
  context?: Record<string, any>; // Template context
  attachments?: AttachmentLike[]; // Email attachments
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: Error;
}
```

##### `sendNotification(subject: string, text: string): Promise<EmailResponse>`

Sends a notification email to the configured notification address.

##### `verifyConnection(): Promise<boolean>`

Verifies the connection to the email service.

## POS-Specific Email Templates

### Receipt Template (`receipt.hbs`)

```handlebars
<!DOCTYPE html>
<html>
<head>
    <title>Receipt - {{storeName}}</title>
</head>
<body>
    <h1>{{storeName}}</h1>
    <h2>Receipt</h2>
    <p><strong>Order Number:</strong> {{orderNumber}}</p>
    <p><strong>Date:</strong> {{date}}</p>
    <p><strong>Customer:</strong> {{customerName}}</p>
    
    <table>
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        {{#each items}}
        <tr>
            <td>{{name}}</td>
            <td>{{quantity}}</td>
            <td>${{price}}</td>
        </tr>
        {{/each}}
    </table>
    
    <p><strong>Total:</strong> ${{total}}</p>
    <p>Thank you for your purchase!</p>
</body>
</html>
```

### Daily Report Template (`daily-report.hbs`)

```handlebars
<h2>Daily Sales Report - {{date}}</h2>
<p><strong>Total Sales:</strong> ${{totalSales}}</p>
<p><strong>Transactions:</strong> {{transactionCount}}</p>
<p><strong>Average Order Value:</strong> ${{averageOrderValue}}</p>
<p><strong>Top Products:</strong></p>
<ul>
    {{#each topProducts}}
    <li>{{this}}</li>
    {{/each}}
</ul>
```

## Logging

The package uses `@repo/utils` for logging email operations. All email sending attempts, successes, and failures are automatically logged with relevant context.

## Error Handling

The package provides detailed error information through the `EmailResponse` interface:

```typescript
try {
  const result = await emailService.sendMail({
    to: 'customer@example.com',
    subject: 'Receipt',
    template: 'receipt',
    context: { /* ... */ }
  });

  if (!result.success) {
    console.error('Failed to send email:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## Best Practices

1. **Environment Variables**: Always use environment variables for sensitive information like passwords.
2. **Templates**: Use templates for consistent email formatting across your POS system.
3. **Error Handling**: Always check the `success` property of `EmailResponse`.
4. **Logging**: Monitor the logs for email sending issues.
5. **Connection Verification**: Verify the connection before sending important emails.
6. **POS Context**: Include relevant POS information in emails (store name, order numbers, etc.).
7. **Customer Privacy**: Ensure customer data is handled securely in email communications.

## Contributing

This is a private package. Please follow the monorepo's contribution guidelines.

## License

Private - All rights reserved. 