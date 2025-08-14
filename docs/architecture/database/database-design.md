# Database Design - Retail POS System

## Tổng quan

Database được thiết kế cho hệ thống POS multi-tenant với focus chính vào **Retail Domain** cho MVP. Schema được xây dựng với **MongoDB** và khả năng mở rộng cho các domains khác (Restaurant, Pharmacy) trong tương lai.

## Nguyên tắc thiết kế

### 1. Multi-tenant Architecture
- **Row-level isolation**: Mọi collection đều có `tenantId` để tách biệt dữ liệu
- **Shared database**: Tất cả tenants dùng chung database nhưng data hoàn toàn isolated
- **Tenant-scoped queries**: Mọi query đều được scope theo tenant

### 2. Domain-driven Design
- **Core Domain**: User, Tenant, Subscription management
- **Retail Domain**: Product, Inventory, Sales, Customer cho retail business
- **Extensible**: Schema structure sẵn sàng cho Restaurant/Pharmacy domains

### 3. Data Integrity
- **MongoDB ObjectId**: Sử dụng ObjectId cho relationships
- **Application-level constraints**: Business rules được enforce ở application level
- **Indexes**: Optimized cho multi-tenant queries với MongoDB indexing

## Prisma Schema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
  output = "../generated/client"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
  ou
}

// ===============================
// CORE DOMAIN - SHARED ACROSS ALL BUSINESS TYPES
// ===============================

// User table - Quản lý người dùng của hệ thống
// Một user có thể thuộc nhiều tenants với các roles khác nhau
model User {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  email           String   @unique
  passwordHash    String   // BCrypt hashed password
  firstName       String
  lastName        String
  phone           String?
  isActive        Boolean  @default(true)
  emailVerified   Boolean  @default(false)
  lastLoginAt     DateTime?
  passwordChangedAt DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relationships
  userTenants     UserTenant[]     // User có thể thuộc nhiều tenants
  ownedTenants    Tenant[]         // Tenants mà user này là owner  
  createdSales    Sale[]           // Sales được tạo bởi user này
  
  @@map("users")
}

// Tenant table - Đại diện cho mỗi business (cửa hàng, nhà hàng, hiệu thuốc)
// MVP focus: Retail tenants only
model Tenant {
  id           String      @id @default(auto()) @map("_id") @db.ObjectId
  name         String      // Tên cửa hàng/business
  subdomain    String      @unique // retail, restaurant-abc, pharmacy-xyz
  domainType   DomainType  // RETAIL, RESTAURANT, PHARMACY
  status       TenantStatus @default(TRIAL)
  ownerId      String      @db.ObjectId // User là chủ sở hữu tenant
  settings     Json        @default("{}") // Tenant-specific settings (currency, timezone, etc.)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relationships
  owner           User             @relation(fields: [ownerId], references: [id])
  userTenants     UserTenant[]     // Users thuộc tenant này
  subscription    Subscription?    // Tenant subscription plan
  
  // Retail Domain relationships
  products        Product[]        // Sản phẩm của tenant (retail)
  categories      Category[]       // Danh mục sản phẩm (retail)
  customers       Customer[]       // Khách hàng (retail)
  sales           Sale[]           // Đơn hàng bán (retail)
  inventories     Inventory[]      // Quản lý tồn kho (retail)
  unitCategories  UnitCategory[]   // Nhóm đơn vị
  units           Unit[]           // Đơn vị tính

  @@map("tenants")
}

// UserTenant - Many-to-many relationship giữa User và Tenant
// Định nghĩa role và permissions của user trong từng tenant
model UserTenant {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  tenantId    String   @db.ObjectId
  role        UserRole @default(USER)
  permissions Json     @default("[]") // Array of permission strings
  assignedAt  DateTime @default(now())
  assignedBy  String   @db.ObjectId // User ID của người assign role này
  isActive    Boolean  @default(true)

  // Relationships
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([userId, tenantId]) // Một user chỉ có 1 role per tenant
  @@map("user_tenants")
}

