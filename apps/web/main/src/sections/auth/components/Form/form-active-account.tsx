import { Button, PinInput } from "@repo/design-system/components/ui";
import { MoveLeft } from "lucide-react";
import React from "react";

export function FormActiveAccount({
  setActive,
}: {
  setActive: (active: number) => void;
}) {
  const handleActiveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setActive(2);
  };
  return (
    <form
      onSubmit={handleActiveAccount}
      className="flex flex-col gap-4 w-full ">
      {/* <Input
        disabled
        variant="filled"
        size="sm"
        type="email"
        value="tranhuuthanhcp@gmail.com"
        label="Email"
        leftSection={<Mail size={16} />}
      /> */}

      <div className="flex items-center justify-center">
        <PinInput length={6} size="sm" radius="md" />
      </div>

      {/* Sign in button */}
      <Button
        type="submit"
        size="sm"
        title="Xác thực tài khoản"
        variant="filled"
      />
      {/* Google sign in */}

      {/* Sign up link */}
      <p className="text-center text-xs font-medium text-gray-400">
        Chưa nhận được mã xác thức?{" "}
        <button className="text-pos-blue-500 hover:underline cursor-pointer">
          Gửi lại mã
        </button>
      </p>
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          onClick={() => setActive(0)}
          className="flex items-center gap-2 cursor-pointer text-gray-500 group transition-all duration-300 hover:text-pos-blue-500  ">
          <MoveLeft
            size={16}
            className=" group-hover:-translate-x-2 transition-all duration-300"
          />
          <span className="text-xs font-medium ">Quay lại trang đăng ký</span>
        </button>
      </div>
    </form>
  );
}
