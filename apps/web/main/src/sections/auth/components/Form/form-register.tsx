import React from "react";
import Image from "next/image";
import { Lock, Mail, Phone, User } from "lucide-react";
import GoogleIC from "@/../../../web/main/src/public/icons/google.svg";
import { useForm } from "react-hook-form";
import { RegisterData, registerSchema } from "../../data";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "@repo/design-system/components/ui";
import { RouterLink } from "@repo/design-system/routes/components";

export function FormRegister({
  setActive,
}: {
  setActive: (active: number) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const handleSignup = (data: RegisterData) => {
    console.log(data);
    setActive(1);
  };
  return (
    <form
      onSubmit={handleSubmit(handleSignup)}
      className="flex flex-col gap-4 w-full ">
      <Input
        {...register("username")}
        error={errors.username?.message}
        name="username"
        size="sm"
        type="text"
        label="Họ và tên"
        radius="xl"
        placeholder="Nguyen Van A"
        leftSection={<User size={16} />}
      />
      <Input
        {...register("email")}
        error={errors.email?.message}
        name="email"
        size="sm"
        type="email"
        label="Email"
        radius="xl"
        placeholder="example@gmail.com"
        leftSection={<Mail size={16} />}
      />
      <Input
        {...register("phone")}
        name="phone"
        error={errors.phone?.message}
        size="sm"
        type="tel"
        label="Số điện thoại"
        radius="xl"
        placeholder="0123456789"
        leftSection={<Phone size={16} />}
      />
      <Input
        {...register("passwordHash")}
        error={errors.passwordHash?.message}
        name="passwordHash"
        size="sm"
        type="password"
        label="Password"
        radius="xl"
        placeholder="**********"
        leftSection={<Lock size={16} />}
      />

      {/* Sign in button */}
      <Button
        type="submit"
        size="sm"
        radius="xl"
        title="Tiếp tục"
        variant="filled"
      />
      {/* Google sign in */}
      <Button
        type="button"
        size="sm"
        radius="xl"
        variant="default"
        icon={<Image src={GoogleIC} alt="google-ic" />}
        title="Tiếp tục với Google"
      />

      {/* Login link */}
      <p className="text-center text-xs font-medium text-gray-400">
        Bạn đã có tài khoản?{" "}
        <RouterLink
          href="/auth/login"
          className="text-blue-500 hover:underline">
          Đăng nhập
        </RouterLink>
      </p>
    </form>
  );
}
