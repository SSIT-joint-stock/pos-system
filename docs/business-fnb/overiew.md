# Tài liệu Tổng quan Dự án - F&B Module POS System

> **Version:** 2.0  
> **Ngày cập nhật:** 06/03/2026  
> **Nguồn:** Feature Breakdown & Dependencies v2.0 (BA Backlog)

---

## 1. Tổng quan Dự án (Project Overview)

### 1.1 Mục tiêu

Xây dựng hệ thống quản lý **Nhà hàng/Quán ăn (F&B)** tích hợp với **POS System**, cho phép:

- Quản lý bàn, menu, đơn hàng trong nhà hàng/quán ăn
- Khách hàng đặt món qua **QR Code Menu** trên điện thoại (F23 - Phase 2)
- Nhân viên bếp xem các món cần chuẩn bị qua **Kitchen Display System (KDS)**
- Quản lý thanh toán, hoàn trả, doanh thu hàng ngày
- Phân tích dữ liệu bàn, món ăn, khách hàng qua Dashboard

### 1.2 Giá trị cốt lõi

- **Hiệu suất phục vụ:** Giảm thời gian lấy order, tăng tốc độ phục vụ
- **Độ chính xác:** Đơn hàng digital > đơn hàng giấy (giảm sai sót)
- **Dữ liệu thời gian thực:** Quản lý real-time doanh thu, khách, món ăn
- **Linh hoạt & Mở rộng:** Hỗ trợ multiple nhà hàng, nhân viên
- **Trải nghiệm khách:** QR menu, đặt món nhanh, thanh toán dễ dàng

### 1.3 Phạm vi MVP (Giai đoạn 1 - Sprint 0-6)

Bao gồm 23 features, chia thành 7 nhóm chính:

1. **Foundation (F0-F2):** Infrastructure, Auth, Config
2. **Core (F3-F5):** Table, Menu, Store Config
3. **Order Processing (F6-F8):** Order, Payment, Receipt
4. **Operations (F9-F11):** Kitchen Display, Status, Modifications
5. **Analytics (F12-F14):** Daily Stats, Table Analytics, Reports
6. **Frontend (F15-F19):** Terminal UI, Table UI, Dashboard
7. **Advanced (F20-F23):** AI, Loyalty, Multi-location, QR Menu

---

## 2. Đối tượng Người dùng (User Personas)

### 2.1 Chủ/Quản lý Nhà hàng (Owner/Manager)

- **Mô tả:** Chủ hoặc quản lý cửa hàng F&B
- **Hành động chính:**
  - Cấu hình thông tin nhà hàng (giờ mở, bàn, menu, giá)
  - Quản lý nhân viên (invite, phân quyền)
  - Duyệt báo cáo doanh thu, phân tích bàn
  - Export báo cáo Excel/PDF
  - Cấu hình máy in, cơ chế thanh toán

### 2.2 Nhân viên POS (Staff/Cashier)

- **Mô tả:** Nhân viên bán hàng, thu ngân, phục vụ
- **Hành động chính:**
  - Tạo đơn hàng qua Terminal POS (F15)
  - Chọn bàn → thêm món từ menu
  - Xử lý thanh toán (tiền mặt, thẻ, ví)
  - Xem trạng thái bàn real-time
  - Ghi chú, hoàn trả, thay đổi đơn hàng

### 2.3 Nhân viên Bếp (Kitchen Staff)

- **Mô tả:** Đầu bếp, phụ bếp
- **Hành động chính:**
  - Xem danh sách món cần chuẩn bị trên KDS (F9)
  - Đánh dấu "Đang làm" → "Làm xong"
  - Sắp xếp theo ưu tiên (thông thường/gấp)
  - Theo dõi thời gian chuẩn bị

### 2.4 Khách hàng (Customer - Phase 2)

- **Mô tả:** Khách hàng nhà hàng
- **Hành động chính (QR Menu F23):**
  - Quét mã QR trên bàn
  - Duyệt menu trên điện thoại
  - Thêm món vào giỏ hàng
  - Gửi order (không cần login)
  - Xem trạng thái order
  - Thanh toán tại bàn hoặc online

### 2.5 Admin Hệ thống (Super Admin)

