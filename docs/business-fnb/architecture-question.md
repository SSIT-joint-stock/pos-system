# POS Multi-Module Implementation - Decision Trees & Comparisons

---

## Decision Tree 1: Module Isolation Strategy

```
START: How to architect Retail + F&B modules?
│
├─ OPTION A: Complete Separation
│  │
│  ├─ Databases: Separate PostgreSQL per module
│  ├─ Code: Completely independent services
│  ├─ Deployment: Separate Docker containers
│  │
│  ├─ PROS:
│  │  ✅ Maximum independence
│  │  ✅ Scale independently
│  │  ✅ Deploy without coordination
│  │  ✅ Easy to open-source one module
│  │
│  ├─ CONS:
│  │  ❌ Data duplication (User, Store, Auth)
│  │  ❌ Complex cross-module queries
│  │  ❌ Distributed transactions needed
│  │  ❌ Initial setup overhead
│  │
│  └─ TIMELINE: 6+ months
│
├─ OPTION B: Shared Database, Isolated Code (RECOMMENDED)
│  │
│  ├─ Database: Single PostgreSQL
│  ├─ Code: Independent NestJS modules
│  ├─ Deployment: Single Docker image (for now)
│  │
│  ├─ PROS:
│  │  ✅ Shared User, Store, Auth (no duplication)
│  │  ✅ Simple to implement initially
│  │  ✅ Can evolve to Option A later (MIGRATE path)
│  │  ✅ Easy cross-module analytics
│  │  ✅ All benefits of Option C (below)
│  │
│  ├─ CONS:
│  │  ⚠️ Some coupling via shared tables
│  │  ⚠️ Both modules must scale together
│  │
│  └─ TIMELINE: 4-5 months (SHORTER)
│
└─ OPTION C: Shared Database, Shared Code
   │
   ├─ Database: Single PostgreSQL
   ├─ Code: Mixed folder structure (no module isolation)
   ├─ Deployment: Single Docker image
   │
   ├─ PROS:
   │  ✅ Fastest to implement (short-term)
   │  ✅ Simple folder structure
   │  ✅ Easy code sharing
   │
   ├─ CONS:
   │  ❌ Hard to maintain (spaghetti code)
   │  ❌ No isolation = harder to refactor later
   │  ❌ Testing nightmare (hard to test in isolation)
   │  ❌ Difficult to extract module later
   │  ❌ Risk of cross-contamination
   │  ❌ Code review becomes difficult
   │
   └─ TIMELINE: 3 months (but technical debt!)

RECOMMENDATION: ➜ OPTION B
   - Best balance of simplicity + scalability
   - Can evolve to Option A if needed
   - Supports gradual migration path
   - Manageable complexity for 2-3 modules
```

---

## Decision Tree 2: Schema Organization

