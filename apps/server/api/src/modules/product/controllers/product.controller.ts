import { BaseController } from "@/shared/interfaces/controller-base.interface"
import { Request, Response, NextFunction } from "express"
import { ProductService } from "../services/product.service"
import { RegisterWithAuth } from "@/shared/types/request"
import { ApiResponse, BadRequestError } from "@repo/types/response"
import { createProductChema, CreateProductInput, UpdateProductInput, updateProductSchema } from "../validations/product.validation"
import { stripUndefined } from "@/shared/utils/strip-undefined"

export class ProductController extends BaseController {
    private service = new ProductService()
    async execute(
        req: RegisterWithAuth,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const action = req.action;
        switch (action) {
            case "create":
                await this.create(req, res, next);
                break;
            case "update":
                await this.update(req, res, next);
                break;
            case "delete":
                await this.delete(req, res, next);
                break;
            case "get-product":
                await this.getProduct(req, res, next);
                break;
            default:
                throw new BadRequestError("Invalid action");
        }
    }

    private async create(req: RegisterWithAuth, res: Response, next: NextFunction) {
        const data = this.validate<CreateProductInput>(req.body, createProductChema)
        const result = await this.service.createProduct(data)
        this.sendResponse(res, ApiResponse.success(result, "Create product successful"));
    }

    private async update(req: RegisterWithAuth, res: Response, next: NextFunction) {
        const id = req.params.id
        const data = this.validate<UpdateProductInput>(req.body, updateProductSchema)
        const stripUndefinedData = stripUndefined(data)
        const result = await this.service.updateProduct(id, stripUndefinedData)
        this.sendResponse(res, ApiResponse.success(result, "Update product successful"));
    }

    private async delete(req: RegisterWithAuth, res: Response, next: NextFunction) {
        const id = req.params.id
        await this.service.deleteProduct(id)
        this.sendResponse(res, ApiResponse.success("Delete product successful"));
    }

    private async getProduct(req: RegisterWithAuth, res: Response, next: NextFunction) {
        const id = req.params.id
        const result = await this.service.getProduct(id)
        this.sendResponse(res, ApiResponse.success(result, "Get product successful"));
    }
}