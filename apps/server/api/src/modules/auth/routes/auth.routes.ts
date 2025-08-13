import { Router } from 'express';
import { ManualAuthController, OAuthAuthController } from '../controllers/auth.controller';
import actionMiddleware from '@shared/middleware/action.middleware';

const router = Router();
const manualAuthController = new ManualAuthController();
const oauthAuthController = new OAuthAuthController();

router.post('/login', actionMiddleware('login'), manualAuthController.handle());
router.post('/register', actionMiddleware('register'), manualAuthController.handle());
router.post('/oauth/init', actionMiddleware('oauth_init'), oauthAuthController.handle());
router.post('/oauth/callback', actionMiddleware('oauth_callback'), oauthAuthController.handle());

export { router as authRoutes };

