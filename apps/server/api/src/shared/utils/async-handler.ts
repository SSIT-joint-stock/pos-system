import { Request, Response, NextFunction } from 'express';

/**
 * This type represents the return type of an asynchronous function
 * @template T - The type of the return value
 * @returns The return type of the asynchronous function
 */
export type Await<T> = T extends {
    then(onfulfilled?: (value: infer U) => unknown): unknown;
} ? U : T;

/**
 * This class represents an asynchronous middleware
 */
export class AsyncMiddleware {
    /**
     * This method handles asynchronous middleware
     * @param fn - The middleware function
     * @returns The middleware function
     */
    public asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
        return (req: Request, res: Response, next: NextFunction) => {
            fn(req, res, next).catch(next);
        };
    }
}

export default new AsyncMiddleware();