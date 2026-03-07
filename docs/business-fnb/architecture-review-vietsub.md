# Kiến Trúc Lược Đồ Multi-Module POS

## Chiến Lược Triển Khai

**Ngày:** 06/03/2026  
**Phiên bản:** 1.0  
**Trạng thái:** Sẵn sàng để xem xét và thảo luận

---

## Tóm Tắt Điều Hành

Chúng ta đang xây dựng một **Hệ thống POS Multi-Module** với 2 modules chính:

1. **Mô-đun POS Bán lẻ** (Hiện có) - Lược Đồ đã hoàn thiện
2. **Mô-đun POS F&B** (Mới) - Cần triển khai

**Những thách thức:**

- Lược Đồ BÁN LẺ và F&B có các entities trùng lặp (Store, User, Order, Payment, v.v.)
- Cần chia sẻ các entities cơ bản mà không xảy ra xung đột
- Mỗi module có logic kinh doanh riêng (Quản lý kho vs Quản lý bàn)
- Tránh trùng lặp lược Đồ & không nhất quán dữ liệu

**Cách tiếp cận Giải pháp:**

- **Lớp Nền Tảng Chung** - Entities cốt lõi (User, Store, Auth, Assets)
- **Lược Đồ Cụ Thể Module** - Logic kinh doanh được cách ly trên mỗi module
- **Hợp Đồng Liên Module** - Các giao diện được xác định giữa các modules

---

## Phần 1: Tổng Quan Kiến Trúc Lược Đồ

### 1.1 Phân Tích Trạng Thái Hiện Tại

#### Mô-đun POS Bán lẻ (Hiện có)

```
✅ User, Store, StoreMember (Auth & Multi-tenant)
✅ Product, Variant, Category, Tag (Kho hàng)
✅ Order, OrderItem (Bán hàng)
✅ OrderReturn, OrderReturnItem (Quản lý hoàn trả)
✅ PurchaseOrder, PurchaseOrderItem (Mua hàng)
✅ PurchaseReturn, PurchaseReturnItem (Hoàn trả của nhà cung cấp)
✅ Supplier, Customer (Liên hệ)
✅ StockMovement, VariantStock (Theo dõi kho hàng)
✅ Payment Models (Giao dịch tiền mặt, thẻ)
✅ StatisticsDaily (Phân tích)
✅ Asset, AssetLink (Quản lý tệp)
✅ Bundle, BundleItem (Combo sản phẩm)
```

#### Mô-đun POS F&B (Dự kiến - Từ Tài liệu Tính năng)

```
❌ FnBTable, TableStatusHistory (Quản lý bàn ăn)
❌ FnBMenuCategory, FnBMenuItem (Quản lý menu)
❌ FnBOrder, FnBOrderItem (Đơn hàng dựa trên bàn)
❌ FnBOrderPayment (Thanh toán cho mỗi đơn hàng)
❌ FnBReceipt (Tạo hoá đơn)
❌ KDSDisplay (Hiển thị bếp)
❌ TableQRCode, MobileMenuSession (Menu QR)
❌ FnBStoreConfig, FnBPOSConfig (Cài đặt F&B)
```

### 1.2 Phân Tích Vấn Đề: Các Entities Trùng Lặp

```
NHỮNG ĐIỂM XUNG ĐỘT:

1. Quản lý Đơn hàng:
   ├─ Bán lẻ: Order → OrderItem (order_id, product_id, variant_id)
   ├─ F&B: FnBOrder → FnBOrderItem (order_id, menu_item_id, qty, notes)
   └─ VẤN ĐỀ: Lược Đồ khác nhau, mô hình items khác nhau

2. Thanh toán:
   ├─ Bán lẻ: Không có bảng thanh toán chuyên dụng, tích hợp trong Order
   ├─ F&B: FnBOrderPayment (theo dõi thanh toán riêng)
   └─ VẤN ĐỀ: Xử lý thanh toán không nhất quán

3. Khách hàng/Liên hệ:
   ├─ Bán lẻ: Customer (được xác định trước)
   ├─ F&B: Không có mô hình khách hàng (khách đặt hàng qua QR)
   └─ VẤN ĐỀ: Các mô hình khách hàng khác nhau

4. Phân tích:
   ├─ Bán lẻ: StatisticsDaily (sản phẩm, đơn vị, doanh thu)
   ├─ F&B: FnBDailyStatistics (bàn, giờ ăn, KDS)
   └─ VẤN ĐỀ: Các mô hình phân tích riêng biệt

5. Cấu hình:
   ├─ Bán lẻ: ngầm trong Store
   ├─ F&B: FnBStoreConfig, FnBPOSConfig (rõ ràng)
   └─ VẤN ĐỀ: Các cách tiếp cận cấu hình khác nhau
```

### 1.3 Nguyên Tắc Kiến Trúc Multi-Module

```
┌──────────────────────────────────────────────────────┐
│      KIẾN TRÚC POS MULTI-MODULE                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  LAYER 1: NỀN TẢNG CHUNG                            │
│  ┌────────────────────────────────────────┐         │
│  │ • User, AdminUser (Auth)               │         │
│  │ • Store, StoreMember (Multi-tenant)    │         │
│  │ • Asset, AssetLink (Lưu trữ tệp)      │         │
│  │ • Enums (Phương pháp thanh toán, v.v) │         │
│  └────────────────────────────────────────┘         │
│                                                      │
│  LAYER 2: LƯỢC ĐỒ CỤ THỂ MODULE                    │
│  ┌──────────────────┬──────────────────────┐        │
│  │ MODULE BÁN LẺ    │    MODULE F&B        │        │
│  ├──────────────────┼──────────────────────┤        │
│  │ • Product        │ • FnBTable           │        │
│  │ • Variant        │ • FnBMenuCategory    │        │
│  │ • Category       │ • FnBMenuItem        │        │
│  │ • Order          │ • FnBOrder           │        │
│  │ • OrderItem      │ • FnBOrderItem       │        │
│  │ • Supplier       │ • FnBStoreConfig     │        │
│  │ • PurchaseOrder  │ • KDSDisplay         │        │
│  │ • Inventory      │ • TableQRCode        │        │
│  │ • StatisticsDaily│ • FnBReceipt         │        │
│  └──────────────────┴──────────────────────┘        │
│                                                      │
│  LAYER 3: TÍCH HỢP LAYER                            │
│  ┌────────────────────────────────────────┐         │
│  │ • Đồng bộ Đơn hàng (Bán lẻ ↔ F&B)    │         │
│  │ • Thanh toán Thống nhất (Sổ tiền, Tài chính) │  │
│  │ • Phân tích Liên Module                │         │
│  │ • Sự kiện Chung (Đặt hàng, v.v.)     │         │
│  └────────────────────────────────────────┘         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Phần 2: Thiết Kế Lược Đồ (Shema) Được Khuyến Nghị

### 2.1 Lớp Nền Tảng Chung (Cốt lõi)

Giữ lược Đồ bán lẻ hiện có nguyên vẹn + thêm các phần mở rộng F&B tối thiểu:

```prisma
// =====================================
// NỀN TẢNG CHUNG - KHÔNG THAY ĐỔI
// =====================================

// Auth & Multi-tenant (Đã tồn tại, tái sử dụng)
model User {
  id            String
  email         String  @unique
  role          user_role
  status        user_status
  // ... (giữ nguyên)
}

model Store {
  id            String  @id
  owner_id      String
  name          String
  business_hour String?
  // THÊM: Loại kinh doanh để phân biệt modules
  business_type BusinessType @default(RETAIL)
  // ... (giữ nguyên)
}

enum BusinessType {
  RETAIL          // Bán lẻ thuần
  F&B            // Nhà hàng/Quán cà phê
  RETAIL_F&B     // Lai (cả bán lẻ + ăn uống)
  SERVICE        // Dịch vụ (tương lai)
  PHARMACY       // Hiệu thuốc (tương lai)
}

