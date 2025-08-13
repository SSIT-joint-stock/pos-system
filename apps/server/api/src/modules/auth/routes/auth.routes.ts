import { Router } from "express";
import {
  AuthController,
  AuthControllerFactory,
} from "@modules/auth/controllers/auth.controller";

const router = Router();
const authController = AuthControllerFactory.create();

// router.post("/register", validate(registerSchema), authController.register);
router.post("/register", (req, res, next) => {
  req.query.action = "regiter";
  authController.execute(req, res, next);
});

router.post("/login", (req, res, next) => {
  req.query.action = "login";
  authController.execute(req, res, next);
});

// router.post("/login", validate(loginSchema), authController.login);

router.get("/", (req, res, next) => {
  req.query.action = "regiter";
  authController.execute(req, res, next);
});

export { router as authRoutes };