- **Mô tả:** Quản trị viên cấp cao nhất
- **Hành động chính:**
  - Quản lý multiple nhà hàng
  - Cấu hình hệ thống toàn cục
  - Phân quyền cho manager/admin
  - Giám sát tất cả dữ liệu
  - Cấu hình integrasi (payment gateway, printer)

---

## 3. Danh sách Feature Chi tiết (Functional Requirements)

### 3.1 Module: Table Management (F3)

#### F3-001: Tạo/Quản lý Bàn

| Thuộc tính         | Mô tả                                                         |
| ------------------ | ------------------------------------------------------------- |
| **Mô tả**          | Quản lý danh sách bàn: tạo, sửa, xoá, thay đổi trạng thái     |
| **Luồng**          | Admin → Cấu hình bàn (code, tên, sức chứa, vị trí)            |
| **Quy tắc**        | Mã bàn unique per store (T01, T02...). Sức chứa > 0           |
| **Trạng thái bàn** | AVAILABLE (trống) / OCCUPIED (có khách) / CLEANING / RESERVED |
| **Admin quản trị** | Có (Manager có thể cấu hình)                                  |
| **Trạng thái**     | MVP                                                           |

#### F3-002: Hiển thị Trạng thái Bàn Real-time

| Thuộc tính     | Mô tả                                               |
| -------------- | --------------------------------------------------- |
| **Mô tả**      | Dashboard hiển thị grid các bàn với trạng thái live |
| **Quy tắc**    | Cập nhật real-time khi order được tạo/thanh toán    |
| **WebSocket**  | Sử dụng WebSocket để sync trạng thái                |
| **Màu sắc**    | Xanh (AVAILABLE), Đỏ (OCCUPIED), Vàng (CLEANING)    |
| **Trạng thái** | MVP                                                 |

#### F3-003: Thay đổi Trạng thái Bàn Thủ công

| Thuộc tính     | Mô tả                                                 |
| -------------- | ----------------------------------------------------- |
| **Mô tả**      | Staff có thể thay đổi status bàn (dọn dẹp, đặt trước) |
| **Quy tắc**    | Click bàn → chọn status từ dropdown                   |
| **Lịch sử**    | Lưu audit trail: ai, lúc nào, đổi từ/sang status nào  |
| **Trạng thái** | MVP                                                   |

---

### 3.2 Module: Menu Management (F4)

#### F4-001: CRUD Menu Items

| Thuộc tính         | Mô tả                                                 |
| ------------------ | ----------------------------------------------------- |
| **Mô tả**          | Quản lý danh sách món ăn: tạo, sửa, xoá, cấu hình giá |
| **Luồng**          | Admin → Thêm menu item (tên, giá, hình, danh mục)     |
| **Quy tắc**        | Tên unique per store. Giá ≥ 0. Hình ảnh tối đa 5MB    |
| **Danh mục**       | Phở, Cơm, Nước, Dessert... (quản lý bởi Admin)        |
| **Hiển thị**       | Toggle visible/hidden (không xoá vĩnh viễn)           |
| **Admin quản trị** | Có (quản lý menu CMS)                                 |
| **Trạng thái**     | MVP                                                   |

#### F4-002: Bộ lọc Danh mục Menu

| Thuộc tính     | Mô tả                                    |
| -------------- | ---------------------------------------- |
| **Mô tả**      | Filter menu items theo danh mục          |
| **Quy tắc**    | Tabs hoặc dropdown lọc (cấu hình Admin)  |
| **Tìm kiếm**   | Tìm theo tên menu, tag (bestseller, mới) |
| **Trạng thái** | MVP                                      |

#### F4-003: Tìm kiếm Menu

| Thuộc tính     | Mô tả                              |
| -------------- | ---------------------------------- |
| **Mô tả**      | Tìm kiếm nhanh menu items theo tên |
| **Quy tắc**    | Search real-time, không chỉnh tả   |
| **Trạng thái** | MVP                                |

---

### 3.3 Module: Order Creation (F6)

#### F6-001: Tạo Đơn hàng per Bàn

