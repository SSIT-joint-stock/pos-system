# [Feature] F1: Authentication & Multi-Tenant Isolation

## Goal

Thiết lập hệ thống đăng nhập, phân quyền (RBAC) và cơ chế cô lập dữ liệu (Multi-Tenant) cho từng Store trong chuỗi F&B. Feature này đảm bảo mỗi cửa hàng chỉ có thể truy cập được dữ liệu của chính mình, đồng thời quản lý các vai trò nhân viên (Owner, Manager, Staff, Cashier) với các quyền hạn tương ứng trên POS.

---

## Tại sao cần Feature này?

```
┌────────────────────────────────────────────────────────────────┐
│              VẤN ĐỀ KHÔNG CÓ FEATURE                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ❌ Problem 1: Rò rỉ dữ liệu giữa các cửa hàng                │
│     - Store A thấy được doanh thu của Store B                  │
│     - Không có ranh giới bảo mật cho khách hàng Doanh nghiệp   │
│                                                                │
│  ❌ Problem 2: Không phân cấp quyền hạn nhân viên              │
│     - Nhân viên phục vụ có thể xóa Order hoặc xem báo cáo      │
│     - Nhân viên thu ngân có thể đổi giá món ăn trái phép       │
│                                                                │
│  ❌ Problem 3: Mất dấu audit trail (Lưu vết)                   │
│     - Không biết ai đã tạo đơn, ai đã sửa giá, ai hủy món      │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│               GIẢI PHÁP: AUTH & MULTI-TENANT (F1)               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ✅ Solution 1: Cô lập Store ID trong mọi query database       │
│  ✅ Solution 2: Phân quyền vai trò chi tiết (RBAC)             │
│  ✅ Solution 3: JWT Token chứa context của Store và User       │
│  ✅ Solution 4: Middleware tự động inject store_id vào API     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Scope

- **Bao gồm:**
  - Đăng ký/Đăng nhập người dùng (Email/SĐT + Password)
  - Quản lý Store (Tạo mới Store gắn với Owner)
  - Phân quyền theo vai trò: OWNER, MANAGER, STAFF, CASHIER, WAITER
  - Cơ chế Multi-tenant Isolation: Tự động filter database theo `store_id`
  - JWT Authentication (Access Token & Refresh Token)
  - Quản lý profile người dùng

- **Không bao gồm:**
  - Đăng nhập bằng Social (Google/Facebook) → Phase 2
  - SSO (Single Sign-On) cho doanh nghiệp lớn
  - Phân quyền tùy chỉnh cấp độ từng field (Attribute-based access control)

---

## Data Model

### Identity & Tenancy Schema

```prisma
model User {
  id              String   @id @default(uuid())
  store_id        String
  store           Store    @relation(fields: [store_id], references: [id])

  email           String?  @unique
  phone           String?  @unique
  password_hash   String
  name            String

  role            UserRole @default(STAFF)
  status          UserStatus @default(ACTIVE)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([store_id])
}

model Store {
  id              String   @id @default(uuid())
  owner_id        String   // Link tới User đầu tiên tạo store
  name            String
  business_type   BusinessType @default(FNB)

  users           User[]
  // Các quan hệ khác: tables, menu_items, orders...

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum UserRole {
  OWNER      // Toàn quyền Store
  MANAGER    // Quản lý vận hành
  CASHIER    // Thu ngân (thanh toán)
  STAFF      // Nhân viên tổng hợp
  WAITER     // Phục vụ (Order món)
}

enum UserStatus { ACTIVE, INACTIVE, SUSPENDED }
enum BusinessType { FNB, RETAIL }
```

---

## Multi-Tenant Isolation Logic

```typescript
/**
 * Quy tắc bảo mật dữ liệu:
 * 1. Mọi table nghiệp vụ (Order, Menu, Table...) PHẢI có cột store_id.
 * 2. Backend Middleware sẽ giải mã JWT và lấy store_id của User hiện tại.
 * 3. Repository logic tự động thêm WHERE store_id = current_store_id vào mọi truy vấn.
 */

// Ví dụ Guards trong NestJS
@Injectable()
export class StoreContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user.store_id) return false;

    // Inject store_id vào request để xử lý ở Service layer
    request.storeId = user.store_id;
    return true;
  }
}
```

---

## API Endpoints

| Method | Endpoint                | Mô tả                    | Auth    |
| ------ | ----------------------- | ------------------------ | ------- |
| POST   | `/api/v1/auth/login`    | Đăng nhập nhận JWT       | Public  |
| POST   | `/api/v1/auth/register` | Đăng ký store mới        | Public  |
| GET    | `/api/v1/auth/me`       | Thông tin user hiện tại  | Bearer  |
| POST   | `/api/v1/admin/users`   | Thêm nhân viên vào store | Manager |

---

## Acceptance Criteria

- [ ] AC1: Người dùng có thể đăng ký Store mới và trở thành OWNER.
- [ ] AC2: OWNER có thể thêm nhân viên và gán ROLE (WAITER, CASHIER...).
- [ ] AC3: Nhân viên Login chỉ thấy dữ liệu của cửa hàng mình (Table/Order/Menu của cửa hàng khác bị ẩn).
- [ ] AC4: Hệ thống từ chối truy cập nếu User cố tình gọi API của cửa hàng khác qua ID.
- [ ] AC5: Token JWT hết hạn đúng thời gian cấu hình và có thể Refresh.

---

## Labels

`auth` `security` `multi-tenant` `sprint-0` `backend`
