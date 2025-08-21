import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router()

const productController = new ProductController()

router.post("/create", (req, res) => {
    productController.create(req, res)
})

export default router