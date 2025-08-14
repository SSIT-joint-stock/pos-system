# @repo/telegram

A powerful Telegram messaging service for POS system notifications, alerts, and customer communications.

## Features

- 📱 Send messages to Telegram channels or users for POS notifications
- 🎨 Support for HTML, Markdown, and MarkdownV2 formatting
- 🔔 Priority-based notifications for inventory alerts, sales reports, and system status
- 📝 Message categorization for different POS events
- ✅ Connection verification
- 📊 Comprehensive logging with @repo/utils

## Installation

Since this is a private package in a monorepo, make sure you have access to the repository and the dependencies are properly set up.

```bash
# From your project root
npm install @repo/telegram
```

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
TELEGRAM_BOT_TOKEN=       # Your Telegram bot token from @BotFather
TELEGRAM_RECIPIENT_ID=    # Channel ID or User ID to send messages to
```

## Basic Usage

### Initialize the Service

```typescript
import { TelegramService } from '@repo/telegram';

// Using default configuration from environment variables
const telegram = new TelegramService();

// Or with custom configuration
const telegram = new TelegramService({
  botToken: 'your-bot-token',
  recipientId: 'your-channel-id',
  defaultParseMode: 'HTML'
});

// Launch the bot (optional, only needed if you want to receive updates)
await telegram.launch();
```

### Send POS System Notifications

```typescript
// Low stock alert
await telegram.sendNotification(
  'Low Stock Alert',
  {
    priority: 'high',
    category: 'INVENTORY',
    parseMode: 'HTML'
  }
);

// Daily sales report
await telegram.sendHTML(`
<b>Daily Sales Report</b>
<i>Date:</i> <code>${new Date().toLocaleDateString()}</code>
<i>Total Sales:</i> <code>$1,250.00</code>
<i>Transactions:</i> <code>45</code>
<a href="https://pos.example.com/reports">View Full Report</a>
`);

// System status update
await telegram.sendMarkdown(`
# POS System Status
**Status**: \`operational\`
**Last Backup**: \`${new Date().toISOString()}\`
**Active Users**: \`3\`
[View Dashboard](https://pos.example.com/admin)
`);
```

### Send Inventory Alerts

```typescript
// Low stock notification
await telegram.sendNotification(
  'Low Stock Alert: Product XYZ',
  {
    priority: 'high',
    category: 'INVENTORY',
    parseMode: 'HTML'
  }
);

// Out of stock notification
await telegram.sendHTML(`
<b>🚨 Out of Stock Alert</b>
<i>Product:</i> <code>Premium Coffee Beans</code>
<i>Current Stock:</i> <code>0 units</code>
<i>Last Restock:</i> <code>2024-01-15</code>
<a href="https://pos.example.com/inventory">Manage Inventory</a>
`);
```

### Send Sales Reports

```typescript
// Daily summary
await telegram.sendMarkdown(`
# 📊 Daily Sales Summary
**Date**: \`${new Date().toLocaleDateString()}\`
**Total Revenue**: \`$${dailyRevenue.toFixed(2)}\`
**Transactions**: \`${transactionCount}\`
**Top Product**: \`${topProduct}\`
**Average Order Value**: \`$${avgOrderValue.toFixed(2)}\`
`);

// Weekly report
await telegram.sendHTML(`
<b>📈 Weekly Sales Report</b>
<i>Period:</i> <code>Jan 15-21, 2024</code>
<i>Total Revenue:</i> <code>$8,750.00</code>
<i>Growth:</i> <code>+12.5%</code>
<i>Best Day:</i> <code>Saturday</code>
<a href="https://pos.example.com/reports/weekly">View Details</a>
`);
```

### Send System Alerts

```typescript
// Backup completion
await telegram.sendNotification(
  'Database backup completed successfully',
  {
    priority: 'medium',
    category: 'SYSTEM',
    parseMode: 'HTML'
  }
);

// Error alert
await telegram.sendHTML(`
<b>⚠️ System Alert</b>
<i>Type:</i> <code>Payment Gateway Error</code>
<i>Time:</i> <code>${new Date().toISOString()}</code>
<i>Status:</i> <code>Investigating</code>
<a href="https://pos.example.com/admin/status">Check Status</a>
`);
```

## API Reference

### TelegramService

#### Constructor Options

```typescript
interface TelegramConfig {
  botToken: string;         // Telegram bot token
  recipientId: string;      // Default recipient (channel/user)
  defaultParseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}
```

#### Methods

##### `sendMessage(message: string, options?: MessageOptions): Promise<TelegramResponse>`

```typescript
interface MessageOptions {
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disableNotification?: boolean;
  replyToMessageId?: number;
  extra?: Partial<ExtraReplyMessage>;
}

interface TelegramResponse {
  success: boolean;
  messageId?: number;
  error?: Error;
}
```

##### `sendNotification(message: string, options?: NotificationOptions): Promise<TelegramResponse>`

```typescript
interface NotificationOptions extends MessageOptions {
  priority?: 'low' | 'medium' | 'high';
  category?: 'INVENTORY' | 'SALES' | 'SYSTEM' | 'SECURITY' | 'BACKUP';
}
```

##### `sendMarkdown(message: string): Promise<TelegramResponse>`
Sends a message with Markdown formatting.

##### `sendHTML(message: string): Promise<TelegramResponse>`
Sends a message with HTML formatting.

##### `verifyConnection(): Promise<boolean>`
Verifies the connection to Telegram.

##### `launch(): Promise<void>`
Launches the bot (required for receiving updates).

##### `stop(reason?: string): void`
Stops the bot gracefully.

## POS-Specific Message Categories

### Inventory Management
- **Low Stock Alerts**: Notify when products are running low
- **Out of Stock**: Immediate alerts for zero inventory
- **Restock Reminders**: Scheduled reminders for reordering
- **Inventory Reports**: Daily/weekly inventory summaries

### Sales & Revenue
- **Daily Sales Reports**: End-of-day summaries
- **Weekly/Monthly Reports**: Period-based analytics
- **Top Products**: Best-selling items
- **Revenue Alerts**: Milestone achievements

### System Operations
- **Backup Status**: Database backup confirmations
- **System Health**: Performance and uptime monitoring
- **Error Alerts**: Critical system issues
- **Maintenance Notifications**: Scheduled maintenance updates

### Security & Access
- **Login Alerts**: Unusual login attempts
- **Permission Changes**: User role modifications
- **Data Export**: Large data export notifications
- **Security Events**: Suspicious activities

## Error Handling

```typescript
try {
  const result = await telegram.sendMessage('Test message');
  
  if (!result.success) {
    console.error('Failed to send message:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## Best Practices

1. **Environment Variables**: Always use environment variables for sensitive information like bot tokens.
2. **Error Handling**: Always check the `success` property of `TelegramResponse`.
3. **Message Formatting**: Use appropriate parse mode for your content (HTML/Markdown).
4. **Notifications**: Use priorities appropriately:
   - `high`: Critical alerts requiring immediate attention (out of stock, system errors)
   - `medium`: Regular updates (daily reports, backup confirmations)
   - `low`: Non-critical information (general updates)
5. **Categories**: Use consistent categories for better message organization in POS context.
6. **Rate Limiting**: Respect Telegram's rate limits for high-volume notifications.

## Contributing

This is a private package. Please follow the monorepo's contribution guidelines.

## License

Private - All rights reserved. 