import { Button, Input } from "@repo/design-system/components/ui";
import { RouterLink } from "@repo/design-system/routes/components";
import { Lock, Mail, Phone, User } from "lucide-react";
import GoogleIC from "@/../../../web/main/src/public/icons/google.svg";
import React from "react";
import Image from "next/image";

export function FormRegister({
  setActive,
}: {
  setActive: (active: number) => void;
}) {
  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    setActive(1);
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full ">
      <Input
        size="sm"
        type="text"
        label="Họ và tên"
        radius="xl"
        placeholder="Nguyen Van A"
        leftSection={<User size={16} />}
      />
      <Input
        size="sm"
        type="email"
        label="Email"
        radius="xl"
        placeholder="example@gmail.com"
        leftSection={<Mail size={16} />}
      />
      <Input
        size="sm"
        type="tel"
        label="Số điện thoại"
        radius="xl"
        placeholder="0123456789"
        leftSection={<Phone size={16} />}
      />
      <Input
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
        <RouterLink href="/auth/login" className="text-blue-500 hover:underline">
          Đăng nhập
        </RouterLink>
      </p>
    </form>
  );
}
