// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

/**
 * Item trả hàng
 */
export const PurchaseReturnItemSchema = z.object({
  product_id: z.string().uuid().optional(),
  variant_id: z.string().uuid().optional(),

  unit: z.string().optional(),

  purchase_order_item_id: z.string().uuid().optional(),

  quantity: z.number().min(0, {
    message: 'Số lượng phải lớn hơn hoặc bằng 0',
  }),

  unit_cost: z.number().min(0, {
    message: 'Vui lòng nhập số tiền lớn hơn 0',
  }),

  reason: z.string().optional().nullable(),
});

/**
 * Create Purchase return with purchase order
 */
export const PurchaseReturnWithPurchaseOrderSchema = z.object({
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  return_date: z.coerce.date().optional(),
  items: z.array(PurchaseReturnItemSchema).optional().default([]),
});

/**
 * Create Purchase return without purchase order
 */
export const PurchaseReturnWithoutPOSchema = z.object({
  supplier_id: z.string().uuid().nullable(),
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  return_date: z.coerce.date().optional(),
  items: z.array(PurchaseReturnItemSchema).optional().default([]),
});

export const AcceptPaymentExportSChema = z.object({
  payment_method: z.string().nonempty({ message: 'Vui lòng chọn phương thức thanh toán' }),
  amount: z.number().min(0).nonnegative({ message: 'Vui lòng số tiền thanh toán' }),
  payment_date: z.coerce.date().optional(),
  reference: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export type PurchaseReturnWithPurchaseOrder = z.infer<typeof PurchaseReturnWithPurchaseOrderSchema>;
export type PurchaseReturnWithoutPO = z.infer<typeof PurchaseReturnWithoutPOSchema>;
export type PurchaseReturnItem = z.infer<typeof PurchaseReturnItemSchema>;
export type AcceptPaymentExport = z.infer<typeof AcceptPaymentExportSChema>;
