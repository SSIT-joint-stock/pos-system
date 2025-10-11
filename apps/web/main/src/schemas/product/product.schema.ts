// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty({
    message: 'Vui lòng nhập tên sản phẩm',
  }),
  sku: z.string().nonempty({
    message: 'Vui lòng nhập mã sử dụng',
  }),
  barcode: z.string().optional(),
  price: z
    .number()
    .min(0, {
      message: 'Giá trị phải lớn hơn hoặc bằng 0',
    })
    .nonnegative({
      message: 'Giá trị phải lớn hơn hoặc bằng 0',
    }),
  cost: z
    .number()
    .min(0, {
      message: 'Giá trị phải lớn hơn hoặc bằng 0',
    })
    .nonnegative({
      message: 'Giá trị phải lớn hơn hoặc bằng 0',
    }),
  image_url: z
    .string()
    .url({ message: 'URL không hợp lệ' })
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  description: z.string().optional(),
  product_status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  categoryIds: z.array(z.string().uuid()).optional(),
  meta: z.record(z.any()).default({}).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateInvoiceProductSchema = CreateProductSchema.extend({
  initial_quantity: z
    .number({
      required_error: 'Vui lòng nhập số lượng ban đầu',
      invalid_type_error: 'Số lượng phải là số',
    })
    .int()
    .min(0, { message: 'Số lượng ban đầu phải >= 0' })
    .default(1),
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Inferred types
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export type CreateInvoiceProductInput = z.infer<typeof CreateInvoiceProductSchema>;
