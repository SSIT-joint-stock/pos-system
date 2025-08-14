import { type Response, type NextFunction } from 'express';
import { RequestWithTenant } from '@shared/types/request';

export default function actionMiddleware(action: string) {
    return (req: RequestWithTenant, res: Response, next: NextFunction) => {
        req.action = action;
        next();
    }
}


