"use client";
import Image from "next/image";
import React, { useState } from "react";
import GoogleIC from "@/../../../web/main/src/public/icons/google.svg";

import {
  Input,
  Button,
  Checkbox,
  Modal,
} from "@repo/design-system/components/ui/";
import { Lock, Mail } from "lucide-react";
import { RouterLink } from "@repo/design-system/routes/components";

import useToast from "@repo/design-system/hooks/client/use-toast-notification";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "../../data";
import { FormResetPassword, FormRetryPassword } from "./index";

export function FormLogin() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalSteps, setModalSteps] = useState(1);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSignIn = (data: LoginData) => {
    console.log(data);
    toast.showSuccessToast("Đăng nhập thanh cong!");
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="flex flex-col gap-4 w-full ">
        <Input
          {...register("email")}
          name="email"
          error={errors.email?.message}
          size="sm"
          type="email"
          label="Email"
          placeholder="example@gmail.com"
          leftSection={<Mail size={16} />}
        />
        <Input
          {...register("passwordHash")}
          name="passwordHash"
          error={errors.passwordHash?.message}
          isInputPassword
          size="sm"
          type="password"
          label="Password"
          placeholder="**********"
          leftSection={<Lock size={16} />}
        />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between text-sm mt-3">
          <Checkbox label="Ghi nhớ tài khoản" radius="xl" size="sm" />
          <button
            onClick={() => setIsOpenModal(true)}
            type="button"
            className="text-pos-blue-500 cursor-pointer hover:underline">
            Quên mật khẩu
          </button>
        </div>

        {/* Sign in button */}
        <Button type="submit" size="sm" title="Đăng nhập" variant="filled" />
        {/* Google sign in */}
        <Button
          type="button"
          size="sm"
          variant="default"
          icon={<Image src={GoogleIC} alt="google-ic" />}
          title="Tiếp tục với Google"
        />

        {/* Sign up link */}
        <p className="text-center text-xs font-medium text-gray-400">
          Bạn chưa có tài khoản?{" "}
          <RouterLink
            href="/auth/register"
            className="text-pos-blue-500 hover:underline">
            Đăng ký
          </RouterLink>
        </p>
      </form>
      <Modal
        radius="xl"
        padding="lg"
        size="md"
        opened={isOpenModal}
        onClose={() => setIsOpenModal(false)}>
        <>
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            Quên mật khẩu
          </h1>
          <p className="mt-1 text-sm text-gray-400 text-center font-medium">
            Vui lòng nhập email bạn đăng ký trên hệ thống
          </p>

          {modalSteps === 1 && <FormRetryPassword />}
          {modalSteps === 2 && <FormResetPassword />}
          {modalSteps === 3 && <>Done</>}
        </>
      </Modal>
    </>
  );
}
