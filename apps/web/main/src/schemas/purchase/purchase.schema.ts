// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

/**
 * Item nhập hàng
 */
export const PurchaseOrderItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid(),

  quantity: z.number().positive(),
  unit: z.string().optional(),

  unit_cost: z.number().min(0),

  discount_rate: z.number().min(0).max(100).optional().default(0),
  tax_rate: z.number().min(0).max(100).optional().default(0),

  notes: z.string().optional().nullable(),
});

/**
 * Create Purchase Order
 */
export const CreatePurchaseOrderSchema = z.object({
  supplier_id: z.string().uuid().nonempty({ message: 'Vui lòng chọn nhà cung cấp' }),

  order_number: z.string().optional(),
  order_date: z.coerce.date().optional(),
  expected_date: z.coerce.date().optional(),

  notes: z.string().optional().nullable(),

  items: z.array(PurchaseOrderItemSchema).optional().default([]),
});

export const AcceptPaymentImportSChema = z.object({
  payment_method: z.string().nonempty({ message: 'Vui lòng chọn phương thức thanh toán' }),
  unit_cost: z.number().min(0).nonnegative({ message: 'Vui lòng số tiền thanh toán' }),
  payment_date: z.coerce.date().optional(),
  reference: z.string().optional(),
  notes: z.string().optional().nullable(),
});

/**
 * Import Excel Purchase Order (after validation)
 */
export const ImportExcelPurchaseSchema = z.object({
  supplier_id: z.string().uuid().nonempty({ message: 'Vui lòng chọn nhà cung cấp' }),
  order_date: z.coerce.date().optional(),
  items: z.array(
    z.object({
      variant_id: z.string().uuid(),
      quantity: z.number(),
      unit_cost: z.number(),
      unit: z.string().optional().nullable(),
      discount_rate: z.number().optional(),
      tax_rate: z.number().optional(),
      isStatus: z.boolean(),
    })
  ),
});

export type CreatePurchaseOrder = z.infer<typeof CreatePurchaseOrderSchema>;
export type CreatePurchaseOrderItem = z.infer<typeof PurchaseOrderItemSchema>;
export type AcceptPaymentImport = z.infer<typeof AcceptPaymentImportSChema>;
export type ImportExcelPurchase = z.infer<typeof ImportExcelPurchaseSchema>;