```
START: How to organize Prisma schema?
│
├─ OPTION A: Single File (Current Approach)
│  │
│  ├─ File: prisma/schema.prisma
│  ├─ Models: ALL entities (Retail + F&B + Shared)
│  ├─ Organization: Section comments (// === RETAIL ===)
│  │
│  ├─ PROS:
│  │  ✅ Single source of truth
│  │  ✅ All relationships visible
│  │  ✅ Easy migrations (1 command)
│  │  ✅ Prisma UI works perfectly
│  │  ✅ Recommended by Prisma team
│  │
│  ├─ CONS:
│  │  ⚠️ File size grows (100+ models = 2000-3000 lines)
│  │  ⚠️ Harder to navigate (but use code folding)
│  │
│  └─ WORKS FOR: 2-4 modules (up to ~150 models)
│
├─ OPTION B: Multiple Files (Prisma v4.10+)
│  │
│  ├─ Files:
│  │  - prisma/base.prisma (User, Store, Auth, Asset)
│  │  - prisma/retail.prisma (Product, Variant, Order, etc.)
│  │  - prisma/fnb.prisma (Table, Menu, FnBOrder, etc.)
│  │
│  ├─ Composition: Using Prisma's @include directive
│  │
│  ├─ PROS:
│  │  ✅ Organized per module
│  │  ✅ Smaller files per module
│  │  ✅ Clearer separation
│  │
│  ├─ CONS:
│  │  ❌ More complex setup
│  │  ❌ Less Prisma tooling support
│  │  ❌ Harder for new developers
│  │  ❌ Migration coordination needed
│  │  ❌ Some limitations with relations across files
│  │
│  └─ WORKS FOR: 4+ modules
│
└─ OPTION C: Separate Databases
   │
   ├─ Setup: Separate schema per database
   ├─ Coordination: Manual cross-DB queries
   │
   ├─ PROS:
   │  ✅ Maximum independence
   │
   ├─ CONS:
   │  ❌ Complex joins needed
   │  ❌ Distributed transactions nightmare
   │  ❌ Data consistency issues
   │  ❌ NOT RECOMMENDED for shared User/Store
   │
   └─ WORKS FOR: When modules are truly separate

RECOMMENDATION: ➜ OPTION A
   - Keep single file for now
   - Switch to Option B if > 150 models
   - Most developers are familiar
   - Easiest migration path
```

---

## Decision Tree 3: Order Entity Design

```
START: How to design Order entities?
│
├─ APPROACH A: Separate Orders (RECOMMENDED)
│  │
│  ├─ Retail: Order + OrderItem + OrderReturn
│  ├─ F&B: FnBOrder + FnBOrderItem (+ no return model, use modification)
│  ├─ Structure:
│  │   Retail Order:  order_id, customer_id, product_id → variant_id
│  │   FnB Order:     order_id, table_id, menu_item_id
│  │
│  ├─ PROS:
│  │  ✅ Different schemas for different needs
│  │  ✅ Clear semantics (Order vs Table-based Order)
│  │  ✅ Different calculations (discount vs service charge)
│  │  ✅ Easy to maintain
│  │  ✅ Clear in code (new FnBOrder(...))
│  │
│  ├─ CONS:
│  │  ⚠️ Some code duplication (can use base interfaces)
│  │  ⚠️ Separate services needed
│  │
│  └─ LINES OF CODE: ~500 more (worth it)
│
├─ APPROACH B: Shared Order with Discriminator
│  │
│  ├─ Single Order table
│  ├─ Type field: 'RETAIL' or 'FNB'
│  ├─ Optional fields:
│  │   - customer_id (Retail only)
│  │   - table_id (F&B only)
│  │   - product_id (Retail only)
│  │   - menu_item_id (F&B only)
│  │
│  ├─ PROS:
│  │  ✅ Single service
│  │  ✅ Unified analytics (easier queries)
│  │  ✅ Single order tracking
│  │
│  ├─ CONS:
│  │  ❌ NULL columns (messy database)
│  │  ❌ Type checking complexity
│  │  ❌ Business logic branches everywhere (if order.type === 'FNB'...)
│  │  ❌ Hard to add module-specific fields later
│  │  ❌ Confusing for developers
│  │  ❌ Risk of mixing order types
│  │
│  └─ NOT RECOMMENDED ❌
│
└─ APPROACH C: Base Order + Inheritance
   │
   ├─ BaseOrder (abstract)
   ├─ RetailOrder extends BaseOrder
   ├─ FnBOrder extends BaseOrder
   │
   ├─ Concept: Object inheritance
   ├─ DB Reality: Still needs separate tables
   │
   ├─ PROS:
   │  ✅ DRY (Don't Repeat Yourself)
   │  ✅ Shared logic in BaseOrder
   │
   ├─ CONS:
   │  ❌ Prisma doesn't support OOP inheritance
   │  ❌ Would need separate tables anyway
   │  ❌ False sense of code sharing
   │
   └─ NOT PRACTICAL ❌

RECOMMENDATION: ➜ APPROACH A
   - Clear, maintainable
   - Different schemas for different needs
   - Type-safe (no discriminators)
   - Code duplication is minimal with proper interfaces
```

