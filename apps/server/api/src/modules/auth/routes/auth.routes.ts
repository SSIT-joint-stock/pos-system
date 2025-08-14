import { NextFunction, Response, Router, Request } from "express";
import {
  ManualAuthController,
  OAuthAuthController,
} from "../controllers/auth.controller";
import { RequestWithTenant } from "@shared/types/request";

const router = Router();
const manualAuthController = new ManualAuthController();
const oauthAuthController = new OAuthAuthController();

router.post(
  "/login",
  (req: RequestWithTenant, res: Response, next: NextFunction) => {
    req.action = "login";
    manualAuthController.execute(req, res, next);
  }
);

router.post(
  "/register",
  (req: RequestWithTenant, res: Response, next: NextFunction) => {
    req.action = "register";
    manualAuthController.execute(req, res, next);
  }
);

router.post(
  "/verify-code",
  (req: RequestWithTenant, res: Response, next: NextFunction) => {
    req.action = "verify-code";
    manualAuthController.execute(req, res, next);
  }
);
router.post(
  "/resend-code",
  (req: RequestWithTenant, res: Response, next: NextFunction) => {
    req.action = "resend-code";
    manualAuthController.execute(req, res, next);
  }
);

router.post(
  "/forgot-password",
  (req: RequestWithTenant, res: Response, next: NextFunction) => {
    req.action = "forgot-password";
    manualAuthController.execute(req, res, next);
  }
);

router.post(
  "/reset-password",
  (req: RequestWithTenant, res: Response, next: NextFunction) => {
    req.action = "reset-password";
    manualAuthController.execute(req, res, next);
  }
);

router.get("/", (req: RequestWithTenant, res: Response, next: NextFunction) => {
  req.action = "asdsad";
  res.json(req.action);
});

// router.post(
//   "/oauth/init",
//   actionMiddleware("oauth_init"),
//   oauthAuthController.handle()
// );
// router.post(
//   "/oauth/callback",
//   actionMiddleware("oauth_callback"),
//   oauthAuthController.handle()
// );

export { router as authRoutes };
