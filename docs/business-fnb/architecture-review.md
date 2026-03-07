# POS Multi-Module Schema Architecture

## Implementation Strategy

**Date:** 06/03/2026  
**Version:** 1.0  
**Status:** Ready for Review & Discussion

---

## Executive Summary

1. **Retail POS Module** (Existing) - Schema đã hoàn thiện
2. **F&B POS Module** (New) - Cần implement

**Challenges:**

- Schema RETAIL và F&B có overlapping entities (Store, User, Order, Payment, etc.)
- Cần chia sẻ base entities mà không conflicts
- Mỗi module có business logic riêng (Inventory vs Table Management)
- Tránh schema duplication & data inconsistency

**Solution Approach:**

- **Shared Foundation Layer** - Core entities (User, Store, Auth, Assets)
- **Module-Specific Schemas** - Isolated business logic per module
- **Cross-Module Contracts** - Defined interfaces giữa modules

---

## Part 1: Schema Architecture Overview

### 1.1 Current State Analysis

#### Retail POS Module (Existing)

```
✅ User, Store, StoreMember (Auth & Multi-tenant)
✅ Product, Variant, Category, Tag (Inventory)
✅ Order, OrderItem (Sales)
✅ OrderReturn, OrderReturnItem (Return Management)
✅ PurchaseOrder, PurchaseOrderItem (Buying)
✅ PurchaseReturn, PurchaseReturnItem (Supplier Returns)
✅ Supplier, Customer (Contacts)
✅ StockMovement, VariantStock (Inventory Tracking)
✅ Payment Models (Cash, Card transactions)
✅ StatisticsDaily (Analytics)
✅ Asset, AssetLink (File Management)
✅ Bundle, BundleItem (Product Bundling)
```

#### F&B POS Module (Planned - From Feature Doc)

```
❌ FnBTable, TableStatusHistory (Dine-in specific)
❌ FnBMenuCategory, FnBMenuItem (Menu management)
❌ FnBOrder, FnBOrderItem (Table-based orders)
❌ FnBOrderPayment (Payment per order)
❌ FnBReceipt (Receipt generation)
❌ KDSDisplay (Kitchen Display)
❌ TableQRCode, MobileMenuSession (QR menu)
❌ FnBStoreConfig, FnBPOSConfig (F&B settings)
```

### 1.2 Problem Analysis: Overlapping Entities

```
CONFLICT POINTS:

1. Order Management:
   ├─ Retail: Order → OrderItem (order_id, product_id, variant_id)
   ├─ F&B: FnBOrder → FnBOrderItem (order_id, menu_item_id, qty, notes)
   └─ ISSUE: Different schema, different item model

2. Payment:
   ├─ Retail: No dedicated payment table, integrated in Order
   ├─ F&B: FnBOrderPayment (separate payment tracking)
   └─ ISSUE: Inconsistent payment handling

3. Customer/Contact:
   ├─ Retail: Customer (pre-defined)
   ├─ F&B: No customer model (guest ordering via QR)
   └─ ISSUE: Different customer models

4. Analytics:
   ├─ Retail: StatisticsDaily (product, units, revenue)
   ├─ F&B: FnBDailyStatistics (table, meal time, KDS)
   └─ ISSUE: Separate analytics models

5. Configuration:
   ├─ Retail: implicit in Store
   ├─ F&B: FnBStoreConfig, FnBPOSConfig (explicit)
   └─ ISSUE: Different config approaches
```

### 1.3 Multi-Module Architecture Principles

```
┌──────────────────────────────────────────────────────┐
│          MULTI-MODULE POS ARCHITECTURE                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  LAYER 1: SHARED FOUNDATION                         │
│  ┌────────────────────────────────────────┐         │
│  │ • User, AdminUser (Auth)               │         │
│  │ • Store, StoreMember (Multi-tenant)    │         │
│  │ • Asset, AssetLink (File storage)      │         │
│  │ • Enums (Common payment methods, etc.) │         │
│  └────────────────────────────────────────┘         │
│                                                      │
│  LAYER 2: MODULE-SPECIFIC SCHEMAS                   │
│  ┌──────────────────┬──────────────────────┐        │
│  │   RETAIL MODULE  │    F&B MODULE        │        │
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
│  LAYER 3: INTEGRATION LAYER                         │
│  ┌────────────────────────────────────────┐         │
│  │ • Order Sync (Retail ↔ F&B)           │         │
│  │ • Unified Payment (Cash Book, Finance) │         │
│  │ • Cross-Module Analytics               │         │
│  │ • Shared Events (Order placed, etc.)   │         │
│  └────────────────────────────────────────┘         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Part 2: Recommended Schema Design

### 2.1 Shared Foundation Layer (Core)

Keep existing retail schema intact + add minimal F&B extensions:

```prisma
// =====================================
// SHARED FOUNDATION - NO CHANGES
// =====================================

