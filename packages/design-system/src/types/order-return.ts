import { Variant } from '@repo/design-system/types/product';

export interface IOrderReturn {
  id: string;
  order_id: string;
  store_id: string;
  created_id: string;
  customer_id: string | null;
  order_number: string;
  order_return_number: string;
  customer_name: string | null;
  customer_phone: string | null;
  reason: string;
  return_type: order_return_type;
  return_status: order_return_status;
  suggest_total: string;
  total: string;
  items_length: number;
  createdAt: Date;
  creator: IOrderReturnCreator;
  payment: IOrderReturnPayment[];
  items: IOrderReturnItem[];
  updatedAt: Date;
}

export interface IOrderReturnItem {
  id: string;
  order_item_id: string;
  order_return_id: string;
  product_id: string;
  variant_id: string;
  item_name: string;
  quantity: number;
  quantity_refunded: number;
  total: string;
  reason_status: string;
  condition: string | null;
  variant: Variant;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderReturnCreator {
  id: string;
  username: string;
  email: string;
}

export interface IOrderReturnPayment {
  id: string;
  created_id: string;
  amount: string;
  createdAt: Date;
  updatedAt: Date;
  payment_method: string;
}

export enum order_return_status {
  REQUESTED = 'REQUESTED', // Khách yêu cầu trả hàng
  REFUNDED = 'REFUNDED', // Đã hoàn tiền
  CANCELLED = 'CANCELLED', // Huỷ yêu cầu trả
}

export enum order_return_type {
  NONE = 'NONE', // Chưa hoàn trả
  FULL = 'FULL', // Trả toàn bộ đơn hàng
  PARTIAL = 'PARTIAL', // Trả một phần đơn hàng
}
