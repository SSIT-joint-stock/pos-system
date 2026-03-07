# POS Multi-Module Triển Khai - Kiến trúc Quyết Định & So Sánh

---

## Kiến trúc Quyết Định 1: Chiến Lược Cách Ly Module

```
BẮT ĐẦU: Cách kiến trúc 2 module Bán lẻ + F&B?
│
├─ PHƯƠNG ÁN A: Tách Biệt Hoàn Toàn
│  │
│  ├─ Cơ sở dữ liệu: PostgreSQL riêng cho mỗi module
│  ├─ Mã: Dịch vụ hoàn toàn độc lập
│  ├─ Triển khai: Các container Docker riêng
│  │
│  ├─ NHỮNG ĐIỂM MẠNH:
│  │  ✅ Độc lập tối đa
│  │  ✅ Mở rộng độc lập
│  │  ✅ Triển khai không cần phối hợp
│  │  ✅ Dễ mã nguồn mở 1 module
│  │
│  ├─ NHỮNG ĐIỂM YẾU:
│  │  ❌ Trùng lặp dữ liệu (User, Store, Auth)
│  │  ❌ Truy vấn liên module phức tạp
│  │  ❌ Cần giao dịch phân tán
│  │  ❌ Chi phí thiết lập ban đầu cao
│  │
│  └─ TIMELINE: 6+ tháng (lâu quá)
│
├─ PHƯƠNG ÁN B: Cơ sở Dữ liệu Chung (DB), Mã (Code) Cách Ly (ĐƯỢC KHUYẾN NGHỊ)
│  │
│  ├─ Cơ sở dữ liệu: PostgreSQL duy nhất (một cơ sở dữ liệu duy nhất)
│  ├─ Mã: Các module NestJS độc lập
│  ├─ Triển khai: Một image Docker (tạm thời)
│  │
│  ├─ NHỮNG ĐIỂM MẠNH:
│  │  ✅ User, Store, Auth chia sẻ (không trùng lặp)
│  │  ✅ Đơn giản để triển khai ban đầu
│  │  ✅ Có thể phát triển thành Phương ÁN A sau (Con đường DI CƯ)
│  │  ✅ Dễ phân tích liên module
│  │  ✅ Tất cả lợi ích của Phương ÁN C (bên dưới)
│  │
│  ├─ NHỮNG ĐIỂM YẾU:
│  │  ⚠️ Một số liên kết qua các bảng chia sẻ
│  │  ⚠️ Cả 2 module phải mở rộng cùng nhau
│  │
│  └─ TIMELINE: 4-5 tháng (NGẮN HƠN)
│
└─ PHƯƠNG ÁN C: Cơ sở Dữ liệu Chung (DB), Mã (Code) Chung
   │
   ├─ Cơ sở dữ liệu: PostgreSQL duy nhất (một cơ sở dữ liệu duy nhất)
   ├─ Mã: Cấu trúc thư mục hỗn hợp (không cách ly module)
   ├─ Triển khai: Một image Docker
   │
   ├─ NHỮNG ĐIỂM MẠNH:
   │  ✅ Triển khai nhanh nhất (ngắn hạn)
   │  ✅ Cấu trúc thư mục đơn giản
   │  ✅ Chia sẻ mã dễ dàng
   │
   ├─ NHỮNG ĐIỂM YẾU:
   │  ❌ Khó bảo trì (mã tự do)
   │  ❌ Cách ly không tốt = khó tái cấu trúc sau
   │  ❌ Ác mộng kiểm tra (khó kiểm tra riêng lẻ)
   │  ❌ Khó trích xuất module sau
   │  ❌ Nguy cơ lẫn lộn giữa các module
   │  ❌ Xem xét mã trở nên khó khăn
   │
   └─ TIMELINE: 3 tháng (nhưng lỗi kỹ thuật!)

KHUYẾN NGHỊ: ➜ PHƯƠNG ÁN B
   - Cân bằng tốt nhất giữa đơn giản + khả năng mở rộng
   - Có thể phát triển thành Phương ÁN A nếu cần
   - Hỗ trợ con đường di chuyển dần dần
   - Độ phức tạp có thể quản lý cho 2-3 modules
```

---

## Cây Quyết Định 2: Tổ Chức Lược Đồ

