export type TransactionType = 'RECEIPT' | 'PAYMENT';

export type FinancePaymentMethod =
  | 'CASH'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'DIGITAL_WALLET';

export type TransactionSource =
  | 'SALE'
  | 'PURCHASE'
  | 'ORDER_RETURN'
  | 'PURCHASE_RETURN'
  | 'CUSTOMER_DEBT'
  | 'SUPPLIER_DEBT'
  | 'OTHER_INCOME'
  | 'OTHER_EXPENSE'
  | 'OPENING_BALANCE';

export type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type ContactType = 'Customer' | 'Supplier' | 'Other';

export interface CashTransaction {
  id: string;
  code: string;
  store_id: string;
  transaction_type: TransactionType;
  transaction_source: TransactionSource;
  amount: number;
  payment_method: FinancePaymentMethod;
  contact_name: string;
  contact_id: string;
  contact_type: ContactType;
  contact_phone?: string;
  contact_address?: string;
  description: string;
  reference_code?: string | null;
  notes?: string | null;
  reference_type?: string | null;
  reference_id?: string | null;
  status: TransactionStatus;
  transaction_date: string;
  created_by: string;
  approved_by?: string | null;
  cancelled_by?: string | null;
  createdAt: string;
  updatedAt: string;
  store?: {
    id: string;
    name: string;
  };
}

export interface CashBookEntry {
  id: string;
  store_id: string;
  date: string;
  opening_balance: number;
  total_receipts: number;
  total_payments: number;
  closing_balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CashBookReport {
  entries: CashBookEntry[];
  summary: {
    opening_balance: number;
    total_receipts: number;
    total_payments: number;
    closing_balance: number;
  };
}

export interface DashboardStats {
  current_balance: string;
  today: {
    receipts: { total: string; count: number };
    payments: { total: string; count: number };
    net: string;
  };
  this_week: {
    receipts: { total: string; count: number };
    payments: { total: string; count: number };
    net: string;
  };
  this_month: {
    receipts: { total: string; count: number };
    payments: { total: string; count: number };
    net: string;
  };
}
