import { Router } from "express";
import {
  BusinessController,
  ManualAuthController,
  OAuthAuthController,
} from "../controllers/auth.controller";
import actionMiddleware from "@/shared/middleware/action.middleware";
import {
  AuthMiddleware,
  jwtAccessUtils,
} from "@/shared/middleware/auth.middleware";

const router = Router();
const authMiddleware = new AuthMiddleware();
const manualAuthController = new ManualAuthController();
const oauthAuthController = new OAuthAuthController();
const businessController = new BusinessController();

router.post("/login", actionMiddleware("login"), manualAuthController.handle());
router.post(
  "/register",
  actionMiddleware("register"),
  manualAuthController.handle()
);
router.post(
  "/verify-code",
  actionMiddleware("verify-code"),
  manualAuthController.handle()
);
router.post(
  "/resend-code",
  actionMiddleware("resend-code"),
  manualAuthController.handle()
);
router.post(
  "/forgot-password",
  actionMiddleware("forgot-password"),
  manualAuthController.handle()
);
router.post(
  "/reset-password",
  actionMiddleware("reset-password"),
  manualAuthController.handle()
);

router.post(
  "/oauth/init",
  actionMiddleware("oauth_init"),
  oauthAuthController.handle()
);
router.post(
  "/oauth/callback",
  actionMiddleware("oauth_callback"),
  oauthAuthController.handle()
);
router.post(
  "/refresh",
  authMiddleware.verifyRefreshToken(),
  actionMiddleware("refresh"),
  manualAuthController.handle()
);
router.post(
  "business",
  authMiddleware.verifyAccessToken(),
  businessController.handle()
)

export { router as authRoutes };