| Thuộc tính         | Mô tả                                                      |
| ------------------ | ---------------------------------------------------------- |
| **Mô tả**          | Tạo đơn hàng mới cho bàn cụ thể                            |
| **Luồng**          | Chọn bàn → Tạo order → Thêm items → Tính tiền → Thanh toán |
| **Quy tắc**        | Mỗi bàn chỉ 1 order PENDING tại 1 lúc                      |
| **Order code**     | Auto-generate: ORD20260304001                              |
| **Bàn status**     | Auto-change: AVAILABLE → OCCUPIED khi tạo order            |
| **Admin quản trị** | Không                                                      |
| **Trạng thái**     | MVP                                                        |

#### F6-002: Thêm Items vào Đơn hàng

| Thuộc tính     | Mô tả                                              |
| -------------- | -------------------------------------------------- |
| **Mô tả**      | Thêm các món ăn vào order                          |
| **Quy tắc**    | Quantity ≥ 1. Lưu snapshot giá tại thời điểm order |
| **Ghi chú**    | Cho phép thêm note: "Không cà chua", "Thêm hành"   |
| **Tính toán**  | Auto-calc: subtotal, tax, discount, total          |
| **Trạng thái** | MVP                                                |

#### F6-003: Chỉnh sửa/Xoá Items

| Thuộc tính     | Mô tả                                   |
| -------------- | --------------------------------------- |
| **Mô tả**      | Sửa số lượng hoặc xoá items khỏi order  |
| **Quy tắc**    | Chỉ được sửa khi order status = PENDING |
| **Lịch sử**    | Lưu modification history (audit trail)  |
| **Trạng thái** | MVP                                     |

#### F6-004: Áp dụng Giảm giá

| Thuộc tính     | Mô tả                                  |
| -------------- | -------------------------------------- |
| **Mô tả**      | Nhân viên áp dụng discount % cho order |
| **Quy tắc**    | Discount rate: 0-100%. Max: 50% (cấu)  |
| **Ghi chú**    | Lý do giảm: "Khách thân", "Khuyến mãi" |
| **Tính toán**  | Auto-recalc: new total                 |
| **Trạng thái** | MVP                                    |

#### F6-005: Hiển thị Tính toán

| Thuộc tính       | Mô tả                                   |
| ---------------- | --------------------------------------- |
| **Mô tả**        | Hiển thị chi tiết tính toán             |
| **Công thức**    | Subtotal - Discount + Tax = Total       |
| **Tax mặc định** | 10% VAT (cấu hình từ F5: Store Config)  |
| **Hiển thị**     | Realtime khi add/remove/change discount |
| **Trạng thái**   | MVP                                     |

---

### 3.4 Module: Order Payment (F7)

#### F7-001: Xử lý Thanh toán

| Thuộc tính       | Mô tả                                             |
| ---------------- | ------------------------------------------------- |
| **Mô tả**        | Xử lý thanh toán cho đơn hàng                     |
| **Phương thức**  | CASH (tiền mặt), CARD (thẻ), BANK, DIGITAL_WALLET |
| **Quy tắc**      | amountReceived ≥ totalAmount. Auto-calc change    |
| **Order status** | PENDING → COMPLETED sau thanh toán                |
| **Bàn status**   | OCCUPIED → AVAILABLE sau thanh toán               |
| **Tính toán**    | change = amountReceived - totalAmount             |
| **Ghi chép**     | Lưu payment record (audit trail)                  |
| **Trạng thái**   | MVP                                               |

#### F7-002: In Hóa đơn (Receipt)

| Thuộc tính     | Mô tả                                                |
| -------------- | ---------------------------------------------------- |
| **Mô tả**      | Auto-generate receipt sau khi thanh toán             |
| **Format**     | Thermal printer (80mm width)                         |
| **Nội dung**   | Store info + Items + Subtotal + Tax + Total + Change |
| **In**         | Print ngay hoặc queue in sau                         |
| **Lưu trữ**    | Lưu receipt record cho audit                         |
| **Trạng thái** | MVP                                                  |

#### F7-003: Hoàn trả Tiền

| Thuộc tính        | Mô tả                                    |
| ----------------- | ---------------------------------------- |
| **Mô tả**         | Xử lý hoàn lại hàng / refund tiền        |
| **Quy tắc**       | Chọn items cần hoàn → Tính refund amount |
| **Restore stock** | Optional - restore inventory (Phase 2)   |
| **Trạng thái**    | MVP (basic refund)                       |

---

### 3.5 Module: Kitchen Display System (F9)

#### F9-001: Hiển thị Danh sách Món Cần Chuẩn bị