// Auth & Multi-tenant (Already exists, reuse)
model User {
  id            String
  email         String  @unique
  role          user_role
  status        user_status
  // ... (keep as-is)
}

model Store {
  id            String  @id
  owner_id      String
  name          String
  business_hour String?
  // ADD: Business type to differentiate modules
  business_type BusinessType @default(RETAIL)
  // ... (keep as-is)
}

enum BusinessType {
  RETAIL          // Pure retail
  F&B            // Pure restaurant/cafe
  RETAIL_F&B     // Hybrid (both retail + dine-in)
  SERVICE        // Service business (future)
  PHARMACY       // Pharmacy (future)
}

// Assets (Keep as-is, shared by all modules)
model Asset {
  id              String
  store_id        String
  // ... (already good)
}

// Contact Types (Extend enum)
enum contact_type {
  CUSTOMER
  SUPPLIER
  STAFF
  TABLE_CUSTOMER   // NEW: For F&B guest tracking (optional)
}
```

**Why this approach:**

- ✅ Minimal changes to existing retail code
- ✅ Explicit module identification (business_type)
- ✅ Foundation can scale to Service/Pharmacy modules
- ✅ No schema migrations for existing stores

---

### 2.2 Retail Module Schema (Keep Almost As-Is)

```prisma
// =====================================
// RETAIL MODULE - Minimal changes
// =====================================

// Product Hierarchy (Unchanged)
model Product {
  id              String
  store_id        String
  name            String
  sku             String
  baseUnit        String
  product_status  product_status
  // ... (keep as-is)
}

model Variant {
  id              String
  product_id      String
  sku             String
  barcode         String?
  name            String
  price           Int     // Retail selling price
  cost            Int?    // COGS
  // ... (keep as-is)
}

// Inventory Management (Unchanged)
model VariantStock {
  id              String
  variant_id      String
  onHand          Int
  reserved        Int?
  damaged         Int?
  // ... (keep as-is)
}

// Sales Order (Retail) - KEEP AS-IS
model Order {
  id              String
  code            String?
  store_id        String
  customer_id     String?
  cashier_id      String

  // Amounts
  subtotal_amount Int
  discount_amount Int
  tax_amount      Int
  total_amount    Int

  // Payment (embedded, no separate table)
  payment_method  payment_method
  customer_pay_amount Int
  change_amount   Int
  status          order_status

  // ... (keep as-is)
}

model OrderItem {
  id              String
  order_id        String
  variant_id      String
  product_id      String
  quantity        Int
  price           Int     // Unit price at order time
  total           Int
  // ... (keep as-is)
}

// Purchase Orders (Unchanged)
model PurchaseOrder {
  id              String
  store_id        String
  supplier_id     String
  // ... (keep as-is)
}

model PurchaseOrderItem {
  id              String
  purchase_order_id String
  product_id      String
  variant_id      String
  // ... (keep as-is)
}

// Analytics - Retail focused
model StatisticsDaily {
  id              String
  store_id        String
  stat_date       DateTime

  orders_count    Int
  gross_revenue   Decimal
  units_sold      Int
  // ... (keep as-is)
}
```

**Changes: NONE** (Backward compatible)

---

### 2.3 F&B Module Schema (NEW)

Create separate Prisma schema file: `prisma/schemas/fnb.prisma`

```prisma
// =====================================
// F&B MODULE - Completely NEW
// =====================================

// ===== TABLE MANAGEMENT =====

model FnBTable {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid

  code            String   // T01, T02 (unique per store)
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

  // Relations
  orders          FnBOrder[]
  qr_code         TableQRCode?

  @@unique([store_id, code])
  @@index([store_id, status])
  @@map("fnb_table")
}

enum FnBTableStatus {
  AVAILABLE
  OCCUPIED
  CLEANING
  RESERVED
  OUT_OF_SERVICE
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

// ===== MENU MANAGEMENT =====

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