// Subscription - Quản lý gói dịch vụ của từng tenant
// MVP: Basic subscription model cho retail tenants
model Subscription {
  id                   String           @id @default(auto()) @map("_id") @db.ObjectId
  tenantId             String           @unique @db.ObjectId
  planType             PlanType         @default(TRIAL)
  status               SubscriptionStatus @default(TRIAL)
  features             Json             @default("[]") // Array of enabled features
  limits               Json             @default("{}") // Usage limits (maxUsers, maxProducts, etc.)
  currentPeriodStart   DateTime         @default(now())
  currentPeriodEnd     DateTime         // End date of current billing period
  canceledAt           DateTime?        // When subscription was canceled
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt

  // Relationships
  tenant               Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

// ===============================
// RETAIL DOMAIN - SPECIFIC FOR RETAIL BUSINESS
// ===============================

// Category - Danh mục sản phẩm cho retail business
// Ví dụ: Electronics, Clothing, Food & Beverage
model Category {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  tenantId    String   @db.ObjectId // Multi-tenant isolation
  name        String   // Tên danh mục
  description String?  // Mô tả danh mục
  parentId    String?  @db.ObjectId // Self-referencing for hierarchical categories
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0) // Thứ tự hiển thị
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  tenant      Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]  // Sản phẩm thuộc danh mục này

  @@unique([tenantId, name]) // Tên category unique trong 1 tenant
  @@index([tenantId, isActive]) // Index cho queries thường dùng
  @@map("categories")
}

// Product - Sản phẩm trong cửa hàng retail
// Core entity cho retail business
model Product {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  tenantId        String   @db.ObjectId // Multi-tenant isolation
  name            String   // Tên sản phẩm
  description     String?  // Mô tả sản phẩm
  sku             String   // Stock Keeping Unit - mã sản phẩm
  barcode         String?  // Mã vạch sản phẩm
  categoryId      String   @db.ObjectId // Danh mục sản phẩm
  basePrice       Float    // Giá bán cơ bản - không cần specify unit vì sẽ có trong ProductUnit
  baseCost        Float?   // Giá vốn cơ bản - không cần specify unit vì sẽ có trong ProductUnit
  trackInventory  Boolean  @default(true) // Có theo dõi tồn kho không
  isActive        Boolean  @default(true)
  imageUrl        String?  // URL hình ảnh sản phẩm
  tags            Json     @default("[]") // Array of tags for searching
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relationships
  tenant          Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  category        Category   @relation(fields: [categoryId], references: [id])
  productUnits    ProductUnit[] // Các đơn vị bán của sản phẩm với giá riêng
  inventory       Inventory? // Thông tin tồn kho (1-to-1)
  saleItems       SaleItem[] // Các lần bán sản phẩm này
  stockMovements  StockMovement[] // Lịch sử xuất nhập kho

  @@unique([tenantId, sku]) // SKU unique trong 1 tenant
  @@unique([tenantId, barcode]) // Barcode unique trong 1 tenant (nếu có)
  @@index([tenantId, isActive]) // Index cho active products
  @@index([tenantId, categoryId]) // Index cho category filtering
  @@map("products")
}

// Inventory - Quản lý tồn kho cho từng sản phẩm
// Quan trọng cho retail business để track stock levels
model Inventory {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  tenantId          String   @db.ObjectId // Multi-tenant isolation
  productId         String   @unique @db.ObjectId // 1-to-1 với Product
  quantity          Int      @default(0) // Số lượng hiện tại
  reservedQuantity  Int      @default(0) // Số lượng đã reserve (đang trong đơn hàng)
  reorderLevel      Int      @default(10) // Mức cảnh báo hết hàng
  reorderQuantity   Int      @default(100) // Số lượng đặt hàng khi hết
  lastStockUpdate   DateTime @default(now()) // Lần cập nhật stock cuối
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relationships
  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  product           Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([tenantId, quantity]) // Index cho low stock queries
  @@map("inventories")
}

