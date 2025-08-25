import { resolve } from "path";
import { CreateProductDTO, DeleteProductDTO, GetProductDTO, GetProductsDetailDTO, IProductService, PickProductFields, productServiceResult, UpdateProductDTO } from "../interfaces/product.interface";
import prisma from "@shared/orm/prisma";
import _ from "lodash";
import { ProductRepository } from "@/shared/repositories/product.repository";
import { BadRequestError } from "@repo/types/response";


export class ProductService implements IProductService {
    private products = new ProductRepository()

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
            const newProduct = await this.products.create({
                ...data,
                description: data.description ?? null,
                barcode: data.barcode ?? null,
                baseCost: data.baseCost ?? null,
                imageUrl: data.imageUrl ?? null,
                tags: data.tags ?? []
            })
            // const newProduct2 = await this.products.create(data)
            return { product: _.pick(newProduct, PickProductFields) }
        } catch (err) {
            throw new BadRequestError("message: Create product failed-", err);
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
    async deleteProduct(id: string): Promise<void> {
        try {
            await this.products.delete(id)
        } catch (err) {
            throw new BadRequestError("message: Delete product failed-", err);
        }
    }
    async getProduct(id: string): Promise<productServiceResult> {
        const product = await this.products.findById(id)
        if (!product) {
            throw new BadRequestError("Product not found")
        }
        return { product: _.pick(product, PickProductFields) }
    }
    async getProductDetail(data: GetProductsDetailDTO) {
        const getProducts = await this.products.findProductsDetail(data)
        if (!getProducts) {
            throw new BadRequestError("Product not found")
        }
        return { product: _.pick(getProducts, PickProductFields) }
    }
    async getAllProducts() {
        try {
            const getProducts = await this.products.findAllProducts()
            return { products: getProducts.map(p => _.pick(p, PickProductFields)) }
        } catch (err) {
            throw new BadRequestError("Product not found")
        }
    }
}

export default new ProductService();