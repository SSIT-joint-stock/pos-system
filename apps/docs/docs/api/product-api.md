# Product API Routes
---

> Tất cả endpoints dưới đây yêu cầu **Authorization: Bearer &lt;accessToken&gt;** (đã login) và `Content-Type: application/json` cho các request có body.  
> Base path giả định: `/api/v1/products`.

---

## 1. Tạo sản phẩm
---
### 1.1. Mô tả
| **Thuộc tính** | **Giá trị** |
|---|---|
| Request URL | `/api/v1/products` |
| Request Method | `POST` |
| Request Header | `Content-Type: application/json`, `Authorization: Bearer <token>` |
| Body data | JSON |

**JSON Schema**
```json
{
  "tenantId": "string(24-hex ObjectId)",
  "name": "string",
  "sku": "string",
  "categoryId": "string(24-hex ObjectId)",
  "basePrice": 0,
  "description": "string|null",
  "barcode": "string|null",
  "baseCost": 0,
  "trackInventory": true,
  "isActive": true,
  "imageUrl": "https://example.com/img.png",
  "tags": ["string", "string"]
}
```

### 1.2. Dữ liệu đầu vào
| Trường | Kiểu | Bắt buộc | Ràng buộc |
|---|---|---|---|
| tenantId | string | ✓ | ObjectId 24 ký tự hex |
| name | string | ✓ | `trim()`, không rỗng |
| sku | string | ✓ | `trim()`, không rỗng (duy nhất trong 1 tenant) |
| categoryId | string | ✓ | ObjectId 24 ký tự hex |
| basePrice | number | ✓ | số hữu hạn, `>= 0` |
| description | string | ✗ | có thể `null` |
| barcode | string | ✗ | có thể `null` |
| baseCost | number | ✗ | số hữu hạn, `>= 0` |
| trackInventory | boolean | ✗ | mặc định `true` |
| isActive | boolean | ✗ | mặc định `true` |
| imageUrl | string | ✗ | URL hợp lệ |
| tags | string[] | ✗ | mảng chuỗi (tối đa **50** tag, mỗi tag `trim().min(1)`) |

### 1.3. Dữ liệu đầu ra
**Success (201)**
```json
{
  "success": true,
  "meta": {
    "timestamp": "date",
    "version": "v1"
  },
  "data": {
    "product": {
      "id": "string",
      "tenantId": "string",
      "name": "string",
      "description": null,
      "sku": "string",
      "barcode": null,
      "categoryId": "string",
      "basePrice": 0,
      "baseCost": null,
      "trackInventory": true,
      "isActive": true,
      "imageUrl": null,
      "tags": [],
      "createdAt": "date",
      "updatedAt": "date"
    }
  },
  "message": "Create product successful"
}
```

**Error (400/409)**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "statusCode": 400,
    "message": "SKU không hợp lệ hoặc thiếu dữ liệu bắt buộc"
  },
  "meta": {
    "timestamp": "date",
    "version": "v1"
  }
}
```

---

## 2. Cập nhật sản phẩm
---
### 2.1. Mô tả
| **Thuộc tính** | **Giá trị** |
|---|---|
| Request URL | `/api/v1/products/:id` |
| Request Method | `PATCH` |
| Request Header | `Content-Type: application/json`, `Authorization: Bearer <token>` |
| Body data | JSON (partial) |

**JSON Schema** (tất cả trường **tùy chọn**, cùng ràng buộc như tạo mới)
```json
{
  "tenantId": "string(24-hex ObjectId)",
  "name": "string",
  "sku": "string",
  "categoryId": "string(24-hex ObjectId)",
  "basePrice": 0,
  "description": "string|null",
  "barcode": "string|null",
  "baseCost": 0,
  "trackInventory": true,
  "isActive": true,
  "imageUrl": "https://...",
  "tags": ["string"]
}
```

### 2.2. Dữ liệu đầu ra
**Success (200)**
```json
{
  "success": true,
  "meta": {
    "timestamp": "date",
    "version": "v1"
  },
  "data": {
    "product": {
      "id": "string",
      "tenantId": "string",
      "name": "string",
      "description": null,
      "sku": "string",
      "barcode": null,
      "categoryId": "string",
      "basePrice": 0,
      "baseCost": null,
      "trackInventory": true,
      "isActive": true,
      "imageUrl": null,
      "tags": [],
      "createdAt": "date",
      "updatedAt": "date"
    }
  },
  "message": "Update product successful"
}
```

**Error (400/404)**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "statusCode": 400,
    "message": "Dữ liệu không hợp lệ"
  },
  "meta": {
    "timestamp": "date",
    "version": "v1"
  }
}
```