// StockMovement - Lịch sử xuất nhập kho
// Track mọi thay đổi về inventory để audit và reporting
model StockMovement {
  id          String            @id @default(auto()) @map("_id") @db.ObjectId
  tenantId    String            @db.ObjectId // Multi-tenant isolation
  productId   String            @db.ObjectId // Sản phẩm liên quan
  type        StockMovementType // SALE, PURCHASE, ADJUSTMENT, RETURN
  quantity    Float             // Số lượng thay đổi (+/-) - Float để support decimal quantities
  unitId      String            @db.ObjectId // Đơn vị của quantity này
  reason      String?           // Lý do thay đổi
  notes       String?           // Ghi chú thêm
  referenceId String?           @db.ObjectId // ID tham chiếu (sale_id, purchase_id, etc.)
  performedBy String            @db.ObjectId // User ID thực hiện
  createdAt   DateTime          @default(now())

  // Relationships
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])
  unit        Unit     @relation(fields: [unitId], references: [id])

  @@index([tenantId, productId, createdAt]) // Index cho product history
  @@index([tenantId, type, createdAt]) // Index cho movement type queries
  @@map("stock_movements")
}

// ===============================
// UNIT SYSTEM - HỆ THỐNG ĐƠN VỊ
// ===============================

// UnitCategory - Nhóm đơn vị (Weight, Volume, Length, Count, etc.)
// Giúp organize và validate unit conversions
model UnitCategory {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  tenantId    String   @db.ObjectId // Multi-tenant isolation
  name        String   // Tên nhóm đơn vị (Weight, Volume, Length, Count)
  description String?  // Mô tả nhóm đơn vị
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  units       Unit[]   // Các đơn vị thuộc nhóm này

  @@unique([tenantId, name]) // Tên category unique trong 1 tenant
  @@index([tenantId, isActive])
  @@map("unit_categories")
}

// Unit - Đơn vị cơ bản (kg, gram, liter, ml, piece, box, etc.)
// Kho đơn vị của từng tenant - chỉ chứa thông tin cơ bản
model Unit {
  id              String       @id @default(auto()) @map("_id") @db.ObjectId
  tenantId        String       @db.ObjectId // Multi-tenant isolation
  categoryId      String       @db.ObjectId // Nhóm đơn vị
  name            String       // Tên đơn vị (kilogram, gram, liter, piece)
  symbol          String       // Ký hiệu (kg, g, l, pcs)
  description     String?      // Mô tả đơn vị
  isActive        Boolean      @default(true)
  sortOrder       Int          @default(0) // Thứ tự hiển thị
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relationships
  tenant          Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  category        UnitCategory @relation(fields: [categoryId], references: [id])
  productUnits    ProductUnit[] // ProductUnit sử dụng đơn vị này
  stockMovements  StockMovement[] // Stock movements với đơn vị

  @@unique([tenantId, symbol]) // Symbol unique trong 1 tenant
  @@unique([tenantId, categoryId, name]) // Name unique trong 1 category của tenant
  @@index([tenantId, categoryId, isActive])
  @@map("units")
}

// ProductUnit - Đơn vị bán của sản phẩm với giá riêng và logic conversion
// Chứa tất cả business logic về pricing và unit conversion
model ProductUnit {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  productId       String   @db.ObjectId // Sản phẩm
  unitId          String   @db.ObjectId // Đơn vị bán
  baseUnitId      String?  @db.ObjectId // Base unit cho conversion (nullable - base unit sẽ null)
  conversionRate  Float?   // Tỷ lệ chuyển đổi từ unit này về base unit (nullable - base unit sẽ null)
  price           Float    // Giá bán cho đơn vị này
  cost            Float?   // Giá vốn cho đơn vị này (optional)
  isBaseUnit      Boolean  @default(false) // Đây có phải base unit của product không
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relationships
  product         Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  unit            Unit       @relation(fields: [unitId], references: [id])
  baseUnit        Unit?      @relation("ProductUnitBaseUnit", fields: [baseUnitId], references: [id])
  saleItems       SaleItem[] // Các lần bán với ProductUnit này

  @@unique([productId, unitId]) // Một sản phẩm không thể có cùng unit 2 lần
  @@index([productId, isActive])
  @@index([productId, isBaseUnit])
  @@map("product_units")
}
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  product     Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  unit        Unit       @relation(fields: [unitId], references: [id])
  saleItems   SaleItem[] // Các lần bán với đơn vị này

  @@unique([productId, unitId]) // Một sản phẩm không thể có cùng unit 2 lần
  @@index([productId, isActive])
  @@index([productId, isDefault])
  @@map("product_units")
}