---

## Decision Tree 4: Cross-Module Communication

```
START: How should Retail & F&B modules communicate?
│
├─ OPTION A: Direct Function Calls (NOT RECOMMENDED)
│  │
│  ├─ Code:
│  │   fnb/order.service → calls → retail/inventory.service.deduct()
│  │
│  ├─ PROS:
│  │  ✅ Fast, no overhead
│  │  ✅ Simple to implement
│  │
│  ├─ CONS:
│  │  ❌ Creates hard dependency
│  │  ❌ Can't test without Retail module
│  │  ❌ Circular dependencies possible
│  │  ❌ Hard to refactor later
│  │  ❌ Retail changes break F&B
│  │
│  └─ RISK: HIGH ⚠️
│
├─ OPTION B: Event-Driven (RECOMMENDED)
│  │
│  ├─ Flow:
│  │   1. FnB Order created
│  │   2. FnB publishes: OrderCreated event
│  │   3. Retail subscribes: if has inventory, deduct stock
│  │   4. Finance subscribes: if payment, create transaction
│  │
│  ├─ Implementation:
│  │   - Use EventEmitter2 (NestJS)
│  │   - Or Bull/RabbitMQ for async
│  │   - Or Kafka for high-volume
│  │
│  ├─ PROS:
│  │  ✅ Loose coupling (modules independent)
│  │  ✅ Easy to test (mock events)
│  │  ✅ Scalable (async, queue)
│  │  ✅ Future-proof (easy to add modules)
│  │  ✅ Can add subscribers anytime
│  │  ✅ Retail doesn't know about F&B
│  │
│  ├─ CONS:
│  │  ⚠️ Slightly more complex setup
│  │  ⚠️ Eventual consistency (not immediate)
│  │  ⚠️ Need error handling/retry logic
│  │
│  └─ RISK: LOW ✅
│
└─ OPTION C: Message Queue (Stripe/Momo)
   │
   ├─ Setup: Bull/RabbitMQ/Kafka
   ├─ Flow: Module A → Queue → Module B (async)
   │
   ├─ PROS:
   │  ✅ Very scalable
   │  ✅ Decoupled
   │  ✅ Reliable delivery
   │
   ├─ CONS:
   │  ❌ Operational overhead
   │  ❌ Overkill for 2 modules
   │
   └─ RECOMMENDED FOR: Later (phase 2+), when needed

RECOMMENDATION: ➜ OPTION B (Event-Driven)
   Example events:
   - fnborder.created → Inventory deduction (if hybrid store)
   - fnborder.paid → Finance transaction creation
   - fnborder.completed → Analytics update

   Benefits for current project:
   - Each module completely independent
   - Can deploy/test in isolation
   - Easy to add modules (Finance, Loyalty, etc.)
   - Clear domain boundaries
```

---

## Decision Tree 5: Testing Strategy

