export enum OrderItemReturnReason {
  UNKNOWN = 'UNKNOWN',
  CUSTOMER_CHANGED_MIND = 'CUSTOMER_CHANGED_MIND',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  WRONG_ITEM_SENT = 'WRONG_ITEM_SENT',
  DAMAGED = 'DAMAGED',
  DEFECTIVE = 'DEFECTIVE',
  WRONG_SIZE = 'WRONG_SIZE',
  WRONG_COLOR = 'WRONG_COLOR',
  WRONG_MODEL = 'WRONG_MODEL',
  OTHER = 'OTHER',
}
export const ORDER_ITEM_RETURN_REASON_LABEL: Record<OrderItemReturnReason, string> = {
  [OrderItemReturnReason.UNKNOWN]: 'Không xác định',
  [OrderItemReturnReason.CUSTOMER_CHANGED_MIND]: 'Khách hàng thay đổi ý định',
  [OrderItemReturnReason.NOT_AS_DESCRIBED]: 'Sản phẩm không đúng mô tả',
  [OrderItemReturnReason.WRONG_ITEM_SENT]: 'Giao sai sản phẩm',
  [OrderItemReturnReason.DAMAGED]: 'Sản phẩm bị hư hỏng',
  [OrderItemReturnReason.DEFECTIVE]: 'Sản phẩm bị lỗi, không hoạt động',
  [OrderItemReturnReason.WRONG_SIZE]: 'Sai kích cỡ / kích thước',
  [OrderItemReturnReason.WRONG_COLOR]: 'Giao sai màu sắc',
  [OrderItemReturnReason.WRONG_MODEL]: 'Sai mẫu / kiểu dáng',
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
