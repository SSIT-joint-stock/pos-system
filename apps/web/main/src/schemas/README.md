# Schemas

Thư mục `schemas` định nghĩa các “hợp đồng dữ liệu” cho UI và logic hiển thị/quản lý. Ưu tiên Zod để validate runtime và sinh type an toàn, có thể kèm interface/type TS khi cần.

## Mục tiêu
- Chuẩn hóa cấu trúc dữ liệu sử dụng ở UI.
- Validate dữ liệu từ API/form ở runtime.
- Tái sử dụng schema giữa nhiều màn hình/feature.

## Quy ước
- Tổ chức theo domain, dùng thư mục chữ thường có gạch nối (vd: `product/`, `order/`).
- Ưu tiên named exports.
- Mỗi entity: `*.schema.ts` (Zod), `*.types.ts` (interface/type), `index.ts` (barrel).
- Đặt tên schema: `<Entity>Schema`, type infer: `<Entity>`, input: `<Entity>Input`.

## Khi nào dùng Zod vs TypeScript
- Zod: validate runtime, parse dữ liệu từ API/form, tạo message lỗi.
- TypeScript: đảm bảo type compile-time, mở rộng cho props hoặc state.

## Ví dụ

### 1) Product schema (Zod + TS)
```ts
// schemas/product/product.schema.ts
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().nonnegative(),
  currency: z.string().default('USD'),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdateProductSchema = CreateProductSchema.partial();

// Inferred types
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
```

```ts
// schemas/product/product.types.ts
export interface ProductTableRowProps {
  productId: string;
  highlight?: boolean;
}