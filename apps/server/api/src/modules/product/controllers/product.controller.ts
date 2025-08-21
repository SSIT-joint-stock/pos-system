import { BaseController } from "@/shared/interfaces/controller-base.interface"
import { Request, Response, NextFunction } from "express"
import { IProductService } from "../interfaces/product.interface"
import { ProductService } from "../services/product.service"

// export class ProductController extends BaseController {
//     execute(req: Request, res: Response, next: NextFunction): Promise<void> {

//     }
// }

export class ProductController {
    private service: ProductService
    constructor() {
        this.service = new ProductService()
    }
    async create(req: Request, res: Response) {
        const result = await this.service.createProduct(req.body)
        if (result) {
            res.status(200).json(result)
        }
    }
}