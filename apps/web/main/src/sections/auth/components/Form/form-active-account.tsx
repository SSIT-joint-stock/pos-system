import useAuth from "@main/hooks/auth/useAuth";
import { Button, PinInput } from "@repo/design-system/components/ui";
import { MoveLeft } from "lucide-react";
import React from "react";
import { VerifyAccountData } from "../../data";

export function FormActiveAccount({
  setActive,
  onSubmit,
}: {
  setActive: (step: number) => void;
  onSubmit: (data: VerifyAccountData) => void;
}) {
  const {
    handleVerificationCodeChange,
    verifyEmailForm,
    handleResendCode,
    loading,
  } = useAuth();
  return (
    <form
      onSubmit={verifyEmailForm.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full ">
      <div className="flex items-center justify-center">
        <PinInput
          name="verificationCode"
          onChange={handleVerificationCodeChange}
          error={verifyEmailForm.formState.errors.verificationCode?.message}
          length={6}
          radius="md"
        />
      </div>

      <Button
        disabled={loading}
        type="submit"
        size="sm"
        title="Xác thực tài khoản"
        variant="filled"
      />
      {/* Google sign in */}

      {/* Sign up link */}
      <p className="text-center text-xs font-medium text-gray-400">
        Chưa nhận được mã xác thức?{" "}
        <button
          onClick={handleResendCode}
          type="button"
          className="text-pos-blue-500 hover:underline cursor-pointer">
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
