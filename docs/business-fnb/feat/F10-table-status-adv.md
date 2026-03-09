# [Feature] F10: Table Status Management (Advanced)

## Goal

Tối ưu hóa quy trình luân chuyển bàn (Table Turnover), tập trung vào các trạng thái chuyển tiếp như Đang dọn dẹp (CLEANING), Đã đặt trước (RESERVED) và xử lý các xung đột trạng thái bàn. Feature này giúp Waiter và Manager kiểm soát chính xác 100% tài nguyên bàn ăn, giảm thời gian chết cho mỗi bàn.

---

## Scope

- **Bao gồm:**
  - Quy trình quản lý trạng thái `CLEANING`: Waiter bấm dọn bàn -> Status đổi màu -> Bấm hoàn tất -> Status về `AVAILABLE`.
  - Hệ thống cảnh báo bàn `CLEANING` quá lâu (>10 phút).
  - Tích hợp trạng thái `RESERVED` với thời gian bắt đầu dự kiến.
  - Chức năng Dashboard theo dõi % công suất bàn (Occupancy rate) thời gian thực.
  - Tự động thay đổi trạng thái bàn sang `OCCUPIED` ngay khi khách quét QR Order thành công (F23).

- **Không bao gồm:**
  - Quy trình đặt bàn online từ Website khách (Module Reservation).

---

## Table State Machine Rules

```
AVAILABLE → RESERVED (Manual call)
RESERVED → OCCUPIED (Customer arrival / First item ordered)
OCCUPIED → CLEANING (Payment completed / Staff trigger)
CLEANING → AVAILABLE (Staff confirms done)
```

---

## Acceptance Criteria

- [ ] AC1: Hệ thống hỗ trợ thay đổi trạng thái bàn nhanh qua 1-2 click trên tablet/mobile.
- [ ] AC2: Dashboard Manager hiển thị chính xác số bàn theo từng màu trạng thái (Trắng: trống, Vàng: dọn, Đỏ: khách).
- [ ] AC3: Lịch sử TableStatusHistory ghi nhận chính xác giây/phút chuyển trạng thái để đo Performance.
- [ ] AC4: Không thể tạo Order mới cho bàn đang ở trạng thái `OUT_OF_SERVICE`.

---

## Labels

`operations` `status-tracking` `sprint-3` `backend`
