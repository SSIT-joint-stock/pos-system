import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import actionMiddleware from "@/shared/middleware/action.middleware";
import { AuthMiddleware } from "@/shared/middleware/auth.middleware";

const router = Router()

const productController = new ProductController()
const auth = new AuthMiddleware();

router.post("/", actionMiddleware("create"), productController.handle());
router.patch("/:id", actionMiddleware("update"), productController.handle());
router.delete("/:id", actionMiddleware("delete"), productController.handle());
router.get("/:id", actionMiddleware("get-product"), productController.handle());
router.get("/", auth.verifyAccessToken(), actionMiddleware("get-all-products"), productController.handle())

export default router