```
BẮT ĐẦU: Cách tổ chức Prisma schema?
│
├─ PHƯƠNG ÁN A: File Duy Nhất (Cách tiếp cận hiện tại)
│  │
│  ├─ File: prisma/schema.prisma
│  ├─ Các mô hình: TẤT CẢ entities (Bán lẻ + F&B + Chung)
│  ├─ Tổ chức: Comment phần (// === BÁN LẺ ===)
│  │
│  ├─ NHỮNG ĐIỂM MẠNH:
│  │  ✅ Nguồn sự thật duy nhất (Single source of truth)
│  │  ✅ Tất cả quan hệ có thể nhìn thấy
│  │  ✅ Di chuyển dễ dàng (1 lệnh)
│  │  ✅ Prisma UI hoạt động hoàn hảo
│  │  ✅ Được Prisma team khuyến nghị
│  │
│  ├─ NHỮNG ĐIỂM YẾU:
│  │  ⚠️ Kích thước tệp tăng (100+ mô hình = 2000-3000 dòng)
│  │  ⚠️ Khó điều hướng (nhưng dùng gấp mã)
│  │
│  └─ HOẠT ĐỘNG CHO: 2-4 modules (tối đa ~150 mô hình)
│
├─ PHƯƠNG ÁN B: Nhiều File (Prisma v4.10+) (khả năng không hoạt động)
│  │
│  ├─ File:
│  │  - prisma/base.prisma (User, Store, Auth, Asset)
│  │  - prisma/retail.prisma (Product, Variant, Order, v.v.)
│  │  - prisma/fnb.prisma (Table, Menu, FnBOrder, v.v.)
│  │
│  ├─ Thành phần: Sử dụng chỉ thị @include của Prisma
│  │
│  ├─ NHỮNG ĐIỂM MẠNH:
│  │  ✅ Tổ chức theo module
│  │  ✅ Các tệp nhỏ hơn trên mỗi module
│  │  ✅ Tách biệt rõ ràng hơn
│  │
│  ├─ NHỮNG ĐIỂM YẾU:
│  │  ❌ Thiết lập phức tạp hơn
│  │  ❌ Hỗ trợ công cụ Prisma ít hơn
│  │  ❌ Khó hơn cho nhà phát triển mới
│  │  ❌ Cần phối hợp di chuyển
│  │  ❌ Một số hạn chế với quan hệ giữa các tệp
│  │
│  └─ HOẠT ĐỘNG CHO: 4+ modules
│
└─ PHƯƠNG ÁN C: Cơ sở Dữ liệu Riêng
   │
   ├─ Thiết lập: Schema riêng cho cơ sở dữ liệu
   ├─ Phối hợp: Truy vấn giữa DB thủ công
   │
   ├─ NHỮNG ĐIỂM MẠNH:
   │  ✅ Độc lập tối đa
   │
   ├─ NHỮNG ĐIỂM YẾU:
   │  ❌ Các phép nối phức tạp cần thiết
   │  ❌ Ác mộng giao dịch phân tán
   │  ❌ Vấn đề nhất quán dữ liệu
   │  ❌ KHÔNG ĐƯỢC KHUYẾN NGHỊ cho User/Store chia sẻ
   │
   └─ HOẠT ĐỘNG CHO: Khi các module hoàn toàn tách rời

KHUYẾN NGHỊ: ➜ PHƯƠNG ÁN A
   - Giữ tệp duy nhất tạm thời
   - Chuyển sang Phương ÁN B nếu > 150 mô hình
   - Hầu hết nhà phát triển quen thuộc
   - Con đường di chuyển dễ nhất
```

---

## Cây Quyết Định 3: Thiết Kế Entity Đơn Hàng

