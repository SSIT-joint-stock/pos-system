// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty({
    message: 'Vui lòng nhập tên sản phẩm',
  }),
  baseUnit: z.string().nonempty({
    message: 'Vui lòng nhập đơn vị cơ bản',
  }),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().default(0).optional(),
  cost: z.number().default(0).optional(),
  image_url: z
    .string()
    .url({ message: 'URL không hợp lệ' })
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  description: z.string().optional(),
  product_status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  categoryIds: z.array(z.string().uuid()).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  is_set_default_variant: z.boolean().default(false),
  meta: z.record(z.any()).default({}).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sku: z.string().optional(),
  quantity: z.number().optional().default(0), // quantity for variant default when create new product
  price: z.number().default(0).optional(),
  cost: z.number().default(0).optional(),
});
export const UpdateProductSchema = ProductSchema.partial()
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    sku: z.string().nonempty({
      message: 'Vui lòng nhập mã sản phẩm',
    }),
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

// Inferred types
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