| Thuộc tính     | Mô tả                                                |
| -------------- | ---------------------------------------------------- |
| **Mô tả**      | KDS screen hiển thị các món pending từ các bàn       |
| **Luồng**      | Order tạo → Items gửi KDS → Kitchen xem danh sách    |
| **Thông tin**  | Table code, Item name, Quantity, Notes, Created time |
| **Sắp xếp**    | By creation time; priority (gấp/thường)              |
| **Trạng thái** | MVP                                                  |

#### F9-002: Đánh dấu Món Đã Chuẩn bị

| Thuộc tính       | Mô tả                                         |
| ---------------- | --------------------------------------------- |
| **Mô tả**        | Kitchen đánh dấu item "Đã chuẩn bị" → Phục vụ |
| **Status flow**  | PENDING → PREPARING → PREPARED → SERVED       |
| **Real-time**    | Update server realtime via WebSocket          |
| **Notification** | Alert waiter khi item ready (optional)        |
| **Trạng thái**   | MVP                                           |

#### F9-003: Ưu tiên (Priority)

| Thuộc tính         | Mô tả                                   |
| ------------------ | --------------------------------------- |
| **Mô tả**          | Đánh dấu item gấp (VIP, khách đặc biệt) |
| **Hiển thị**       | Ở đầu danh sách, highlight màu vàng/đỏ  |
| **Admin quản trị** | Có (manager đặt priority)               |
| **Trạng thái**     | MVP                                     |

---

### 3.6 Module: Daily Analytics (F12)

#### F12-001: Thống kê Hôm nay

| Thuộc tính     | Mô tả                                                |
| -------------- | ---------------------------------------------------- |
| **Mô tả**      | Hiển thị tổng doanh thu, số order, items bán hôm nay |
| **Tính toán**  | Cron job tính mỗi 00:01, lưu vào DB                  |
| **Hiển thị**   | KPI cards trên dashboard (doanh thu, order count)    |
| **Cache**      | Cache 1 hour, invalidate khi có order mới            |
| **Trạng thái** | MVP                                                  |

#### F12-002: Ranking Top Products

| Thuộc tính     | Mô tả                                   |
| -------------- | --------------------------------------- |
| **Mô tả**      | Hiển thị 5-10 món bán chạy nhất hôm nay |
| **Quy tắc**    | Sắp xếp theo quantity sold giảm dần     |
| **Dùng làm**   | Menu optimization, promotion planning   |
| **Trạng thái** | MVP                                     |

#### F12-003: Thống kê Tuần/Tháng

| Thuộc tính     | Mô tả                                                |
| -------------- | ---------------------------------------------------- |
| **Mô tả**      | So sánh doanh thu tuần/tháng này vs tuần/tháng trước |
| **Biểu đồ**    | Line chart hiển thị trend doanh thu theo ngày        |
| **Trend**      | Tính % tăng/giảm, so sánh YoY (year-over-year)       |
| **Trạng thái** | MVP                                                  |

---

### 3.7 Module: Table Analytics (F13)

#### F13-001: Hiệu suất Từng Bàn

| Thuộc tính     | Mô tả                                           |
| -------------- | ----------------------------------------------- |
| **Mô tả**      | Thống kê doanh thu, số khách, lần order mỗi bàn |
| **Metrics**    | Orders count, Total revenue, Avg order value    |
| **Sắp xếp**    | By revenue hoặc orders count giảm dần           |
| **Dùng làm**   | Xác định bàn "hot", tối ưu bố trí nhà hàng      |
| **Trạng thái** | MVP                                             |

#### F13-002: Tỷ lệ Sử dụng Bàn

| Thuộc tính     | Mô tả                                                |
| -------------- | ---------------------------------------------------- |
| **Mô tả**      | % thời gian bàn OCCUPIED vs tổng thời gian hoạt động |
| **Công thức**  | (Tổng thời OCCUPIED / Hoạt động) × 100%              |
| **Mục tiêu**   | Giúp nhà hàng optimize bố trí bàn                    |
| **Trạng thái** | MVP                                                  |

---

### 3.8 Module: QR Code Menu (F23 - Phase 2)

#### F23-001: Tạo Mã QR per Bàn

