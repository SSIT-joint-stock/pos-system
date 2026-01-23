// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

/**
 * Item nhập hàng
 */
export const OrderReturnItemSchema = z.object({
  order_item_id: z.string().uuid(),

  quantity: z.number().min(0, {
    message: 'Số lượng phải lớn hơn hoặc bằng 0',
  }),

  reason_status: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
});

/**
 * Create Purchase Order
 */
export const OrderReturnSchema = z.object({
  reason: z.string().optional().nullable(),

  items: z.array(OrderReturnItemSchema).optional().default([]),
});

export const AcceptPaymentImportSChema = z.object({
  payment_method: z.string().nonempty({ message: 'Vui lòng chọn phương thức thanh toán' }),
  unit_cost: z.number().min(0).nonnegative({ message: 'Vui lòng số tiền thanh toán' }),
  payment_date: z.coerce.date().optional(),
  reference: z.string().optional(),
  notes: z.string().optional().nullable(),
});

// Accept order return quantity
export const AcceptQuantitySchema = z.object({
  items: z.array(
    z.object({
      order_return_item_id: z.string().uuid(),
      quantity: z.number().min(0, {
        message: 'Số lượng phải lớn hơn hoặc bằng 0',
      }),
    })
  ),
});

export const AcceptPaymentReturnSchema = z.object({
  payment_method: z.string().nonempty({ message: 'Vui lòng chọn phương thức thanh toán' }),
  amount: z.number().min(0).nonnegative({ message: 'Vui lòng số tiền thanh toán' }),
  payment_date: z.coerce.date().optional(),
  reference: z.string().optional(),
  notes: z.string().optional().nullable(),
});
export type OrderReturn = z.infer<typeof OrderReturnSchema>;
export type OrderReturnItem = z.infer<typeof OrderReturnItemSchema>;
export type AcceptPaymentImport = z.infer<typeof AcceptPaymentImportSChema>;
export type AcceptQuantity = z.infer<typeof AcceptQuantitySchema>;
export type AcceptPaymentReturn = z.infer<typeof AcceptPaymentReturnSchema>;
