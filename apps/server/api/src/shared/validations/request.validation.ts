import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import BaseValidation from "./base.validation";
import { ValidationError } from "@repo/types/response";

export type RequestValidationType = "body" | "query" | "params" | "headers" | "cookies";

export default class RequestValidation extends BaseValidation {
    private static mergeSchemas(schemas: z.ZodObject<any>[]) {
        return schemas.reduce((acc, schema) => acc.merge(schema), z.object({}));
    }

    static validateRequest(type: RequestValidationType, ...schemas: z.ZodObject<any>[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const data = req[type];
                const validatedData = this.mergeSchemas(schemas).safeParse(data);
                if (!validatedData.success) {
                    throw new ValidationError(validatedData.error.flatten().fieldErrors, "Invalid request");
                }
                req[type] = validatedData;
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}