| Thuộc tính         | Mô tả                                           |
| ------------------ | ----------------------------------------------- |
| **Mô tả**          | Generate QR code cho mỗi bàn                    |
| **QR data**        | URL encode: menu.restaurant.com/table/T01/store |
| **Print**          | In trên thermal printer, dán trên bàn           |
| **Admin quản trị** | Có (batch generate, reprint)                    |
| **Trạng thái**     | Phase 2 (Sprint 6)                              |

#### F23-002: Mobile Menu Web App

| Thuộc tính       | Mô tả                                            |
| ---------------- | ------------------------------------------------ |
| **Mô tả**        | Khách quét QR → Xem menu trên điện thoại         |
| **Responsive**   | Mobile-first, hoạt động trên iOS/Android         |
| **Features**     | Browse categories, Search, Add to cart, Checkout |
| **No login**     | Guest ordering, không cần tài khoản              |
| **Cart persist** | Giỏ hàng lưu 30 phút (session storage)           |
| **Trạng thái**   | Phase 2 (Sprint 6)                               |

#### F23-003: Đặt Hàng qua Mobile

| Thuộc tính       | Mô tả                                     |
| ---------------- | ----------------------------------------- |
| **Mô tả**        | Khách submit order từ điện thoại qua QR   |
| **Sync**         | Order auto-sync với POS, thêm vào KDS     |
| **Notification** | Kitchen & waiter nhận thông báo order mới |
| **Analytics**    | Track QR orders vs terminal orders        |
| **Trạng thái**   | Phase 2 (Sprint 6)                        |

---

## 4. Phân quyền RBAC (Admin Roles)

### 4.1 Ma trận Phân quyền

| Role              | Mô tả            | Quyền chính                       | Quản lý Menu | Quản lý Bàn | Xem Analytics | Giới hạn              |
| ----------------- | ---------------- | --------------------------------- | ------------ | ----------- | ------------- | --------------------- |
| **Super Admin**   | Quản trị toàn bộ | Tất cả quyền                      | Có           | Có          | Có            | Không                 |
| **Manager**       | Quản lý cửa hàng | CRUD menu, bàn, order, analytics  | Có           | Có          | Có            | Không thể xoá manager |
| **Staff/Cashier** | Nhân viên POS    | Tạo order, thanh toán, in hóa đơn | Xem          | Xem         | Không         | Chỉ order của mình    |
| **Kitchen Staff** | Nhân viên bếp    | Xem KDS, đánh dấu prepared        | Không        | Không       | Không         | Chỉ KDS screen        |

### 4.2 Quyền Chi tiết

```
┌─────────────────────────────────────────────┐
│          RBAC PERMISSION MATRIX              │
├──────────────────┬──────┬────┬──────┬────────┤
│ Feature          │Super │Mgr │Staff │Kitchen │
├──────────────────┼──────┼────┼──────┼────────┤
│ Create Table     │ ✅   │ ✅ │ ❌   │ ❌     │
│ Edit Menu        │ ✅   │ ✅ │ ❌   │ ❌     │
│ Create Order     │ ✅   │ ✅ │ ✅   │ ❌     │
│ Process Payment  │ ✅   │ ✅ │ ✅   │ ❌     │
│ View KDS         │ ✅   │ ✅ │ ❌   │ ✅     │
│ Mark Prepared    │ ✅   │ ✅ │ ❌   │ ✅     │
│ View Analytics   │ ✅   │ ✅ │ ❌   │ ❌     │
│ Manage Users     │ ✅   │ ❌ │ ❌   │ ❌     │
│ Config System    │ ✅   │ ❌ │ ❌   │ ❌     │
└──────────────────┴──────┴────┴──────┴────────┘
```

---

## 5. Danh mục & Cấu hình (Admin Quản trị)

### 5.1 Cấu hình Nhà hàng (Store Config - F5)

- Giờ mở/đóng cửa
- % VAT (mặc định 10%)
- % Phí phục vụ (nếu có)
- Loại máy in (Thermal/Inkjet/None)
- Payment methods (CASH, CARD, DIGITAL_WALLET)
- Enable features (KDS, QR Menu, Loyalty - Phase 2)

### 5.2 Danh mục Menu (mặc định)

- Phở
- Cơm
- Nước uống
- Dessert
- Khác

### 5.3 Tag Menu (ví dụ)

