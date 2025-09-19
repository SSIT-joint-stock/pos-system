// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).nonempty({
    message: 'Vui lòng nhập tên sản phẩm',
  }),
  sku: z.string().min(1).nonempty({
    message: 'Vui lòng nhập mã sử dụng',
  }),
  barcode: z.string().optional(),
  price: z.number().min(0).nonnegative({
    message: 'Giá trị phải lớn hơn hoặc bằng 0',
  }),
  cost: z.number().min(0).nonnegative({
    message: 'Giá trị phải lớn hơn hoặc bằng 0',
  }),
  image_url: z.string().url().optional(),
  description: z.string().optional(),
  product_status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  meta: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Inferred types
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
