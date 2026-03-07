# [Feature] F8: Receipt & Invoice Generation

## Goal

Tự động hóa việc tạo và quản lý hóa đơn (Receipt) sau khi thanh toán. Hệ thống sinh ra bản ghi hóa đơn không thể sửa đổi (Immutable), hỗ trợ in trực tiếp ra máy in nhiệt, xuất file PDF hoặc gửi qua Email cho khách hàng. Đây là chứng từ pháp lý và kế toán quan trọng nhất của giao dịch.

---

## Scope

- **Bao gồm:**
  - Tự động sinh `FnBReceipt` ngay khi Order chuyển sang `COMPLETED`.
  - Snapshot toàn bộ dữ liệu tại thời điểm thanh toán (Giá, Tên món, Thuế, Discount).
  - Chức năng In hóa đơn (Layout chuẩn in nhiệt).
  - Xuất hóa đơn ra định dạng PDF.
  - Gửi hóa đơn điện tử qua Email (nếu khách cung cấp).
  - Quản lý số lần in (Print count) để tránh gian lận.

---

## Data Model

```prisma
model FnBReceipt {
  id              String   @id @default(uuid())
  order_id        String   @unique
  order           FnBOrder @relation(fields: [order_id], references: [id])

  receipt_number  String   @unique // VD: HD20260307-001

  // Snapshot data (Lưu Json để đảm bảo tính toàn vẹn khi Product đổi tên/giá sau này)
  store_snapshot  Json     // {name, address, hotline}
  items_snapshot  Json     // [{name, qty, price, total}]
  totals_snapshot Json     // {subtotal, tax, service_charge, discount, total}
  payment_info    Json     // {method, amount_received, change}

  print_count     Int      @default(0)
  last_printed_at DateTime?

  createdAt       DateTime @default(now())
}
```

---

## Acceptance Criteria

- [ ] AC1: Hóa đơn được tạo tự động với mã duy nhất, không trùng lặp.
- [ ] AC2: Dữ liệu hóa đơn là Snapshot, không thay đổi ngay cả khi xóa món ăn trong danh mục sau này.
- [ ] AC3: Layout in nhiệt hiển thị đầy đủ thông tin: Store name, Table, Cashier, Item list, Totals.
- [ ] AC4: Khách nhận được email hóa đơn trong vòng < 30s sau khi bấm gửi.
- [ ] AC5: Kiểm soát được số lần in để Manager quản lý thất thoát.

---

## Labels

`receipt` `finance` `sprint-2` `pdf`
