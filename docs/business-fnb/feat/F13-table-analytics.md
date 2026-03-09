# [Feature] F13: Table Analytics (Optimization)

## Goal

Chuyên sâu vào phân tích hiệu quả sử dụng tài nguyên bàn ăn. Feature này đo lường tần suất quay vòng bàn (Turnover rate), thời gian trung bình khách ngồi (Average Meal Time) và hiệu suất theo từng vị trí (Location). Mục tiêu là giúp nhà hàng tối ưu hóa bố trí sơ đồ bàn để tăng doanh thu tối đa.

---

## Key KPIs

- **Table Occupancy %**: Thời gian bàn có khách / Tổng thời gian mở cửa.
- **Average Ticket Size**: Doanh thu trung bình trên mỗi bàn.
- **Favorite Locations**: Khu vực nào khách thích ngồi nhất (Khu VIP, Ngoài trời...).
- **Staff Performance per Table**: Nhân viên nào phục vụ bàn nhanh/hiệu quả nhất.

---

## Acceptance Criteria

- [ ] AC1: Report hiển thị biểu đồ nhiệt (Heatmap) về tần suất sử dụng các bàn.
- [ ] AC2: Tính toán chính xác thời gian ăn trung bình của khách (từ lúc Open -> Paid).
- [ ] AC3: Phân tích được doanh thu theo từng Khu vực (Category Location).

---

## Labels

`analytics` `optimization` `sprint-4`
