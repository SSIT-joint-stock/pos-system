// MongoDB Initialization Script for POS System
// This script creates databases, users, and initial collections

// Switch to admin database
db = db.getSiblingDB('admin');

// Create POS system database
db = db.getSiblingDB('pos_system');

// Create collections for multi-tenant architecture
db.createCollection('tenants');
db.createCollection('users');
db.createCollection('accounts');

// Create restaurant-specific collections
db.createCollection('restaurant_orders');
db.createCollection('restaurant_menu_items');
db.createCollection('restaurant_categories');
db.createCollection('restaurant_tables');
db.createCollection('restaurant_inventory');

// Create retail-specific collections
db.createCollection('retail_products');
db.createCollection('retail_categories');
db.createCollection('retail_orders');
db.createCollection('retail_customers');
db.createCollection('retail_inventory');

// Create shared collections
db.createCollection('audit_logs');
db.createCollection('system_settings');
db.createCollection('health_checks');

// Create indexes for better performance
db.tenants.createIndex({ "subdomain": 1 }, { unique: true });
db.tenants.createIndex({ "accountId": 1 });
db.tenants.createIndex({ "businessType": 1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "tenantId": 1 });
db.users.createIndex({ "accountId": 1 });

db.restaurant_orders.createIndex({ "restaurantId": 1 });
db.restaurant_orders.createIndex({ "orderNumber": 1 }, { unique: true });
db.restaurant_orders.createIndex({ "status": 1 });
db.restaurant_orders.createIndex({ "createdAt": -1 });

db.retail_orders.createIndex({ "retailStoreId": 1 });
db.retail_orders.createIndex({ "orderNumber": 1 }, { unique: true });
db.retail_orders.createIndex({ "customerId": 1 });
db.retail_orders.createIndex({ "status": 1 });
db.retail_orders.createIndex({ "createdAt": -1 });

db.retail_products.createIndex({ "retailStoreId": 1 });
db.retail_products.createIndex({ "sku": 1 }, { unique: true });
db.retail_products.createIndex({ "barcode": 1 });
db.retail_products.createIndex({ "categoryId": 1 });

db.restaurant_menu_items.createIndex({ "restaurantId": 1 });
db.restaurant_menu_items.createIndex({ "categoryId": 1 });
db.restaurant_menu_items.createIndex({ "isAvailable": 1 });

// Create application user for the POS system
db.createUser({
  user: "pos_app_user",
  pwd: "pos_app_password_2024",
  roles: [
    {
      role: "readWrite",
      db: "pos_system"
    }
  ]
});

// Create monitoring user
db.createUser({
  user: "pos_monitor_user",
  pwd: "pos_monitor_password_2024",
  roles: [
    {
      role: "read",
      db: "pos_system"
    }
  ]
});

print("MongoDB initialization completed successfully!"); 