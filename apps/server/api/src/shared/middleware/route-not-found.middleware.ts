import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@repo/types/response';

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new ForbiddenError(
        'ROUTE_NOT_FOUND',
        'Route not found',
        'Route not found'
    );

    next(error);
}

export default routeNotFound; 