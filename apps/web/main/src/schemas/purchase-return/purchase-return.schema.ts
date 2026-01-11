// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

/**
 * Item trả hàng
 */
export const PurchaseReturnItemSchema = z.object({
  product_id: z.string().uuid().optional(),
  variant_id: z.string().uuid().optional(),

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

export type PurchaseReturnWithPurchaseOrder = z.infer<typeof PurchaseReturnWithPurchaseOrderSchema>;
export type PurchaseReturnWithoutPO = z.infer<typeof PurchaseReturnWithoutPOSchema>;
export type PurchaseReturnItem = z.infer<typeof PurchaseReturnItemSchema>;
