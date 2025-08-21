import { resolve } from "path";
import { CreateProductDTO, DeleteProductDTO, GetProductDTO, IProductService, productServiceResult, UpdateProductDTO } from "../interfaces/product.interface";
import prisma from "@shared/orm/prisma";


export class ProductService implements IProductService {
    async createProduct(data: CreateProductDTO): Promise<string> {
        try {
            const product = await prisma.product.create({
                data: data
            })
            return "Create product successfully"
        } catch (err) {
            throw new Error("message: Create product failed-", err);
        }
    }
    async updateProduct(data: UpdateProductDTO): Promise<string> {
        try {
            const product = await prisma.product.update(
                {
                    where: {
                        id: data.id,
                    },
                    data: data
                }
            )
            return "Update product successfully"
        } catch (err) {
            throw new Error("message: Update product failed-", err);
        }
    }
    async deleteProduct(data: DeleteProductDTO): Promise<string> {
        try {
            const product = await prisma.product.delete(
                {
                    where: {
                        id: data.id,
                    },
                }
            )
            return "Delete product successfully"
        } catch (err) {
            throw new Error("message: Delete product failed-", err);
        }
    }
    async getProduct(data: GetProductDTO): Promise<string> {
        // to do
        throw new Error("Method not implemented.");
    }
}