```
BẮT ĐẦU: Cách thiết kế các entity Đơn hàng?
│
├─ CÁCH TIẾP CẬN A: Đơn hàng Riêng Biệt (ĐƯỢC KHUYẾN NGHỊ)
│  │
│  ├─ Bán lẻ: Order + OrderItem + OrderReturn
│  ├─ F&B: FnBOrder + FnBOrderItem (+ không có mô hình trả lại, dùng sửa đổi)
│  ├─ Cấu trúc:
│  │   Đơn hàng Bán lẻ:  order_id, customer_id, product_id → variant_id
│  │   Đơn hàng F&B:     order_id, table_id, menu_item_id
│  │
│  ├─ NHỮNG ĐIỂM MẠNH:
│  │  ✅ Lược Đồ khác nhau cho các nhu cầu khác nhau
│  │  ✅ Ngữ nghĩa rõ ràng (Order vs Đơn hàng dựa trên Bàn)
│  │  ✅ Tính toán khác nhau (chiết khấu vs phí phục vụ)
│  │  ✅ Dễ bảo trì
│  │  ✅ Rõ ràng trong mã (FnBOrder(...) mới)
│  │
│  ├─ NHỮNG ĐIỂM YẾU:
│  │  ⚠️ Một số trùng lặp mã (có thể dùng giao diện cơ sở)
│  │  ⚠️ Cần các dịch vụ riêng biệt
│  │
│  └─ DÒNG MÃ: ~500 thêm (đáng giá)
│
├─ CÁCH TIẾP CẬN B: Đơn hàng Chung với Bộ Phân Biệt
│  │
│  ├─ Bảng Đơn hàng duy nhất
│  ├─ Trường Loại: 'RETAIL' hoặc 'FNB'
│  ├─ Các trường tùy chọn:
│  │   - customer_id (chỉ Bán lẻ)
│  │   - table_id (chỉ F&B)
│  │   - product_id (chỉ Bán lẻ)
│  │   - menu_item_id (chỉ F&B)
│  │
│  ├─ NHỮNG ĐIỂM MẠNH:
│  │  ✅ Dịch vụ duy nhất
│  │  ✅ Phân tích thống nhất (truy vấn dễ hơn)
│  │  ✅ Theo dõi đơn hàng duy nhất
│  │
│  ├─ NHỮNG ĐIỂM YẾU:
│  │  ❌ Cột NULL (cơ sở dữ liệu lộn xộn)
│  │  ❌ Phức tạp kiểm tra loại
│  │  ❌ Các nhánh logic kinh doanh ở mọi nơi (if order.type === 'FNB'...)
│  │  ❌ Khó thêm trường riêng module sau
│  │  ❌ Nhầm lẫn cho nhà phát triển
│  │  ❌ Nguy cơ trộn lẫn loại đơn hàng
│  │
│  └─ KHÔNG ĐƯỢC KHUYẾN NGHỊ ❌
│
└─ CÁCH TIẾP CẬN C: Đơn hàng Cơ sở + Thừa Kế
   │
   ├─ BaseOrder (trừu tượng)
   ├─ RetailOrder extends BaseOrder
   ├─ FnBOrder extends BaseOrder
   │
   ├─ Khái niệm: Thừa kế đối tượng
   ├─ Thực tế DB: Vẫn cần bảng riêng biệt
   │
   ├─ NHỮNG ĐIỂM MẠNH:
   │  ✅ DRY (Không Lặp Lại Chính Mình)
   │  ✅ Logic chung trong BaseOrder
   │
   ├─ NHỮNG ĐIỂM YẾU:
   │  ❌ Prisma không hỗ trợ thừa kế OOP
   │  ❌ Sẽ cần bảng riêng dù sao
   │  ❌ Chia sẻ mã giả
   │
   └─ KHÔNG THỰC TẾ ❌

KHUYẾN NGHỊ: ➜ CÁCH TIẾP CẬN A
   - Rõ ràng, dễ bảo trì
   - Lược Đồ khác nhau cho các nhu cầu khác nhau
   - An toàn loại (không có bộ phân biệt)
   - Trùng lặp mã tối thiểu với giao diện thích hợp
```

---

## Cây Quyết Định 4: Giao Tiếp Liên Module

