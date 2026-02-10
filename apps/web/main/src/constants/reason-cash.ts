export enum ReasonCash {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  ORDER_RETURN = 'ORDER_RETURN',
  PURCHASE_RETURN = 'PURCHASE_RETURN',
  CUSTOMER_DEBT = 'CUSTOMER_DEBT',
  SUPPLIER_DEBT = 'SUPPLIER_DEBT',
  OTHER_INCOME = 'OTHER_INCOME',
  OTHER_EXPENSE = 'OTHER_EXPENSE',
  OPENING_BALANCE = 'OPENING_BALANCE',
}
export enum ReasonReceipt {
  SALE = 'SALE',
  PURCHASE_RETURN = 'PURCHASE_RETURN',
  CUSTOMER_DEBT = 'CUSTOMER_DEBT',
  OTHER_INCOME = 'OTHER_INCOME',
  OPENING_BALANCE = 'OPENING_BALANCE',
}

export enum ReasonPayment {
  PURCHASE = 'PURCHASE',
  ORDER_RETURN = 'ORDER_RETURN',
  SUPPLIER_DEBT = 'SUPPLIER_DEBT',
  OTHER_EXPENSE = 'OTHER_EXPENSE',
}
export const ReasonCashMap: Record<ReasonCash, string> = {
  [ReasonCash.SALE]: 'Thu tiền bán hàng',
  [ReasonCash.PURCHASE]: 'Chi tiền nhập hàng',
  [ReasonCash.ORDER_RETURN]: 'Chi tiền trả hàng cho khách',
  [ReasonCash.PURCHASE_RETURN]: 'Thu tiền trả hàng nhập',
  [ReasonCash.CUSTOMER_DEBT]: 'Thu nợ khách hàng',
  [ReasonCash.SUPPLIER_DEBT]: 'Chi trả nợ NCC',
  [ReasonCash.OTHER_INCOME]: 'Thu khác',
  [ReasonCash.OTHER_EXPENSE]: 'Chi khác',
  [ReasonCash.OPENING_BALANCE]: 'Số dư đầu kỳ',
};

export const ReasonReceiptMap: Record<ReasonReceipt, string> = {
  [ReasonReceipt.SALE]: 'Thu tiền bán hàng',
  [ReasonReceipt.PURCHASE_RETURN]: 'Thu tiền trả hàng nhập',
  [ReasonReceipt.CUSTOMER_DEBT]: 'Thu nợ khách hàng',
  [ReasonReceipt.OTHER_INCOME]: 'Thu khác',
  [ReasonReceipt.OPENING_BALANCE]: 'Số dư đầu kỳ',
};

export const ReasonPaymentMap: Record<ReasonPayment, string> = {
  [ReasonPayment.PURCHASE]: 'Chi tiền nhập hàng',
  [ReasonPayment.ORDER_RETURN]: 'Chi tiền trả hàng cho khách',
  [ReasonPayment.SUPPLIER_DEBT]: 'Chi trả nợ NCC',
  [ReasonPayment.OTHER_EXPENSE]: 'Chi khác',
};

export const REASON_RECEIPT_OPTIONS = Object.values(ReasonReceipt).map((value) => ({
  value,
  label: ReasonReceiptMap[value],
}));

export const REASON_PAYMENT_OPTIONS = Object.values(ReasonPayment).map((value) => ({
  value,
  label: ReasonPaymentMap[value],
}));

export function getOrderItemReturnReasonLabel(reason: ReasonCash) {
  return ReasonCashMap[reason];
}
