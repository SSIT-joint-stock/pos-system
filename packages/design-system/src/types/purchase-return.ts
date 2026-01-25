import { Product, Variant } from '@repo/design-system/types/product';

export interface PurchaseReturn {
  id: string;
  store_id: string;
  return_number: string;
  supplier_id: string;
  supplier_name: string;
  supplier_code: string;
  purchase_order_id: string | null;
  status: PurchaseReturnStatus;
  payment_status: PaymentStatus;
  discount_amount: string; // Represented as string in JSON
  reason_discount: string | null;
  total: string; // Represented as string in JSON
  reason: string | null;
  notes: string | null;
  created_by: string;
  return_date: string; // ISO Date String
  createdAt: string;
  updatedAt: string;
  purchase_order: {
    id: string;
    order_number: string;
  } | null;
  supplier: SupplierShortInfo;
  items: PurchaseReturnItem[];
  creator: UserShortInfo;
  payments: PurchaseReturnPayment[];
}

export interface SupplierShortInfo {
  id: string;
  name: string;
  code: string;
  email: string;
  tax_code: string;
}

export interface UserShortInfo {
  id: string;
  username: string;
  email: string;
}

/**
 * Individual Item within a Return
 */
export interface PurchaseReturnItem {
  id: string;
  purchase_return_id: string;
  product_id: string;
  variant_id: string;
  purchase_order_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_cost: string;
  base_unit_cost: string;
  product: Product;
  variant: Variant;
  total: string;
  reason: string | null;
}

export interface PurchaseReturnPayment {
  id: string;

  purchase_return_id: string;

  amount: number;
  payment_method: string;
  payment_date: string;

  reference: string;
  notes: string;

  createdAt: string;
}

/**
 * Enums for Statuses
 */
export enum PurchaseReturnStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}
