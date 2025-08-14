import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }).nonempty({
    message: "Vui lòng nhập email",
  }),
  passwordHash: z
    .string()
    .min(6, {
      message: "Mật khẩu ít nhất phải 6 ký tự",
    })
    .nonempty({
      message: "Vui lòng nhập mật khẻu",
    }),
});
export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Tên tài khoản phải nhất 3 ký tự",
    })
    .max(20, {
      message: "Ten tài khoản không quá 20 ký tự",
    })
    .nonempty({
      message: "Vui lòng nhập tên tài khoản",
    }),
  email: z
    .string()
    .email({
      message: "Email không hợp lệ",
    })
    .nonempty({
      message: "Vui lòng nhập email",
    }),
  passwordHash: z
    .string()
    .min(6, {
      message: "Mật khẩu ít nhất phải 6 ký tự",
    })
    .nonempty({
      message: "Vui lòng nhập mật khẻu",
    }),
  phone: z.string().nonempty({
    message: "Vui lòng nhập số diện thoại",
  }),
});
export type RegisterData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email không hợp lệ",
    })
    .nonempty({
      message: "Vui lòng nhập email",
    }),
});
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
