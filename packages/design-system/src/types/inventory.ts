export type InventoryStatus = 'ACTIVE' | 'INACTIVE' | 'SOLD';
export enum payment_method {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}
export interface InventoryProduct {
  name: string;
  price: number;
  store_id?: string; // dùng khi cần trong set-status
}

export interface Inventory {
  id: string;
  product_id: string;
  quantity: number;
  discount: number;
  total: number;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
  product: InventoryProduct;
}