```
START: What's the testing approach for multi-module?
│
├─ LEVEL 1: Unit Tests (Individual Services)
│  │
│  ├─ Coverage: 60% of total tests
│  ├─ Structure:
│  │   src/modules/fnb/table/table.service.ts
│  │   test/unit/fnb/table/table.service.spec.ts
│  │
│  ├─ Example:
│  │   ✅ tableService.createTable() returns correct entity
│  │   ✅ tableService.changeStatus() validates transitions
│  │   ✅ tableService.changeStatus() rejects invalid transition
│  │
│  ├─ Mock: Prisma, external services
│  ├─ Speed: <1 sec per test
│  ├─ Tool: Jest
│  │
│  └─ Target: 80%+ coverage per service
│
├─ LEVEL 2: Integration Tests (Workflows)
│  │
│  ├─ Coverage: 25% of total tests
│  ├─ Structure:
│  │   test/integration/fnb/order-workflow.spec.ts
│  │
│  ├─ Example:
│  │   ✅ Create order → Table AVAILABLE → OCCUPIED
│  │   ✅ Add item → Order total updated correctly
│  │   ✅ Pay → Payment created → Table AVAILABLE
│  │   ✅ Discount applied → Total recalculated
│  │
│  ├─ Database: Test database (Postgres)
│  ├─ Speed: <10 sec per test
│  ├─ Tool: Jest + Prisma client
│  │
│  └─ Test scenarios: Per feature (F3-F23)
│
├─ LEVEL 3: E2E Tests (Complete Scenarios)
│  │
│  ├─ Coverage: 15% of total tests
│  ├─ Structure:
│  │   test/e2e/fnb/create-order-to-payment.e2e.spec.ts
│  │
│  ├─ Example:
│  │   1. Create store + table + menu items
│  │   2. Create order for table
│  │   3. Add 3 items with different notes
│  │   4. Apply discount
│  │   5. Process payment
│  │   6. Verify receipt generated
│  │   7. Verify table status = AVAILABLE
│  │   8. Verify analytics updated
│  │
│  ├─ Coverage: Complete HTTP requests
│  ├─ Speed: 10-30 sec per test
│  ├─ Tool: Jest + NestJS test utilities
│  │
│  └─ Critical scenarios only (not everything)
│
└─ LEVEL 4: Load Testing (Performance)
   │
   ├─ When: Before launch
   ├─ Example:
   │   ✅ 100 concurrent users creating orders
   │   ✅ 50 concurrent KDS users watching updates
   │   ✅ 1000 QR scans per hour
   │
   ├─ Tool: k6 or Artillery
   │
   └─ Target: Response time <200ms at 100 concurrent

TESTING STRUCTURE:
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

RECOMMENDATION: ➜ Pyramid Approach
   60% Unit + 25% Integration + 15% E2E

   Benefits:
   - Fast feedback (unit tests run in seconds)
   - Reliable (integration tests catch workflow issues)
   - Confidence (E2E tests verify user scenarios)
   - Cost-effective (most value from unit tests)
```

---

## Comparison Table: Retail vs F&B Schema Design

```
╔════════════════════╦═══════════════════════════╦═══════════════════════════╗
║ Aspect             ║ RETAIL MODULE             ║ F&B MODULE                ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ INVENTORY          ║                           ║                           ║
║ Entity             ║ Product → Variant         ║ MenuItem                  ║
║ Stock tracking     ║ VariantStock (detailed)   ║ Simple flag (available)   ║
║ Units              ║ Conversion (kg, box, etc) ║ Fixed unit (plate)        ║
║ Cost tracking      ║ Unit cost (COGS)          ║ Optional (prep cost)      ║
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ ORDERS             ║                           ║                           ║
║ Entity             ║ Order + OrderItem         ║ FnBOrder + FnBOrderItem   ║
║ Location reference ║ Customer address          ║ Table code                ║
║ Item reference     ║ variant_id                ║ menu_item_id              ║
║ Quantity           ║ Integer (units)           ║ Integer (plates)          ║
║ Payment embedded?  ║ Yes (payment_method in)   ║ No (FnBOrderPayment)      ║
║ Return workflow    ║ OrderReturn entity        ║ OrderModification entity  ║
║ Special requests   ║ Limited (meta JSON)       ║ Rich (notes per item)     ║
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ PRICING            ║                           ║                           ║
║ Base price         ║ Variant.price             ║ FnBMenuItem.price         ║
║ Discounts          ║ % on entire order         ║ % on items or order       ║
║ Service charge     ║ No                        ║ Yes (% of total)          ║
║ Tax calculation    ║ Included in Order.tax     ║ Configurable (store)      ║
║ Sale vs Cost       ║ Tracked (profit calc)     ║ Optional (prep cost)      ║
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ CUSTOMER MODEL     ║                           ║                           ║
║ Entity             ║ Customer (pre-defined)    ║ Guest (temp in session)   ║
║ Phone/Email        ║ Stored                    ║ Optional (QR order)       ║
║ Loyalty            ║ Reward points (store)     ║ Loyalty program (future)  ║
║ Rating/Feedback    ║ Post-order review         ║ In-session feedback       ║
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ ANALYTICS          ║                           ║                           ║
║ Table             ║ StatisticsDaily           ║ FnBDailyStatistics        ║
║ Key metrics       ║ Units sold, Revenue       ║ Orders, Table turnover    ║
║ Timing            ║ Daily snapshot            ║ Peak hours, Avg meal time ║
║ Inventory focus   ║ Yes (stock levels)        ║ No (prep time focus)      ║
║ Table focus       ║ No                        ║ Yes (utilization, churn)  ║
║                    ║                           ║                           ║
╠════════════════════╬═══════════════════════════╬═══════════════════════════╣
║ SPECIAL FEATURES   ║                           ║                           ║
║                    ║ • Returns/Refunds         ║ • KDS (Kitchen Display)   ║
║                    ║ • Variants/Options        ║ • QR Menu & Mobile Order  ║
║                    ║ • Bundles                 ║ • Table Grouping/Merging  ║
║                    ║ • Inventory alerts        ║ • Receipt printing        ║
║                    ║                           ║                           ║
╚════════════════════╩═══════════════════════════╩═══════════════════════════╝
```

