import { z } from "zod";

export const headerValidate = z.object({
    ua: z.string()
        .min(1, "UA token cannot be empty")
        .regex(/^[A-Za-z0-9+/=]+$/, "UA token must only contain base64-compatible characters"),
    rn: z.string().length(4, "Random number must be exactly 4 characters"),
    timestamp: z.string()
        .min(1, "Timestamp cannot be empty")
        .refine((val) => !isNaN(Number(val)), "Timestamp must be a valid number"),
    path: z.string()
        .min(1, "Path cannot be empty")
        .startsWith("/api/", "Path must start with /api/")
});