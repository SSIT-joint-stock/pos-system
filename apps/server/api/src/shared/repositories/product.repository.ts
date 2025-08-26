import prisma, { DbClient, Prisma, PrismaClient, Product, } from "@shared/orm/prisma";


export type ProductEntity = Product
export type StrictPartial<T> = {
    [K in keyof T]?: T[K];
};

type Db = PrismaClient | Prisma.TransactionClient;
export class ProductRepository {
    constructor(private db: DbClient) { }

    // private selectField = {
    //     tenantId: true,
    //     name: true,
    //     sku: true,
    //     categoryId: true,
    //     basePrice: true,

    //     description: true,
    //     barcode: true,
    //     baseCost: true,
    //     trackInventory: true,
    //     isActive: true,
    //     imageUrl: true,
    //     tags: true,
    // }

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
        const newProduct = await this.db.product.create({
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
        const udatedProduct = await this.db.product.update(
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
        await this.db.product.delete({
            where: { id },
        });
    }
    async findById(id: string, tenantId: string): Promise<ProductEntity | null> {
        const product = await this.db.product.findUnique({
            where: { id, tenantId }
        })
        return product as unknown as ProductEntity
    }

    async findProductsDetail(product: object): Promise<ProductEntity[]> {
        const products = await this.db.product.findMany({ where: product });
        return products as ProductEntity[];
    }

    async findAllProducts(): Promise<ProductEntity[]> {
        const products = await this.db.product.findMany();
        return products as ProductEntity[];
    }
}