- Bestseller
- New (Mới)
- Promo (Khuyến mãi)
- Vegetarian
- Spicy

### 5.4 Loại Bàn (Location Categories)

- Khu A (Mái che)
- Khu B (Ngoài trời)
- Phòng riêng
- Bar counter

---

## 6. Tích hợp API & Deep Link

### 6.1 Internal APIs

| ID      | Hạng mục           | Mô tả                             | Authenticate  |
| ------- | ------------------ | --------------------------------- | ------------- |
| API-001 | Order Management   | CRUD orders, status changes       | JWT (Staff+)  |
| API-002 | Menu Management    | Get menu items, categories        | JWT (Admin+)  |
| API-003 | Table Status       | Get/update table status real-time | JWT (Staff+)  |
| API-004 | Payment Processing | Process payment, create receipt   | JWT (Staff+)  |
| API-005 | KDS Display        | Get pending items, mark prepared  | JWT (Kitchen) |
| API-006 | Analytics          | Daily/weekly stats, top products  | JWT (Admin+)  |
| API-007 | QR Menu (Public)   | Get menu, create QR order         | None (Public) |

### 6.2 External Integrations

| ID     | Loại            | Mô tả                       | Ghi chú              |
| ------ | --------------- | --------------------------- | -------------------- |
| INT-01 | Payment Gateway | Stripe, Momo, ZaloPay       | Phase 2              |
| INT-02 | Printer Driver  | Thermal printer integration | Windows/Linux driver |
| INT-03 | Google Maps     | Direction/location lookup   | Optional             |
| INT-04 | Email Service   | Gửi receipt via email       | Phase 2              |

### 6.3 WebSocket Channels

| ID     | Channel                 | Mô tả                                   |
| ------ | ----------------------- | --------------------------------------- |
| WS-001 | `/stores/:id/tables`    | Real-time table status updates          |
| WS-002 | `/stores/:id/orders`    | Real-time order updates                 |
| WS-003 | `/stores/:id/kds`       | Real-time KDS items (for kitchen staff) |
| WS-004 | `/stores/:id/payments`  | Real-time payment confirmations         |
| WS-005 | `/stores/:id/analytics` | Real-time dashboard metrics (Phase 2)   |

---

## 7. Điều kiện Nghiệm thu (Acceptance Criteria)

### 7.1 Module: Table Management (F3)

- [ ] AC1: Tạo/sửa/xoá bàn hoạt động đúng
- [ ] AC2: Mã bàn unique per store
- [ ] AC3: Trạng thái bàn hiển thị real-time
- [ ] AC4: Dashboard grid hiển thị 50+ bàn smooth
- [ ] AC5: WebSocket sync <500ms latency
- [ ] AC6: Lịch sử thay đổi status lưu đầy đủ

### 7.2 Module: Menu Management (F4)

- [ ] AC1: CRUD menu items hoạt động
- [ ] AC2: Hiển thị menu <1 sec
- [ ] AC3: Lọc/tìm kiếm menu <500ms
- [ ] AC4: Giá & mô tả hiển thị chính xác
- [ ] AC5: Hình ảnh load đúng trên mobile & desktop
- [ ] AC6: Toggle visible/hidden không xoá dữ liệu

### 7.3 Module: Order Management (F6-F8)

- [ ] AC1: Tạo order → Thêm items → Thanh toán hoạt động end-to-end
- [ ] AC2: Tính toán (subtotal, tax, discount, total) chính xác
- [ ] AC3: Order code auto-generate unique
- [ ] AC4: Bàn status auto-change: AVAILABLE → OCCUPIED → AVAILABLE
- [ ] AC5: Receipt in ra đúng format thermal printer
- [ ] AC6: Modification history (add/remove/change qty) lưu đầy đủ

### 7.4 Module: Kitchen Display System (F9)

- [ ] AC1: KDS screen hiển thị items pending theo time
- [ ] AC2: Click "Prepared" → item state change real-time
- [ ] AC3: Priority items hiển thị đầu danh sách
- [ ] AC4: Multiple kitchen stations nhìn thấy cùng list
- [ ] AC5: Auto-mark SERVED sau timeout (nếu config)
- [ ] AC6: Performance: <100ms render 50+ items

### 7.5 Module: Analytics (F12-F13)