```
BẮT ĐẦU: Các module Bán lẻ & F&B nên giao tiếp như thế nào?
│
├─ PHƯƠNG ÁN A: Gọi Hàm Trực Tiếp (KHÔNG ĐƯỢC KHUYẾN NGHỊ)
│  │
│  ├─ Mã:
│  │   fnb/order.service → gọi → retail/inventory.service.deduct()
│  │
│  ├─ NHỮNG ĐIỂM MẠNH:
│  │  ✅ Nhanh, không chi phí
│  │  ✅ Đơn giản để triển khai
│  │
│  ├─ NHỮNG ĐIỂM YẾU:
│  │  ❌ Tạo sự phụ thuộc cứng
│  │  ❌ Không thể kiểm tra mà không có module Bán lẻ
│  │  ❌ Các phụ thuộc vòng tròn có thể
│  │  ❌ Khó tái cấu trúc sau
│  │  ❌ Thay đổi Bán lẻ phá vỡ F&B
│  │
│  └─ NGUY HIỂM: CAO ⚠️
│
├─ PHƯƠNG ÁN B: Được Điều khiển Bởi Sự kiện (ĐƯỢC KHUYẾN NGHỊ)
│  │
│  ├─ Dòng:
│  │   1. Đơn hàng F&B được tạo
│  │   2. F&B xuất bản: Sự kiện OrderCreated
│  │   3. Bán lẻ đăng ký: nếu có kho, trừ kho
│  │   4. Tài chính đăng ký: nếu thanh toán, tạo giao dịch
│  │
│  ├─ Triển khai:
│  │   - Sử dụng EventEmitter2 (NestJS)
│  │   - Hoặc Bull/RabbitMQ để không đồng bộ
│  │   - Hoặc Kafka cho khối lượng cao
│  │
│  ├─ NHỮNG ĐIỂM MẠNH:
│  │  ✅ Cách ly lỏng (các module độc lập)
│  │  ✅ Dễ kiểm tra (các sự kiện lả)
│  │  ✅ Có thể mở rộng (không đồng bộ, hàng đợi)
│  │  ✅ Tương lai (dễ thêm modules)
│  │  ✅ Có thể thêm người đăng ký bất cứ lúc nào
│  │  ✅ Bán lẻ không biết về F&B
│  │
│  ├─ NHỮNG ĐIỂM YẾU:
│  │  ⚠️ Thiết lập phức tạp hơn
│  │  ⚠️ Tính nhất quán cuối cùng (không tức thì)
│  │  ⚠️ Cần xử lý lỗi/logic retry
│  │
│  └─ NGUY HIỂM: THẤP ✅
│
└─ PHƯƠNG ÁN C: Hàng Đợi Thư (Stripe/Momo)
   │
   ├─ Thiết lập: Bull/RabbitMQ/Kafka
   ├─ Dòng: Module A → Hàng đợi → Module B (không đồng bộ)
   │
   ├─ NHỮNG ĐIỂM MẠNH:
   │  ✅ Rất có thể mở rộng
   │  ✅ Tách rời
   │  ✅ Giao hàng đáng tin cây
   │
   ├─ NHỮNG ĐIỂM YẾU:
   │  ❌ Chi phí vận hành
   │  ❌ Quá mức cho 2 modules
   │
   └─ ĐƯỢC KHUYẾN NGHỊ CHO: Sau (giai đoạn 2+), khi cần

KHUYẾN NGHỊ: ➜ PHƯƠNG ÁN B (Được Điều khiển Bởi Sự kiện)
   Ví dụ sự kiện:
   - fnborder.created → Trừ kho (nếu cửa hàng lai)
   - fnborder.paid → Tạo giao dịch tài chính
   - fnborder.completed → Cập nhật phân tích

   Lợi ích cho dự án hiện tại:
   - Mỗi module hoàn toàn độc lập
   - Có thể triển khai/kiểm tra riêng lẻ
   - Dễ thêm modules (Tài chính, Loy, v.v.)
   - Giới hạn miền rõ ràng
```

---

## Cây Quyết Định 5: Chiến Lược Kiểm Tra