---

## 3. Xóa sản phẩm
---
### 3.1. Mô tả
| **Thuộc tính** | **Giá trị** |
|---|---|
| Request URL | `/api/v1/products/:id` |
| Request Method | `DELETE` |
| Request Header | `Authorization: Bearer <token>` |

### 3.2. Dữ liệu đầu ra
**Success (200)**
```json
{
  "success": true,
  "meta": {
    "timestamp": "date",
    "version": "v1"
  },
  "data": null,
  "message": "Delete product successful"
}
```

**Error (404)**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "statusCode": 400,
    "message": "Product not found"
  },
  "meta": {
    "timestamp": "date",
    "version": "v1"
  }
}
```

---

## 4. Lấy chi tiết sản phẩm
---
### 4.1. Mô tả
| **Thuộc tính** | **Giá trị** |
|---|---|
| Request URL | `/api/v1/products/:id` |
| Request Method | `GET` |
| Request Header | `Authorization: Bearer <token>` |

### 4.2. Dữ liệu đầu ra
**Success (200)**
```json
{
  "success": true,
  "meta": {
    "timestamp": "date",
    "version": "v1"
  },
  "data": {
    "product": {
      "id": "string",
      "tenantId": "string",
      "name": "string",
      "description": null,
      "sku": "string",
      "barcode": null,
      "categoryId": "string",
      "basePrice": 0,
      "baseCost": null,
      "trackInventory": true,
      "isActive": true,
      "imageUrl": null,
      "tags": [],
      "createdAt": "date",
      "updatedAt": "date"
    }
  },
  "message": "Get product successful"
}
```

**Error (404)**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "statusCode": 400,
    "message": "Product not found"
  },
  "meta": {
    "timestamp": "date",
    "version": "v1"
  }
}
```

---

## 5. Lấy danh sách sản phẩm
---
### 5.1. Mô tả
| **Thuộc tính** | **Giá trị** |
|---|---|
| Request URL | `/api/v1/products` |
| Request Method | `GET` |
| Request Header | `Authorization: Bearer <token>` |

> Hiện tại API trả **toàn bộ** danh sách (chưa có query/pagination/filter). Có thể mở rộng sau.

### 5.2. Dữ liệu đầu ra
**Success (200)**
```json
{
  "success": true,
  "meta": {
    "timestamp": "date",
    "version": "v1"
  },
  "data": {
    "products": [
      {
        "id": "string",
        "tenantId": "string",
        "name": "string",
        "description": null,
        "sku": "string",
        "barcode": null,
        "categoryId": "string",
        "basePrice": 0,
        "baseCost": null,
        "trackInventory": true,
        "isActive": true,
        "imageUrl": null,
        "tags": [],
        "createdAt": "date",
        "updatedAt": "date"
      }
    ]
  },
  "message": "Get all products successful"
}
```

---

## 6. Quy tắc validate & lỗi thường gặp
- `tenantId`, `categoryId` phải là **ObjectId 24 ký tự hex**. Sai định dạng → 400: `"ObjectId không hợp lệ (yêu cầu 24 ký tự hex)"`.
- `basePrice`, `baseCost` là số hữu hạn, không âm.
- `imageUrl` phải là URL hợp lệ.
- `tags` là mảng tối đa **50** phần tử, mỗi phần tử là chuỗi không rỗng.
- Trong cùng một `tenantId`, `sku` không được trùng (nếu trùng → 409/400: `"Product with SKU \"...\" already exists in this tenant"`).
- Tất cả endpoints yêu cầu **Bearer token** hợp lệ.

---

### Ghi chú triển khai
- Response format tuân theo `ApiResponse.success(...)` / `BadRequestError(...)`.
- Các thông báo `message` thực tế trong hệ thống:
  - **Create**: `"Create product successful"`
  - **Update**: `"Update product successful"`
  - **Delete**: `"Delete product successful"`
  - **Get one**: `"Get product successful"`
  - **Get all**: `"Get all products successful"`