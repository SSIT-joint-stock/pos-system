import { payment_method } from './method';

export const ORDER_STATUS = {
  overage: {
    label: 'Trả thừa',
    color: 'text-pos-blue-500',
    bgColor: 'bg-pos-blue-50',
    value: 'OVERAGE',
  },
  returned: {
    label: 'Đã trả hàng',
    color: 'text-red-900',
    bgColor: 'bg-red-50',
    value: 'RETURNED',
  },
  pending: {
    label: 'Chờ thanh toán',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    value: 'PENDING',
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    value: 'CANCELLED',
  },
  completed: {
    label: 'Hoàn thành',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    value: 'COMPLETED',
  },
  processing: {
    label: 'Đang xử lý',
    color: 'text-red-900',
    bgColor: 'bg-red-50',
    value: 'PROCESSING',
  },
};

export const ORDER_STATUS_MAP = Object.values(ORDER_STATUS).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, { label: string; color: string; bgColor: string; value: string }>
);

export const SUPPLIER_STATUS = {
  active: {
    label: 'Đang hoạt động',
    color: 'text-pos-blue-500',
    bgColor: 'bg-pos-blue-50',
    value: 'ACTIVE',
  },
  inactive: {
    label: 'Ngưng hoạt động',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    value: 'INACTIVE',
  },
  delete: { label: 'Đã xóa', color: 'text-red-500', bgColor: 'bg-red-50', value: 'DELETE' },
};

export const SUPPLIER_STATUS_MAP = Object.values(SUPPLIER_STATUS).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, { label: string; color: string; bgColor: string; value: string }>
);

export const STOCK_MOVEMENT_STATUS = [
  { value: 'ADJUSTMENT', label: 'Điều chỉnh kho ' },
  { value: 'PURCHASE', label: 'Nhập hàng từ nhà cung cấp' },
  { value: 'SALE', label: 'Bán hàng cho khách hàng' },
  { value: 'RETURN_PURCHASE', label: 'Trả hàng cho nhà cung cấp' },
  { value: 'RETURN_SALE', label: 'Nhận hàng trả từ khách hàng' },
  { value: 'TRANSFER_IMPORT', label: 'Nhập hàng từ kho khác' },
  { value: 'TRANSFER_EXPORT', label: 'Xuất hàng sang kho khác' },
];

export const STOCK_MOVEMENT_CONFIG: Record<
  string,
  { isIncoming: boolean; usesAbsoluteValue: boolean }
> = {
  ADJUSTMENT: { isIncoming: true, usesAbsoluteValue: false },
  PURCHASE: { isIncoming: true, usesAbsoluteValue: true },
  RETURN_SALE: { isIncoming: true, usesAbsoluteValue: true },
  TRANSFER_IMPORT: { isIncoming: true, usesAbsoluteValue: true },

  SALE: { isIncoming: false, usesAbsoluteValue: true },
  RETURN_PURCHASE: { isIncoming: false, usesAbsoluteValue: true },
  TRANSFER_EXPORT: { isIncoming: false, usesAbsoluteValue: true },
};

export const PURCHASE_STATUS = {
  pending: {
    label: 'Đang chờ duyệt',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    value: 'PENDING',
  },
  received: {
    label: 'Đã nhập hàng',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    value: 'RECEIVED',
  },
};

export const PURCHASE_STATUS_MAP = Object.values(PURCHASE_STATUS).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, { label: string; color: string; bgColor: string; value: string }>
);

export const PAYMENT_STATUS = {
  unpaid: {
    label: 'Chưa thanh toán',
    color: 'text-yellow-500', // chữ vàng đậm
    bgColor: 'bg-yellow-50', // nền vàng nhạt
    value: 'UNPAID',
  },
  partial: {
    label: 'Thanh toán một phần',
    color: 'text-orange-500', // chữ cam nhạt
    bgColor: 'bg-orange-50', // nền cam nhạt
    value: 'PARTIAL',
  },
  paid: {
    label: 'Đã thanh toán đầy đủ',
    color: 'text-green-500', // chữ xanh lá đậm
    bgColor: 'bg-green-50', // nền xanh lá nhạt
    value: 'PAID',
  },
  overdue: {
    label: 'Quá hạn thanh toán',
    color: 'text-red-500', // chữ đỏ đậm
    bgColor: 'bg-red-50', // nền đỏ nhạt
    value: 'OVERDUE',
  },
};

