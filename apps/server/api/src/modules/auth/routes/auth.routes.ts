import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const authRoutes = Router();
const controller = new AuthController();

authRoutes.post('/login', controller.handle());


