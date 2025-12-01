export const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'yellow' },
  paid: { label: 'Paid', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
} as const;
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
  delete: { label: 'Đã xóa', color: 'tex-red-500', bgColor: 'bg-red-50', value: 'DELETE' },
};
export const SUPPLIER_STATUS_MAP = Object.values(SUPPLIER_STATUS).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, { label: string; color: string; bgColor: string; value: string }>
);

export type OrderStatus = keyof typeof ORDER_STATUS;
export type SupplierStatus = keyof typeof SUPPLIER_STATUS;