```
BẮT ĐẦU: Cách tiếp cận kiểm tra cho multi-module?
│
├─ CẤP 1: Kiểm Tra Đơn Vị (Dịch vụ Riêng)
│  │
│  ├─ Tính năng: 60% của tổng số kiểm tra
│  ├─ Cấu trúc:
│  │   src/modules/fnb/table/table.service.ts
│  │   test/unit/fnb/table/table.service.spec.ts
│  │
│  ├─ Ví dụ:
│  │   ✅ tableService.createTable() trả về entity đúng
│  │   ✅ tableService.changeStatus() xác thực chuyển đổi
│  │   ✅ tableService.changeStatus() từ chối chuyển đổi không hợp lệ
│  │
│  ├─ Giả lập: Prisma, dịch vụ bên ngoài
│  ├─ Tốc độ: <1 giây mỗi kiểm tra
│  ├─ Công cụ: Jest
│  │
│  └─ Mục tiêu: >80% độ bao phủ mỗi dịch vụ
│
├─ CẤP 2: Kiểm Tra Tích Hợp (Quy Trình Công Việc)
│  │
│  ├─ Tính năng: 25% của tổng số kiểm tra
│  ├─ Cấu trúc:
│  │   test/integration/fnb/order-workflow.spec.ts
│  │
│  ├─ Ví dụ:
│  │   ✅ Tạo đơn hàng → Bàn AVAILABLE → OCCUPIED
│  │   ✅ Thêm mục → Tổng đơn hàng cập nhật đúng
│  │   ✅ Thanh toán → Thanh toán tạo → Bàn AVAILABLE
│  │   ✅ Áp dụng chiết khấu → Tổng tính toán lại
│  │
│  ├─ Cơ sở dữ liệu: Cơ sở dữ liệu kiểm tra (Postgres)
│  ├─ Tốc độ: <10 giây mỗi kiểm tra
│  ├─ Công cụ: Jest + máy khách Prisma
│  │
│  └─ Kịch bản kiểm tra: Trên mỗi tính năng (F3-F23)
│
├─ CẤP 3: Kiểm Tra E2E (Kịch Bản Hoàn Chỉnh)
│  │
│  ├─ Tính năng: 15% của tổng số kiểm tra
│  ├─ Cấu trúc:
│  │   test/e2e/fnb/create-order-to-payment.e2e.spec.ts
│  │
│  ├─ Ví dụ:
│  │   1. Tạo cửa hàng + bàn + mục menu
│  │   2. Tạo đơn hàng cho bàn
│  │   3. Thêm 3 mục với ghi chú khác nhau
│  │   4. Áp dụng chiết khấu
│  │   5. Xử lý thanh toán
│  │   6. Xác minh hoá đơn được tạo
│  │   7. Xác minh trạng thái bàn = AVAILABLE
│  │   8. Xác minh phân tích cập nhật
│  │
│  ├─ Tính năng: Yêu cầu HTTP hoàn chỉnh
│  ├─ Tốc độ: 10-30 giây mỗi kiểm tra
│  ├─ Công cụ: Jest + tiện ích NestJS kiểm tra
│  │
│  └─ Kịch bản quan trọng chỉ (không phải mọi thứ)
│
└─ CẤP 4: Kiểm Tra Tải (Hiệu Suất)
   │
   ├─ Khi: Trước khi khởi động
   ├─ Ví dụ:
   │   ✅ 100 người dùng đồng thời tạo đơn hàng
   │   ✅ 50 người dùng KDS đồng thời xem cập nhật
   │   ✅ 1000 quét QR mỗi giờ
   │
   ├─ Công cụ: k6 hoặc Artillery
   │
   └─ Mục tiêu: Thời gian phản hồi <200ms ở 100 đồng thời

CẤU TRÚC KIỂM TRA:
```

test/
├── unit/
│ ├── retail/
│ │ ├── product/
│ │ └── order/
│ └── fnb/
│ ├── table/
│ │ └── table.service.spec.ts
│ ├── order/
│ │ ├── order.service.spec.ts
│ │ └── payment.service.spec.ts
│ └── menu/
│ └── menu-item.service.spec.ts
│
├── integration/
│ ├── fnb/
│ │ ├── order-workflow.spec.ts
│ │ ├── payment-workflow.spec.ts
│ │ └── table-status-workflow.spec.ts
│ └── cross-module/
│ └── order-inventory-sync.spec.ts
│
└── e2e/
├── fnb/
│ ├── create-order-to-payment.e2e.spec.ts
│ ├── qr-menu-ordering.e2e.spec.ts
│ └── kds-workflow.e2e.spec.ts
└── retail/
└── order-to-return.e2e.spec.ts

```

KHUYẾN NGHỊ: ➜ Cách Tiếp Cận Tạo Hình
   60% Đơn vị + 25% Tích hợp + 15% E2E

   Lợi ích:
   - Phản hồi nhanh (các kiểm tra đơn vị chạy trong vài giây)
   - Đáng tin cây (các kiểm tra tích hợp bắt các vấn đề quy trình)
   - Tự tin (các kiểm tra E2E xác minh kịch bản người dùng)
   - Hiệu quả chi phí (hầu hết giá trị từ kiểm tra đơn vị)
```

---

## Bảng So Sánh: Schema Bán lẻ Vs F&B

