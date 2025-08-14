# @repo/secure-endpoints

Secure API utilities for POS system endpoints, providing authentication, validation, and security tools for both client and server-side operations.

## Features

- 🔒 Secure endpoint protection for multi-tenant POS system
- 📝 Comprehensive logging for security events
- 🚀 Client-side token generation and management
- ⚡ Server-side token validation and decoding

## Installation

```json
{
  "dependencies": {
    "@repo/secure-endpoints": "*"
  }
}
```

## Package Structure

```
src/
├── client/           # Client-side utilities
│   ├── constants.ts  # Shared constants
│   ├── generator.ts  # Token generation logic
│   └── index.ts     # Client exports
└── server/          # Server-side utilities
    ├── decode.ts    # Token decoding & validation service
    ├── validate.ts  # Zod validation schemas
    └── index.ts     # Server exports
```

## Usage

### Client-side (Frontend Apps)

```typescript
// Import from client entry point
import { uaGenerate } from '@repo/secure-endpoints/client';

// Generate secure token for API requests
const token = uaGenerate({
  userId: 'user-123',
  tenantId: 'retail-store-1',
  permissions: ['read:products', 'write:sales'],
  timestamp: Date.now()
});

// Use in API requests
const response = await fetch('/api/v1/products', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Tenant-ID': 'retail-store-1'
  }
});
```

### Server-side (API Server)

```typescript
// Import from server entry point
import { DecodeUaService, headerValidate } from '@repo/secure-endpoints/server';

// Initialize service
const decodeService = new DecodeUaService();

// Validate request headers
const headers = headerValidate.parse({
  ua: 'token',
  rn: 'random',
  timestamp: Date.now().toString(),
  path: '/api/v1/products'
});

// Validate token
const isValid = decodeService.validateToken({
  token: headers.ua,
  date: new Date(Number(headers.timestamp)),
  random1: headers.rn.slice(0, 2),
  random2: headers.rn.slice(2, 4),
  endpoint: 'V1/PRODUCTS'
});

// Decode token data
const decodedData = decodeService.decodeToken(headers.ua);
const parsedToken = decodeService.parseDecodedToken(decodedData);
```

### POS-Specific Examples

#### Retail Store Authentication

```typescript
// Client: Generate token for cashier login
const cashierToken = uaGenerate({
  userId: 'cashier-456',
  tenantId: 'retail-store-1',
  role: 'cashier',
  permissions: ['read:products', 'write:sales', 'read:customers'],
  timestamp: Date.now()
});

// Server: Validate cashier permissions
const cashierValidation = decodeService.validateToken({
  token: cashierToken,
  date: new Date(),
  random1: 'ab',
  random2: 'cd',
  endpoint: 'V1/SALES'
});

if (cashierValidation) {
  // Allow access to sales endpoints
  const userData = decodeService.parseDecodedToken(
    decodeService.decodeToken(cashierToken)
  );
  // userData contains: { userId, tenantId, role, permissions }
}
```

#### Multi-Tenant Security

```typescript
// Client: Generate tenant-specific token
const tenantToken = uaGenerate({
  userId: 'manager-789',
  tenantId: 'retail-store-2', // Different store
  role: 'manager',
  permissions: ['read:reports', 'write:inventory', 'admin:users'],
  timestamp: Date.now()
});

// Server: Ensure tenant isolation
const tokenData = decodeService.parseDecodedToken(
  decodeService.decodeToken(tenantToken)
);

// Verify tenant access
if (tokenData.tenantId !== request.headers['X-Tenant-ID']) {
  throw new Error('Tenant access denied');
}
```

## API Reference

### Client API (`/client`)

Modules exported from `generator.ts`:
- `uaGenerate`: Generate secure tokens from payload
- Constants from `constants.ts`

### Server API (`/server`)

#### `DecodeUaService`

Main class for token processing and validation:

```typescript
interface ParsedToken {
  random1: string;    // First random string (2 chars)
  timestamp: string;  // Token creation time
  random2: string;    // Second random string (2 chars)
  endpoint: string;   // API endpoint
  date: Date;        // Timestamp as Date
  userId?: string;   // User identifier
  tenantId?: string; // Tenant identifier
  role?: string;     // User role
  permissions?: string[]; // User permissions
}

interface ValidateToken {
  token: string;     // Token to validate
  date: Date;        // Request time
  random1: string;   // Random string 1
  random2: string;   // Random string 2
  endpoint: string;  // API endpoint
}

class DecodeUaService {
  constructor(logger?: LoggerInstance);
  decodeToken(token: string): string;
  parseDecodedToken(decoded: string): ParsedToken;
  validateToken(validateToken: ValidateToken): boolean;
  transpileEndpoint(endpoint: string): string;
}
```

#### Zod Schemas

```typescript
const headerValidate = z.object({
  ua: z.string(),        // Token
  rn: z.string(),        // Random string
  timestamp: z.string(), // Request timestamp
  path: z.string(),      // Request path
});
```

## POS-Specific Security Features

### Role-Based Access Control

```typescript
// Define POS roles and permissions
const POS_ROLES = {
  OWNER: ['admin:*', 'read:*', 'write:*'],
  MANAGER: ['read:*', 'write:inventory', 'read:reports', 'write:users'],
  CASHIER: ['read:products', 'write:sales', 'read:customers'],
  INVENTORY: ['read:inventory', 'write:inventory', 'read:products']
};

// Validate role permissions
const hasPermission = (userPermissions: string[], requiredPermission: string) => {
  return userPermissions.some(permission => 
    permission === requiredPermission || 
    permission === 'admin:*' ||
    permission.endsWith(':*')
  );
};
```

### Tenant Isolation

```typescript
// Ensure data isolation between retail stores
const validateTenantAccess = (tokenData: ParsedToken, requestedTenantId: string) => {
  if (tokenData.tenantId !== requestedTenantId) {
    throw new Error('Access denied: Invalid tenant');
  }
  return true;
};
```

### Session Management

```typescript
// Track active POS sessions
const activeSessions = new Map();

const validateSession = (userId: string, sessionId: string) => {
  const session = activeSessions.get(userId);
  return session && session.id === sessionId && session.active;
};
```

## Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Development with watch mode
npm run dev

# Lint code
npm run lint

# Clean build
npm run clean
```

## Important Notes

1. **Entry Points**: This package has 2 separate entry points:
   - `/client`: For client-side use only
   - `/server`: For server-side use only

2. **Import Guidelines**: Always specify the entry point when importing:
   ```typescript
   // ✅ Correct
   import { ... } from '@repo/secure-endpoints/client';
   import { DecodeUaService } from '@repo/secure-endpoints/server';
   
   // ❌ Incorrect
   import { ... } from '@repo/secure-endpoints';
   ```

3. **Header Validation**: Always validate headers before processing tokens:
   ```typescript
   // ✅ Correct
   const headers = headerValidate.parse(request.headers);
   const decodeService = new DecodeUaService();
   const isValid = decodeService.validateToken({ ... });

   // ❌ Incorrect
   const decodeService = new DecodeUaService();
   const isValid = decodeService.validateToken({
     token: request.headers.ua, // Not validated
     ...
   });
   ```

4. **POS Security**: Implement additional POS-specific security measures:
   - Session timeout for cashier terminals
   - Audit logging for all transactions
   - Rate limiting for API endpoints
   - Encryption for sensitive data

## License

Private - POS System 