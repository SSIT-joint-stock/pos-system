import useAuth from '../../../../hooks/auth/use-auth';
import { Button, PinInput } from '@repo/design-system/components/ui';
import { MoveLeft } from 'lucide-react';
import React from 'react';
import { VerifyAccountData } from '../../data';
import dayjs from 'dayjs';
import { useCountDown } from '../../../../hooks/use-count-down';

export function FormActiveAccount({
  setActive,
  onSubmit,
}: {
  setActive: (step: number) => void;
  onSubmit: (data: VerifyAccountData) => void;
}) {
  const {
    handleVerificationCodeChange,
    verifyEmailForm: {
      handleSubmit,
      formState: { errors },
    },
    resendCode,
    loading,
  } = useAuth();
  const { remaining, setRemaining, RESEND_COOLDOWN, STORAGE_KEY } = useCountDown();
  const email = localStorage.getItem('verifiedEmail');

  const handleResend = async () => {
    await resendCode(email as string);

    const expiredAt = dayjs().add(RESEND_COOLDOWN, 'second');
    localStorage.setItem(STORAGE_KEY, expiredAt.toISOString());
    setRemaining(RESEND_COOLDOWN);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full ">
      <div className="flex items-center justify-center">
        <PinInput
          name="verificationCode"
          onChange={handleVerificationCodeChange}
          error={errors.verificationCode ? 'Vui lòng nhập mã xác thực' : ''}
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
        Chưa nhận được mã xác thức?{' '}
        <button
          disabled={remaining > 0}
          onClick={handleResend}
          type="button"
          className="text-pos-blue-500 hover:underline cursor-pointer disabled:cursor-not-allowed "
        >
          {remaining > 0 ? `Gửi lại mã sau ${remaining}s` : 'Gửi lại mã'}
        </button>
      </p>
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          onClick={() => setActive(0)}
          className="flex items-center gap-2 cursor-pointer text-gray-500 group transition-all duration-300 hover:text-pos-blue-500  "
        >
          <MoveLeft size={16} className=" group-hover:-translate-x-2 transition-all duration-300" />
          <span className="text-xs font-medium ">Quay lại trang đăng ký</span>
        </button>
      </div>
    </form>
  );
}