---

## Migration Path: From Single to Multi-Module

```
┌─────────────────────────────────────────────────────────────────┐
│         EVOLUTION PATH: OPTION B → OPTION A                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ MONTH 0-4:  Single-Instance (OPTION B)                         │
│ ├─ Shared: User, Store, Asset, Auth                           │
│ ├─ Retail: Product, Variant, Order, Return                    │
│ ├─ F&B: Table, Menu, FnBOrder, KDS                            │
│ ├─ Deployment: Single service, shared database                │
│ └─ Team: 6-8 engineers work on both                            │
│                                                                 │
│ MONTH 4-6: Module Extraction (Prepare for Option A)            │
│ ├─ Step 1: Separate Retail & F&B services                     │
│ │   Retail Service:  http://retail-api:3000                   │
│ │   F&B Service:     http://fnb-api:3001                      │
│ │                                                               │
│ ├─ Step 2: Add API Gateway                                    │
│ │   Gateway:  http://api.pos.local                             │
│ │   Routes:   /api/v1/retail/* → Retail Service               │
│ │   Routes:   /api/v1/fnb/*    → F&B Service                  │
│ │                                                               │
│ ├─ Step 3: Implement Event Bus                                │
│ │   Replace direct calls with events                           │
│ │   orderService.create() → emit(OrderCreated)                │
│ │                                                               │
│ └─ Step 4: Separate Databases                                 │
│     Shared DB:  shared_db (User, Store, Asset)                │
│     Retail DB:  retail_db (Product, Order, etc.)              │
│     F&B DB:     fnb_db (Table, FnBOrder, etc.)                │
│                                                                 │
│ MONTH 6+:   Fully Distributed (OPTION A)                       │
│ ├─ Architecture:                                               │
│ │   ┌─────────────┐                                            │
│ │   │  API Gateway│                                            │
│ │   └──────┬──────┘                                            │
│ │     ┌────┴─────┐                                             │
│ │     │           │                                             │
│ │  Retail      F&B       Finance    Loyalty                    │
│ │  Service    Service    Service    Service                    │
│ │     │           │           │         │                      │
│ │  [Retail DB] [F&B DB] [Finance DB] [Loyalty DB]            │
│ │     └───────┬───┘           │         │                      │
│ │         [Shared DB]   [Event Bus / Message Queue]            │
│ │         (User, Store)                                        │
│ │                                                               │
│ ├─ Independent:                                                │
│ │   ✅ Can scale each service separately                       │
│ │   ✅ Can deploy independently                               │
│ │   ✅ Different tech stacks possible                          │
│ │   ✅ Teams work independently                               │
│ │                                                               │
│ └─ Rollback possible:                                          │
│    If issues, migrate back to Step 4 or 3                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

KEY ADVANTAGES OF THIS PATH:
✅ Start simple (lower risk)
✅ Validate F&B works with Retail
✅ Gradual complexity increase
✅ Team gains experience before separation
✅ Can rollback at each step
✅ Cost-effective ramp-up
```