```
╔════════════════════╦═══════════════════════════╦═══════════════════════════╗
║ Khía cạnh          ║ MODULE BÁN LẺ             ║ MODULE F&B                ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ KHOẢNG            ║                           ║                            ║
║ Entity             ║ Product → Variant         ║ MenuItem                  ║
║ Theo dõi kho       ║ VariantStock (chi tiết)   ║ Cờ đơn giản (sẵn có)      ║
║ Đơn vị             ║ Chuyển đổi (kg, hộp, v.v) ║ Đơn vị cố định (đĩa)      ║
║ Theo dõi chi phí   ║ Chi phí đơn vị (COGS)     ║ Tùy chọn (chi phí chuẩn bị)│
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ ĐƠN HÀNG           ║                           ║                           ║
║ Entity             ║ Order + OrderItem         ║ FnBOrder + FnBOrderItem   ║
║ Tham chiếu vị trí  ║ Địa chỉ khách hàng        ║ Mã bàn                    ║
║ Tham chiếu mục     ║ variant_id                ║ menu_item_id              ║
║ Số lượng           ║ Integer (đơn vị)          ║ Integer (đĩa)             ║
║ Thanh toán nhúng?  ║ Có (payment_method in)    ║ Không (FnBOrderPayment)   ║
║ Quy trình trả lại  ║ Entity OrderReturn        ║ Entity OrderModification  ║
║ Yêu cầu đặc biệt   ║ Hạn chế (siêu dữ liệu JSON)│ Phong phú (ghi chú mỗi mục)│
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ ĐỊNH GIÁ           ║                           ║                           ║
║ Giá cơ sở          ║ Variant.price             ║ FnBMenuItem.price         ║
║ Chiết khấu         ║ % trên toàn bộ đơn hàng   ║ % trên mục hoặc đơn hàng  ║
║ Phí phục vụ        ║ Không                     ║ Có (% tổng cộng)          ║
║ Tính toán thuế     ║ Bao gồm trong Order.tax   ║ Có thể cấu hình (cửa hàng)│
║ Bán vs Chi phí     ║ Được theo dõi (lợi nhuận) ║ Tùy chọn (chi phí chuẩn bị)│
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ MÔ HÌNH KHÁCH      ║                           ║                           ║
║ Entity             ║ Customer (được xác định trước)│ Guest (tạm trong phiên)│
║ Điện thoại/Email   ║ Đã lưu                    ║ Tùy chọn (đặt hàng QR)    ║
║ Lòng trung thành   ║ Điểm thưởng (cửa hàng)    ║ Chương trình lòng trung thành(tương lai)│
║ Xếp hạng/Phản hồi  ║ Đánh giá sau đặt hàng     ║ Phản hồi trong phiên      ║
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ PHÂN TÍCH          ║                           ║                           ║
║ Bảng              ║ StatisticsDaily           ║ FnBDailyStatistics        ║
║ Số liệu chính     ║ Đơn vị bán, Doanh thu     ║ Đơn hàng, Lượt bàn        ║
║ Thời gian         ║ Ảnh chụp hàng ngày        ║ Thời gian cao điểm, Thời gian ăn trung bình║
║ Tập trung kho    ║ Có (mức kho)              ║ Không (tập trung thời gian chuẩn bị)│
║ Tập trung bàn    ║ Không                     ║ Có (sử dụng, chu kỳ)      ║
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ CÁC TÍNH NĂNG ĐẶC BIỆT║                        ║                           ║
║                    ║ • Hoàn trả/Hoàn tiền     ║ • KDS (Hiển thị Bếp)      ║
║                    ║ • Biến thể/Tùy chọn      ║ • Menu QR & Đặt hàng Di động│
║                    ║ • Gói                     ║ • Gộp bàn/Tách bàn        ║
║                    ║ • Cảnh báo kho            ║ • In hoá đơn              ║
║                    ║                           ║                           ║
╚════════════════════╩═══════════════════════════╩═══════════════════════════╝
```

---

## Con Đường Di Chuyển: Từ Single Thành Multi-Module

