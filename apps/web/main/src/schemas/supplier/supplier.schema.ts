// eslint-disable-next-line filenames/match-regex
import { SupplierStatus } from '@repo/design-system/types';
import { z } from 'zod';

export const SupplierSchema = z.object({
  id: z.string().uuid(),
  code: z.string().optional(),
  name: z.string().nonempty({
    message: 'Vui lòng nhập tên nhà cung cấp',
  }),
  contact_person: z.string().optional(),
  email: z
    .string()
    .email({
      message: 'Email không hợp lệ',
    })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional(),
  tax_code: z.string().optional(),
  bank_account: z.string().optional(),
  notes: z.string().optional(),

  status: z
    .enum([SupplierStatus.ACTIVE, SupplierStatus.INACTIVE, SupplierStatus.DELETE])
    .default(SupplierStatus.ACTIVE)
    .optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateSupplierSchema = SupplierSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateSupplierSchema = CreateSupplierSchema.partial();

// Inferred types
export type Store = z.infer<typeof SupplierSchema>;
export type CreateSupplierInput = z.infer<typeof CreateSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
