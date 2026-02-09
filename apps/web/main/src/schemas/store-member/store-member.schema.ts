/* eslint-disable filenames/match-regex */
import { z } from 'zod';

/**
 * Validate email khi add member đã tồn tại
 */
export const AddMemberByEmailSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Vui lòng nhập email' })
    .email({ message: 'Email không hợp lệ' }),
});

/**
 * Validate payload khi tạo member mới
 */
export const CreateMemberSchema = z
  .object({
    username: z.string().nonempty({ message: 'Vui lòng nhập username' }),

    email: z
      .string()
      .nonempty({ message: 'Vui lòng nhập email' })
      .email({ message: 'Email không hợp lệ' }),

    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),

    confirmPassword: z.string().min(6, { message: 'Mật khẩu xác nhận phải có ít nhất 6 ký tự' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export const UpdateMemberSchema = z.object({
  username: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
});

/**
 * Validate update role
 */
export const UpdateMemberRoleSchema = z.object({
  role: z.string().nonempty({ message: 'Role không hợp lệ' }),
});

/* -------- TYPES -------- */

export type AddMemberByEmailInput = z.infer<typeof AddMemberByEmailSchema>;
export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof UpdateMemberRoleSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;
