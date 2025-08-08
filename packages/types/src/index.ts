// Export all response classes
export * from './response';

// Export API error types
export * from './api';

// Export domain-specific types
export * from './restaurant';
export * from './retail';

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Tenant Types
export interface Tenant {
  id: string;
  accountId: string;
  businessType: BusinessType;
  name: string;
  subdomain: string;
  customDomain?: string;
  status: TenantStatus;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export enum BusinessType {
  RESTAURANT = 'RESTAURANT',
  RETAIL = 'RETAIL'
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL'
}

// Product Types (Retail)
export interface Product {
  id: string;
  retailStoreId: string;
  categoryId?: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  brand?: string;
  price: number;
  cost?: number;
  weight?: number;
  dimensions?: ProductDimensions;
  images: string[];
  tags: string[];
  variants: ProductVariant[];
  status: ProductStatus;
  category?: ProductCategory;
  inventory?: Inventory;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ProductVariant {
  name: string;
  value: string;
  price?: number;
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED'
}

export interface ProductCategory {
  id: string;
  retailStoreId: string;
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  parent?: ProductCategory;
  children?: ProductCategory[];
}

// Inventory Types
export interface Inventory {
  id: string;
  retailStoreId: string;
  productId: string;
  quantity: number;
  reserved: number;
  minStock: number;
  maxStock?: number;
  reorderPoint: number;
  lastUpdated: string;
  product?: Product;
}

// Menu Types (Restaurant)
export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  preparationTime?: number;
  calories?: number;
  allergens: string[];
  dietaryInfo: string[];
  images: string[];
  isAvailable: boolean;
  sortOrder: number;
  modifiers?: MenuItemModifier[];
  category?: MenuCategory;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  availableTime?: AvailableTime;
}

export interface AvailableTime {
  start: string;
  end: string;
}

export interface MenuItemModifier {
  id: string;
  menuItemId: string;
  name: string;
  type: ModifierType;
  options: ModifierOption[];
  required: boolean;
  multiSelect: boolean;
}

export enum ModifierType {
  SIZE = 'SIZE',
  OPTION = 'OPTION',
  ADDON = 'ADDON',
  SUBSTITUTION = 'SUBSTITUTION'
}

export interface ModifierOption {
  name: string;
  price: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Customer Types
export interface Customer {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: Address;
  loyaltyPoints: number;
  totalSpent: number;
  isActive: boolean;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Payment Types
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  E_WALLET = 'E_WALLET',
  STORE_CREDIT = 'STORE_CREDIT',
  OTHER = 'OTHER'
}

// Table Types (Restaurant)
export interface Table {
  id: string;
  restaurantId: string;
  number: string;
  capacity: number;
  location?: string;
  status: TableStatus;
  currentOrder?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  CLEANING = 'CLEANING',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}