// Customer - Quản lý thông tin khách hàng retail
// Core cho CRM và loyalty programs
model Customer {
  id            String       @id @default(auto()) @map("_id") @db.ObjectId
  tenantId      String       @db.ObjectId // Multi-tenant isolation
  name          String       // Tên khách hàng
  email         String?      // Email (optional)
  phone         String?      // Số điện thoại (optional)
  address       Json?        // Địa chỉ (JSON object)
  loyaltyTier   LoyaltyTier  @default(BRONZE) // Tier khách hàng thân thiết
  totalSpent    Float        @default(0) // Tổng tiền đã mua - MongoDB uses Float
  visitCount    Int          @default(0) // Số lần mua hàng
  lastPurchase  DateTime?    // Lần mua cuối
  notes         String?      // Ghi chú về khách hàng
  isActive      Boolean      @default(true)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relationships
  tenant        Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  sales         Sale[]       // Các đơn hàng của khách hàng

  @@unique([tenantId, email]) // Email unique trong 1 tenant (nếu có)
  @@unique([tenantId, phone]) // Phone unique trong 1 tenant (nếu có)
  @@index([tenantId, loyaltyTier]) // Index cho loyalty queries
  @@map("customers")
}

// Sale - Đơn hàng bán hàng (Invoice/Receipt)
// Core transaction entity cho retail business
model Sale {
  id              String        @id @default(auto()) @map("_id") @db.ObjectId
  tenantId        String        @db.ObjectId // Multi-tenant isolation
  saleNumber      String        // Số hóa đơn (auto-generated)
  customerId      String?       @db.ObjectId // Khách hàng (optional - có thể là guest)
  cashierId       String        @db.ObjectId // User bán hàng
  subtotal        Float         // Tổng tiền hàng - MongoDB uses Float
  discountAmount  Float         @default(0) // Tiền giảm giá
  taxAmount       Float         @default(0) // Tiền thuế
  total           Float         // Tổng cộng
  paymentMethod   PaymentMethod @default(CASH) // Phương thức thanh toán
  status          SaleStatus    @default(COMPLETED) // Trạng thái đơn hàng
  notes           String?       // Ghi chú đơn hàng
  refundedAmount  Float         @default(0) // Số tiền đã hoàn
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relationships
  tenant          Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  customer        Customer?     @relation(fields: [customerId], references: [id])
  cashier         User          @relation(fields: [cashierId], references: [id])
  items           SaleItem[]    // Chi tiết các sản phẩm trong đơn hàng
  refunds         Refund[]      // Các lần hoàn tiền

  @@unique([tenantId, saleNumber]) // Sale number unique trong 1 tenant
  @@index([tenantId, status, createdAt]) // Index cho sale queries
  @@index([tenantId, customerId]) // Index cho customer sales
  @@map("sales")
}

// SaleItem - Chi tiết sản phẩm trong từng đơn hàng
// Line items của mỗi sale với đơn vị và giá cụ thể
model SaleItem {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  saleId        String      @db.ObjectId // Đơn hàng chứa item này
  productId     String      @db.ObjectId // Sản phẩm được bán
  productUnitId String      @db.ObjectId // ProductUnit được bán (chứa thông tin unit + price)
  quantity      Float       // Số lượng bán - Float để support decimal quantities
  unitPrice     Float       // Giá bán tại thời điểm đó (từ ProductUnit)
  total         Float       // Thành tiền (quantity * unitPrice)
  discount      Float       @default(0) // Giảm giá cho item này

  // Relationships
  sale          Sale        @relation(fields: [saleId], references: [id], onDelete: Cascade)
  product       Product     @relation(fields: [productId], references: [id])
  productUnit   ProductUnit @relation(fields: [productUnitId], references: [id])

  @@index([saleId]) // Index cho sale items
  @@index([productId]) // Index cho product sales
  @@index([productUnitId]) // Index cho product unit sales
  @@map("sale_items")
}

