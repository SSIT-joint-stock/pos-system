// eslint-disable-next-line filenames/match-regex
import { z } from 'zod';

export const PaymentMethodSchema = z.enum([
  'CASH',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'BANK_TRANSFER',
  'DIGITAL_WALLET',
]);

export const TransactionSourceSchema = z.enum([
  'SALE',
  'PURCHASE',
  'ORDER_RETURN',
  'PURCHASE_RETURN',
  'CUSTOMER_DEBT',
  'SUPPLIER_DEBT',
  'OTHER_INCOME',
  'OTHER_EXPENSE',
  'OPENING_BALANCE',
]);

export const ContactTypeSchema = z.enum(['CUSTOMER', 'SUPPLIER', 'OTHER', 'STORE_MEMBER']);

export const CreateReceiptSchema = z.object({
  amount: z.number().positive('Số tiền thu phải lớn hơn 0'),
  payment_method: PaymentMethodSchema,
  transaction_source: z.enum([
    'SALE',
    'PURCHASE_RETURN',
    'CUSTOMER_DEBT',
    'OTHER_INCOME',
    'OPENING_BALANCE',
  ]),
  contact_id: z.string().optional(),
  contact_type: ContactTypeSchema,
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const CreatePaymentSchema = z.object({
  amount: z.number().positive('Số tiền chi phải lớn hơn 0'),
  payment_method: PaymentMethodSchema,
  transaction_source: z.enum(['PURCHASE', 'ORDER_RETURN', 'SUPPLIER_DEBT', 'OTHER_EXPENSE']),
  contact_id: z.string().optional(),
  contact_type: ContactTypeSchema,
  description: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateReceiptInput = z.infer<typeof CreateReceiptSchema>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;

export const UpdateTransactionSchema = z.object({
  amount: z.number().optional(),
  payment_method: PaymentMethodSchema.optional(),
  transaction_source: TransactionSourceSchema.optional(),
  contact_name: z.string().optional(),
  contact_type: ContactTypeSchema.optional(),
  contact_id: z.string().uuid().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  reference_type: z.string().optional(),
  reference_id: z.string().uuid().optional(),
});

export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
