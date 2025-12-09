// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(255, 'Tên danh mục không được vượt quá 255 ký tự'),
  description: z.string().max(1000, 'Mô tả không được vượt quá 1000 ký tự').optional(),
});

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(255, 'Tên danh mục không được vượt quá 255 ký tự')
    .optional(),
  description: z.string().max(1000, 'Mô tả không được vượt quá 1000 ký tự').optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
