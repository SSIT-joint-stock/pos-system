import { PurchaseReturn } from '@repo/design-system/types/purchase-return';

export interface PurchaseOrderItem {
  id: string;
  product_id: string;
  item_name: string;
  unit: string;
  applied_factor: string;
  total_base_qty: string;
  quantity: string;
  quantity_returned: string;
  unit_cost: string;
  total: string;
  notes: string | null;
  discount_rate: string;
  tax_rate: string;
  discount_amount: string;
  tax_amount: string;
}

export interface Supplier {
  name: string;
  tax_code: string;
  email: string;
  code: string;
  phone: string;
  address: string;
}

export interface Creator {
  id: string;
  username: string;
  email: string;
}
export interface Payments {
  id: string;
  purchase_order_id: string;
  payment_method: string;
  unit_cost: string;
  payment_date: string;
  reference: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
export interface PurchaseOrder {
  id: string;
  store_id: string;
  order_number: string;
  supplier_id: string;
  supplier_code: string;
  order_date: string;
  expected_date: string | null;
  received_date: string | null;
  status: string;
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  shipping_fee: string;
  total: string;
  paid_amount: string;
  payment_method: string | null;
  payment_status: string;
  notes: string | null;
  created_by: string;
  approved_by: string | null;
  approved_at: string | null;
  createdAt: string;
  updatedAt: string;
  supplier: Supplier;
  items: PurchaseOrderItem[];
  purchase_returns: PurchaseReturn[];
  payments: Payments[];

  creator: Creator;
}
export interface ValidationPurchaseOrderRes {
  itemLength: number;
  itemErrorLength: number;
  itemValidLength: number;
  result: ValidationPurchaseOrderResItem[];
}
export interface ValidationPurchaseOrderResItem {
  item_name: string;
  base_unit: string;
  category: string;
  sku: string;
  barcode: string;
  unit_cost: string;
  price: string;
  quantity: string;
  tax_rate: string;
  discount_rate: string;
  isStatus: boolean;
  msg: string;
  product_id: string | null;
  variant_id: string | null;
}

export interface PurchaseOrderResponse {
  success: boolean;
  meta: {
    timestamp: string;
    version: string;
  };
  data: PurchaseOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
