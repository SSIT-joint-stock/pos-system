import { PurchaseOrder } from '@repo/design-system/types/purchase';

export enum SupplierStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETE = 'DELETE',
}
export interface Supplier {
  id: string;
  store_id: string;
  name: string;
  code: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  tax_code: string;
  bank_account: string;
  notes: string;
  status: SupplierStatus;
  total_purchased: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  purchase_orders?: PurchaseOrder[];
}
export interface SupplierInfoByTaxCode {
  data: Supplier;
}