// Assets (Giữ nguyên, chia sẻ bởi tất cả modules)
model Asset {
  id              String
  store_id        String
  // ... (đã tốt)
}

// Loại Liên hệ (Mở rộng enum)
enum contact_type {
  CUSTOMER
  SUPPLIER
  STAFF
  TABLE_CUSTOMER   // MỚI: Để theo dõi khách F&B (tùy chọn)
}
```

**Tại sao cách tiếp cận này:**

- ✅ Thay đổi tối thiểu vào mã (base code) bán lẻ (retail) hiện có
- ✅ Xác định module rõ ràng (business_type)
- ✅ Nền tảng có thể mở rộng đến các modules Service/Pharmacy
- ✅ Không cần di chuyển lược Đồ cho các cửa hàng hiện có

---

### 2.2 Lược Đồ Mô-đun Bán lẻ (Giữ Gần Như Nguyên Vẹn)

```prisma
// =====================================
// MODULE BÁN LẺ - Thay đổi tối thiểu
// =====================================

// Phân cấp Sản phẩm (Không thay đổi)
model Product {
  id              String
  store_id        String
  name            String
  sku             String
  baseUnit        String
  product_status  product_status
  // ... (giữ nguyên)
}

model Variant {
  id              String
  product_id      String
  sku             String
  barcode         String?
  name            String
  price           Int     // Giá bán lẻ
  cost            Int?    // COGS
  // ... (giữ nguyên)
}

// Quản lý Kho hàng (Không thay đổi)
model VariantStock {
  id              String
  variant_id      String
  onHand          Int
  reserved        Int?
  damaged         Int?
  // ... (giữ nguyên)
}

// Đơn hàng Bán hàng (Bán lẻ) - GIỮ NGUYÊN
model Order {
  id              String
  code            String?
  store_id        String
  customer_id     String?
  cashier_id      String

  // Số tiền
  subtotal_amount Int
  discount_amount Int
  tax_amount      Int
  total_amount    Int

  // Thanh toán (nhúng, không có bảng riêng)
  payment_method  payment_method
  customer_pay_amount Int
  change_amount   Int
  status          order_status

  // ... (giữ nguyên)
}

model OrderItem {
  id              String
  order_id        String
  variant_id      String
  product_id      String
  quantity        Int
  price           Int     // Giá đơn vị tại thời điểm đặt hàng
  total           Int
  // ... (giữ nguyên)
}

// Đơn Mua hàng (Không thay đổi)
model PurchaseOrder {
  id              String
  store_id        String
  supplier_id     String
  // ... (giữ nguyên)
}

model PurchaseOrderItem {
  id              String
  purchase_order_id String
  product_id      String
  variant_id      String
  // ... (giữ nguyên)
}

// Phân tích - Tập trung vào Bán lẻ
model StatisticsDaily {
  id              String
  store_id        String
  stat_date       DateTime

  orders_count    Int
  gross_revenue   Decimal
  units_sold      Int
  // ... (giữ nguyên)
}
```

**Thay đổi: KHÔNG CÓ** (Tương thích ngược)

---

### 2.3 Lược Đồ Mô-đun F&B (MỚI HOÀN TOÀN)

Tạo tệp Prisma schema riêng: `prisma/schemas/fnb.prisma`

```prisma
// =====================================
// MODULE F&B - HOÀN TOÀN MỚI
// =====================================

// ===== QUẢN LÝ BÀN =====

model FnBTable {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid

  code            String   // T01, T02 (duy nhất trên cửa hàng)
  name            String   // "Bàn góc cửa sổ"
  capacity        Int      // 2, 4, 6 khách
  location        String?  // "Khu A", "Ngoài trời"

  status          FnBTableStatus @default(AVAILABLE)
  customer_count  Int?
  seated_at       DateTime?
  current_order_id String?

  is_active       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Quan hệ
  orders          FnBOrder[]
  qr_code         TableQRCode?

  @@unique([store_id, code])
  @@index([store_id, status])
  @@map("fnb_table")
}

enum FnBTableStatus {
  AVAILABLE        // Có sẵn
  OCCUPIED         // Đã có khách
  CLEANING         // Đang vệ sinh
  RESERVED         // Đặt bàn
  OUT_OF_SERVICE   // Không sử dụng được
}

model TableStatusHistory {
  id              String   @id @default(uuid()) @db.Uuid
  table_id        String   @db.Uuid

  previous_status FnBTableStatus
  new_status      FnBTableStatus
  changed_by      String   @db.Uuid  // user_id
  reason          String?

  createdAt       DateTime @default(now())

  @@index([table_id, createdAt])
  @@map("table_status_history")
}

// ===== QUẢN LÝ MENU =====

