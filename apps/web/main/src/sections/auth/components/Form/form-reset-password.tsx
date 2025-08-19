"use client";
import React from "react";
import { ResetPasswordData, resetPasswordSchema } from "../../data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "@repo/design-system/components/ui";

export function FormResetPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const handleResetPassword = (data: ResetPasswordData) => {
    console.log(data);
    alert("reset password success");
    // closeModal();
  };
  return (
    <form
      onSubmit={handleSubmit(handleResetPassword)}
      className="mt-2 flex flex-col gap-4"
      action="">
      <Input
        {...register("code")}
        error={errors.code?.message}
        type="text"
        label="Code"
        placeholder="Nhập code"
        size="sm"
      />
      <Input
        {...register("passwordHash")}
        isInputPassword
        error={errors.passwordHash?.message}
        type="password"
        label="Mật khẩu "
        placeholder="Nhập mật khẩu"
        size="sm"
      />
      <Input
        {...register("confirmPasswordHash")}
        isInputPassword
        error={errors.confirmPasswordHash?.message}
        type="password"
        label="Xác thực mật mật khẩu"
        placeholder="Nhập xác thực mật khẩu "
        size="sm"
      />
      <Button type="submit" title="Đặt lại mật khẩu" size="sm" />
    </form>
  );
}
