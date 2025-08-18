import { z } from "zod";

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  verificationCode: z.string().min(4),
});

export const reSendVerificationCodeSchema = z.object({
  email: z.string().email(),
  // Service của bạn hiện yêu cầu cả verificationCode; nếu không cần, bỏ field này
  verificationCode: z.string().min(0).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8),
  resetToken: z.string().min(10),
});

export const businessSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  taxCode: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type ReSendVerifyInput = z.infer<typeof reSendVerificationCodeSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type BusinessInfoInput = z.infer<typeof businessSchema>;