// Refund - Quản lý hoàn tiền
// Tracking refunds cho customer service và accounting
model Refund {
  id         String    @id @default(auto()) @map("_id") @db.ObjectId
  saleId     String    @db.ObjectId // Đơn hàng được hoàn
  amount     Float     // Số tiền hoàn - MongoDB uses Float
  reason     String    // Lý do hoàn tiền
  notes      String?   // Ghi chú thêm
  approvedBy String    @db.ObjectId // User approve hoàn tiền
  createdAt  DateTime  @default(now())

  // Relationships
  sale       Sale      @relation(fields: [saleId], references: [id])

  @@index([saleId]) // Index cho sale refunds
  @@map("refunds")
}

// ===============================
// ENUMS - ĐỊNH NGHĨA CÁC GIÁ TRỊ CONSTANT
// ===============================

enum DomainType {
  RETAIL     // Bán lẻ - MVP focus
  RESTAURANT // Nhà hàng - Post-MVP
  SERVICE    // Dịch vụ - Future
}

enum TenantStatus {
  TRIAL      // Đang dùng thử
  ACTIVE     // Hoạt động
  SUSPENDED  // Bị tạm ngưng
  CANCELLED  // Đã hủy
}

enum UserRole {
  USER         // Người dùng cơ bản
  CASHIER      // Thu ngân
  MANAGER      // Quản lý
  ADMIN        // Quản trị tenant
  SUPER_ADMIN  // Quản trị hệ thống
}

enum PlanType {
  TRIAL        // Gói dùng thử miễn phí
  BASIC        // Gói cơ bản
  PROFESSIONAL // Gói chuyên nghiệp
  ENTERPRISE   // Gói doanh nghiệp
}

enum SubscriptionStatus {
  TRIAL        // Đang dùng thử
  ACTIVE       // Đang hoạt động
  PAST_DUE     // Quá hạn thanh toán
  CANCELLED    // Đã hủy
  PAUSED       // Tạm dừng
}

enum StockMovementType {
  SALE         // Xuất kho do bán hàng
  PURCHASE     // Nhập kho do mua hàng
  ADJUSTMENT   // Điều chỉnh kho
  RETURN       // Nhập kho do trả hàng
  TRANSFER     // Chuyển kho (future)
  DAMAGE       // Hỏng hóc
}

enum PaymentMethod {
  CASH           // Tiền mặt
  CARD           // Thẻ tín dụng/ghi nợ
  DIGITAL_WALLET // Ví điện tử (MoMo, ZaloPay, etc.)
  BANK_TRANSFER  // Chuyển khoản
  CREDIT         // Trả sau
}

enum LoyaltyTier {
  BRONZE   // Khách hàng đồng
  SILVER   // Khách hàng bạc
  GOLD     // Khách hàng vàng
  PLATINUM // Khách hàng bạch kim
  VIP      // Khách hàng VIP
}

enum SaleStatus {
  PENDING    // Đang xử lý
  COMPLETED  // Hoàn thành
  CANCELLED  // Đã hủy
  REFUNDED   // Đã hoàn tiền
  PARTIAL_REFUND // Hoàn tiền một phần
}
```

## Giải thích mối quan hệ và thiết kế

### 1. Core Domain Relationships

#### User ↔ Tenant (Many-to-Many)
```
User ---> UserTenant <--- Tenant
```
- **Lý do**: Một user có thể làm việc cho nhiều tenants (VD: freelance cashier)
- **UserTenant**: Store role và permissions của user trong từng tenant
- **Security**: Mỗi request phải check user có quyền access tenant không

#### Tenant ↔ Subscription (One-to-One)
```
Tenant ---> Subscription
```
- **Lý do**: Mỗi tenant có 1 subscription plan duy nhất
- **Business Logic**: Subscription limits được check khi create resources
- **Billing**: Track usage và billing period

### 2. Retail Domain Relationships

#### Product Hierarchy
```
Category (Self-referencing) ---> Product ---> Inventory
                            \              \
                             \              \--> ProductUnit (with prices + conversion)
                              \                      \
                               \--> SaleItem --------/
