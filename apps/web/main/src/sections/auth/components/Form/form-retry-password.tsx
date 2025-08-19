"use client";
import { Button, Input } from "@repo/design-system/components/ui";
import React from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordData, forgotPasswordSchema } from "../../data";
import { zodResolver } from "@hookform/resolvers/zod";

export function FormRetryPassword({
  setModalSteps,
}: {
  setModalSteps: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const handleRetryPassword = (data: ForgotPasswordData) => {
    setModalSteps(2)
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(handleRetryPassword)}
      className="mt-2 flex flex-col gap-4"
      action="">
      <Input
        {...register("email")}
        error={errors.email?.message}
        type="email"
        label="Email"
        placeholder="Nhập email"
        size="sm"
      />
      <Button type="submit" title="Tiếp tục" size="sm" />
    </form>
  );
}
