import React from "react";
import { Lock, Mail, Phone, User } from "lucide-react";
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
        placeholder="**********"
        leftSection={<Lock size={16} />}
      />

      {/* Sign in button */}
      <Button type="submit" size="sm" title="Tiếp tục" variant="filled" />
      {/* Google sign in */}
      <Button
        type="button"
        size="sm"
        variant="default"
        icon={
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="22"
              height="22"
              viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
          </>
        }
        title="Tiếp tục với Google"
      />

      {/* Login link */}
      <p className="text-center text-xs font-medium text-gray-400">
        Bạn đã có tài khoản?{" "}
        <RouterLink
          href="/auth/login"
          className="text-pos-blue-500 hover:underline">
          Đăng nhập
        </RouterLink>
      </p>
    </form>
  );
}
