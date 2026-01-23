import { IOrderReturn } from '@repo/design-system/types/order-return';
import { Product, Variant } from './product';

// enums
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD';

// liên quan
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  quantity_return: number;
  tax_rate: number;
  discount_rate: number;
  price: number;
  meta: Record<string, any>;
  createdAt: string; // ISO string
  updatedAt: string;
  product?: Product;
  variant?: Variant;
}

export interface Customer {
  id: string;
  store_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cashier {
  id: string;
  username: string;
  email: string;
}

// main Order type
export interface Order {
  id: string;
  code?: string | null;
  cashier_id: string;
  customer_id?: string | null;
  customer_name?: string | null;
  store_id: string;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  customer_pay_amount: number;
  change_amount: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  createdAt: string; // ISO string
  updatedAt: string;

  // relations
  cashier?: Cashier;
  customer?: Customer;
  order_item: OrderItem[];
  order_return: IOrderReturn[];
}
