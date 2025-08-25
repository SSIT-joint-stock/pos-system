import { z } from "zod";
export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .nonempty({
      message: "Vui lòng nhập email hoặc tên đăng nhập",
    }),
  password: z
    .string()
    .min(6, {
      message: "Mật khẩu ít nhất phải 6 ký tự",
    })
    .nonempty({
      message: "Vui lòng nhập mật khẻu",
    }),
});
export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email({ message: "Email không hợp lệ" }).nonempty({
      message: "Vui lòng nhập email",
    }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu ít nhất phải 6 ký tự" })
      .nonempty({ message: "Vui lòng nhập mật khẩu" }),
    confirmPassword: z.string().nonempty({
      message: "Vui lòng nhập xác thực mật khẩu",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác thực không khớp",
  });
export type RegisterData = z.infer<typeof registerSchema>;

export const verifyAccountSchema = z.object({
  verificationCode: z.string().nonempty({
    message: "Vui lòng nhập mã xác thực",
  }),
});
export type VerifyAccountData = z.infer<typeof verifyAccountSchema>;

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

export const resetPasswordSchema = z.object({
  code: z.string().nonempty({
    message: "Vui lòng nhập mã xác thực",
  }),
  passwordHash: z.string().nonempty({
    message: "Vui lòng nhập mật khẩu",
  }),
  confirmPasswordHash: z.string().nonempty({
    message: "Vui lòng nhập xác thực mật khẩu",
  }),
});
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const businessInfoSchema = z.object({
  userId: z.string().nonempty({ message: "Vui lòng nhập userId" }),
  name: z.string().nonempty({ message: "Vui lòng nhập tên doanh nghiệp" }),
  domainType: z.enum(["RETAIL", "RESTAURANT", "SERVICE"], {
    message: "Vui lòng chọn loại hình doanh nghiệp",
  }),
  phone: z.string().nonempty({
    message: "Vui lòng nhập số điện thoại",
  }),
  address: z.string().optional(),
  taxCode: z
    .string()
    .nonempty({ message: "Vui lòng nhập mã số thuế" })
    .optional(),
});
export type BusinessInfoData = z.infer<typeof businessInfoSchema>;
