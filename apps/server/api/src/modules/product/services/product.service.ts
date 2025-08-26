import { resolve } from "path";
import { CreateProductDTO, DeleteProductDTO, GetProductDTO, GetProductsDetailDTO, IProductService, PickProductFields, productServiceResult, UpdateProductDTO } from "../interfaces/product.interface";
import prisma from "@shared/orm/prisma";
import _ from "lodash";
import { ProductRepository } from "@/shared/repositories/product.repository";
import { BadRequestError, NotFoundError } from "@repo/types/response";
import { InventoryRepository } from "@/shared/repositories/inventory.repository";


export class ProductService implements IProductService {
    private products = new ProductRepository(prisma)

    async existInTenant(tenantId: string, sku: string): Promise<boolean> {
        const existing = await prisma.product.findFirst({
            where: {
                tenantId,
                sku,
            },
            select: { id: true },
        });
        return !!existing;
    }

    async createProduct(data: CreateProductDTO): Promise<productServiceResult> {
        const alreadyExists = await this.existInTenant(data.tenantId, data.sku);
        if (alreadyExists) {
            throw new BadRequestError(`Product with SKU "${data.sku}" already exists in this tenant`);
        }
        try {
            const tags: any = Array.isArray(data.tags) ? data.tags : [];

            const createdProduct = await prisma.$transaction(async (tx) => {
                const productRepo = new ProductRepository(tx);
                const inventoryRepo = new InventoryRepository(tx);
                const newProduct = await productRepo.create({
                    ...data,
                    description: data.description ?? null,
                    barcode: data.barcode ?? null,
                    baseCost: data.baseCost ?? null,
                    imageUrl: data.imageUrl ?? null,
                    tags: tags
                })
                // auto-create inventory record (0/0)
                await inventoryRepo.upsertZero(data.tenantId, newProduct.id);
                return newProduct
            })
            return { product: _.pick(createdProduct, PickProductFields) }
        } catch (e: any) {
            throw new BadRequestError("message: Create product failed-", e);
        }
    }
    async updateProduct(id: string, data: UpdateProductDTO): Promise<productServiceResult> {
        try {
            const updatedProduct = await this.products.updateById(id, {
                ...data,
            });
            return { product: _.pick(updatedProduct, PickProductFields) }
        } catch (err) {
            throw new BadRequestError("message: Update product failed-", err);
        }
    }
    async deleteProduct(id: string, tenantId: string): Promise<void> {
        const existed = await this.products.findById(id, tenantId);
        if (!existed) throw new NotFoundError("Không tìm thấy sản phẩm");

        await prisma.$transaction(async (tx) => {                               // add delete stock movement later
            const productRepo = new ProductRepository(tx);
            const inventoryRepo = new InventoryRepository(tx);
            await productRepo.delete(existed.id);
            await inventoryRepo.delete(existed.id);
        });
    }
    async getProduct(id: string, tenantId: string): Promise<productServiceResult> {
        const product = await this.products.findById(id, tenantId);
        if (!product) {
            throw new BadRequestError("Product not found")
        }
        return { product: _.pick(product, PickProductFields) }
    }
    async getAllProducts() {
        try {
            const getProducts = await this.products.findAllProducts()
            return { products: getProducts.map(p => _.pick(p, PickProductFields)) }
        } catch (err) {
            throw new BadRequestError("Product not found")
        }
    }
    // async getProductDetail(data: GetProductsDetailDTO) {
    //     const getProducts = await this.products.findProductsDetail(data)
    //     if (!getProducts) {
    //         throw new BadRequestError("Product not found")
    //     }
    //     return { product: _.pick(getProducts, PickProductFields) }
    // }
}

export default new ProductService();