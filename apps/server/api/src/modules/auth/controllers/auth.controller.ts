import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '@shared/interfaces/controller-base.interface';
import { AuthService } from '../services/auth.service';
import { loginSchema } from '../validations/auth.validation';
import { ApiResponse } from '@repo/types/response';

export class AuthController extends BaseController {
    private service = new AuthService();

    async execute(req: Request, res: Response): Promise<void> {
        // Only one action for now: POST /login
        await this.handleLogin(req, res);
    }

    private async handleLogin(req: Request, res: Response): Promise<void> {
        const data = this.validate(req.body, loginSchema);
        const result = await this.service.login(data);
        this.sendResponse(res, ApiResponse.success(result, 'Login successful'));
    }
}