  // Pricing
  price           Decimal  @db.Decimal(15, 2)  // Selling price
  cost            Decimal? @db.Decimal(15, 2)  // COGS (optional, for analysis)

  // Availability
  is_available    Boolean  @default(true)
  quantity_limited Boolean @default(false)
  quantity_available Int?

  // Metadata
  preparation_time Int?    // minutes for KDS
  is_spicy        Boolean? @default(false)
  is_vegetarian   Boolean? @default(false)
  allergens       String?
  tags            String[] // "bestseller", "new"

  display_order   Int      @default(0)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  order_items     FnBOrderItem[]

  @@unique([store_id, name])
  @@index([store_id, category_id, is_available])
  @@map("fnb_menu_item")
}

// ===== ORDER MANAGEMENT (F&B specific) =====

model FnBOrder {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid
  table_id        String   @db.Uuid

  order_code      String   // ORD20260304001
  order_type      FnBOrderType @default(DINE_IN)
  status          FnBOrderStatus @default(PENDING)

  // Customer info (for dine-in, can be empty)
  customer_count  Int?
  customer_name   String?
  customer_phone  String?

  // Amounts
  subtotal_amount Decimal  @default(0) @db.Decimal(15, 2)
  discount_amount Decimal  @default(0) @db.Decimal(15, 2)
  discount_rate   Decimal? @db.Decimal(5, 2)
  discount_reason String?

  tax_amount      Decimal  @default(0) @db.Decimal(15, 2)
  tax_rate        Decimal  @default(10) @db.Decimal(5, 2)

  service_charge  Decimal  @default(0) @db.Decimal(15, 2)
  total_amount    Decimal  @default(0) @db.Decimal(15, 2)

  // Payment (linked to FnBOrderPayment, see below)
  payment_status  payment_status @default(UNPAID)

  // Timestamps
  seated_at       DateTime?
  served_at       DateTime?
  paid_at         DateTime?
  cancelled_at    DateTime?

  notes           String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  // Relations
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
  DINE_IN
  TAKEOUT
  DELIVERY
}

enum FnBOrderStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
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

  // Relations
  order           FnBOrder @relation(fields: [order_id], references: [id])
  menu_item       FnBMenuItem @relation(fields: [menu_item_id], references: [id])

  @@index([order_id])
  @@index([status])
  @@map("fnb_order_item")
}

enum FnBOrderItemStatus {
  PENDING
  PREPARING
  PREPARED
  SERVED
  CANCELLED
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
  ITEM_ADDED
  ITEM_REMOVED
  QUANTITY_CHANGED
  DISCOUNT_APPLIED
}

// ===== PAYMENT (Separate from Order) =====

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

// ===== RECEIPT/INVOICE =====

model FnBReceipt {
  id              String   @id @default(uuid()) @db.Uuid
  order_id        String   @unique @db.Uuid

  receipt_number  String   @unique  // HD20260304001
  receipt_type    FnBReceiptType

  store_info      Json     // Snapshot of store data
  table_info      Json     // Snapshot of table data
  items_data      Json     // Snapshot of order items
  amounts_data    Json     // Snapshot of amounts
  payment_info    Json     // Snapshot of payment

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
  SALES
  REFUND
}

// ===== KITCHEN DISPLAY SYSTEM (KDS) =====

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
  PENDING
  PREPARING
  PREPARED
  SERVED
  CANCELLED
}

// ===== QR CODE MENU & MOBILE ORDERING =====

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

// ===== CONFIGURATION =====

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
  THERMAL
  INKJET
  NONE
}

// ===== ANALYTICS =====

