"use client";
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
import Image from "next/image";

export function FormLogin() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <>
      <form className="flex flex-col gap-4 w-full ">
        <Input
          size="sm"
          type="email"
          label="Email"
          radius="xl"
          placeholder="example@gmail.com"
          leftSection={<Mail size={16} />}
        />
        <Input
          isInputPassword
          size="sm"
          type="password"
          label="Password"
          radius="xl"
          placeholder="**********"
          leftSection={<Lock size={16} />}
        />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between text-sm mt-3">
          <Checkbox label="Ghi nhớ tài khoản" radius="xl" size="sm" />
          <button
            onClick={() => setIsOpenModal(true)}
            type="button"
            className="text-blue-500 cursor-pointer hover:underline">
            Quên mật khẩu
          </button>
        </div>

        {/* Sign in button */}
        <Button size="sm" radius="xl" title="Đăng nhập" variant="filled" />
        {/* Google sign in */}
        <Button
          size="sm"
          radius="xl"
          variant="default"
          icon={<Image src={GoogleIC} alt="google-ic" />}
          title="Tiếp tục với Google"
        />

        {/* Sign up link */}
        <p className="text-center text-xs font-medium text-gray-400">
          Bạn chưa có tài khoản?{" "}
          <RouterLink
            href="/auth/register"
            className="text-blue-500 hover:underline">
            Đăng ký
          </RouterLink>
        </p>
      </form>
      <Modal
        size="md"
        opened={isOpenModal}
        onClose={() => setIsOpenModal(false)}>
        <>
          <div className="flex flex-col gap-2 pb-1 border-b border-b-blue-600">
            <h2 className="text-xl font-semibold text-center">
              Quên mật khẩu?
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Đừng lo lắng, chúng tôi sẽ gửi cho bạn hướng dẫn thiết lập lại.
            </p>
          </div>
          <form className="mt-6 flex flex-col gap-4" action="">
            <Input
              type="email"
              radius="xl"
              label="Email"
              placeholder="Nhập email"
              size="sm"
            />
            <Button title="Tiếp tục" radius="xl" size="sm" />
          </form>
        </>
      </Modal>
    </>
  );
}