```
┌─────────────────────────────────────────────────────────────────┐
│      CON ĐƯỜNG PHÁT TRIỂN: PHƯƠNG ÁN B → PHƯƠNG ÁN A           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ THÁNG 0-4:  Đơn-Thể (PHƯƠNG ÁN B)                              │
│ ├─ Chung: User, Store, Asset, Auth                            │
│ ├─ Bán lẻ: Product, Variant, Order, Return                    │
│ ├─ F&B: Table, Menu, FnBOrder, KDS                            │
│ ├─ Triển khai: Dịch vụ duy nhất, cơ sở dữ liệu chung          │
│ └─ Đội ngũ: 6-8 kỹ sư làm việc trên cả hai                    │
│                                                                 │
│ THÁNG 4-6: Trích xuất Module (Chuẩn bị cho Phương ÁN A)        │
│ ├─ Bước 1: Tách Dịch vụ Bán lẻ & F&B                          │
│ │   Dịch vụ Bán lẻ:  http://retail-api:3000                   │
│ │   Dịch vụ F&B:     http://fnb-api:3001                      │
│ │                                                               │
│ ├─ Bước 2: Thêm Cổng API                                      │
│ │   Cổng:  http://api.pos.local                                │
│ │   Tuyến:   /api/v1/retail/* → Dịch vụ Bán lẻ               │
│ │   Tuyến:   /api/v1/fnb/*    → Dịch vụ F&B                  │
│ │                                                               │
│ ├─ Bước 3: Triển khai Event Bus                               │
│ │   Thay thế lệnh gọi trực tiếp bằng sự kiện                 │
│ │   orderService.create() → emit(OrderCreated)                │
│ │                                                               │
│ └─ Bước 4: Tách Cơ sở Dữ liệu                                 │
│     Cơ sở dữ liệu chung:  shared_db (User, Store, Asset)      │
│     Cơ sở dữ liệu Bán lẻ:  retail_db (Product, Order, v.v.)   │
│     Cơ sở dữ liệu F&B:     fnb_db (Table, FnBOrder, v.v.)    │
│                                                                 │
│ THÁNG 6+:   Hoàn toàn Phân tán (PHƯƠNG ÁN A)                  │
│ ├─ Kiến trúc:                                                  │
│ │   ┌─────────────┐                                            │
│ │   │  Cổng API   │                                            │
│ │   └──────┬──────┘                                            │
│ │     ┌────┴─────┐                                             │
│ │     │           │                                             │
│ │  Bán lẻ      F&B       Tài chính    Lòng trung thành       │
│ │  Dịch vụ    Dịch vụ    Dịch vụ      Dịch vụ                │
│ │     │           │           │         │                      │
│ │  [DB Bán lẻ] [DB F&B] [DB Tài chính] [DB Lòng trung thành]│
│ │     └───────┬───┘           │         │                      │
│ │         [Cơ sở dữ liệu Chung]   [Event Bus / Hàng Đợi Tin Nhắn]│
│ │         (User, Store)                                        │
│ │                                                               │
│ ├─ Độc lập:                                                    │
│ │   ✅ Có thể mở rộng từng dịch vụ riêng biệt                │
│ │   ✅ Có thể triển khai độc lập                             │
│ │   ✅ Có thể sử dụng stack kỹ thuật khác nhau               │
│ │   ✅ Đội ngũ làm việc độc lập                              │
│ │                                                               │
│ └─ Khả năng Quay lại:                                          │
│    Nếu có vấn đề, di chuyển quay lại Bước 4 hoặc 3            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

NHỮNG LỢI THẾ CỦA CON ĐƯỜNG NÀY:
✅ Bắt đầu đơn giản (rủi ro thấp hơn)
✅ Xác thực F&B hoạt động với Bán lẻ
✅ Tăng độ phức tạp dần dần
✅ Đội ngũ đạt được kinh nghiệm trước khi tách
✅ Có thể quay lại ở mỗi bước
✅ Hiệu quả chi phí tăng dần
```

---

## Tham chiếu Nhanh: Quyết Định Triển khai

```
╔═════════════════════════════╦════════════════════════════════════════╗
║ QUYẾT ĐỊNH                  ║ KHUYẾN NGHỊ                            ║
╠═════════════════════════════╬════════════════════════════════════════╣
║ Cách Ly Module              ║ Phương ÁN B: Cơ sở dữ liệu Chung, Mã Cách Ly║
║ Timeline Hàm Ý             ║ 4-5 tháng (vs 6+ cho Phương ÁN A)      ║
║                             ║                                        ║
║ Tổ Chức Lược Đồ           ║ Tệp Prisma Duy Nhất (2000-3000 dòng)   ║
║ Max mô hình trước khi tách │ ~150 mô hình                           ║
║                             ║                                        ║
║ Thiết Kế Entity Đơn Hàng    ║ Riêng Biệt (Order vs FnBOrder)        ║
║ Chia sẻ Mã                 ║ Giao Diện, Không Thừa Kế              ║
║                             ║                                        ║
║ Giao Tiếp Liên Module      ║ Được Điều khiển Bởi Sự kiện (EventEmitter2)│
║ Cần Hàng Đợi Ngay?         ║ Không (EventEmitter2 đủ)               ║
║ Timeline Di chuyển Hàng Đợi│ Khi > 10k sự kiện/ngày                │
║                             ║                                        ║
║ Chiến Lược Kiểm Tra        ║ 60% Đơn vị, 25% Tích hợp, 15% E2E     ║
║ Mục tiêu Tính Năng Bao Phủ │ >80% mỗi module                        ║
║ Thời gian mỗi bộ kiểm tra   ║ Đơn vị: <1s, Tích hợp: <10s, E2E: <30s│
║                             ║                                        ║
║ Cách Tiếp Cận Di Chuyển Prisma││ Additive (thêm bảng F&B, không thay đổi)│
║ Tương thích ngược Bán lẻ    ║ 100% (không cho phép thay đổi phá vỡ)│
║ Chiến Lược Cơ Chế Tính Năng ║ Store.business_type enum              ║
║                             ║                                        ║
║ Phát triển Tương lai        ║ Có thể di chuyển tới Phương ÁN A (Cơ sở Dữ liệu Riêng)│
║ Điểm hòa vốn để chia tách   ║ 3-4 modules, 200+ bảng, > 50 dev      ║
║                             ║                                        ║
╚═════════════════════════════╩════════════════════════════════════════╝
```