- [ ] AC1: Daily stats calculate chính xác
- [ ] AC2: Top products ranking đúng
- [ ] AC3: Biểu đồ doanh thu trend hiển thị
- [ ] AC4: Table analytics (turnover, revenue) chính xác
- [ ] AC5: Report export Excel/PDF hoạt động
- [ ] AC6: Dashboard cache & update strategy hiệu quả

### 7.6 Module: QR Menu (F23)

- [ ] AC1: QR code generate & print đúng
- [ ] AC2: Mobile menu load <2 sec
- [ ] AC3: Browse menu & add to cart hoạt động
- [ ] AC4: QR order auto-sync với POS <5 sec
- [ ] AC5: Kitchen nhận order notification
- [ ] AC6: Analytics track QR orders vs terminal orders

---

## 8. Checklist Triển khai

### 8.1 Infrastructure & Setup

- [ ] PostgreSQL database setup
- [ ] Redis cache setup
- [ ] WebSocket server (Socket.IO)
- [ ] File upload service (S3/MinIO)
- [ ] Email service configuration
- [ ] Payment gateway credentials (Phase 2)

### 8.2 Backend Development

- [ ] API endpoints cho tất cả modules
- [ ] JWT authentication & RBAC
- [ ] Real-time sync (WebSocket)
- [ ] Cron jobs (daily stats, cleanup)
- [ ] Input validation & error handling
- [ ] Audit logging & history tracking
- [ ] Database migrations

### 8.3 Frontend (POS Terminal - F15)

- [ ] Dashboard layout (grid tables)
- [ ] Order creation flow (table → menu → cart → payment)
- [ ] Real-time table status updates
- [ ] Receipt printing integration
- [ ] Responsive design (desktop/tablet)
- [ ] Form validation

### 8.4 Kitchen Display (F9)

- [ ] KDS screen layout
- [ ] Real-time item list updates
- [ ] Status update buttons (PREPARING → PREPARED)
- [ ] Priority highlighting
- [ ] Sound alerts (optional)
- [ ] Responsive for kitchen displays

### 8.5 Admin Dashboard (F19)

- [ ] Menu CMS
- [ ] Table configuration
- [ ] Order management interface
- [ ] Analytics dashboard (graphs, export)
- [ ] User/staff management
- [ ] System configuration panel

### 8.6 Mobile Web (QR Menu - F23)

- [ ] QR code generator
- [ ] Mobile menu web app
- [ ] Shopping cart functionality
- [ ] Order submission
- [ ] Responsive design (mobile-first)
- [ ] Offline support (Phase 2)

### 8.7 Testing

- [ ] Unit tests (services, models)
- [ ] Integration tests (order flow, payment)
- [ ] E2E tests (complete user journeys)
- [ ] Load testing (100+ concurrent users)
- [ ] Security audit
- [ ] Performance testing

### 8.8 Tài liệu & Training

- [ ] API documentation (Swagger)
- [ ] Admin user guide
- [ ] Staff training materials
- [ ] Kitchen staff guide
- [ ] Deployment runbook
- [ ] Troubleshooting guide

---

## 9. User Stories Tham khảo

> **Nhân viên POS:**
> _"Với tư cách là nhân viên bán hàng, tôi muốn có thể nhanh chóng tạo order từ bàn → thêm món → thanh toán trong <2 phút để phục vụ khách hiệu quả."_

> **Đầu bếp:**
> _"Với tư cách là đầu bếp, tôi muốn xem danh sách các món cần chuẩn bị trên KDS screen, sắp xếp theo ưu tiên, để chuẩn bị thức ăn đúng thứ tự."_

> **Quản lý Nhà hàng:**
> _"Với tư cách là quản lý, tôi muốn xem báo cáo doanh thu hôm nay, top products, bàn nào bán chạy nhất để tối ưu kinh doanh."_

> **Khách hàng (Phase 2):**
> _"Với tư cách là khách, tôi muốn quét mã QR trên bàn → xem menu → đặt hàng qua điện thoại mà không cần gọi nhân viên."_

> **Chủ Nhà hàng:**
> _"Với tư cách là chủ nhà hàng, tôi muốn có dashboard quản lý tất cả, từ cấu hình menu, bàn, đến phân tích doanh thu theo bàn."_

---

## 10. Phụ lục

