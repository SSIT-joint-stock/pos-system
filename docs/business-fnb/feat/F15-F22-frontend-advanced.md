# [Overview] Frontend Components & Advanced Features

## 1. Frontend Components (F15-F19)

Hệ thống Frontend được xây dựng theo mô hình Module-based, tập trung vào trải nghiệm mượt mà của nhân viên POS và sự trực quan cho Manager.

### F15: POS Terminal UI

- **Giao diện bán hàng chính**: Tối ưu cho màn hình Tablet/Touchscreen.
- **Tính năng**: Danh mục món bên trái, Giỏ hàng bên phải, Thanh toán nhanh.

### F16: Table Selection UI

- **Sơ đồ bàn (Floor Plan)**: Hiển thị trực quan vị trí bàn theo từng khu vực.
- **Real-time status**: Bàn đổi màu ngay khi có biến động (xanh: trống, đỏ: khách).

### F17: Order Entry UI

- **Tối ưu thao tác**: Thêm món bằng 1 lần chạm, điều chỉnh ghi chú linh hoạt.

### F18: Payment UI

- **Xử lý nhanh**: Nhập tiền khách đưa, gợi ý tiền mặt chẵn, in hóa đơn nhanh.

### F19: Manager Dashboard UI

- **Visualization**: Biểu đồ doanh thu (Chart.js/Recharts), bảng kê top món ăn bán chạy.

---

## 2. Advanced Features (F20-F22)

Các tính năng gia tăng giá trị cho hệ thống (Giai đoạn mở rộng).

### F20: AI Order Suggestions

- **Goal**: Sử dụng Machine Learning để gợi ý các món ăn kèm (Cross-sell) cho khách hàng.
- **Input**: Lịch sử đơn hàng, khung giờ, thời tiết.
- **Output**: API gợi ý món ăn phù hợp nhất.

### F21: Loyalty Program

- **Goal**: Giữ chân khách hàng qua hệ thống tích điểm và hạng thành viên.
- **Scope**: Tích điểm theo % đơn hàng, đổi voucher, ưu đãi sinh nhật.

### F23: Multi-Location Sync

- **Goal**: Quản lý chuỗi nhiều cửa hàng từ một tài khoản duy nhất.
- **Scope**: Đồng bộ Menu trung tâm, báo cáo doanh thu tổng hợp toàn chuỗi.

---

## Acceptance Criteria

- [ ] AC1: Frontend UI đáp ứng chuẩn Responsive (Mobile/Tablet/Desktop).
- [ ] AC2: AI Suggestions trả về kết quả gợi ý trong < 200ms.
- [ ] AC3: Tích điểm loyalty chính xác và có audit trail cho việc đổi điểm.
- [ ] AC4: Dữ liệu của store chi nhánh không bị lẫn vào store khác trong hệ thống Multi-location.

---

## Labels

`frontend` `ui-ux` `ai` `loyalty` `chain-management`