model FnBMenuCategory {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid

  name            String   // "Phở", "Cơm"
  description     String?
  icon            String?
  display_order   Int      @default(0)
  is_active       Boolean  @default(true)

  menu_items      FnBMenuItem[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([store_id, name])
  @@index([store_id, display_order])
  @@map("fnb_menu_category")
}

model FnBMenuItem {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid
  category_id     String   @db.Uuid

  name            String   // "Phở Bò"
  description     String?
  sku             String?
  image_url       String?

  // Định giá
  price           Decimal  @db.Decimal(15, 2)  // Giá bán
  cost            Decimal? @db.Decimal(15, 2)  // COGS (tùy chọn, để phân tích)

  // Tính sẵn có
  is_available    Boolean  @default(true)
  quantity_limited Boolean @default(false)
  quantity_available Int?

  // Siêu dữ liệu
  preparation_time Int?    // phút cho KDS
  is_spicy        Boolean? @default(false)
  is_vegetarian   Boolean? @default(false)
  allergens       String?
  tags            String[] // "bestseller", "new"

  display_order   Int      @default(0)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Quan hệ
  order_items     FnBOrderItem[]

  @@unique([store_id, name])
  @@index([store_id, category_id, is_available])
  @@map("fnb_menu_item")
}

// ===== QUẢN LÝ ĐƠN HÀNG (F&B cụ thể) =====

model FnBOrder {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid
  table_id        String   @db.Uuid

  order_code      String   // ORD20260304001
  order_type      FnBOrderType @default(DINE_IN)
  status          FnBOrderStatus @default(PENDING)

  // Thông tin khách hàng (cho dine-in, có thể trống)
  customer_count  Int?
  customer_name   String?
  customer_phone  String?

  // Số tiền
  subtotal_amount Decimal  @default(0) @db.Decimal(15, 2)
  discount_amount Decimal  @default(0) @db.Decimal(15, 2)
  discount_rate   Decimal? @db.Decimal(5, 2)
  discount_reason String?

  tax_amount      Decimal  @default(0) @db.Decimal(15, 2)
  tax_rate        Decimal  @default(10) @db.Decimal(5, 2)

  service_charge  Decimal  @default(0) @db.Decimal(15, 2)
  total_amount    Decimal  @default(0) @db.Decimal(15, 2)

  // Thanh toán (liên kết FnBOrderPayment, xem bên dưới)
  payment_status  payment_status @default(UNPAID)

  // Dấu thời gian
  seated_at       DateTime?
  served_at       DateTime?
  paid_at         DateTime?
  cancelled_at    DateTime?

  notes           String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  // Quan hệ
  table           FnBTable
  items           FnBOrderItem[]
  payments        FnBOrderPayment[]
  modifications   OrderModification[]
  receipt         FnBReceipt?

  @@index([store_id, status])
  @@index([table_id, status])
  @@index([created_at])
  @@map("fnb_order")
}

enum FnBOrderType {
  DINE_IN     // Ăn tại chỗ
  TAKEOUT     // Mang về
  DELIVERY    // Giao hàng
}

enum FnBOrderStatus {
  PENDING      // Chờ xác nhận
  CONFIRMED    // Đã xác nhận
  COMPLETED    // Hoàn thành
  CANCELLED    // Bị hủy
}

model FnBOrderItem {
  id              String   @id @default(uuid()) @db.Uuid
  order_id        String   @db.Uuid
  menu_item_id    String   @db.Uuid

  quantity        Int      @default(1)
  unit_price      Decimal  @db.Decimal(15, 2)
  notes           String?

  subtotal        Decimal  @db.Decimal(15, 2)
  discount_amount Decimal  @default(0) @db.Decimal(15, 2)
  tax_amount      Decimal  @default(0) @db.Decimal(15, 2)
  total           Decimal  @db.Decimal(15, 2)

  status          FnBOrderItemStatus @default(PENDING)
  prepared_at     DateTime?
  served_at       DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Quan hệ
  order           FnBOrder @relation(fields: [order_id], references: [id])
  menu_item       FnBMenuItem @relation(fields: [menu_item_id], references: [id])

  @@index([order_id])
  @@index([status])
  @@map("fnb_order_item")
}

enum FnBOrderItemStatus {
  PENDING      // Chờ
  PREPARING    // Đang chuẩn bị
  PREPARED     // Đã chuẩn bị
  SERVED       // Đã phục vụ
  CANCELLED    // Bị hủy
}

model OrderModification {
  id              String   @id @default(uuid()) @db.Uuid
  order_id        String   @db.Uuid

  type            ModificationType
  item_id         String?
  quantity_change Int?
  reason          String?
  modified_by     String   @db.Uuid

  createdAt       DateTime @default(now())

  order           FnBOrder @relation(fields: [order_id], references: [id])

  @@map("order_modification")
}

enum ModificationType {
  ITEM_ADDED           // Thêm món
  ITEM_REMOVED         // Xóa món
  QUANTITY_CHANGED     // Thay đổi số lượng
  DISCOUNT_APPLIED     // Áp dụng chiết khấu
}

// ===== THANH TOÁN (Riêng với Đơn hàng) =====

model FnBOrderPayment {
  id              String   @id @default(uuid()) @db.Uuid
  order_id        String   @db.Uuid

  payment_method  payment_method
  amount_received Decimal  @db.Decimal(15, 2)
  amount_change   Decimal  @db.Decimal(15, 2)

  gateway         String?  // Stripe, Momo, ZaloPay
  transaction_id  String?
  status          payment_status @default(COMPLETED)

  notes           String?
  createdAt       DateTime @default(now())

  order           FnBOrder @relation(fields: [order_id], references: [id])

  @@index([order_id])
  @@map("fnb_order_payment")
}

// ===== HÓA ĐƠN/INVOICE =====

model FnBReceipt {
  id              String   @id @default(uuid()) @db.Uuid
  order_id        String   @unique @db.Uuid

  receipt_number  String   @unique  // HD20260304001
  receipt_type    FnBReceiptType

  store_info      Json     // Ảnh chụp dữ liệu cửa hàng
  table_info      Json     // Ảnh chụp dữ liệu bàn
  items_data      Json     // Ảnh chụp items đặt hàng
  amounts_data    Json     // Ảnh chụp số tiền
  payment_info    Json     // Ảnh chụp thanh toán

  is_printed      Boolean  @default(false)
  print_count     Int      @default(0)
  printed_at      DateTime?

  is_emailed      Boolean  @default(false)
  emailed_at      DateTime?
  email_to        String?

  createdAt       DateTime @default(now())

  order           FnBOrder @relation(fields: [order_id], references: [id])

  @@map("fnb_receipt")
}

enum FnBReceiptType {
  SALES        // Bán hàng
  REFUND       // Hoàn tiền
}

// ===== HỆ THỐNG HIỂN THỊ BẾP (KDS) =====

model KDSDisplay {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid
  order_item_id   String   @db.Uuid

  order_code      String
  table_code      String
  customer_count  Int?
  item_name       String
  item_notes      String?

  status          KDSStatus @default(PENDING)
  priority        Int       @default(0)

  preparation_time Int?
  prepared_at     DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([store_id, status, priority])
  @@map("kds_display")
}

enum KDSStatus {
  PENDING      // Chờ
  PREPARING    // Đang chuẩn bị
  PREPARED     // Đã chuẩn bị
  SERVED       // Đã phục vụ
  CANCELLED    // Bị hủy
}

// ===== MENU QR & ĐẶT HÀNG DI ĐỘNG =====

model TableQRCode {
  id              String   @id @default(uuid()) @db.Uuid
  table_id        String   @unique @db.Uuid

  qr_code_url     String
  qr_code_image   String?

  is_active       Boolean  @default(true)
  is_printed      Boolean  @default(false)
  printed_at      DateTime?

  scans_count     Int      @default(0)
  last_scanned_at DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  table           FnBTable @relation(fields: [table_id], references: [id])

  @@map("table_qr_code")
}

model MobileMenuSession {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid
  table_id        String?  @db.Uuid

  session_token   String   @unique
  device_id       String?
  ip_address      String?

  cart_items      MobileCartItem[]

  items_viewed    Int      @default(0)
  items_added     Int      @default(0)
  time_spent_minutes Int?

  order_id        String?  @db.Uuid

  createdAt       DateTime @default(now())
  expired_at      DateTime

  @@index([store_id, table_id])
  @@index([session_token])
  @@map("mobile_menu_session")
}

model MobileCartItem {
  id              String   @id @default(uuid()) @db.Uuid
  session_id      String   @db.Uuid
  menu_item_id    String   @db.Uuid

  quantity        Int      @default(1)
  notes           String?

  createdAt       DateTime @default(now())

  session         MobileMenuSession @relation(fields: [session_id], references: [id])
  menu_item       FnBMenuItem @relation(fields: [menu_item_id], references: [id])

  @@index([session_id])
  @@map("mobile_cart_item")
}

// ===== CẤU HÌNH =====

model FnBStoreConfig {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @unique @db.Uuid

  opening_time    String?
  closing_time    String?
  avg_meal_time   Int      @default(45)
  max_tables      Int      @default(50)

  enable_dine_in  Boolean  @default(true)
  enable_takeout  Boolean  @default(false)
  enable_delivery Boolean  @default(false)
  enable_kds      Boolean  @default(false)
  enable_loyalty  Boolean  @default(false)

  tax_percentage  Float    @default(10.0)
  service_charge  Float    @default(0.0)
  min_order_value Float?

  receipt_type    FnBReceiptType
  language        String   @default("vi")
  currency        String   @default("VND")

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("fnb_store_config")
}

model FnBPOSConfig {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @unique @db.Uuid

  order_number_prefix String @default("ORD")
  auto_print_receipt Boolean @default(true)
  show_table_merging Boolean @default(false)

  printer_type    PrinterType
  printer_ip      String?
  printer_port    Int?
  receipt_copies  Int      @default(1)
  receipt_width   Int      @default(80)

  notify_email    Boolean  @default(true)
  notify_sms      Boolean  @default(false)
  receipt_email   String?

  allow_discount  Boolean  @default(true)
  max_discount_percent Float @default(50.0)

  kds_timeout     Int      @default(5)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("fnb_pos_config")
}

enum PrinterType {
  THERMAL      // Máy in nhiệt
  INKJET       // Máy in phun mực
  NONE         // Không có
}

// ===== PHÂN TÍCH =====

model FnBDailyStatistics {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid
  stat_date       DateTime

  // Đơn hàng
  orders_count    Int      @default(0)
  paid_orders     Int      @default(0)

  // Doanh thu
  gross_revenue   Decimal  @default(0) @db.Decimal(15, 2)
  discount_total  Decimal  @default(0) @db.Decimal(15, 2)
  tax_total       Decimal  @default(0) @db.Decimal(15, 2)
  net_revenue     Decimal  @default(0) @db.Decimal(15, 2)

  // Bàn
  tables_used     Int      @default(0)
  avg_customers_per_order Int?
  avg_table_turnover_mins Int?

  // Các mục
  items_sold      Int      @default(0)
  top_item        String?

  // Thời gian
  peak_hour       String?  // "11:30", "12:00", "18:30"

  createdAt       DateTime @default(now())

  @@unique([store_id, stat_date])
  @@index([store_id, stat_date])
  @@map("fnb_daily_statistics")
}

model QROrderMetrics {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid
  stat_date       DateTime

  qr_scans        Int      @default(0)
  unique_devices  Int      @default(0)

  sessions_created Int     @default(0)
  sessions_completed Int   @default(0)
  conversion_rate Float?

  qr_orders       Int      @default(0)
  qr_revenue      Decimal  @default(0) @db.Decimal(15, 2)

  terminal_orders Int      @default(0)
  qr_vs_terminal_ratio Float?

  mobile_users    Int      @default(0)
  ios_percentage  Float?
  android_percentage Float?

  createdAt       DateTime @default(now())

  @@unique([store_id, stat_date])
  @@map("qr_order_metrics")
}
```

**Quyết định thiết kế chính:**

✅ Hoàn toàn riêng biệt với lược Đồ Bán lẻ  
✅ Không có khóa ngoại tới bảng Bán lẻ (trừ Store)  
✅ Các loại Decimal cho giá (nhất quán với Bán lẻ)  
✅ Ảnh chụp JSON cho Hoá đơn (dữ liệu bất biến)  
✅ FnBOrderPayment riêng (vs nhúng trong Đơn hàng)  
✅ Bảng phân tích chuyên dụng (metrics khác nhau)

---

## Phần 3: Cấu Trúc Thư Mục & Tổ Chức Dự Án

### 3.1 Cấu Trúc Backend Được Khuyến Nghị

```
backend/
├── src/
│   ├── common/                          # Mã dùng chung
│   │   ├── filters/                     # Bộ lọc
│   │   ├── guards/                      # Bảo vệ
│   │   │   ├── auth.guard.ts
│   │   │   ├── fnb.guard.ts            # @FnBGuard - Kiểm tra module có bật
│   │   │   └── role.guard.ts
│   │   ├── interceptors/                # Bộ chặn
│   │   ├── pipes/                       # Ống
│   │   ├── middleware/                  # Phần mềm trung gian
│   │   │   ├── store-context.middleware.ts
│   │   │   └── logging.middleware.ts
│   │   ├── decorators/                  # Trang trí
│   │   │   ├── store.decorator.ts
│   │   │   └── user.decorator.ts
│   │   ├── exceptions/                  # Ngoại lệ
│   │   ├── utils/                       # Tiện ích
│   │   └── constants/                   # Hằng số
│   │
│   ├── modules/                         # Các Module
│   │   ├── auth/                        # Xác thực cốt lõi (chia sẻ)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── store/                       # Quản lý Cửa hàng (chia sẻ)
│   │   │   ├── store.controller.ts
│   │   │   ├── store.service.ts
│   │   │   ├── dto/
│   │   │   └── store.module.ts
│   │   │
│   │   ├── user/                        # Quản lý Người dùng (chia sẻ)
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.module.ts
│   │   │
│   │   ├── asset/                       # Quản lý Tệp (chia sẻ)
│   │   │   ├── asset.controller.ts
│   │   │   ├── asset.service.ts
│   │   │   └── asset.module.ts
│   │   │
│   │   ├── retail/                      # MODULE BÁN LẺ ===
│   │   │   ├── product/
│   │   │   │   ├── product.controller.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── product.repository.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-product.dto.ts
│   │   │   │   │   └── update-product.dto.ts
│   │   │   │   ├── entities/
│   │   │   │   └── product.module.ts
│   │   │   │
│   │   │   ├── variant/
│   │   │   │   ├── variant.controller.ts
│   │   │   │   ├── variant.service.ts
│   │   │   │   └── variant.module.ts
│   │   │   │
│   │   │   ├── category/
│   │   │   │   ├── category.controller.ts
│   │   │   │   └── category.module.ts
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── inventory.controller.ts
│   │   │   │   ├── inventory.service.ts
│   │   │   │   └── inventory.module.ts
│   │   │   │
│   │   │   ├── order/
│   │   │   │   ├── order.controller.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── dto/
│   │   │   │   ├── events/
│   │   │   │   └── order.module.ts
│   │   │   │
│   │   │   ├── purchase/
│   │   │   │   ├── purchase-order.controller.ts
│   │   │   │   ├── purchase-order.service.ts
│   │   │   │   └── purchase-order.module.ts
│   │   │   │
│   │   │   ├── supplier/
│   │   │   │   ├── supplier.controller.ts
│   │   │   │   └── supplier.module.ts
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── analytics.controller.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── analytics.module.ts
│   │   │   │
│   │   │   └── retail.module.ts        # Module chính, import tất cả submodules
│   │   │
│   │   ├── fnb/                        # MODULE F&B ===
│   │   │   ├── table/
│   │   │   │   ├── table.controller.ts
│   │   │   │   ├── table.service.ts
│   │   │   │   ├── table.repository.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-table.dto.ts
│   │   │   │   │   └── update-table-status.dto.ts
│   │   │   │   ├── entities/
│   │   │   │   ├── events/
│   │   │   │   │   └── table-status-changed.event.ts
│   │   │   │   └── table.module.ts
│   │   │   │
│   │   │   ├── menu/
│   │   │   │   ├── category/
│   │   │   │   │   ├── menu-category.controller.ts
│   │   │   │   │   ├── menu-category.service.ts
│   │   │   │   │   └── menu-category.module.ts
│   │   │   │   │
│   │   │   │   ├── item/
│   │   │   │   │   ├── menu-item.controller.ts
│   │   │   │   │   ├── menu-item.service.ts
│   │   │   │   │   ├── menu-item.repository.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   └── menu-item.module.ts
│   │   │   │   │
│   │   │   │   └── menu.module.ts
│   │   │   │
│   │   │   ├── order/
│   │   │   │   ├── order.controller.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── order.repository.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-fnb-order.dto.ts
│   │   │   │   │   ├── add-order-item.dto.ts
│   │   │   │   │   └── apply-discount.dto.ts
│   │   │   │   ├── entities/
│   │   │   │   ├── events/
│   │   │   │   │   ├── order-created.event.ts
│   │   │   │   │   ├── order-item-added.event.ts
│   │   │   │   │   └── payment-processed.event.ts
│   │   │   │   ├── validators/
│   │   │   │   └── order.module.ts
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── payment.controller.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── process-payment.dto.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── cash-payment.strategy.ts
│   │   │   │   │   ├── card-payment.strategy.ts
│   │   │   │   │   └── digital-wallet.strategy.ts
│   │   │   │   └── payment.module.ts
│   │   │   │
│   │   │   ├── receipt/
│   │   │   │   ├── receipt.controller.ts
│   │   │   │   ├── receipt.service.ts
│   │   │   │   ├── templates/
│   │   │   │   │   ├── receipt.template.html
│   │   │   │   │   └── receipt.template.txt
│   │   │   │   └── receipt.module.ts
│   │   │   │
│   │   │   ├── kds/                   # Hệ thống Hiển thị Bếp
│   │   │   │   ├── kds.gateway.ts     # WebSocket
│   │   │   │   ├── kds.controller.ts
│   │   │   │   ├── kds.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── kds.module.ts
│   │   │   │
│   │   │   ├── qr-menu/              # Menu QR & Đặt hàng Di động
│   │   │   │   ├── qr.controller.ts
│   │   │   │   ├── qr.service.ts
│   │   │   │   │
│   │   │   │   ├── mobile/
│   │   │   │   │   ├── mobile-menu.controller.ts
│   │   │   │   │   ├── mobile-menu.service.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-session.dto.ts
│   │   │   │   │   │   ├── submit-order.dto.ts
│   │   │   │   │   │   └── add-to-cart.dto.ts
│   │   │   │   │   └── mobile-menu.controller.ts
│   │   │   │   │
│   │   │   │   └── qr-menu.module.ts
│   │   │   │
│   │   │   ├── config/               # Cấu hình F&B
│   │   │   │   ├── fnb-config.controller.ts
│   │   │   │   ├── fnb-config.service.ts
│   │   │   │   └── fnb-config.module.ts
│   │   │   │
│   │   │   ├── analytics/            # Phân tích F&B
│   │   │   │   ├── fnb-analytics.controller.ts
│   │   │   │   ├── fnb-analytics.service.ts
│   │   │   │   ├── jobs/
│   │   │   │   │   └── daily-statistics.job.ts
│   │   │   │   └── fnb-analytics.module.ts
│   │   │   │
│   │   │   └── fnb.module.ts         # Module F&B chính
│   │   │
│   │   └── shared/                   # Module Chia sẻ (nếu cần)
│   │       ├── cache/
│   │       ├── database/
│   │       ├── mailer/
│   │       └── shared.module.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── env.config.ts
│   │   └── cache.config.ts
│   │
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── app.module.ts
│
├── prisma/
│   ├── schema.prisma                # Lược Đồ chính (Bán lẻ + nền tảng chung)
│   ├── schemas/
│   │   └── fnb.prisma              # Lược Đồ F&B (để dokumentation, tùy chọn)
│   ├── migrations/
│   │   ├── 001_init_retail/
│   │   └── 002_add_fnb_module/
│   └── seed.ts
│
├── test/
│   ├── unit/
│   │   ├── retail/
│   │   └── fnb/
│   ├── integration/
│   │   ├── retail/
│   │   ├── fnb/
│   │   └── cross-module/
│   └── e2e/
│       ├── retail/
│       └── fnb/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── RETAIL_MODULE.md
│   └── FNB_MODULE.md
│
├── .env.example
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Phần 3.2: Nguyên Tắc Tổ Chức Thư Mục Chính

```
┌────────────────────────────────────────────────────────┐
│      NHỮNG THỰC HÀNH TỐT NHẤT VỀ TỔ CHỨC THƯMỤC       │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 1. COMMON (Chia sẻ bởi tất cả modules)               │
│    Vị trí: src/common, src/modules/auth, v.v.        │
│    Mục đích: Guards, Filters, Middleware, Decorators  │
│    Quy tắc: KHÔNG nhập từ retail hoặc fnb modules    │
│                                                        │
│ 2. MODULE-SPECIFIC (Cách ly mỗi module)              │
│    Vị trí: src/modules/retail/, src/modules/fnb/     │
│    Mục đích: Logic kinh doanh, controllers, services  │
│    Quy tắc: Có thể nhập từ common, KHÔNG các module khác│
│    Ngoại lệ: Có thể nhập shared models/interfaces     │
│                                                        │
│ 3. INTEGRATION LAYER (Liên module)                   │
│    Vị trí: src/shared/ hoặc src/integrations/        │
│    Mục đích: Events, DTOs, shared interfaces          │
│    Quy tắc: Cả 2 modules có thể nhập, KHÔNG phụ thuộc vòng│
│                                                        │
│ 4. PRISMA SCHEMA (Nguồn sự thật duy nhất)            │
│    Vị trí: prisma/schema.prisma                      │
│    Quy tắc: Tất cả entities định nghĩa trong MỘT tệp │
│    Ghi chú: fnb.prisma chỉ cho dokumentation         │
│                                                        │
│ 5. TESTS (Phản chiếu cấu trúc module)                │
│    Vị trí: test/unit/{retail,fnb}/                   │
│    Quy tắc: Đường dẫn kiểm tra khớp với module       │
│    Ví dụ: src/modules/fnb/table/ → test/unit/fnb/table/│
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Phần 4: Chiến Lược Triển Khai & Timeline

### 4.1 Giai Đoạn 1: Thiết Lập Nền Tảng (Tuần 1)

**Mục tiêu:** Thiết lập cơ sở hạ tầng để hỗ trợ cả 2 modules

**Các Công Việc:**

1. Mở rộng Prisma schema với các mô hình F&B ✓
2. Tạo cấu trúc module FnB ✓
3. Thiết lập tiêm dependency cho module
4. Tạo FnB guards (@FnBGuard) & middleware
5. Thiết lập business_type trong mô hình Store
6. Tạo F&B specific enums & constants
7. Viết kiểm tra cho nền tảng

**Danh Sách Kiểm Tra:**

```
□ Tạo di chuyển Prisma (001_add_fnb_module)
□ Tạo cấu trúc thư mục module FnB
□ Triển khai và kiểm tra @FnBGuard
□ Xác định enum Store.business_type
□ Cập nhật doc (README, ARCHITECTURE.md)
□ Tất cả kiểm tra cho nền tảng đạt
```

---

### 4.2 Giai Đoạn 2: Tính Năng Cốt Lõi F&B (Tuần 2-4)

**Mục tiêu:** Triển khai F0-F8 từ tài liệu tính năng

#### Sprint 1 (Tuần 2): F0, F1, F2, F3, F4, F5

```
- Cơ sở Hạ tầng Cốt lõi (F0)
- Auth & Multi-tenant (F1) - tái sử dụng hiện có
- Cấu hình F&B (F2)
- Quản lý Bàn (F3)
- Quản lý Menu (F4)
- Cấu hình Cửa hàng (F5)

Kết quả đầu ra:
□ API endpoints cho bàn/menu/cấu hình
□ Di chuyển cơ sở dữ liệu (database migration)
□ Kiểm tra đơn vị (80%+ độ bao phủ)
□ Kiểm tra tích hợp cho các hoạt động CRUD
```

#### Sprint 2 (Tuần 4): F6, F7, F8

```
- Tạo Đơn hàng (F6)
- Thanh toán Đơn hàng (F7)
- Hoá đơn (F8)

Kết quả đầu ra::
□ Quy trình đơn hàng hoàn chỉnh (tạo → thêm mục → thanh toán)
□ Xử lý thanh toán
□ Tạo hoá đơn
□ Kiểm tra E2E cho quy trình đặt hàng
```

---

### 4.3 Giai Đoạn 3: Hoạt Động & Phân Tích (Tuần 6-8)

#### Sprint 3 (Tuần 6): F9, F10, F11

```
- Hệ Thống Hiển Thị Bếp (F9)
- Quản lý Trạng thái Bàn (F10)
- Sửa đổi Đơn hàng (F11)

Kết quả đầu ra:
□ Triển khai WebSocket cho KDS
□ Cập nhật bàn theo thời gian thực
□ Theo dõi sửa đổi đơn hàng
□ Kiểm tra tích hợp
```

#### Sprint 4 (Tuần 7-8): F12-F14, Frontend

```
- Phân tích Hàng ngày (F12)
- Phân tích Bàn (F13)
- Báo cáo (F14)
- Các thành phần Frontend (F15-F19)

Kết quả đầu ra:
□ Các công việc cron phân tích
□ Xuất báo cáo
□ Các thành phần UI Frontend
□ Kiểm tra E2E cho quy trình hoàn chỉnh
```

---

### 4.4 Giai Đoạn 4: Tính Năng Nâng Cao (Tuần 9-12)

#### Sprint 5-6: F20-F23

```
- Menu QR Code (F23) - Ưu tiên
- Gợi ý AI (F20)
- Chương trình Lòng Trung Thành (F21)
- Đồng Bộ Đa Vị Trí (F22)

Sản Phẩm Giao Hàng:
□ Tạo mã QR
□ Ứng dụng web menu di động
□ Phân tích cho đơn hàng QR
□ Tất cả tiêu chí chấp nhận được đáp ứng
```

---

## Phần 5: Các Câu Hỏi để Hỏi Tech Lead

### 5.1 Kiến Trúc & Thiết Kế

#### **Q1: Mức Độ Cách Ly Module**

**Câu hỏi:**
Các module Bán lẻ và F&B nên có:

- A) Cách ly hoàn toàn (các dịch vụ riêng trong tương lai)?
- B) Cơ sở dữ liệu chia sẻ, mã cách ly (cách tiếp cận hiện tại)?
- C) Lai (chia sẻ Store/User, đơn hàng riêng)?

**Tại sao hỏi:** Ảnh hưởng hướng phụ thuộc, chiến lược bộ nhớ đệm, khả năng mở rộng

**Khuyến nghị:** Phương ÁN B tạm thời

- Một cơ sở dữ liệu PostgreSQL duy nhất
- Các module NestJS cách ly
- Giới hạn miền rõ ràng
- Có thể phát triển thành các dịch vụ riêng biệt (Phương ÁN A) sau

---

#### **Q2: Truy Cập Dữ Liệu Liên Module**

**Câu hỏi:**
Có thể FnBOrderPayment truy cập Retail VariantStock để đồng bộ?
Cả 2 modules có thể ghi vào các bảng chung (Store, User)?

**Tại sao hỏi:** Ảnh hưởng xử lý giao dịch, tính nhất quán dữ liệu

**Khuyến nghị:**

- ✅ Cả 2 modules có thể ĐỌC từ các bảng chia sẻ
- ✅ Cả 2 modules có thể GHI vào các bảng chia sẻ (Auth, cấu hình Store)
- ❌ Bán lẻ KHÔNG NÊN đọc từ các bảng cụ thể F&B trực tiếp
- ❌ F&B KHÔNG NÊN đọc từ kho bán lẻ (dùng sự kiện thay thế)

---

#### **Q3: Thống Nhất Thanh Toán**

**Câu hỏi:**
F&B nên dùng cùng quy trình xử lý thanh toán như Bán lẻ hay riêng?

**Trạng thái hiện tại:**

- Bán lẻ: payment_method nhúng trong Order
- F&B: FnBOrderPayment (bảng thanh toán riêng)

**Khuyến nghị:**

**Phương ÁN 1 (Được Khuyến Nghị): Riêng tạm thời**

- F&B có quy trình đơn giản hơn (dine-in chủ yếu tiền mặt)
- Bán lẻ có hoàn trả phức tạp, thanh toán trả góp
- Có thể hợp nhất sau nếu cần

**Phương ÁN 2: Dịch vụ Thanh toán Thống Nhất**

- Tạo giao diện PaymentProcessor trừu tượng
- RetailPaymentProcessor, FnBPaymentProcessor triển khai nó
- CashTransaction chia sẻ cho module tài chính

---

### 5.2 Triển Khai & Cấu Trúc Mã

#### **Q4: Tổ Chức Prisma Schema**

**Câu hỏi:**
Giữ single prisma/schema.prisma với tất cả mô hình, hay chia thành nhiều tệp?

**Phương ÁN:**

- A) Tệp duy nhất (cách tiếp cận hiện tại) - Đơn giản nhưng phát triển lớn
- B) Nhiều tệp với @include/@extend - Tính năng Prisma nâng cao
- C) Cơ sở dữ liệu riêng cho mỗi module - Phức tạp, không được khuyến nghị tạm thời

**Khuyến nghị:** Phương ÁN A

- Giữ tệp duy nhất để đơn giản
- Thêm bình luận phần rõ ràng (// === F&B MODELS ===)
- Max ~100 bảng trên mỗi tệp là có thể quản lý
- Nếu > 150 mô hình trong tương lai, xem xét chia

---

#### **Q5: Mẫu Repository**

**Câu hỏi:**
Nên dùng mẫu Repository cho truy cập dữ liệu?

**Phương ÁN:**

- A) Prisma trực tiếp trong services (đơn giản, cách tiếp cận hiện tại)
- B) Lớp Repository + tiêm dependency (kiến trúc sạch)
- C) Lai (repositories cho truy vấn phức tạp chỉ)

**Khuyến nghị:** Phương ÁN C (Thực Dụng)

- Dùng repositories cho các entities chính (Order, Table, MenuItem)
- Prisma trực tiếp cho CRUD đơn giản
- Repositories xử lý truy vấn phức tạp, giao dịch

**Lợi ích:**
✅ Kiểm tra dễ hơn (repositories giả)
✅ Logic kinh doanh sạch hơn
✅ Cơ sở dữ liệu bất khả tri nếu cần

---

#### **Q6: Phụ Thuộc Module**

**Câu hỏi:**
Module F&B có nên phụ thuộc vào module Bán lẻ cho các dịch vụ chia sẻ?

**Khuyến nghị:** KHÔNG

- Mỗi module nên độc lập
- Dùng tiêm dependency cho các dịch vụ chia sẻ
- Nhập từ src/common, không phải src/modules/retail

**Mẫu Chống:**

```
❌ fnb/order/order.service → retail/product/product.service
```

**Mẫu Đúng:**

```
✅ fnb/order/order.service → common/cache/cache.service
✅ fnb/order/order.service → shared/database/database.service
```

---

### 5.3 Kiểm Tra & Chất Lượng

#### **Q7: Chiến Lược Kiểm Tra**

**Câu hỏi:**
Cách tiếp cận kiểm tra cho hệ thống multi-module?

**Khuyến nghị:** Cách tiếp cận Tạo hình

- 60% Kiểm tra Đơn vị (các dịch vụ riêng, repositories)
- 25% Kiểm tra Tích hợp (quy trình module-level)
- 15% Kiểm tra E2E (kịch bản liên module)

**Các tệp kiểm tra chính:**

```
test/unit/fnb/table/table.service.spec.ts
test/unit/fnb/order/order.service.spec.ts
test/integration/fnb/order-workflow.spec.ts
test/e2e/fnb/order-to-payment.e2e.spec.ts
```

**Mục tiêu:** >80% độ bao phủ mỗi module

---

#### **Q8: Giao Dịch Cơ Sở Dữ Liệu**

**Câu hỏi:**
Cách xử lý các hoạt động đa bước trên các bảng?
(ví dụ: Tạo Đơn hàng → Thêm Items → Xử lý Thanh toán → Cập nhật Trạng thái Bàn)

**Khuyến nghị:** Prisma $transaction()

```typescript
await prisma.$transaction(async (tx) => {
  // Bước 1: Tạo đơn hàng
  const order = await tx.fnbOrder.create({ ... });

  // Bước 2: Thêm items
  await tx.fnbOrderItem.create({ ... });

  // Bước 3: Xử lý thanh toán
  await tx.fnbOrderPayment.create({ ... });

  // Bước 4: Cập nhật bàn
  await tx.fnbTable.update({ ... });

  // Tất cả thành công hoặc tất cả quay lại
});
```

**Lợi ích:** Đảm bảo ACID cho quy trình phức tạp

---

### 5.4 DevOps & Triển Khai

#### **Q9: Tính Bình Đẳng Môi Trường**

**Câu hỏi:**
Cách đảm bảo dev/staging/prod có cùng phiên bản schema?

**Khuyến nghị:** Di chuyển dựa trên Git

- Kiểm tra di chuyển vào kiểm soát phiên bản
- Chạy di chuyển như một phần của triển khai
- Dùng lệnh Prisma migrate
- Gắn nhãn bản phát hành với phiên bản schema

**Trước khi triển khai:**

1. Chạy `prisma migrate deploy` trên staging
2. Kiểm tra kỹ
3. Quy trình tương tự sang production

---

#### **Q10: Tương Thích Ngược**

**Câu hỏi:**
Cách thêm các mô hình F&B mà không phá vỡ Bán lẻ đang chạy?

**Chiến Lược:**

1. Thêm bảng mới vào schema (F&B cụ thể)
2. Chạy di chuyển như additive (không thay đổi bảng Bán lẻ)
3. Triển khai mã (module mới bị cổng tính năng)
4. Bật cho các cửa hàng cụ thể qua business_type
5. Triển khai dần: cửa hàng beta → tất cả cửa hàng

**Giảm thiểu Rủi Ro:**

- Các cửa hàng Bán lẻ không bao giờ thấy các bảng F&B
- API Bán lẻ không thay đổi
- Các cờ tính năng kiểm soát truy cập module
- Quay lại dễ (chỉ thay đổi business_type)

---

## Phần 6: Danh Sách Kiểm Tra Triển Khai

### 6.1 Trước Khi Viết Mã

- [ ] Xem xét tài liệu này với đội backend
- [ ] Thống nhất với cách tiếp cận kiến trúc multi-module
- [ ] Quyết định tổ chức lược Đồ Prisma
- [ ] Xác định cấu trúc thư mục chung vs module-specific
- [ ] Thiết lập chiến lược di chuyển cơ sở dữ liệu
- [ ] Tạo sơ đồ phụ thuộc module (visio/miro)
- [ ] Thiết lập tiêu chuẩn xem xét mã cho multi-module
- [ ] Tạo tệp constants/enums chia sẻ
- [ ] Thiết lập quy tắc eslint cho hạn chế nhập

### 6.2 Giai Đoạn 1: Nền Tảng

- [ ] Mở rộng Prisma schema với các mô hình F&B
- [ ] Tạo di chuyển Prisma (001_add_fnb)
- [ ] Thiết lập FnBModule trong NestJS
- [ ] Tạo trang trí @FnBGuard
- [ ] Tạo FnB middleware (StoreContext)
- [ ] Thêm business_type vào mô hình Store
- [ ] Tạo cấu trúc DTOs cơ sở F&B
- [ ] Viết kiểm tra nền tảng
- [ ] Cập nhật dokumentation

### 6.3 Giai Đoạn 2: Tính Năng Cốt Lõi (F0-F8)

**Cho mỗi tính năng:**

- [ ] Tạo entity/service/controller
- [ ] Viết logic kinh doanh + xác thực
- [ ] Tạo di chuyển nếu cần
- [ ] Viết DTOs + hợp đồng API
- [ ] Kiểm tra đơn vị (80%+ độ bao phủ)
- [ ] Kiểm tra tích hợp cho quy trình
- [ ] Dokumentation API (Swagger)
- [ ] Cập nhật tài liệu kiến trúc

### 6.4 Kiểm Tra

- [ ] Kiểm tra đơn vị cho services/repositories
- [ ] Kiểm tra tích hợp cho quy trình
- [ ] Kiểm tra E2E cho kịch bản hoàn chỉnh
- [ ] Kiểm tra tải cho WebSocket (KDS)
- [ ] Kiểm tra cách ly multi-tenant
- [ ] Kiểm tra truy cập dữ liệu liên module
- [ ] Kiểm tra giao dịch cơ sở dữ liệu

### 6.5 Tài Liệu

- [ ] Sơ đồ Kiến trúc (modules, phụ thuộc)
- [ ] Sơ đồ Lược Đồ Cơ sở Dữ liệu
- [ ] Dokumentation API (Swagger)
- [ ] Hướng dẫn Cấu trúc Thư mục
- [ ] Hướng dẫn Triển khai Module
- [ ] Tài liệu Chiến lược Kiểm tra
- [ ] Danh sách Kiểm tra Triển khai
- [ ] Hướng dẫn Xử sự cố

---

## Phần 7: Giảm Thiểu Rủi Ro

### 7.1 Những Tẫm Chống Phổ Biến

#### ❌ **MẪUZZU CHỐNG 1: Bảng Đơn Hàng Chung**

**Vấn Đề:** Trộn Retail Order + F&B Order trong cùng một bảng

```
- Lược Đồ khác (variant_id vs menu_item_id)
- Quy trình khác (trả lại vs sửa đổi)
- Tính toán khác (chiết khấu vs phí phục vụ)
```

**Giải Pháp:** ✅ Bảng FnBOrder riêng biệt

---

#### ❌ **MẪUZZU CHỐNG 2: Phụ Thuộc Liên Module**

**Vấn Đề:** fnb/order phụ thuộc vào retail/product

```
- Tạo rủi ro phụ thuộc vòng tròn
- Khó kiểm tra riêng lẻ
- Liên kết các modules không liên quan
```

**Giải Pháp:** ✅ Dùng sự kiện/hàng đợi tin nhắn cho giao tiếp

---

#### ❌ **MẪUZZU CHỐNG 3: Bảng Thanh Toán Chung**

**Vấn Đề:** Bảng Thanh toán duy nhất cho cả 2 modules

```
- Dữ liệu khác mỗi module (table_id cho F&B, v.v.)
- Quy trình khác (hoàn tiền vs trả lại)
- Nhu cầu báo cáo khác
```

**Giải Pháp:** ✅ FnBOrderPayment riêng, giữ Bán lẻ nhúng

---

#### ❌ **MẪUZZU CHỐNG 4: Dịch Vụ Khối Lượng Lớn**

**Vấn Đề:** OrderService làm tất cả (tạo, thanh toán, trả lại, phân tích)

```
- Khó kiểm tra
- Khó bảo trì
- Vấn đề hiệu suất
```

**Giải Pháp:** ✅ Chia thành: CreateOrderService, PaymentService,
ModificationService, AnalyticsService

---

#### ❌ **MẪUZZU CHỐNG 5: Không Có Cờ Tính Năng**

**Vấn Đề:** Triển khai cả 2 modules, không thể vô hiệu F&B nếu lỗi

```
- Thay đổi phá vỡ Bán lẻ
- Không triển khai dần dần
- Triển khai rủi ro
```

**Giải Pháp:** ✅ Dùng business_type + @FnBGuard cho kiểm soát tính năng

---

### 7.2 Giám Sát & Khả Quan Sát

**Số Liệu Bắt Buộc:**

#### 1. Sức Khỏe Module:

```
- Thời gian phản hồi API F&B module
- Các hoạt động CRUD bàn mỗi giây
- Độ trễ tạo đơn hàng
```

#### 2. Nhất Quán Dữ Liệu:

```
- Số Đơn hàng → Thanh toán không khớp
- OrderItems Mồ Côi
- Chuyển đổi trạng thái bàn (thay đổi trạng thái không hợp lệ)
```

#### 3. Số Liệu Kinh Doanh:

```
- Đơn hàng mỗi giờ (F&B)
- Giá trị đơn hàng trung bình
- Thời gian quay vòng bàn
- Tỉ lệ chuyển đổi quét mã QR
```

#### 4. Cơ Sở Hạ Tầng:

```
- Kết nối WebSocket (KDS)
- Sử dụng nhóm kết nối cơ sở dữ liệu
- Tỉ lệ hit bộ nhớ đệm Redis
- Tỉ lệ thành công tải lên tệp
```

---

## Phần 8: Các Câu Hỏi để Xác Nhận Với Tech Lead

### Mẫu cho Cuộc Họp Tech Lead

```markdown
# Triển Khai Multi-Module POS - Thẩm Định Tech Lead

## Tổng Quan

Chúng tôi đang triển khai một hệ thống POS multi-module với
Modules Bán lẻ (hiện có) và F&B (mới). Tài liệu này nêu ra
kiến trúc và tìm kiếm sự phê duyệt của bạn trước khi phát triển bắt đầu.

## Các Quyết Định Chính để Xác Nhận

### 1. Tổ Chức Lược Đồ

**Khuyến nghị:** Tệp lược Đồ Prisma duy nhất với các phần rõ ràng

- [ ] Được Phê duyệt
- [ ] Cần thảo luận
- [ ] Từ chối

**Câu hỏi:**

- Nên dùng các tệp Prisma riêng cho mục đích tài liệu?
- Có lo ngại về ~30 bảng mới được thêm vào lược Đồ hiện có?
- Timeline cho tiềm năng sharding cơ sở dữ liệu (nếu > 50 cửa hàng)?

---

### 2. Cấu Trúc Module

**Khuyến nghị:** Các module NestJS độc lập trong src/modules/{retail,fnb}

- [ ] Được Phê duyệt
- [ ] Cần thảo luận
- [ ] Từ chối

**Câu hỏi:**

- Có sở thích nào về hạn chế nhập giữa các modules?
- Nên dùng bí danh module (@modules/\* vs nhập tương đối)?
- Cấu trúc kiểm tra: phản chiếu sản xuất hay phẳng?

---

### 3. Chia Sẻ Dữ Liệu

**Khuyến nghị:**

- Chia sẻ: User, Store, Asset, Auth
- Cách ly: Orders, Products, Tables, Menus
- [ ] Được Phê duyệt
- [ ] Cần thảo luận
- [ ] Từ chối

**Câu hỏi:**

- Thực thi giới hạn module chặt chẽ đến mức nào? (quy tắc ESLint?)
- Cần sự kiện liên module cho đồng bộ? (ví dụ: Đơn hàng được tạo → Tài chính)
- Chiến lược bộ nhớ đệm mỗi module hay tập trung?

---

### 4. Timeline Triển Khai

**Khuyến nghị:** 12-16 tuần tổng cộng

- Nền Tảng: 2 tuần
- Tính Năng Cốt Lõi: 6 tuần
- Hoạt Động: 4 tuần
- Nâng Cao: 4 tuần
- [ ] Thực Tế
- [ ] Quá Tích Cực
- [ ] Quá Bảo Thủ

**Câu hỏi:**

- Kích thước đội khả dụng? (đề xuất 4 BE + 2 FE)
- Phụ thuộc vào triển khai module Tài chính?
- Ràng buộc thời hạn cứng?

---

### 5. Cách Tiếp Cận Kiểm Tra

**Khuyến nghị:** Tạo hình (60% đơn vị, 25% tích hợp, 15% E2E)

- [ ] Được Phê duyệt
- [ ] Cần thảo luận
- [ ] Từ chối

**Câu hỏi:**

- Mục tiêu độ bao phủ mã? (đề xuất 80%+)
- Kiểm tra hiệu suất cần thiết? (đơn hàng đồng thời, tải KDS)
- Kiểm tra tải trước khởi động? (bao nhiêu người dùng đồng thời?)

---

## Bước Tiếp Theo

- [ ] Lên lịch cuộc họp theo dõi
- [ ] Tạo thông số kỹ thuật chi tiết mỗi module
- [ ] Thiết lập môi trường phát triển
- [ ] Bắt đầu triển khai Giai Đoạn 1
```

---

## Tóm Tắt & Khuyến Nghị

### Các Điểm Chính

| Khía cạnh      | Khuyến nghị            | Lý Do                            |
| -------------- | ---------------------- | -------------------------------- |
| **Lược Đồ**    | Tệp Prisma Duy Nhất    | Đơn giản, multi-tenancy rõ ràng  |
| **Modules**    | Modules NestJS Cách Ly | Khả năng kiểm tra, bảo trì       |
| **Chia Sẻ**    | Tối thiểu, dựa sự kiện | Cách ly lỏng, dễ chia tách       |
| **Kiểm Tra**   | Cách tiếp cận Tạo hình | Hiệu quả chi phí, độ bao phủ tốt |
| **Timeline**   | 12-16 tuần             | Thực tế với đội vững chắc        |
| **Triển Khai** | Cổng Tính Năng         | Triển khai an toàn, quay lại dễ  |

---

### Trước Khi Bạn Viết Mã

#### 1. **Lên Lịch Đồng Bộ Tech Lead** (1-2 giờ)

```
- Xem tài liệu này
- Thống nhất về kiến trúc
- Làm rõ những điều mơ hồ
- Nhận ký duyệt
```

#### 2. **Thiết Lập Nền Tảng** (1 tuần)

```
- Cập nhật Prisma schema
- Tạo di chuyển
- Thiết lập cấu trúc module FnB
- Tạo guards & middleware
```

#### 3. **Tạo Thông Số Kỹ Thuật Chi Tiết** (cho mỗi tính năng)

```
- DTOs & hợp đồng API
- Lược Đồ cơ sở dữ liệu (mô hình cụ thể)
- Quy trình logic kinh doanh
- Kịch bản kiểm tra
```

#### 4. **Thiết Lập Tiêu Chuẩn**

```
- Phong cách mã & quy ước
- Hạn chế nhập
- Mẫu xử lý lỗi
- Tiêu chuẩn ghi nhật ký
```

---

**Phiên Bản Tài Liệu:** 1.0  
**Cập Nhật Lần Cuối:** 06/03/2026  
**Tình Trạng:** Sẵn sàng để Xem Xét Tech Lead  
**Lần Xem Xét Tiếp Theo:** Sau cuộc họp thẩm định

---

## Phụ Lục A: Mẫu Thảo Luận Chi Tiết Tech Lead

### Chương Trình Nghị Sự Cuộc Họp (90 phút)

#### Phần 1: Tổng Quan Kiến Trúc (20 phút)

- Hiển thị sơ đồ: cấu trúc module, quan hệ entities
- Giải thích mô hình chia sẻ vs cách ly
- Thảo luận các cổng tính năng và triển khai dần

#### Phần 2: Đi Sâu Lược Đồ (25 phút)

- Hướng dẫn bổ sung Prisma schema
- Hiển thị quan hệ mô hình F&B
- Thảo luận quan ngại tính nhất quán dữ liệu
- Giải quyết câu hỏi thiết kế mô hình cụ thể

#### Phần 3: Cách Tiếp Cận Triển Khai (20 phút)

- Timeline và các giai đoạn
- Cấu trúc đội và vai trò
- Chiến lược giảm thiểu rủi ro
- Cách tiếp cận kiểm tra

#### Phần 4: Câu Hỏi Mở (20 phút)

- Giải quyết quan ngại của tech lead
- Làm rõ những điều mơ hồ
- Thẩm định các quyết định
- Nhận sự phê duyệt cuối cùng

#### Phần 5: Bước Tiếp Theo (5 phút)

- Gán chủ sở hữu mỗi giai đoạn
- Lên lịch cuộc họp theo dõi
- Xác định tiêu chí thành công

---

## Phụ Lục B: Danh Sách Kiểm Tra Phê Duyệt Triển Khai

```
DANH SÁCH KIỂM TRA Xreview KIẾN TRÚC

☐ Tech Lead phê duyệt thiết kế lược Đồ
☐ Tech Lead phê duyệt cấu trúc module
☐ Tech Lead phê duyệt cách tiếp cận chia sẻ dữ liệu
☐ Tech Lead phê duyệt chiến lược kiểm tra
☐ Trưởng đội xác nhận khả năng thi hành timeline
☐ Trưởng DevOps xác nhận cơ sở hạ tầng
☐ Trưởng QA xác nhận cách tiếp cận kiểm tra
☐ Quản lý Sản phẩm thẩm định phạm vi tính năng
☐ Xem xét Bảo mật hoàn thành (multi-tenancy, auth)
☐ Xác định yêu cầu Hiệu suất (người dùng đồng thời, tải KDS)

CHỮ KÝ PHÊDUYỆT:
___________________ Tech Lead __________ Ngày
___________________ Quản Lý Sản Phẩm ____ Ngày
___________________ Trưởng Đội _________ Ngày
```

---