---

## Danh sách Kiểm Tra Go/No-Go cho Tech Lead

```
TRƯỚC KHI TRIỂN KHAI BẮT ĐẦU:

KIẾN TRÚC
☐ Cách tiếp cận multi-module được chấp thuận (Phương ÁN B)
☐ Thiết kế lược Đồ được chấp thuận (tệp Prisma duy nhất)
☐ Giao tiếp được điều khiển sự kiện được chấp thuận
☐ Quyền sở hữu dữ liệu được xác định (ai cập nhật cái gì)
☐ Hướng phụ thuộc được xác định (không có phụ thuộc vòng tròn)

QUYẾT ĐỊNH KỸ THUẬT
☐ Chiến lược di chuyển Prisma được chấp thuận
☐ Tạo hình kiểm tra được chấp thuận
☐ Cấu trúc tổ chức mã được chấp thuận
☐ Hạn chế nhập được xác định (quy tắc eslint)
☐ Mẫu xử lý lỗi được xác định
☐ Tiêu chuẩn Ghi nhật ký được xác định
☐ Tiêu chuẩn Hợp đồng API được xác định (DTOs)

ĐỘI NG GIAN & TIMELINE
☐ Timeline thực tế cho kích thước đội
☐ Kích thước đội được phân bổ
☐ Stack công nghệ được xác nhận (NestJS, PostgreSQL, v.v.)
☐ Phụ thuộc vào các đội khác được quản lý
☐ Các trở ngại được xác định và giảm thiểu

KHỞI ĐỘNG & NGUY HIỂM
☐ Chiến lược Triển khai (các cổng tính năng được chấp thuận)
☐ Kế hoạch Quay lại được ghi lại
☐ Yêu cầu Hiệu suất được xác định
☐ Xem xét Bảo mật đã hoàn thành
☐ Chiến lược Sao lưu dữ liệu được xác nhận
☐ Thiết lập Giám sát/Cảnh báo được lên kế hoạch

TÀI LIỆU
☐ Sơ đồ Kiến trúc được xem xét
☐ Sơ đồ Lược Đồ Cơ sở Dữ liệu được xem xét
☐ Yêu cầu Tài liệu API được xác định
☐ Hướng dẫn Onboarding cho modules mới được cần
☐ Hướng dẫn Xử sự cố được tạo ra

```

---

## Ghi Chú Cho Cuộc Họp Tech Lead

**Thứ tự Trình bày Được Khuyến Nghị:**

1. **Trạng thái Hiện tại**
   - Hiển thị lược Đồ Bán lẻ
   - Hiển thị các yêu cầu tính năng F&B
   - Xác định các xung đột

2. **Các tùy chọn Kiến trúc**
   - Phương ÁN A vs B vs C
   - Khuyến nghị với lý do
   - Con đường phát triển

3. **Thiết Kế Lược Đồ**
   - Các entities Đơn hàng Riêng Biệt được hiển thị
   - Sơ đồ Quan hệ
   - So sánh với lược Đồ Bán lẻ

4. **Cách Tiếp Cận Triển Khai**
   - Cấu trúc Thư mục
   - Giới hạn Module
   - Chiến lược Kiểm tra
   - Chia tách Timeline

5. **Các Quyết Định Chính để Xác nhận**
   - Giao tiếp được điều khiển sự kiện
   - Mẫu Truy cập Dữ liệu
   - Chiến lược Di chuyển
   - Phương pháp Triển khai

6. **Rủi Ro & Giảm Thiểu**
   - 5 Rủi Ro Hàng đầu
   - Giảm Thiểu mỗi Rủi Ro
   - Kế hoạch Dự phòng

7. **Câu hỏi & Trả lời**