```
- **Category**: Hierarchical structure cho organizing products
- **Product**: Core entity với SKU, base pricing (reference only)
- **ProductUnit**: Business logic layer với pricing, conversion rates, base unit relationships
- **Inventory**: 1-to-1 relationship để track stock levels (conversion via ProductUnit)
- **SaleItem**: Reference đến ProductUnit để lấy complete unit + price + conversion information

#### Sales Flow
```
Customer ---> Sale ---> SaleItem ---> Product
     \             \
      \             \--> Refund
       \
        \--> Multiple Sales (purchase history)
```
- **Customer**: Optional - có thể là guest purchase
- **Sale**: Core transaction với payment method, totals
- **SaleItem**: Line items với quantity, pricing tại thời điểm bán
- **Refund**: Track partial/full refunds cho accounting

#### Inventory Management
```
Product ---> Inventory ---> StockMovement
```
- **Inventory**: Current stock levels, reorder points
- **StockMovement**: Audit trail cho mọi stock changes
- **Business Rules**: 
  - Stock được update khi có sale
  - Low stock alerts khi quantity < reorderLevel
  - Reserved quantity cho pending sales

#### Unit System (Hệ thống đơn vị) - Simplified Logic
```
UnitCategory ---> Unit (Simple metadata only)
                    \
                     \--> ProductUnit (Complete business logic)
                            \
                             \--> SaleItem
                              \
                               \--> StockMovement (via ProductUnit.unitId)
```
- **UnitCategory**: Nhóm đơn vị (Weight, Volume, Length, Count)
- **Unit**: Simple unit definitions (name, symbol, description only)
- **ProductUnit**: Business logic layer (pricing, conversion rates, base unit relationships)
- **Logic Flow**:
  1. Tenant setup simple units (no conversion logic)
  2. Tạo ProductUnits với conversion rates và pricing
  3. Sales chọn ProductUnit (contains everything needed)
  4. Inventory conversion through ProductUnit logic

### 3. Multi-tenant Isolation

#### Row-Level Security
- **Mọi bảng** đều có `tenantId` field
- **Mọi query** đều được filter theo tenantId
- **Middleware**: Auto-inject tenantId vào queries
- **Indexes**: Compound indexes với tenantId đầu tiên

#### Data Separation Examples
```javascript
// Product query cho tenant specific trong MongoDB
db.products.find({ tenantId: ObjectId("tenant_123"), isActive: true });

// Sale report cho 1 tenant
db.sales.find({ 
  tenantId: ObjectId("tenant_123"), 
  createdAt: { $gte: new Date("2024-01-01") } 
});

// Unit conversion example
db.units.find({ 
  tenantId: ObjectId("tenant_123"), 
  categoryId: ObjectId("weight_category_id") 
});
```

### 4. Extensibility cho Future Domains

#### Restaurant Domain (Post-MVP)
```sql
-- Có thể thêm tables:
model RestaurantTable {
  id       String @id
  tenantId String
  number   Int
  // ... restaurant-specific fields
}

model MenuCategory {
  id       String @id  
  tenantId String
  // ... menu-specific fields
}
```

#### Pharmacy Domain (Post-MVP)
```sql
-- Có thể thêm tables:
model Medicine {
  id            String @id
  tenantId      String
  prescriptionRequired Boolean
  // ... pharmacy-specific fields
}

