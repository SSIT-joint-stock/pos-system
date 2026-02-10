// export enum OrderItemReturnReason {
//   UNKNOWN = 'UNKNOWN',
//   CUSTOMER_CHANGED_MIND = 'CUSTOMER_CHANGED_MIND',
//   NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
//   WRONG_ITEM_SENT = 'WRONG_ITEM_SENT',
//   DAMAGED = 'DAMAGED',
//   DEFECTIVE = 'DEFECTIVE',
//   WRONG_SIZE = 'WRONG_SIZE',
//   WRONG_COLOR = 'WRONG_COLOR',
//   WRONG_MODEL = 'WRONG_MODEL',
//   OTHER = 'OTHER',
// }
export enum OrderItemReturnReason {
  UNKNOWN = 'UNKNOWN', // Không xác định

  // Nhóm lỗi Shop/Sản phẩm
  PRODUCT_DEFECT = 'PRODUCT_DEFECT', // Hàng lỗi/hỏng
  WRONG_PRODUCT = 'WRONG_PRODUCT', // Giao sai hàng
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED', // Khác mô tả
  EXPIRED = 'EXPIRED', // Hết hạn
  INCOMPLETE = 'INCOMPLETE', // Thiếu phụ kiện
  POOR_QUALITY = 'POOR_QUALITY', // Chất lượng kém
  // Nhóm vận chuyển
  SHIPPING_DAMAGE = 'SHIPPING_DAMAGE', // Hư hỏng do vận chuyển
  LATE_DELIVERY = 'LATE_DELIVERY', // Giao trễ

  // Nhóm khách hàng
  CHANGE_OF_MIND = 'CHANGE_OF_MIND', // Đổi ý/Không thích nữa
  SIZE_UNFIT = 'SIZE_UNFIT', // Không vừa (Size)
  ACCIDENTAL_ORDER = 'ACCIDENTAL_ORDER', // Đặt nhầm
  BETTER_PRICE = 'BETTER_PRICE', // Tìm thấy giá rẻ hơn

  // Khác
  OTHER = 'OTHER', // Lý do khác
}
export const ORDER_ITEM_RETURN_REASON_LABEL: Record<OrderItemReturnReason, string> = {
  [OrderItemReturnReason.UNKNOWN]: 'Không xác định',
  [OrderItemReturnReason.PRODUCT_DEFECT]: 'Hàng lỗi/hỏng',
  [OrderItemReturnReason.WRONG_PRODUCT]: 'Giao sai hàng',
  [OrderItemReturnReason.NOT_AS_DESCRIBED]: 'Khác mô tả',
  [OrderItemReturnReason.EXPIRED]: 'Hết hạn',
  [OrderItemReturnReason.INCOMPLETE]: 'Thiếu phụ kiện',
  [OrderItemReturnReason.POOR_QUALITY]: 'Chất lượng kém',
  [OrderItemReturnReason.SHIPPING_DAMAGE]: 'Hư hỏng do vận chuyển',
  [OrderItemReturnReason.LATE_DELIVERY]: 'Giao trễ',
  [OrderItemReturnReason.CHANGE_OF_MIND]: 'Đổi ý/Không thích nữa',
  [OrderItemReturnReason.SIZE_UNFIT]: 'Không vừa (Size)',
  [OrderItemReturnReason.ACCIDENTAL_ORDER]: 'Đặt nhầm',
  [OrderItemReturnReason.BETTER_PRICE]: 'Tìm thấy giá rẻ hơn',
  [OrderItemReturnReason.OTHER]: 'Lý do khác',
};

export const ORDER_RETURN_STATUS = {
  requested: {
    label: 'Khách yêu cầu trả hàng',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    value: 'REQUESTED',
  },
  refunded: {
    label: 'Đã hoàn tiền',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    value: 'REFUNDED',
  },
  pending: {
    label: 'Đã hủy',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    value: 'CANCELLED',
  },
};

export const ORDER_RETURN_TYPE = {
  none: {
    label: 'Chưa hoàn trả',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    value: 'NONE',
  },
  full: {
    label: 'Trả toàn bộ đơn hàng',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    value: 'FULL',
  },
  partial: {
    label: 'Trả một phần đơn hàng',
    color: 'text-pos-blue-500',
    bgColor: 'bg-pos-blue-50',
    value: 'PARTIAL',
  },
};

export const ORDER_ITEM_RETURN_REASON_OPTIONS = Object.values(OrderItemReturnReason).map(
  (value) => ({
    value,
    label: ORDER_ITEM_RETURN_REASON_LABEL[value],
  })
);

export const ORDER_RETURN_STATUS_MAP = Object.values(ORDER_RETURN_STATUS).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, { label: string; color: string; bgColor: string; value: string }>
);

export const ORDER_RETURN_TYPE_MAP = Object.values(ORDER_RETURN_TYPE).reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, { label: string; color: string; bgColor: string; value: string }>
);

export const orderReturnStatusOptions = Object.entries(ORDER_RETURN_STATUS).map(([key, item]) => ({
  label: item.label,
  value: item.value,
  color: item.color,
  key, // optional
}));

export function getOrderItemReturnReasonLabel(reason: OrderItemReturnReason) {
  return ORDER_ITEM_RETURN_REASON_LABEL[reason];
}

export function getOrderReturnStatusLabel(status: string) {
  return ORDER_RETURN_STATUS_MAP[status]?.label;
}