### 10.1 Định dạng Dữ liệu

| Loại          | Định dạng          | Ví dụ                |
| ------------- | ------------------ | -------------------- |
| Ngày giờ      | `dd/mm/yyyy hh:mm` | `04/03/2026 12:30`   |
| Tiền          | Số nguyên (VND)    | `150000`             |
| Số điện thoại | `0xxx.xxx.xxx`     | `0912.345.678`       |
| Order code    | `ORDYYMMDDxxxx`    | `ORD20260304001`     |
| Table code    | `Txx`              | `T01, T02, T12`      |
| Mã QR         | Base64 (PNG/SVG)   | `data:image/png;...` |

### 10.2 Giới hạn Hệ thống

| Thông số              | Giới hạn     | Ghi chú                |
| --------------------- | ------------ | ---------------------- |
| Max concurrent orders | 1000/store   | Per store              |
| Max concurrent users  | 100/store    | Staff + kitchen        |
| Max receipt size      | 10MB         | Per order              |
| Max image size        | 5MB          | Per menu item          |
| Max query results     | 1000 records | Pagination required    |
| Order retention       | 365 days     | Auto-archive or delete |
| Payment timeout       | 5 mins       | For incomplete payment |

### 10.3 Retention Policy

| Đối tượng                   | Thời gian lưu             | Ghi chú               |
| --------------------------- | ------------------------- | --------------------- |
| Order (COMPLETED)           | 365 ngày                  | Archive or delete     |
| Order (PENDING)             | 7 ngày                    | Auto-cancel nếu >7d   |
| Receipt                     | 365 ngày (hoặc vĩnh viễn) | Audit trail           |
| Payment record              | 365 ngày                  | Compliance            |
| Modification history        | 365 ngày                  | Audit                 |
| KDS history                 | 30 ngày                   | Operational data      |
| Table status history        | 90 ngày                   | Analysis              |
| Daily analytics             | Vĩnh viễn                 | Business intelligence |
| QR order tracking (Phase 2) | 365 ngày                  | Analytics             |

### 10.4 Performance Targets

| Metric              | Target    | Notes            |
| ------------------- | --------- | ---------------- |
| API response time   | <200ms    | P95 latency      |
| WebSocket latency   | <500ms    | Real-time sync   |
| Menu load time      | <1s       | Initial load     |
| Dashboard load time | <2s       | Analytics page   |
| Mobile QR load time | <2s       | F23              |
| Concurrent users    | 100/store | Load test target |
| Database query time | <100ms    | P99 latency      |

---

## 11. Risk & Mitigation

| Risk                     | Impact          | Mitigation                             |
| ------------------------ | --------------- | -------------------------------------- |
| WebSocket disconnect     | Order delay     | Auto-reconnect, message queue          |
| Payment gateway down     | Revenue loss    | Fallback to offline mode, manual entry |
| Printer not available    | No receipt      | Digital receipt (email/SMS)            |
| High concurrent users    | System crash    | Load balancing, horizontal scaling     |
| Data loss                | Business impact | Daily backups, transaction logs        |
| Kitchen didn't see order | Customer delay  | Sound alert + mobile notification      |

---

## 12. Timeline & Milestones

### Phase 1: MVP (Sprint 0-6, Weeks 1-16)

| Sprint | Features        | Milestone                |
| ------ | --------------- | ------------------------ |
| 0      | F0, F1, F2      | Foundation ready         |
| 1      | F3, F4, F5      | Core features ready      |
| 2      | F6, F7, F8      | Order flow complete      |
| 3      | F9, F10, F11    | Kitchen operations ready |
| 4      | F12, F13, F14   | Analytics ready          |
| 4-5    | F15, F16-F19    | Frontend complete        |
| 6      | Testing, Deploy | **MVP Launch** ✅        |

### Phase 2: Advanced (Sprint 7-8)

- F20: AI Order Suggestions
- F21: Loyalty Program
- F22: Multi-Location Sync
- F23: QR Code Menu

### Phase 3: Optimization (Sprint 9+)

- Performance tuning
- Advanced analytics
- Mobile app (native iOS/Android)

---

**Version:** 2.0  
**Date:** 06/03/2026  
**Status:** Ready for Development  
**Owner:** Product & Architecture Team  
**Next Review:** After Sprint 2 (Week 5)
