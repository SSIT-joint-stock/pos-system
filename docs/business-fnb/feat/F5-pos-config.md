# [Feature] F5: Store Configuration (POS Specific)

## Goal

Cung cấp các cấu hình kỹ thuật chuyên sâu cho vận hành tại điểm bán (Point of Sale), tập trung vào thiết lập thiết bị in ấn (Printer), quy tắc đánh số hóa đơn, và các thông báo vận hành. Feature này đảm bảo hệ thống POS tương thích với hạ tầng phần cứng có sẵn của nhà hàng.

---

## Scope

- **Bao gồm:**
  - Cấu hình máy in (Printer IP, Port, Type: Thermal/Inkjet).
  - Định dạng in Receipt (Khổ giấy 58mm/80mm, số bản in).
  - Quy tắc sinh mã Order (Prefix: ORD, HD, DON...).
  - Thiết lập thông báo qua Email/SMS cho chủ quán khi có đơn lớn.
  - Cấu hình thời gian tự động hoàn thành món trên KDS (Auto-timeout).
  - Tích hợp kiểm tra kết nối máy in (Test printer connectivity).

---

## Data Model

```prisma
model FnBPOSConfig {
  id              String   @id @default(uuid())
  store_id        String   @unique
  store           Store    @relation(fields: [store_id], references: [id])

  // POS Operational Rules
  order_prefix    String   @default("ORD")
  auto_print      Boolean  @default(true)

  // Printer Hardware
  printer_type    PrinterType @default(THERMAL)
  printer_ip      String?
  printer_port    Int?      @default(9100)
  receipt_width   Int       @default(80) // mm

  // Notifications
  notify_on_large_order Boolean @default(false)
  manager_email         String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum PrinterType { THERMAL, INKJET, NONE }
```

---

## Acceptance Criteria

- [ ] AC1: Có thể cấu hình địa chỉ IP máy in và gửi lệnh in test thành công.
- [ ] AC2: Mã đơn hàng được sinh ra đúng theo prefix đã cấu hình.
- [ ] AC3: Hệ thống tự động in hóa đơn ngay sau khi thanh toán nếu `auto_print = true`.
- [ ] AC4: Lưu trữ và bảo mật thông tin cấu hình máy in cục bộ.

---

## Labels

`config` `hardware` `printer` `sprint-1`
