import { z } from "zod";

export default class BaseValidation {
    static readonly idSchema = z.string().uuid();
    static readonly phoneSchema = z.string().regex(/^[0-9]{10}$/); // 10 digits

    static validateSchema(schema: z.ZodSchema, data: any) {
        return schema.parse(data);
    }
}