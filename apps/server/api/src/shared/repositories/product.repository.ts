import prisma, { Product } from "@shared/orm/prisma";

export type ProductEntity = Product
export type StrictPartial<T> = {
    [K in keyof T]?: T[K];
};


export class ProductRepository {


    private selectField = {
        tenantId: true,
        name: true,
        sku: true,
        categoryId: true,
        basePrice: true,

        description: true,
        barcode: true,
        baseCost: true,
        trackInventory: true,
        isActive: true,
        imageUrl: true,
        tags: true,
    }

    async create(
        product: Omit<
            ProductEntity,
            | "id"
            | "trackInventory"
            | "isActive"
            | "createdAt"
            | "updatedAt"
        >
    ): Promise<ProductEntity> {
        const newProduct = await prisma.product.create({
            data: {
                ...product,
                tags: (product.tags ?? [])   // need to test later
            }
        })
        return newProduct as ProductEntity
    }

    async updateById(id: string,
        product: StrictPartial<Omit<
            ProductEntity,
            | "id"
            | "trackInventory"
            | "isActive"
            | "createdAt"
            | "updatedAt"
        >>): Promise<ProductEntity> {
        const udatedProduct = await prisma.product.update(
            {
                where: { id },
                data: {
                    ...product,
                    tags: (product.tags ?? [])   // need to test later
                },
            }
        )
        return udatedProduct as ProductEntity
    }

    async delete(id: string): Promise<void> {
        await prisma.product.delete({
            where: { id },
        });
    }
    async findById(id: string): Promise<ProductEntity | null> {
        const product = await prisma.product.findUnique({
            where: { id }
        })
        return product as unknown as ProductEntity
    }
}