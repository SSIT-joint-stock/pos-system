# API Structure & Standards

## Tổng quan

Hệ thống POS sử dụng RESTful API với chuẩn JSON, tuân theo các quy tắc thiết kế API nhất quán và developer-friendly.

## API Design Principles

### 1. RESTful Design
- Sử dụng HTTP methods đúng nghĩa: GET, POST, PUT, DELETE, PATCH
- Resource-oriented URLs
- Stateless architecture
- Cacheable responses

### 2. Multi-tenant Support
- Tenant isolation qua subdomain routing
- Tenant ID được truyền qua X-Tenant-ID header
- Resource scoping tự động theo tenant

## URL Structure & Path Rules

### Base URL Pattern
```
https://{tenant-subdomain}.{domain}/api/v{version}/{resource}
```

### Subdomain-based Tenant Routing
```typescript
// Retail tenant
https://retail.domain.com/api/v1/products
https://retail.domain.com/pos

// Restaurant tenant  
https://restaurant.domain.com/api/v1/menu-items
https://restaurant.domain.com/pos

// Pharmacy tenant
https://pharmacy.domain.com/api/v1/medicines
https://pharmacy.domain.com/pos

// Each subdomain maps to a specific tenant automatically
```

### Path Conventions
```typescript
// Base patterns (no tenant in URL - determined by subdomain)
GET    /api/v1/products           // List resources
GET    /api/v1/products/{id}      // Get single resource
POST   /api/v1/products           // Create resource
PUT    /api/v1/products/{id}      // Update (replace) resource
PATCH  /api/v1/products/{id}      // Update (partial) resource
DELETE /api/v1/products/{id}      // Delete resource

// Nested resources
GET    /api/v1/products/{id}/inventory
GET    /api/v1/customers/{id}/orders

// Actions/Operations
POST   /api/v1/sales/{id}/refund
POST   /api/v1/inventory/{id}/adjust
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
```

### URL Naming Rules
- **Lowercase**: Sử dụng lowercase cho tất cả URLs
- **Kebab-case**: Dùng dấu gạch ngang cho multi-word resources
- **Plural nouns**: Resources dùng danh từ số nhiều (`products`, `customers`)
- **No trailing slash**: Không có `/` cuối URL
- **Versioning**: Version ở đầu path (`/v1/`, `/v2/`)

```typescript
// ✅ Good
GET /api/v1/product-categories
GET /api/v1/sales-reports
POST /api/v1/password-reset

// ❌ Bad  
GET /api/v1/ProductCategories
GET /api/v1/sales_reports/
POST /api/v1/passwordReset
```

## HTTP Methods & Status Codes

### Method Usage
```typescript
// GET - Retrieve resources (idempotent, cacheable)
GET /api/v1/products?category=electronics&page=1

// POST - Create resources, non-idempotent operations
POST /api/v1/products
POST /api/v1/auth/login

// PUT - Replace entire resource (idempotent)
PUT /api/v1/products/123

// PATCH - Partial update (idempotent)
PATCH /api/v1/products/123

// DELETE - Remove resource (idempotent)
DELETE /api/v1/products/123
```

### Standard Status Codes
```typescript
// Success responses
200 OK              // Successful GET, PUT, PATCH
201 Created         // Successful POST
204 No Content      // Successful DELETE, or PUT with no response body

// Client error responses  
400 Bad Request     // Invalid request data
401 Unauthorized    // Authentication required
403 Forbidden       // Access denied
404 Not Found       // Resource not found
409 Conflict        // Resource conflict (duplicate)
422 Unprocessable   // Validation errors

// Server error responses
500 Internal Error  // Server error
503 Service Unavailable // Temporary unavailability
```

## Response Format Standards

### Success Response Structure
```typescript
// Single resource response
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "iPhone 15",
    "price": 999.99,
    "category": "electronics",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v1"
  }
}

// List response with pagination
{
  "success": true,
  "data": [
    {
      "id": "prod_123",
      "name": "iPhone 15",
      "price": 999.99
    },
    {
      "id": "prod_124", 
      "name": "Samsung Galaxy",
      "price": 899.99
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v1"
  }
}

// Operation result response
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "prod_125",
    "name": "New Product"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v1"
  }
}
```

### Error Response Structure
```typescript
// Validation error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required",
        "code": "REQUIRED"
      },
      {
        "field": "price",
        "message": "Price must be greater than 0",
        "code": "MIN_VALUE"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v1",
    "requestId": "req_abc123"
  }
}

// Business logic error response
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Not enough inventory for this product",
    "details": {
      "productId": "prod_123",
      "requested": 10,
      "available": 5
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v1",
    "requestId": "req_abc123"
  }
}

// Authentication error response
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v1"
  }
}
```

## Pagination Standards

### Query Parameters
```typescript
// Standard pagination params
GET /api/v1/products?page=1&limit=20&sortBy=name&sortOrder=asc

// Filtering and search
GET /api/v1/products?category=electronics&search=iphone&minPrice=500

// Date range filtering
GET /api/v1/sales?startDate=2024-01-01&endDate=2024-01-31
```