export const PAYMENT_STATUS_MAP = Object.values(PAYMENT_STATUS).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, { label: string; color: string; bgColor: string; value: string }>
);
export const paymentMethods = [
  {
    label: 'Tiền mặt',
    value: payment_method.CASH,
  },
  {
    label: 'Thẻ tín dụng',
    value: payment_method.CREDIT_CARD,
  },
  {
    label: 'Thẻ ghi nợ',
    value: payment_method.DEBIT_CARD,
  },
  {
    label: 'Chuyển khoản',
    value: payment_method.BANK_TRANSFER,
  },
  {
    label: 'Ví điện tử',
    value: payment_method.DIGITAL_WALLET,
  },
];

export const PURCHASE_RETURN_STATUS = {
  draft: {
    label: 'Đang chờ duyệt',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    value: 'DRAFT',
  },
  completed: {
    label: 'Đã hoàn trả',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    value: 'COMPLETED',
  },
  cancelled: {
    label: 'Đã hoàn trả',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    value: 'CANCELLED',
  },
};

export const PURCHASE_RETURN_STATUS_MAP = Object.values(PURCHASE_RETURN_STATUS).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, { label: string; color: string; bgColor: string; value: string }>
);

export type OrderStatus = keyof typeof ORDER_STATUS;
export type SupplierStatus = keyof typeof SUPPLIER_STATUS;
export type StockMovementStatus = (typeof STOCK_MOVEMENT_STATUS)[number]['value'];
export type PurchaseStatus = keyof typeof PURCHASE_STATUS;

// helper functions map

export function getPurchaseStatusLabel(status: string) {
  return PURCHASE_STATUS_MAP[status]?.label;
}
export function getPurchaseReturnStatusLabel(status: string) {
  return PURCHASE_RETURN_STATUS_MAP[status]?.label;
}

export function getPurchasePaymentStatusLabel(status: string) {
  return PAYMENT_STATUS_MAP[status]?.label;
}

export function getOrderStatusLabel(status: string) {
  return ORDER_STATUS_MAP[status]?.label;
}
export function getPaymentMethodLabel(method: string) {
  const methodObj = paymentMethods.find((m) => m.value === method);
  return methodObj ? methodObj.label : 'N/A';
}

export const RETURN_TYPE_LABELS: Record<string, string> = {
  RETURN_FOR_CREDIT: 'Hoàn tiền',
  RETURN_FOR_EXCHANGE: 'Đổi hàng',
  'N/A': 'Không xác định',
};

export function getReturnTypeLabel(type: string) {
  return RETURN_TYPE_LABELS[type] || type || 'N/A';
}

export function getOrderReturnStatusLabel(status: string) {
  const map: Record<string, string> = {
    DRAFT: 'Đang chờ duyệt',
    COMPLETED: 'Đã hoàn thành',
    CANCELLED: 'Đã hủy',
  };
  return map[status] || status;
}
export function getStockMovementStatusLabel(status: string) {
  const statusObj = STOCK_MOVEMENT_STATUS.find((s) => s.value === status);
  return statusObj ? statusObj.label : 'N/A';
}

export const purchaseStatusOptions = Object.entries(PURCHASE_STATUS).map(([key, item]) => ({
  label: item.label,
  value: item.value,
  color: item.color,
  key, // optional
}));
export const paymentStatusOptions = Object.entries(PAYMENT_STATUS).map(([key, item]) => ({
  label: item.label,
  value: item.value,
  color: item.color,
  key, // optional
}));
