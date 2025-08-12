import { z } from "zod";

export const baseStorageConnectionOptionsSchema = z.object({
    endPoint: z.string(),
    port: z.number().optional(),
    useSSL: z.boolean().optional(),
    accessKey: z.string(),
    secretKey: z.string(),
    bucketName: z.string(),
});