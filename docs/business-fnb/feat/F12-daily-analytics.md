# [Feature] F12: Daily Analytics System

## Goal

Thiết lập hệ thống phân tích dữ liệu bán hàng hàng ngày, cung cấp cái nhìn tổng quan về doanh thu, số lượng đơn hàng, và hiệu suất của các món ăn. Feature này giúp chủ quán nắm bắt tình hình kinh doanh tức thì qua các chỉ số Key Performance Indicators (KPIs).

---

## Metric Tracked

| Metric        | Mô tả                                          |
| ------------- | ---------------------------------------------- |
| Total Revenue | Tổng doanh thu (sau Discount, trước/sau Tax)   |
| Order Count   | Tổng số đơn hoàn thành vs Đơn bị hủy           |
| Top Items     | Danh sách 10 món ăn bán chạy nhất              |
| Peak Hours    | Khung giờ có số lượng order/doanh thu cao nhất |
| Guest Count   | Tổng số khách đã phục vụ trong ngày            |

---

## Technical Approach

1. **Daily Statistics Aggregator**: Chạy Cron Job vào 00:00 hàng ngày để tổng hợp dữ liệu ngày cũ vào table `FnBDailyStatistics`.
2. **Real-time Projection**: Sử dụng Redis để lưu trữ tạm các chỉ số của ngày hiện tại (In-memory aggregation).
3. **Dashboard Manager**: Hiển thị biểu đồ (Line/Bar chart) so sánh giữa các ngày/tuần.

---

## Data Model

```prisma
model FnBDailyStatistics {
  id              String   @id @default(uuid())
  store_id        String
  stat_date       DateTime @db.Date

  revenue         Decimal  @db.Decimal(15, 2)
  order_count     Int
  cancelled_count Int
  guest_count     Int
  top_items_json  Json     // Map {item_id: quantity}

  createdAt       DateTime @default(now())

  @@unique([store_id, stat_date])
}
```

---

## Acceptance Criteria

- [ ] AC1: Dashboard hiển thị đúng doanh thu thực tế theo store_id.
- [ ] AC2: Thống kê Top món ăn hiển thị đúng số lượng đã bán.
- [ ] AC3: Hệ thống tự động tổng hợp dữ liệu ngày cũ mà không làm treo Server.
- [ ] AC4: Manager có thể xem báo cáo theo khoảng ngày tùy chọn.

---

## Labels

`analytics` `dashboard` `sprint-4` `data`
