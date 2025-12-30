export interface ReportSupplier {
  supplier_id: string;
  supplier_code: string;
  supplier_name: string;
  supplier_tax_code: string;
  supplier_status: string;
  purchase_orders_code_numbers: string[];
  total_products_in_purchase: number;
  total_purchase_orders: number;
  total_purchase_paid: number;
  total_paid: number;
  total_unpaid_amount: number;
}
