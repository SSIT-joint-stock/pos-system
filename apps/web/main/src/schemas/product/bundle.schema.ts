// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

export const BundleItemSchema = z.object({
  variantId: z.string().uuid({ message: 'ID biến thể không hợp lệ' }),
  variant_name: z.string(),
  quantity: z.number().min(1, { message: 'Số lượng phải ít nhất là 1' }),
});

export const BundleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty({ message: 'Vui lòng nhập tên combo' }),
  sku: z.string().nonempty({ message: 'Vui lòng nhập mã SKU' }),
  quantity: z.number().min(0).default(0),
  price: z.number().min(0, { message: 'Giá bán không được âm' }),
  items: z.array(BundleItemSchema).min(1, { message: 'Combo phải có ít nhất một sản phẩm' }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateBundleSchema = BundleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sku: z.string().optional(),
});

export const UpdateBundleSchema = BundleSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type BundleItemInput = z.infer<typeof BundleItemSchema>;
export type BundleInput = z.infer<typeof BundleSchema>;
export type CreateBundleInput = z.infer<typeof CreateBundleSchema>;
export type UpdateBundleInput = z.infer<typeof UpdateBundleSchema>;
