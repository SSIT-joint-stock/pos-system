// eslint-disable-next-line filenames/match-regex
import { payment_method } from '../../constants/method';
import { z } from 'zod';

// Enums
export const OrderStatusEnum = z.enum([
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
  'RETURNED',
]);

// OrderItem schema
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().min(1, { message: 'Số lượng phải lớn hơn 0' }),
  price: z.number().min(0),
  meta: z.record(z.any()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Customer schema (lightweight version cho FE)
export const CustomerSchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid(),
  name: z.string().min(1, { message: 'Tên khách hàng là bắt buộc' }),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Main Order schema
export const OrderSchema = z.object({
  id: z.string().uuid(),
  code: z.string().nullable().optional(),
  cashier_id: z.string().uuid(),
  customer_id: z.string().uuid().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  store_id: z.string().uuid(),

  subtotal_amount: z.number().min(0),
  discount_amount: z.number().min(0),
  tax_amount: z.number().min(0),
  total_amount: z.number().min(0),

  payment_method: z
    .enum([
      payment_method.CASH,
      payment_method.DIGITAL_WALLET,
      payment_method.BANK_TRANSFER,
      payment_method.CREDIT_CARD,
      payment_method.DEBIT_CARD,
    ])
    .default(payment_method.CASH),
  status: OrderStatusEnum.default('PENDING'),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // relations
  customer: CustomerSchema.optional(),
  order_item: z.array(OrderItemSchema).default([]),
});

// Create DTO
export const CreateOrderSchema = z.object({
  customer_id: z.string().uuid().optional(),
  customer_name: z.string().optional(),
  payment_method: z
    .enum([
      payment_method.CASH,
      payment_method.DIGITAL_WALLET,
      payment_method.BANK_TRANSFER,
      payment_method.CREDIT_CARD,
      payment_method.DEBIT_CARD,
    ])
    .default(payment_method.CASH),
  customer_pay_amount: z.number().min(0).optional(),
  subtotal_amount: z.number().min(0).optional(),
  discount_amount: z.number().min(0).optional(),
  tax_amount: z.number().min(0).optional(),
  total_amount: z.number().min(0).optional(),
  order_items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        tax_rate: z.number().optional(),
        discount_rate: z.number().optional(),
        variant_id: z.string().uuid(),
        quantity: z.number().min(1, { message: 'Số lượng phải lớn hơn 0' }),
        price: z.number().min(0),
        meta: z.record(z.any()).default({}).optional(),
      })
    )
    .min(1, { message: 'Đơn hàng phải có ít nhất 1 sản phẩm' }),
});

// Update DTO
export const UpdateOrderSchema = CreateOrderSchema.partial();

// Inferred types
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