model FnBDailyStatistics {
  id              String   @id @default(uuid()) @db.Uuid
  store_id        String   @db.Uuid
  stat_date       DateTime

  // Orders
  orders_count    Int      @default(0)
  paid_orders     Int      @default(0)

  // Revenue
  gross_revenue   Decimal  @default(0) @db.Decimal(15, 2)
  discount_total  Decimal  @default(0) @db.Decimal(15, 2)
  tax_total       Decimal  @default(0) @db.Decimal(15, 2)
  net_revenue     Decimal  @default(0) @db.Decimal(15, 2)

  // Tables
  tables_used     Int      @default(0)
  avg_customers_per_order Int?
  avg_table_turnover_mins Int?

  // Items
  items_sold      Int      @default(0)
  top_item        String?

  // Timing
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

**Key Design Decisions:**

✅ Completely separate from Retail schema  
✅ No foreign keys to Retail tables (except Store)  
✅ Decimal types for prices (consistency with Retail)  
✅ JSON snapshots for Receipt (immutable data)  
✅ Separate FnBOrderPayment (vs embedded in Order)  
✅ Dedicated analytics tables (different metrics)

---

## Part 3: Folder Structure & Project Organization

### 3.1 Recommended Backend Structure

```
backend/
├── src/
│   ├── common/                          # Shared code
│   │   ├── filters/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── fnb.guard.ts            # @FnBGuard - Check if module enabled
│   │   │   └── role.guard.ts
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   ├── middleware/
│   │   │   ├── store-context.middleware.ts
│   │   │   └── logging.middleware.ts
│   │   ├── decorators/
│   │   │   ├── store.decorator.ts
│   │   │   └── user.decorator.ts
│   │   ├── exceptions/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── modules/
│   │   ├── auth/                       # Core Auth (shared by all modules)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── store/                      # Store Management (shared)
│   │   │   ├── store.controller.ts
│   │   │   ├── store.service.ts
│   │   │   ├── dto/
│   │   │   └── store.module.ts
│   │   │
│   │   ├── user/                       # User Management (shared)
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.module.ts
│   │   │
│   │   ├── asset/                      # File Management (shared)
│   │   │   ├── asset.controller.ts
│   │   │   ├── asset.service.ts
│   │   │   └── asset.module.ts
│   │   │
│   │   ├── retail/                     # RETAIL MODULE ===
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
│   │   │   └── retail.module.ts        # Main module, imports all submodules
│   │   │
│   │   ├── fnb/                        # F&B MODULE ===
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
│   │   │   ├── kds/                   # Kitchen Display System
│   │   │   │   ├── kds.gateway.ts     # WebSocket
│   │   │   │   ├── kds.controller.ts
│   │   │   │   ├── kds.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── kds.module.ts
│   │   │   │
│   │   │   ├── qr-menu/              # QR Code & Mobile Ordering
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
│   │   │   ├── config/               # F&B Configuration
│   │   │   │   ├── fnb-config.controller.ts
│   │   │   │   ├── fnb-config.service.ts
│   │   │   │   └── fnb-config.module.ts
│   │   │   │
│   │   │   ├── analytics/            # F&B Analytics
│   │   │   │   ├── fnb-analytics.controller.ts
│   │   │   │   ├── fnb-analytics.service.ts
│   │   │   │   ├── jobs/
│   │   │   │   │   └── daily-statistics.job.ts
│   │   │   │   └── fnb-analytics.module.ts
│   │   │   │
│   │   │   └── fnb.module.ts         # Main F&B module
│   │   │
│   │   └── shared/                   # Shared module (if needed)
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
│   ├── schema.prisma                # Main schema (Retail + shared foundation)
│   ├── schemas/
│   │   └── fnb.prisma              # F&B schema (for documentation, optional)
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

### 3.2 Key Folder Organization Principles

```
┌────────────────────────────────────────────────────────┐
│         FOLDER ORGANIZATION BEST PRACTICES              │
├────────────────────────────────────────────────────────┤
│                                                        │
│ 1. COMMON (Shared by all modules)                      │
│    Location: src/common, src/modules/auth, etc.       │
│    Purpose: Guards, Filters, Middleware, Decorators    │
│    Rule: NO imports from retail or fnb modules        │
│                                                        │
│ 2. MODULE-SPECIFIC (Isolated per module)              │
│    Location: src/modules/retail/, src/modules/fnb/    │
│    Purpose: Business logic, controllers, services      │
│    Rule: Can import from common, NOT other modules    │
│    Exception: Can import shared models/interfaces      │
│                                                        │
│ 3. INTEGRATION LAYER (Cross-module)                   │
│    Location: src/shared/ or src/integrations/         │
│    Purpose: Events, DTOs, shared interfaces           │
│    Rule: Both modules can import, NO cyclic deps       │
│                                                        │
│ 4. PRISMA SCHEMA (Single source of truth)             │
│    Location: prisma/schema.prisma                     │
│    Rule: All entities defined in ONE file              │
│    Note: fnb.prisma is documentation only             │
│                                                        │
│ 5. TESTS (Mirror module structure)                    │
│    Location: test/unit/{retail,fnb}/                  │
│    Rule: Test paths match module paths                │
│    Example: src/modules/fnb/table/ → test/unit/fnb/table/
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Part 4: Implementation Strategy & Timeline

### 4.1 Phase 1: Foundation Setup (Week 1-2)

**Goal:** Setup infrastructure to support both modules

**Tasks:**

1. Extend Prisma schema with F&B models ✓
2. Create FnB module structure ✓
3. Setup module dependency injection
4. Create FnB guards (@FnBGuard) & middleware
5. Setup business_type in Store model
6. Create F&B specific enums & constants
7. Write tests for foundation

**Checklist:**

```
□ Prisma migration created (001_add_fnb_module)
□ FnB module folder structure created
□ @FnBGuard implemented and tested
□ Store.business_type enum defined
□ Documentation updated (README, ARCHITECTURE.md)
□ All tests passing for foundation
```

---

### 4.2 Phase 2: Core F&B Features (Week 3-5)

**Goal:** Implement F0-F8 from feature doc

**Sprint 1 (Week 3):** F0, F1, F2, F3, F4, F5

```
- Core Infrastructure (F0)
- Auth & Multi-tenant (F1) - reuse existing
- F&B Config (F2)
- Table Management (F3)
- Menu Management (F4)
- Store Configuration (F5)

Deliverables:
□ API endpoints for table/menu/config
□ Database migrations
□ Unit tests (80%+ coverage)
□ Integration tests for CRUD operations
```

**Sprint 2 (Week 4):** F6, F7, F8

```
- Order Creation (F6)
- Order Payment (F7)
- Receipt (F8)

Deliverables:
□ Complete order flow (create → add items → pay)
□ Payment processing
□ Receipt generation
□ E2E tests for order workflows
```

---

### 4.3 Phase 3: Operations & Analytics (Week 6-8)

**Sprint 3 (Week 6):** F9, F10, F11

```
- Kitchen Display System (F9)
- Table Status Management (F10)
- Order Modifications (F11)

Deliverables:
□ WebSocket implementation for KDS
□ Real-time table updates
□ Order modification tracking
□ Integration tests
```

**Sprint 4 (Week 7-8):** F12-F14, Frontend

```
- Daily Analytics (F12)
- Table Analytics (F13)
- Reports (F14)
- Frontend components (F15-F19)

Deliverables:
□ Analytics cron jobs
□ Reports export
□ Frontend UI components
□ E2E tests for complete workflows
```

---

### 4.4 Phase 4: Advanced Features (Week 9-12)

**Sprint 5-6:** F20-F23

```
- QR Code Menu (F23) - Priority
- AI Suggestions (F20)
- Loyalty Program (F21)
- Multi-Location Sync (F22)

Deliverables:
□ QR code generation
□ Mobile menu web app
□ Analytics for QR orders
□ All acceptance criteria met
```

---

## Part 5: Questions to Ask Tech Lead

### 5.1 Architecture & Design

**Q1: Module Isolation Level**

```
Question:
Should retail and F&B modules have:
A) Complete isolation (separate services in future)?
B) Shared database, isolated code (current approach)?
C) Hybrid (shared Store/User, separate Orders)?

Why ask: Affects dependency direction, caching strategy, scalability

Recommendation: Option B for now
- Single PostgreSQL database
- Isolated NestJS modules
- Clear domain boundaries
- Can evolve to separate services (Option A) later if needed
```

**Q2: Cross-Module Data Access**

```
Question:
Can F&B OrderPayment access Retail VariantStock for sync?
Can both modules write to common tables (Store, User)?

Why ask: Affects transaction handling, data consistency

Recommendation:
- ✅ Both modules can READ from shared tables
- ✅ Both modules can WRITE to shared tables (Auth, Store config)
- ❌ Retail should NOT read from F&B specific tables directly
- ❌ F&B should NOT read from Retail inventory (use events instead)
```

**Q3: Payment Unification**

```
Question:
Should F&B use same payment processing as Retail, or separate pipeline?

Current state:
- Retail: payment_method embedded in Order
- F&B: FnBOrderPayment (separate table)

Recommendation:
Option 1 (Recommended): Separate for now
- F&B has simpler flow (dine-in mostly cash)
- Retail has complex returns, installments
- Can merge later if needed

Option 2: Unified Payment Service
- Create abstract PaymentProcessor interface
- RetailPaymentProcessor, FnBPaymentProcessor implement it
- Shared CashTransaction for finance module
```

---

### 5.2 Implementation & Code Structure

**Q4: Prisma Schema Organization**

```
Question:
Keep single prisma/schema.prisma with all models, or split into multiple files?

Options:
A) Single file (current approach) - Simple but grows large
B) Multiple files with @include/@extend - Advanced Prisma feature
C) Separate databases per module - Complex, not recommended for now

Recommendation: Option A
- Keep single file for simplicity
- Add clear section comments (// === F&B MODELS ===)
- Max ~100 tables per file is manageable
- If > 150 models in future, consider splitting

Visual organization:
```

**Q5: Repository Pattern**

```
Question:
Should we use Repository pattern for data access?

Options:
A) Direct Prisma in services (simple, current approach)
B) Repository layer + dependency injection (clean architecture)
C) Hybrid (repositories for complex queries only)

Recommendation: Option C (Pragmatic)
- Use repositories for main entities (Order, Table, MenuItem)
- Direct Prisma for simple CRUD
- Repositories handle complex queries, transactions

Benefits:
✅ Easier testing (mock repositories)
✅ Cleaner business logic
✅ Database agnostic if needed
```

**Q6: Module Dependencies**

```
Question:
Should FnB module depend on Retail module for shared services?

Recommendation: NO
- Each module should be independent
- Use dependency injection for shared services
- Import from src/common, not src/modules/retail

Anti-pattern:
❌ fnb/order/order.service -> retail/product/product.service

Correct pattern:
✅ fnb/order/order.service -> common/cache/cache.service
✅ fnb/order/order.service -> shared/database/database.service
```

---

### 5.3 Testing & Quality

**Q7: Testing Strategy**

```
Question:
What's the testing approach for multi-module system?

Recommendation: Pyramid approach
- 60% Unit tests (individual services, repositories)
- 25% Integration tests (module-level workflows)
- 15% E2E tests (cross-module scenarios)

Key test files:
test/unit/fnb/table/table.service.spec.ts
test/unit/fnb/order/order.service.spec.ts
test/integration/fnb/order-workflow.spec.ts
test/e2e/fnb/order-to-payment.e2e.spec.ts

Target coverage: >80% per module
```

**Q8: Database Transactions**

````
Question:
How to handle multi-step operations across tables?
(e.g., Create Order → Add Items → Process Payment → Update Table Status)

Recommendation: Prisma $transaction()
```typescript
await prisma.$transaction(async (tx) => {
  // Step 1: Create order
  const order = await tx.fnbOrder.create({ ... });

  // Step 2: Add items
  await tx.fnbOrderItem.create({ ... });

  // Step 3: Process payment
  await tx.fnbOrderPayment.create({ ... });

  // Step 4: Update table
  await tx.fnbTable.update({ ... });

  // All succeed or all rollback
});
````

Benefit: ACID guarantees for complex workflows

```

---

### 5.4 DevOps & Deployment

**Q9: Environment Parity**
```

Question:
How to ensure dev/staging/prod have same schema version?

Recommendation: Git-based migrations

- Check in migrations to version control
- Run migrations as part of deployment
- Use Prisma migrate command
- Tag releases with schema version

Before deploy:

1. Run prisma migrate deploy on staging
2. Test thoroughly
3. Same process to production

```

**Q10: Backward Compatibility**
```

Question:
How to add F&B models without breaking Retail in production?

Strategy:

1. Add new tables to schema (F&B specific)
2. Run migration as additive (no changes to Retail tables)
3. Deploy code (new module is feature-gated)
4. Enable for specific stores via business_type
5. Gradual rollout: beta stores → all stores

Risk mitigation:

- Retail stores never see F&B tables
- Retail API unchanged
- Feature flags control module access
- Easy rollback (just change business_type)

```

---

## Part 6: Implementation Checklist

### 6.1 Before Writing Code

- [ ] Review this document with backend team
- [ ] Align on multi-module architecture approach
- [ ] Decide on Prisma schema organization
- [ ] Define shared vs module-specific folder structure
- [ ] Setup database migration strategy
- [ ] Create module dependency diagram (visio/miro)
- [ ] Establish code review standards for multi-module
- [ ] Create shared constants/enums file
- [ ] Setup eslint rules for import restrictions

### 6.2 Phase 1: Foundation

- [ ] Extend Prisma schema with F&B models
- [ ] Create Prisma migration (001_add_fnb)
- [ ] Setup FnBModule in NestJS
- [ ] Create @FnBGuard decorator
- [ ] Create FnB middleware (StoreContext)
- [ ] Add business_type to Store model
- [ ] Create FnB DTOs base structure
- [ ] Write foundation tests
- [ ] Update documentation

### 6.3 Phase 2: Core Features (F0-F8)

**Per feature:**
- [ ] Create entity/service/controller
- [ ] Write business logic + validation
- [ ] Create migration if needed
- [ ] Write DTOs + API contracts
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests for workflows
- [ ] API documentation (Swagger)
- [ ] Update architectural docs

### 6.4 Testing

- [ ] Unit tests for services/repositories
- [ ] Integration tests for workflows
- [ ] E2E tests for complete scenarios
- [ ] Load testing for WebSocket (KDS)
- [ ] Multi-tenant isolation tests
- [ ] Cross-module data access tests
- [ ] Database transaction tests

### 6.5 Documentation

- [ ] Architecture diagram (modules, dependencies)
- [ ] Database schema diagram
- [ ] API documentation (Swagger)
- [ ] Folder structure guide
- [ ] Module implementation guide
- [ ] Testing strategy document
- [ ] Deployment checklist
- [ ] Troubleshooting guide

---

## Part 7: Risk Mitigation

### 7.1 Common Pitfalls

```

❌ ANTI-PATTERN 1: Shared Order Table
Problem: Mixing Retail Order + F&B Order in same table

- Different schemas (variant_id vs menu_item_id)
- Different workflows (return vs modify)
- Different calculations (discount vs service charge)
  Solution: ✅ Separate FnBOrder table

❌ ANTI-PATTERN 2: Cross-Module Dependencies
Problem: fnb/order depends on retail/product

- Creates circular dependency risk
- Hard to test in isolation
- Couples unrelated modules
  Solution: ✅ Use events/message queue for communication

❌ ANTI-PATTERN 3: Shared Payment Table
Problem: Single Payment table for both modules

- Different data per module (table_id for F&B, etc.)
- Different workflows (refund vs return)
- Different reporting needs
  Solution: ✅ Separate FnBOrderPayment, keep Retail embedded

❌ ANTI-PATTERN 4: Monolithic Service
Problem: OrderService does everything (create, pay, return, analytics)

- Hard to test
- Hard to maintain
- Performance issues
  Solution: ✅ Break into: CreateOrderService, PaymentService,
  ModificationService, AnalyticsService

❌ ANTI-PATTERN 5: No Feature Flag
Problem: Deploy both modules, can't disable F&B if bugs

- Breaking changes to Retail
- No gradual rollout
- Risky deployment
  Solution: ✅ Use business_type + @FnBGuard for feature control

```

### 7.2 Monitoring & Observability

```

Must-Have Metrics:

1. Module Health:
   - F&B module API response time
   - Table CRUD operations per second
   - Order creation latency

2. Data Consistency:
   - Order → Payment mismatch count
   - Orphaned OrderItems
   - Table status transitions (invalid state changes)

3. Business Metrics:
   - Orders per hour (F&B)
   - Average order value
   - Table turnover time
   - QR code scan conversion rate

4. Infrastructure:
   - WebSocket connections (KDS)
   - Database connection pool usage
   - Redis cache hit rate
   - File upload success rate

````

---

## Part 8: Questions to Confirm With Tech Lead

### Template for Tech Lead Meeting

```markdown
# Multi-Module POS Implementation - Tech Lead Alignment

## Overview
We're implementing a multi-module POS system with Retail (existing)
and F&B (new) modules. This document outlines architecture and seeks
your approval before development starts.

## Key Decisions to Confirm

### 1. Schema Organization
**Recommendation:** Single Prisma schema file with clear sections
- [ ] Approved
- [ ] Needs discussion
- [ ] Rejected

**Questions:**
- Should we use separate Prisma files for documentation purposes?
- Any concerns with ~30 new tables added to existing schema?
- Timeline for potential database sharding (if > 50 stores)?

### 2. Module Structure
**Recommendation:** Independent NestJS modules in src/modules/{retail,fnb}
- [ ] Approved
- [ ] Needs discussion
- [ ] Rejected

**Questions:**
- Any preference on import restrictions between modules?
- Should we use module aliases (@modules/* vs relative imports)?
- Testing structure: mirror production or flat?

### 3. Data Sharing
**Recommendation:**
- Shared: User, Store, Asset, Auth
- Isolated: Orders, Products, Tables, Menus
- [ ] Approved
- [ ] Needs discussion
- [ ] Rejected

**Questions:**
- How strictly enforce module boundaries? (ESLint rules?)
- Cross-module events needed for sync? (e.g., Order created → Finance)
- Caching strategy per module or centralized?

### 4. Implementation Timeline
**Recommendation:** 12-16 weeks total
- Foundation: 2 weeks
- Core Features: 6 weeks
- Operations: 4 weeks
- Advanced: 4 weeks
- [ ] Realistic
- [ ] Too aggressive
- [ ] Too conservative

**Questions:**
- Available team size? (recommend 4 BE + 2 FE)
- Dependencies on Finance module implementation?
- Hard deadline constraints?

### 5. Testing Approach
**Recommendation:** Pyramid (60% unit, 25% integration, 15% E2E)
- [ ] Approved
- [ ] Needs discussion
- [ ] Rejected

**Questions:**
- Target code coverage? (recommend 80%+)
- Performance testing needed? (concurrent orders, KDS load)
- Load testing before launch? (how many concurrent users?)

## Next Steps
- [ ] Schedule follow-up meeting
- [ ] Create detailed specification per module
- [ ] Setup development environment
- [ ] Begin Phase 1 implementation
````

---

## Summary & Recommendations

### Key Takeaways

| Aspect         | Recommendation          | Rationale                       |
| -------------- | ----------------------- | ------------------------------- |
| **Schema**     | Single Prisma file      | Simplicity, clear multi-tenancy |
| **Modules**    | Isolated NestJS modules | Testability, maintainability    |
| **Sharing**    | Minimal, event-based    | Loose coupling, easier to split |
| **Testing**    | Pyramid approach        | Cost-effective, good coverage   |
| **Timeline**   | 12-16 weeks             | Realistic with solid team       |
| **Deployment** | Feature-gated           | Safe rollout, easy rollback     |

### Before You Code

1. **Schedule tech lead sync** (1-2 hours)
   - Review this document
   - Align on architecture
   - Clarify ambiguities
   - Get sign-off

2. **Setup foundation** (1 week)
   - Update Prisma schema
   - Create migrations
   - Setup FnB module structure
   - Create guards & middleware

3. **Create detailed specs** (per feature)
   - DTOs & API contracts
   - Database schema (specific models)
   - Business logic flows
   - Test scenarios

4. **Establish standards**
   - Code style & conventions
   - Import restrictions
   - Error handling patterns
   - Logging standards

---

**Document Version:** 1.0  
**Last Updated:** 06/03/2026  
**Status:** Ready for Tech Lead Review  
**Next Review:** After alignment meeting

---

## Appendix A: Detailed Tech Lead Discussion Template

### Meeting Agenda (90 minutes)

**Part 1: Architecture Overview (20 min)**

- Show diagrams: module structure, entity relationships
- Explain shared vs isolated models
- Discuss feature gates and gradual rollout

**Part 2: Schema Deep Dive (25 min)**

- Walk through Prisma schema additions
- Show FnB model relationships
- Discuss data consistency concerns
- Address specific model design questions

**Part 3: Implementation Approach (20 min)**

- Timeline and phases
- Team structure and roles
- Risk mitigation strategies
- Testing approach

**Part 4: Open Questions (20 min)**

- Address tech lead's concerns
- Clarify ambiguities
- Align on decisions
- Get final approval

**Part 5: Next Steps (5 min)**

- Assign owners per phase
- Schedule follow-up meetings
- Define success criteria

---

## Appendix B: Implementation Approval Checklist

```
ARCHITECTURE REVIEW CHECKLIST

☐ Tech Lead approved schema design
☐ Tech Lead approved module structure
☐ Tech Lead approved data sharing approach
☐ Tech Lead approved testing strategy
☐ Team lead confirmed timeline feasibility
☐ DevOps lead confirmed infrastructure
☐ QA lead confirmed testing approach
☐ Product manager aligned on feature scope
☐ Security review completed (multi-tenancy, auth)
☐ Performance requirements defined (concurrent users, KDS load)

APPROVAL SIGNATURES:
___________________ Tech Lead __________ Date
___________________ Product Manager ____ Date
___________________ Team Lead _________ Date
```

---

**End of Document**