---

## Quick Reference: Implementation Decisions

```
╔═════════════════════════════╦════════════════════════════════════════╗
║ DECISION                    ║ RECOMMENDATION                         ║
╠═════════════════════════════╬════════════════════════════════════════╣
║ Module Isolation            ║ Option B: Shared DB, Isolated Code     ║
║ Timeline Implication        ║ 4-5 months (vs 6+ for Option A)        ║
║                             ║                                        ║
║ Schema Organization         ║ Single Prisma file (2000-3000 lines)   ║
║ Max models before split     ║ ~150 models                            ║
║                             ║                                        ║
║ Order Entity Design         ║ Separate (Order vs FnBOrder)           ║
║ Code sharing               ║ Interfaces, not inheritance            ║
║                             ║                                        ║
║ Cross-Module Comms         ║ Event-Driven (EventEmitter2)           ║
║ Queue needed now?          ║ No (EventEmitter2 sufficient)          ║
║ Queue migration timeline   ║ When > 10k events/day                   ║
║                             ║                                        ║
║ Testing Strategy           ║ 60% Unit, 25% Integration, 15% E2E     ║
║ Target Coverage            ║ >80% per module                         ║
║ Time per test suite        ║ Unit: <1s, Integration: <10s, E2E: <30s│
║                             ║                                        ║
║ Prisma Migration Approach  ║ Additive (add F&B tables, no changes)   ║
║ Retail backward compat     ║ 100% (breaking changes forbidden)       ║
║ Feature gate strategy      ║ Store.business_type enum               ║
║                             ║                                        ║
║ Future evolution           ║ Can migrate to Option A (separate DBs) ║
║ Break-even point for split ║ 3-4 modules, 200+ tables, > 50 devs    ║
║                             ║                                        ║
╚═════════════════════════════╩════════════════════════════════════════╝
```

---

## Architectural Overview Diagram

