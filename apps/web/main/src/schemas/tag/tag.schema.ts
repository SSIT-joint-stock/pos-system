// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';
export const CreateTagSchema = z.object({
  name: z.string().min(1, 'Tên tag là bắt buộc').max(255, 'Tên tag không được vượt quá 255 ký tự'),
  description: z.string().max(1000, 'Mô tả tag vượt quá 1000 ký tự').optional(),
});

export const UpdateTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên tag là bắt buộc')
    .max(255, 'Tên tag không được vượt quá 255 ký tự')
    .optional(),
  description: z.string().max(1000, 'Mô tả tag vượt quá 1000 ký tự').optional(),
});

export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;