### Pagination Response Format
```typescript
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,           // Current page (1-based)
    "limit": 20,         // Items per page
    "total": 156,        // Total items count
    "totalPages": 8,     // Total pages count
    "hasNext": true,     // Has next page
    "hasPrev": false,    // Has previous page
    "nextPage": 2,       // Next page number (if hasNext)
    "prevPage": null     // Previous page number (if hasPrev)
  }
}
```

### Pagination Rules
- **Default limit**: 20 items per page
- **Maximum limit**: 100 items per page
- **Page numbering**: 1-based (page=1 for first page)
- **Total count**: Always include total count for UI
- **Tenant isolation**: Automatic via subdomain routing

## Query Parameters Standards

### Filtering Parameters
```typescript
// Exact match
GET /api/v1/products?category=electronics&status=active

// Range filtering
GET /api/v1/products?minPrice=100&maxPrice=1000
GET /api/v1/sales?startDate=2024-01-01&endDate=2024-01-31

// Array/Multiple values
GET /api/v1/products?categories=electronics,clothing&brands=apple,samsung

// Boolean filtering  
GET /api/v1/products?inStock=true&featured=false
```

### Search Parameters
```typescript
// Text search
GET /api/v1/products?search=iphone
GET /api/v1/customers?q=john+doe

// Field-specific search
GET /api/v1/products?name=iphone&description=phone
```

### Sorting Parameters
```typescript
// Single field sorting
GET /api/v1/products?sortBy=name&sortOrder=asc
GET /api/v1/products?sortBy=price&sortOrder=desc

// Multiple field sorting
GET /api/v1/products?sort=category:asc,price:desc,name:asc
```

## Request/Response Headers

### Required Headers
```typescript
// Request headers
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {jwt_token}",
  "X-Tenant-ID": "tenant_123",
  "X-Request-ID": "req_abc123",
  "User-Agent": "POS-App/1.0.0"
}

// Response headers
{
  "Content-Type": "application/json",
  "X-Request-ID": "req_abc123",
  "X-Rate-Limit-Remaining": "95",
  "X-Rate-Limit-Reset": "1642678800",
  "Cache-Control": "no-cache"
}
```

## API Versioning Strategy

### URL Versioning
```typescript
// Version in URL path (recommended)
GET /api/v1/products
GET /api/v2/products

// Subdomain determines tenant automatically
https://retail.domain.com/api/v1/products
https://restaurant.domain.com/api/v1/menu-items

// Version lifecycle
v1 -> Current stable version
v2 -> New version with breaking changes  
v1 -> Deprecated after v2 stable (6 months)
v1 -> Sunset after deprecation period (12 months)
```

### Backward Compatibility Rules
- **Additive changes**: Adding fields, endpoints is compatible
- **Breaking changes**: Removing fields, changing types requires new version
- **Deprecation notice**: 6 months advance notice for deprecation
- **Migration guide**: Provide clear migration documentation

## Error Handling Standards

### Error Code Categories
```typescript
// 4xx Client Errors
400 BAD_REQUEST         // Invalid request format
401 UNAUTHORIZED        // Authentication required
403 FORBIDDEN          // Access denied
404 NOT_FOUND          // Resource not found
409 CONFLICT           // Resource conflict
422 VALIDATION_ERROR   // Input validation failed
429 RATE_LIMITED       // Too many requests

// 5xx Server Errors  
500 INTERNAL_ERROR     // Server error
502 BAD_GATEWAY        // Upstream error
503 SERVICE_UNAVAILABLE // Maintenance mode
504 GATEWAY_TIMEOUT    // Upstream timeout
```

### Error Response Examples
```typescript
// Field validation error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email", 
        "message": "Invalid email format",
        "code": "INVALID_FORMAT",
        "value": "invalid-email"
      }
    ]
  }
}

// Business rule error
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_INVENTORY",
    "message": "Not enough stock available",
    "details": {
      "productId": "prod_123",
      "requested": 10,
      "available": 3
    }
  }
}

// Rate limiting error
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED", 
    "message": "Too many requests",
    "details": {
      "retryAfter": 60,
      "limit": 100,
      "window": "1h"
    }
  }
}
```

## Authentication & Security

### Authentication Methods
```typescript
// JWT Bearer Token (recommended)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// API Key (for service-to-service)
X-API-Key: ak_1234567890abcdef

// Session-based (for web apps)
Cookie: session_id=sess_abc123
```

### Security Headers
```typescript
// Request security headers
{
  "X-Tenant-ID": "tenant_123",           // Tenant identification
  "X-Request-ID": "req_abc123",          // Request tracing
  "X-Forwarded-For": "192.168.1.1",     // Client IP
  "User-Agent": "POS-App/1.0.0"         // Client identification
}

// Response security headers
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY", 
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000"
}
```

## API Documentation Standards

### OpenAPI Specification
- Use OpenAPI 3.0+ for API documentation
- Include examples for all endpoints
- Document all error responses
- Provide schema definitions

### Documentation Requirements
- **Endpoint description**: Clear purpose and usage
- **Parameters**: All query params, headers, body schema
- **Responses**: Success and error response examples
- **Authentication**: Required auth methods
- **Rate limits**: Request limits and throttling
- **SDKs**: Client libraries in major languages