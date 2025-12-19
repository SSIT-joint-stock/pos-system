// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';
export const CreateVariantSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên biến thể là bắt buộc')
    .max(255, 'Tên biến thể không được vượt quá 255 ký tự')
    .trim(),
  sku: z.string().trim().optional(),
  barcode: z.string().trim().optional(),
  price: z.number().min(0).default(0).optional(),
  cost: z.number().min(0).default(0).optional(),
  stock: z.number().default(0).optional(),
  conversions: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Tên đơn vị không được rỗng'),
        factor: z.number(),
      })
    )
    .default([])
    .superRefine((conversions, ctx) => {
      const map = new Map<string, number>();

      conversions.forEach((item, index) => {
        const key = item.name.toLowerCase(); // tránh "Hộp" vs "hộp"

        if (map.has(key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Đơn vị "${item.name}" đã tồn tại`,
            path: [index, 'name'], // báo lỗi đúng input
          });
        } else {
          map.set(key, index);
        }
      });
    }),
});

export const UpdateVariantSchema = CreateVariantSchema.partial().extend({
  name: z
    .string()
    .trim()
    .min(1, 'Tên biến thể là bắt buộc')
    .max(255, 'Tên biến thể không được vượt quá 255 ký tự')
    .optional(),
});

export type CreateVariantInput = z.infer<typeof CreateVariantSchema>;
export type UpdateVariantInput = z.infer<typeof UpdateVariantSchema>;