model Prescription {
  id       String @id
  tenantId String 
  // ... prescription fields
}
```

### 5. Performance Considerations

#### Essential Indexes cho MongoDB
```javascript
// Multi-tenant queries
db.products.createIndex({ tenantId: 1, isActive: 1 });
db.sales.createIndex({ tenantId: 1, createdAt: -1 });
db.customers.createIndex({ tenantId: 1, loyaltyTier: 1 });

// Business logic indexes  
db.inventories.createIndex({ tenantId: 1, quantity: 1 });
db.products.createIndex({ tenantId: 1, categoryId: 1 });

// Unit system indexes
db.units.createIndex({ tenantId: 1, categoryId: 1, isActive: 1 });
db.units.createIndex({ tenantId: 1, symbol: 1 });
db.unit_categories.createIndex({ tenantId: 1, isActive: 1 });

// Text search indexes
db.products.createIndex({ 
  tenantId: 1, 
  name: "text", 
  description: "text", 
  sku: "text" 
});
```

#### Query Patterns
- **List products**: `tenantId + isActive`
- **Low stock alerts**: `tenantId + quantity < reorderLevel`
- **Sales reporting**: `tenantId + date range`
- **Customer lookup**: `tenantId + email/phone`

### 6. Business Rules Enforcement

#### Application-level Constraints (MongoDB)
```javascript
// SKU unique per tenant - handled in application
const existingSKU = await Product.findOne({ tenantId, sku });
if (existingSKU) throw new Error("SKU already exists");

// Email unique per tenant (if provided)
const existingEmail = await Customer.findOne({ tenantId, email });
if (existingEmail) throw new Error("Email already exists");

// Sale number unique per tenant
const existingSaleNumber = await Sale.findOne({ tenantId, saleNumber });
if (existingSaleNumber) throw new Error("Sale number already exists");
```

#### Application-level Rules
- **Inventory**: Stock cannot go negative
- **Sales**: Subtotal = sum of line items  
- **Refunds**: Cannot exceed original sale amount
- **Subscriptions**: Check limits before creating resources
- **Money precision**: Use libraries like `decimal.js` cho accurate financial calculations

## MongoDB vs PostgreSQL - Cân nhắc quan trọng

### ✅ Ưu điểm MongoDB cho POS System:
- **Flexible schema**: Dễ thêm fields mới cho different domains
- **JSON-native**: Perfect cho settings, tags, address objects
- **Horizontal scaling**: Better cho multi-tenant growth
- **Aggregation pipeline**: Powerful cho reporting queries
- **Text search**: Built-in full-text search cho products

### ⚠️ Nhược điểm cần lưu ý:
- **No ACID transactions across collections**: Cần design cẩn thận
- **Float precision**: Money calculations cần special handling  
- **No foreign key constraints**: Phải handle trong application
- **Data consistency**: Cần implement validation logic cẩn thận

### 💡 Khuyến nghị:
**Cho retail POS system, MongoDB phù hợp nếu:**
- Team có experience với NoSQL
- Cần flexibility cho future domains
- Plan to scale horizontally  
- Accept trade-offs về ACID compliance

**Stick với PostgreSQL nếu:**
- Cần strict ACID transactions
- Team prefer SQL và relational constraints
- Financial accuracy là critical (built-in Decimal type)
- Prefer database-level data integrity

Thiết kế này đảm bảo scalability cho MVP retail và extensibility cho future domains với MongoDB! 

### 🚀 Để implement với MongoDB:

1. **Setup MongoDB Atlas** hoặc local MongoDB
2. **Connection string**: `mongodb://localhost:27017/pos-system`
3. **Prisma generate**: Sẽ tạo MongoDB-compatible client
4. **Implement validation**: Application-level constraints trong services
5. **Use Decimal.js**: Cho accurate money calculations

```env
DATABASE_URL="mongodb://localhost:27017/pos-system"
```

> **� Ghi chú**: Chi tiết implementation cho Unit System đã được chuyển sang [Unit Module Documentation](../modules/unit.md) để dễ quản lý và maintain.