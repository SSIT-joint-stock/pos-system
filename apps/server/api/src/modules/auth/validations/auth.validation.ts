// src/validations/auth.validation.ts
import { z, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Schema cho request body khi register
 * - email: hợp lệ
 * - username: 3-30 ký tự
 * - password: ít nhất 6 ký tự
 * - confirmPassword: giống password
 */ export const registerSchema = z
  .object({
    type: z.string(), // hoặc z.enum(["manual", "oauth"])
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(6, { message: "Password phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password và confirmPassword phải giống nhau",
    path: ["confirmPassword"],
  });

/**
 * Schema cho request body khi login
 * - email: hợp lệ
 * - password: required
 *
 * (Nếu bạn muốn cho phép login bằng username, chỉnh lại schema tương ứng)
 */
export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Password là bắt buộc" }),
});

/**
 * Helper middleware để validate body (dùng với Express)
 * - schema: zod schema áp dụng trực tiếp cho req.body
 * - Nếu hợp lệ: gán lại req.body = parsed data (tiện cho transform) rồi next()
 * - Nếu sai: trả 400 kèm lỗi đã flatten
 */
export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const flattened = result.error.flatten();
      // Trả structure lỗi dễ dùng ở frontend
      return res.status(400).json({
        message: "Validation failed",
        errors: flattened.fieldErrors,
      });
    }
    // Gán lại req.body bằng dữ liệu đã parse (nếu có transform)
    // req.body = result.data;
    return next();
  };

/**
 * Types inferred
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
