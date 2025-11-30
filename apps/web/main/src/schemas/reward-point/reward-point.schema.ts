// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

export const RewardPointSChema = z.object({
  id: z.string().uuid(),

  convert_rate: z.coerce.number().min(1, 'Phải lớn hơn 0'),
  point_value: z.coerce.number().min(1, 'Phải lớn hơn 0'),
  description: z.string().optional(),
  is_apply: z.boolean().default(false),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const ConfigRewardPoint = RewardPointSChema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Inferred types
export type RewardPoint = z.infer<typeof RewardPointSChema>;
export type ConfigRewardPointInput = z.infer<typeof ConfigRewardPoint>;