```
SHARED FOUNDATION LAYER (Immutable after MVP)
┌─────────────────────────────────────────────────────┐
│                                                     │
│  User        Store        Asset        Auth        │
│  (UUID)      (UUID)      (UUID)     (JWT)          │
│                                                     │
│  StoreMember  AdminUser   Config      Cache       │
│  (Access)    (RBAC)      (Settings)  (Redis)      │
│                                                     │
└─────────────────────────────────────────────────────┘
         ↓ Injected via DI Container ↓

MODULE LAYER (Independent NestJS modules)
┌──────────────────────┐      ┌──────────────────────┐
│   RETAIL MODULE      │      │    F&B MODULE        │
├──────────────────────┤      ├──────────────────────┤
│ • Product            │      │ • FnBTable           │
│ • Variant            │      │ • FnBMenuCategory    │
│ • Category           │      │ • FnBMenuItem        │
│ • Order              │      │ • FnBOrder           │
│ • OrderItem          │      │ • FnBOrderItem       │
│ • Supplier           │      │ • FnBOrderPayment    │
│ • PurchaseOrder      │      │ • FnBReceipt         │
│ • Inventory          │      │ • KDSDisplay         │
│ • Analytics          │      │ • TableQRCode        │
│ • ...                │      │ • FnBStoreConfig     │
│                      │      │ • FnBDailyStatistics │
│                      │      │ • ...                │
└──────────────────────┘      └──────────────────────┘
         ↓                              ↓

INTEGRATION LAYER (Event-Driven)
┌─────────────────────────────────────────────────────┐
│                                                     │
│  EventEmitter2                                      │
│  ├─ OrderCreated                                   │
│  ├─ PaymentProcessed                              │
│  ├─ OrderCompleted                                │
│  └─ ... (events between modules)                  │
│                                                     │
└─────────────────────────────────────────────────────┘
         ↓ Async Events ↓

EXTERNAL SERVICES (Future)
├─ Payment Gateway (Stripe, Momo, ZaloPay)
├─ Finance Module (Accounting)
├─ Inventory Module (Stock management)
├─ Loyalty Module (Rewards)
├─ Notification Service (Email, SMS, Push)
└─ Analytics Platform (BI, Dashboards)

DEPLOYMENT
┌────────────────────────────────────────┐
│         Current (Month 0-4)             │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │      NestJS Application          │  │
│  │  ├─ @Module(RetailModule)       │  │
│  │  ├─ @Module(FnBModule)          │  │
│  │  └─ @Module(AuthModule)         │  │
│  └──────────────────────────────────┘  │
│         ↓ Single Docker ↓              │
│  ┌──────────────────────────────────┐  │
│  │     PostgreSQL Database          │  │
│  │  ├─ retail_* (100 tables)        │  │
│  │  ├─ fnb_* (30 tables)            │  │
│  │  └─ shared_* (10 tables)         │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│      Future (Month 6+)                  │
├────────────────────────────────────────┤
│     ┌──────────────────┐               │
│     │   API Gateway    │               │
│     └────────┬─────────┘               │
│      ┌──────┴──────────┐               │
│      │                 │               │
│   ┌──┴──┐         ┌────┴──┐           │
│   │Retail         │ F&B   │           │
│   │Service        │Service│           │
│   │[Docker]       │[Docker]           │
│   │[Retail DB]    │[F&B DB]           │
│   └───────┘       └───────┘           │
│      └────────┬──────────┘            │
│         [Shared DB]                   │
│    (User, Store, Auth)                │
└────────────────────────────────────────┘
```

---

## Go/No-Go Decision Checklist for Tech Lead

```
BEFORE IMPLEMENTATION STARTS

ARCHITECTURE
☐ Multi-module approach approved (Option B)
☐ Schema design approved (single Prisma file)
☐ Event-driven communication approved
☐ Data ownership defined (who updates what)
☐ Dependency direction defined (no circular deps)

TECHNICAL DECISIONS
☐ Prisma migrations strategy approved
☐ Testing pyramid approved
☐ Code organization structure approved
☐ Import restrictions defined (eslint rules)
☐ Error handling patterns defined
☐ Logging standards defined
☐ API contract standards defined (DTOs)

TEAM & TIMELINE
☐ Timeline realistic for team size
☐ Team size allocated
☐ Tech stack confirmed (NestJS, PostgreSQL, etc.)
☐ Dependencies on other teams managed
☐ Blockers identified and mitigated

LAUNCH & RISK
☐ Rollout strategy (feature gates approved)
☐ Rollback plan documented
☐ Performance requirements defined
☐ Security review completed
☐ Data backup strategy confirmed
☐ Monitoring/alerting setup planned

DOCUMENTATION
☐ Architecture diagrams reviewed
☐ API documentation requirements defined
☐ Onboarding docs needed for new modules
☐ Code review standards documented
☐ Troubleshooting guide outline created

```

---

## Notes for Tech Lead Meeting

**Recommended presentation order:**

1. **Current state**
   - Show Retail schema
   - Show F&B feature requirements
   - Identify conflicts

2. **Architecture options**
   - Option A vs B vs C
   - Recommendation with rationale
   - Evolution path

3. **Schema design**
   - Separate Order entities shown
   - Relationships diagram
   - Comparison with Retail schema

4. **Implementation approach**
   - Folder structure
   - Module boundaries
   - Testing strategy
   - Timeline breakdown

5. **Key decisions to confirm**
   - Event-driven communication
   - Data access patterns
   - Migration strategy
   - Rollout approach

6. **Risk & mitigation**
   - Top 5 risks
   - Mitigation per risk
   - Contingency plans

7. **Q&A**

---
