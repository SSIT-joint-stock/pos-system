import { Router } from "express";
import { AuthController } from "@modules/auth/controllers/auth.controller";
import axios from "axios";

const router = Router();
const authController = new AuthController();

// router.post("/register", validate(registerSchema), authController.register);
router.post("/register", authController.register);

// router.post("/login", validate(loginSchema), authController.login);

router.get("/", async (req, res) => {
  return res.json("test");
});
export { router as authRoutes };
