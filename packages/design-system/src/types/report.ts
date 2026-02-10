export enum PurchaseType {
  PURCHASE_ORDER = 'purchase_order',
  PURCHASE_RETURN = 'purchase_return',
}
export interface ReportSupplier {
  supplier_id: string;
  supplier_code: string;
  supplier_name: string;
  supplier_tax_code: string;
  supplier_status: string;
  purchase_orders_code_numbers: string[];
  purchase_return_code_numbers: string[];
  total_products_in_purchase: number;
  total_purchase_orders: number;
  total_purchase_returns: number;
  total_purchase_paid: number;
  total_paid: number;
  total_unpaid_amount: number;
}

export interface ReportSupplierDetailResponse {
  data: ReportSupplierDetail[];
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
  totalPurchaseOrders: number;
  totalPurchaseReturns: number;
}
export interface ReportSupplierDetail {
  id: string;
  code: string;
  amount: number;
  status: string;
  payment_status: string;
  createdAt: string;
  purchase_type: PurchaseType; // đơn nhập
}

export interface ReportCustomer {
  customer_id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  total_products_in_orders: number;
  total_orders: number;
  total_customer_paid: number;
  total_paid: number;
  total_unpaid_amount: number;
}

export interface ReportOrders {
  order_created_at: string;
  order_code: string;
  customer_name: string;
  order_total_amount: string;
  variant_name: string;
  product_name: string;
  base_unit: string;
  quantity: string;
  price: string;
  line_total: string;
}

export interface ReportStoreMembers {
  created_at: string;
  member_email: string;
  member_id: string;
  member_name: string;
  total_order_price: number;
  total_order_success: number;
  total_orders: number;
  total_price_amount: number;
}
export interface ReportCustomerMember {
  createdAt: string;
  email: string;
  name: string;
  role: string;
  storeId: string;
  total_order: number;
  user: {
    orders_cashier: ReportCashierMember[];
  };
}
export interface ReportCashierMember {
  cashier_id: string;
  change_amount: number;
  code: string;
  createdAt: string;
  customer_id: string;
  customer_name: string;
  customer_pay_amount: number;
  discount_amount: number;
  id: string;
  payment_method: string;
  status: string;
  store_id: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  updatedAt: string;
}
export interface ReportOrderReturns {
  stt: number;
  return_date: string;
  return_number: string;
  order_number: string;
  customer_name: string;
  return_status: string;
  return_type: string;
  total_return: number;
  variant_name: string;
  product_name: string;
  base_unit: string;
  quantity: number;
  line_total: number;
  reason_status: string;
  condition: string;
}

export interface ReportStocks {
  stt: number;
  product_name: string;
  variant_name: string;
  sku: string;
  base_unit: string;
  on_hand: number;
  reserved: number;
  damaged: number;
  price: number;
  cost: number;
  stock_value: number;
}

export interface ReportPurchaseInvoices {
  stt: number;
  date: string;
  invoice_type: string;
  invoice_code: string;
  supplier_name: string;
  supplier_code: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  note: string;
}
