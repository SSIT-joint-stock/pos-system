import type { 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  PaymentMethod,
  Product, 
  Customer 
} from './index';

// Retail Order Types
export interface RetailOrder extends Order {
  retailStoreId: string;
  customerId?: string;
  paymentMethod: PaymentMethod;
  items: RetailOrderItem[];
  customer?: Customer;
}

export interface RetailOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  product?: Product;
}

// Point of Sale Types
export interface POSSession {
  id: string;
  userId: string;
  terminalId: string;
  startTime: string;
  endTime?: string;
  startingCash: number;
  endingCash?: number;
  totalSales: number;
  totalTransactions: number;
  status: SessionStatus;
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  SUSPENDED = 'SUSPENDED'
}

export interface CashDrawer {
  id: string;
  terminalId: string;
  currentBalance: number;
  transactions: CashTransaction[];
  lastUpdated: string;
}

export interface CashTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  reason?: string;
  userId: string;
  timestamp: string;
}

export enum TransactionType {
  SALE = 'SALE',
  REFUND = 'REFUND',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  OPENING_BALANCE = 'OPENING_BALANCE',
  CLOSING_BALANCE = 'CLOSING_BALANCE'
}

// Promotion Types
export interface Promotion {
  id: string;
  retailStoreId: string;
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  isPercentage: boolean;
  conditions: PromotionCondition[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

export enum PromotionType {
  DISCOUNT = 'DISCOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BUNDLE = 'BUNDLE'
}

export interface PromotionCondition {
  type: ConditionType;
  value: number;
  operator: ConditionOperator;
}

export enum ConditionType {
  MIN_AMOUNT = 'MIN_AMOUNT',
  MIN_QUANTITY = 'MIN_QUANTITY',
  SPECIFIC_PRODUCT = 'SPECIFIC_PRODUCT',
  SPECIFIC_CATEGORY = 'SPECIFIC_CATEGORY'
}

export enum ConditionOperator {
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  EQUAL = 'EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL'
}

// Loyalty Program Types
export interface LoyaltyProgram {
  id: string;
  retailStoreId: string;
  name: string;
  description?: string;
  pointsPerDollar: number;
  redemptionRate: number;
  minRedemptionPoints: number;
  tiers: LoyaltyTier[];
  isActive: boolean;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  multiplier: number;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  orderId?: string;
  type: LoyaltyTransactionType;
  points: number;
  description: string;
  timestamp: string;
}

export enum LoyaltyTransactionType {
  EARNED = 'EARNED',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  ADJUSTED = 'ADJUSTED'
}