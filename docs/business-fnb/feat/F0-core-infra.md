# [Feature] F0: Core Infrastructure

## Goal

Thiết lập nền tảng kỹ thuật vững chắc cho toàn bộ hệ thống POS F&B, bao gồm hạ tầng Database, chuẩn hóa API, hệ thống Real-time messaging qua WebSocket và cơ chế lưu trữ File. Feature này đảm bảo hệ thống có khả năng mở rộng (Scalability), độ trễ thấp và đồng bộ dữ liệu tức thì giữa các thành phần.

---

## Tại sao cần Feature này?

```
┌────────────────────────────────────────────────────────────────┐
│              VẤN ĐỀ KHÔNG CÓ FEATURE                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ❌ Problem 1: Dữ liệu phân mảnh, không đồng bộ                │
│     - Thiếu chuẩn database dẫn đến xung đột dữ liệu            │
│     - Không có real-time, nhân viên phải refresh thủ công      │
│                                                                │
│  ❌ Problem 2: Khó mở rộng trong tương lai                     │
│     - Cấu trúc API lỏng lẻo, khó tích hợp thêm module mới      │
│     - Hiệu năng thấp khi số lượng store & user tăng cao        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│               GIẢI PHÁP: CORE INFRASTRUCTURE (F0)               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ✅ Solution 1: Stack công nghệ hiện đại (NestJS, PostgreSQL)  │
│  ✅ Solution 2: Socket.io cho trải nghiệm Real-time hoàn hảo    │
│  ✅ Solution 3: Cloud Storage S3 để quản lý tài nguyên file     │
│  ✅ Solution 4: Quy chuẩn API RESTful & Swagger Documentation   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Scope

- **Bao gồm:**
  - Setup Dự án (NestJS Monorepo structure)
  - Cấu hình Database (PostgreSQL 14+) & Prisma ORM
  - Cấu hình Caching (Redis) cho Session và Menu
  - Triển khai Real-time server với Socket.io
  - Cấu hình File Storage (S3-compatible: MinIO/R2)
  - Middleware chuẩn: Logging, Error Handling, Store Context
  - API Documentation (Swagger)

- **Không bao gồm:**
  - Cài đặt CI/CD pipeline chi tiết (DevOps module)
  - Cân bằng tải (Load Balancing) đa khu vực
  - Hệ thống Search nâng cao (Elasticsearch) → Phase 2

---

## Technical Stack

```typescript
interface CoreInfrastructure {
  backend: 'NestJS (Node.js framework)';
  orm: 'Prisma with PostgreSQL';
  cache: 'Redis (BullQueue for background tasks)';
  realtime: 'Socket.IO (Namespaces: /tables, /kds)';
  storage: 'AWS S3 or Cloudflare R2';
  docs: 'Swagger / OpenAPI 3.0';
}
```

---

## Common Data Models (Base)

```prisma
// Base Entity Pattern
abstract model BaseEntity {
  id              String   @id @default(uuid())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime? // For soft-delete
}
```

---

## API Endpoints (System)

| Method | Endpoint         | Mô tả                      | Auth   |
| ------ | ---------------- | -------------------------- | ------ |
| GET    | `/api/v1/health` | Kiểm tra sức khỏe hệ thống | Public |
| GET    | `/api/v1/status` | Kiểm tra kết nối DB/Redis  | Public |

---

## Acceptance Criteria

- [ ] AC1: Project khởi tạo thành công, các module nền tảng được tách bạch.
- [ ] AC2: Prisma Client kết nối thành công tới PostgreSQL, Migration hoạt động tốt.
- [ ] AC3: Redis kết nối ổn định, hỗ trợ cache dữ liệu menu/tables.
- [ ] AC4: WebSocket server sẵn sàng nhận kết nối từ nhiều client đồng thời.
- [ ] AC5: File upload thành công lên S3 và sinh URL truy cập.
- [ ] AC6: Swagger UI hiển thị đầy đủ doc cho các API đã viết.

---

## Labels

`infra` `core` `foundation` `sprint-0` `backend`
