# [Feature] F2: F&B Configuration Management

## Goal

Thiết lập hệ thống quản lý cấu hình đặc thù cho ngành F&B, bao gồm các tham số vận hành như thuế (Tax), phí phục vụ (Service Charge), thời gian ăn trung bình và bật/tắt các module tính năng (KDS, Dine-in, Delivery). Feature này giúp biến hệ thống POS chung thành một giải pháp chuyên biệt cho nhà hàng/quán ăn.

---

## Tại sao cần Feature này?

```
┌────────────────────────────────────────────────────────────────┐
│              VẤN ĐỀ KHÔNG CÓ FEATURE                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ❌ Problem 1: Cấu hình cứng (Hardcoded) tốn phí bảo trì      │
│     - Nhà hàng không thể tự đổi mức thuế VAT                   │
│     - Không thể điều chỉnh thời gian ước tính chuẩn bị món     │
│                                                                │
│  ❌ Problem 2: Hệ thống quá phức tạp hoặc quá đơn giản        │
│     - Quán nhỏ bị ngợp bởi các tính năng KDS, Delivery         │
│     - Nhà hàng lớn thiếu các tùy chọn cấu hình in ấn, phí      │
│                                                                │
│  ❌ Problem 3: Không quản lý được các danh mục linh hoạt       │
│     - Khó khăn khi định nghĩa khu vực bàn (Khu A, Khu B...)    │
│     - Không có chuẩn chung cho các loại phản hồi khách hàng    │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│               GIẢI PHÁP: F&B CONFIG MANAGEMENT (F2)             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ✅ Solution 1: Portal cấu hình Admin trực quan                │
│  ✅ Solution 2: Feature Flags để ON/OFF module linh hoạt       │
│  ✅ Solution 3: Quản lý Category đa năng (Location, Feedback)  │
│  ✅ Solution 4: Tùy chỉnh tài chính (Tax, Service charge)      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Scope

- **Bao gồm:**
  - Cấu hình cửa hàng (Store Config): Giờ mở/đóng cửa, ngôn ngữ, tiền tệ.
  - Cấu hình tài chính: Thuế suất (VAT), Phí phục vụ (Service charge).
  - Quản lý Feature Flags: Bật/tắt Dine-in, Takeout, KDS, Loyalty.
  - Quản lý danh mục loại hình (FnBCategory): Vị trí bàn (Location), Loại phản hồi (Feedback type).
  - Default values cho cửa hàng mới tạo.
  - Redis cache cho Config để truy xuất siêu tốc trong mọi request.

- **Không bao gồm:**
  - Cấu hình in ấn chi tiết (Printer settings) → Nằm ở Feature F5.
  - Quản lý nhiều chi nhánh (Multi-location) → Phase 3.

---

## Data Model

### Configuration Schema

```prisma
model FnBStoreConfig {
  id              String   @id @default(uuid())
  store_id        String   @unique
  store           Store    @relation(fields: [store_id], references: [id], onDelete: Cascade)

  // Operating Hours
  opening_time    String?  // VD: "08:00"
  closing_time    String?  // VD: "22:00"
  avg_meal_time   Int      @default(45) // Phút

  // Feature Flags
  enable_dine_in  Boolean  @default(true)
  enable_kds      Boolean  @default(false)
  enable_loyalty  Boolean  @default(false)

  // Financials
  tax_percentage  Float    @default(10.0) // VAT
  service_charge  Float    @default(0.0)
  currency        String   @default("VND")

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model FnBCategory {
  id              String   @id @default(uuid())
  store_id        String
  type            CategoryType
  name            String
  icon            String?
  display_order   Int      @default(0)

  @@unique([store_id, type, name])
}

enum CategoryType {
  TABLE_LOCATION  // VD: "Sân vườn", "Tầng 1"
  FEEDBACK_TYPE   // VD: "Chất lượng món", "Thái độ phục vụ"
}
```

---

## API Endpoints

| Method | Endpoint                        | Mô tả                  | Auth    |
| ------ | ------------------------------- | ---------------------- | ------- |
| GET    | `/api/v1/stores/:id/config`     | Lấy toàn bộ cấu hình   | Staff+  |
| PUT    | `/api/v1/stores/:id/config`     | Cập nhật cấu hình      | Manager |
| GET    | `/api/v1/stores/:id/categories` | Lấy danh mục theo type | Staff+  |
| POST   | `/api/v1/admin/categories`      | Thêm danh mục mới      | Manager |

---

## Acceptance Criteria

- [ ] AC1: Mỗi Store khi tạo mới tự động có bộ config mặc định (VAT 10%, Dine-in ON).
- [ ] AC2: Manager có thể thay đổi mức thuế và phí phục vụ, ảnh hưởng ngay tới các Order mới tạo.
- [ ] AC3: Nếu `enable_kds = false`, hệ thống không gửi dữ liệu tới màn hình bếp.
- [ ] AC4: Có thể tạo/xóa các vị trí bàn (Location) để gán cho Bàn ăn ở Feature F3.
- [ ] AC5: Cấu hình được lưu trong Redis và Invalidate ngay khi có thay đổi.

---

## Labels

`config` `business-logic` `sprint-1` `backend`
