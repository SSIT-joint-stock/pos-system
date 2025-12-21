// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

export const StoreSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty({ message: 'Vui lòng nhập tên doanh nghiệp' }),
  description: z.string().optional(),
  phone_number: z.string().optional(),
  business_hour: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateStoreSchema = StoreSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateStoreSchema = CreateStoreSchema.partial();

// Inferred types
export type Store = z.infer<typeof StoreSchema>;
export type CreateStoreInput = z.infer<typeof CreateStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
