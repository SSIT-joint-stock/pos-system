// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

export const InfoPaymentSchema = z.object({
  id: z.string().uuid(),

  bank_code: z.string().nonempty({
    message: 'Vui lòng nhập hình thức thanh toán',
  }),
  bank_name: z.string().nonempty({
    message: 'Vui lòng nhập tên ngân hàng',
  }),
  bank_account_number: z.string().nonempty({
    message: 'Vui lòng nhập số tài khoản ngân hàng',
  }),
  bank_account_name: z
    .string()
    .nonempty({
      message: 'Vui lòng nhập tên tài khoản ngân hàng',
    })
    .toUpperCase(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const ConfigInfoPayment = InfoPaymentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Inferred types
export type InfoPayment = z.infer<typeof InfoPaymentSchema>;
export type ConfigInfoPaymentInput = z.infer<typeof ConfigInfoPayment>;
