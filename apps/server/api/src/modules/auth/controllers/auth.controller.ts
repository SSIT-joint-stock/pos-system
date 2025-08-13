import type { Request, Response } from 'express';
import { BaseController } from '@shared/interfaces/controller-base.interface';
import { AuthService } from '@modules/auth/services/auth.service';
import { loginSchema, registerSchema, type RegisterInput, type LoginInput } from '@modules/auth/validations/auth.validation';
import { ApiResponse, BadRequestError } from '@repo/types/response';
import { RequestWithTenant } from '@shared/types/request';

export class ManualAuthController extends BaseController {
    private service = new AuthService();

    async execute(req: RequestWithTenant, res: Response): Promise<void> {
        const { action } = req;
        switch (action) {
            case 'login':
                await this.handleLogin(req, res);
                break;
            case 'register':
                await this.handleRegister(req, res);
                break;
            default:
                throw new BadRequestError('Invalid action');
        }
    }

    private async handleLogin(req: RequestWithTenant, res: Response): Promise<void> {
        const data = this.validate<LoginInput>(req.body, loginSchema);
        const result = await this.service.login(data);
        this.sendResponse(res, ApiResponse.success(result, 'Login successful'));
    }

    private async handleRegister(req: RequestWithTenant, res: Response): Promise<void> {
        const data = this.validate<RegisterInput>(req.body, registerSchema);
        const result = await this.service.register(data);
        this.sendResponse(res, ApiResponse.success(result, 'Register successful'));
    }
}

export class OAuthAuthController extends BaseController {
    private service = new AuthService();

    async execute(req: RequestWithTenant, res: Response): Promise<void> {
        const { action } = req;
        switch (action) {
            case 'oauth_init':
                await this.handleOAuthInit(req, res);
                break;
            case 'oauth_callback':
                await this.handleOAuthCallback(req, res);
                break;
            default:
                throw new BadRequestError('Invalid action');
        }
    }

    private async handleOAuthInit(req: RequestWithTenant, res: Response): Promise<void> {
        // TODO: Implement OAuth init
        this.sendResponse(res, ApiResponse.success(null, 'OAuth init successful'));
    }

    private async handleOAuthCallback(req: RequestWithTenant, res: Response): Promise<void> {
        // TODO: Implement OAuth callback
        this.sendResponse(res, ApiResponse.success(null, 'OAuth callback successful'));
    }
}



