# @repo/logger

A powerful logging package that integrates with Grafana Loki for centralized log management and visualization.

## Features

- 📊 Structured logging with multiple levels (info, warn, error, debug)
- 🔍 Automatic context enrichment
- 🎯 Service-based logging
- 📈 Grafana Loki integration
- 🔄 Multiple transport support
- 🎨 Custom log formatting
- 🏷️ Automatic labeling and metadata

## Installation

Since this is a private package in a monorepo, make sure you have access to the repository and the dependencies are properly set up.

```bash
# From your project root
pnpm add @repo/logger
```

## Basic Usage

### Initialize Logger

```typescript
import { createLogger } from '@repo/logger';

// Create a logger instance with service name
const logger = createLogger({ 
  serviceName: 'UserService'
});

// Or with additional configuration
const logger = createLogger({
  serviceName: 'UserService',
  environment: 'development',
  level: 'debug'
});
```

### Logging Messages

```typescript
// Info level logging
logger.info('User logged in successfully', {
  userId: '123',
  loginMethod: 'oauth'
});

// Error level with error object
try {
  // some code
} catch (error) {
  logger.error('Failed to process user request', {
    error,
    userId: '123',
    requestId: 'abc-123'
  });
}

// Warning level
logger.warn('Rate limit threshold reached', {
  currentRate: 95,
  threshold: 100
});

// Debug level for detailed information
logger.debug('Processing request details', {
  headers: request.headers,
  body: request.body
});
```

## Configuration

### Environment Variables

```env
# Loki Configuration (optional)
LOKI_HOST=http://localhost:7100
LOKI_USERNAME=
LOKI_PASSWORD=

# Logger Configuration
LOG_LEVEL=info              # debug, info, warn, error
NODE_ENV=development        # development, production, test
```

### Custom Configuration

```typescript
interface LoggerConfig {
  serviceName: string;
  environment?: string;
  level?: string;
  lokiConfig?: {
    host: string;
    username?: string;
    password?: string;
  };
}
```

## Integration with Grafana Loki

The logger automatically integrates with Grafana Loki when properly configured. Logs can be viewed and queried in Grafana at `http://localhost:7000`.

### Common LogQL Queries

```logql
# Filter logs by service
{service="UserService"}

# Find error logs
{service="UserService"} |= "error"

# Filter by environment
{environment="development"}

# Complex filtering
{service="UserService"} |= "error" | json | userId="123"
```

## Best Practices

1. **Structured Logging**
   ```typescript
   // Good ✅
   logger.info('User action completed', {
     action: 'checkout',
     userId: '123',
     items: 5
   });

   // Avoid ❌
   logger.info(`User ${userId} completed checkout with ${items} items`);
   ```

2. **Error Logging**
   ```typescript
   try {
     await processOrder(orderId);
   } catch (error) {
     logger.error('Order processing failed', {
       error,
       orderId,
       // Include relevant context
       orderStatus: 'pending',
       paymentId: 'xyz'
     });
   }
   ```

3. **Service Naming**
   - Use consistent service names across your application
   - Follow PascalCase for service names (e.g., 'UserService', 'PaymentProcessor')

4. **Log Levels**
   - `error`: For errors that need immediate attention
   - `warn`: For warning conditions that should be looked at
   - `info`: For general operational information
   - `debug`: For detailed debugging information

5. **Context Enrichment**
   ```typescript
   // Add consistent context across logs
   const logger = createLogger({
     serviceName: 'OrderService',
     environment: process.env.NODE_ENV,
     // Additional default context
     defaultMeta: {
       region: 'us-east',
       version: '1.0.0'
     }
   });
   ```

## Local Development Setup

1. Start Grafana and Loki using Docker Compose:
```bash
docker-compose -f docker-compose.logger.yml up -d
```

2. Access Grafana at `http://localhost:7000`
   - Default credentials are skipped (anonymous access enabled)
   - Loki data source is pre-configured

3. View logs in Grafana:
   - Go to Explore
   - Select Loki data source
   - Start querying your logs

## Monitoring and Maintenance

### Common Operations

```bash
# View Loki status
curl http://localhost:7100/ready

# Check Loki metrics
curl http://localhost:7100/metrics

# Restart logging stack
docker-compose -f docker-compose.logger.yml restart

# View container logs
docker-compose -f docker-compose.logger.yml logs -f
```

### Troubleshooting

1. **No Logs in Grafana**
   - Verify Loki is running: `curl http://localhost:7100/ready`
   - Check logger configuration
   - Verify correct log level is set

2. **Connection Issues**
   - Check if Loki container is running
   - Verify network connectivity
   - Check environment variables

## API Reference

### Logger Instance

```typescript
interface LoggerInstance {
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
}
```

### Configuration Types

```typescript
interface LoggerConfig {
  serviceName: string;
  environment?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
  defaultMeta?: Record<string, any>;
  lokiConfig?: LokiConfig;
}

interface LokiConfig {
  host: string;
  username?: string;
  password?: string;
}
```

## Contributing

This is a private package. Please follow the monorepo's contribution guidelines.

## License

Private - All rights reserved.
