import z from "zod";

export const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ObjectId không hợp lệ (yêu cầu 24 ký tự hex)");

export const createProductChema = z.object({
    tenantId: objectId,
    name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),
    sku: z.string().trim().min(1, "SKU không được để trống"),
    categoryId: objectId,
    basePrice: z
        .number({ invalid_type_error: "basePrice phải là số" })
        .finite()
        .nonnegative(), // >= 0

    // Optional
    description: z.string().trim().max(1000).optional(),
    barcode: z.string().trim().min(1).optional(),
    baseCost: z
        .number({ invalid_type_error: "baseCost phải là số" })
        .finite()
        .nonnegative()
        .optional(),
    trackInventory: z.boolean().optional(),
    isActive: z.boolean().optional(),
    imageUrl: z.string().url("imageUrl phải là URL hợp lệ").optional(),
    tags: z.array(z.string().trim().min(1)).max(50).optional(),
})

export const updateProductSchema = createProductChema.partial();


export type CreateProductInput = z.infer<typeof createProductChema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;