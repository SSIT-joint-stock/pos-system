'use client';
import useAuth from '@main/hooks/auth/use-auth';
import { useCountDown } from '@main/hooks/use-count-down';
import { Button, Input, Modal } from '@repo/design-system/components/ui';
import dayjs from 'dayjs';
import React, { useState } from 'react';

export default function FormReactiveAccount({
  isOpenModalActiveAcc,
  setIsOpenModalActiveAcc,
}: {
  isOpenModalActiveAcc: boolean;
  setIsOpenModalActiveAcc: (value: boolean) => void;
}) {
  const [email, setEmail] = useState<string>('');
  // auth hook
  const {
    loading,
    resendCode,
    verifyAccount,
    verifyEmailForm: {
      register,
      handleSubmit,
      formState: { errors },
    },
  } = useAuth();
  const { remaining, setRemaining, RESEND_COOLDOWN, STORAGE_KEY } = useCountDown();
  const handleResend = async (email: string) => {
    await resendCode(email as string);

    const expiredAt = dayjs().add(RESEND_COOLDOWN, 'second');
    localStorage.setItem(STORAGE_KEY, expiredAt.toISOString());
    setRemaining(RESEND_COOLDOWN);
  };

  return (
    <Modal
      opened={isOpenModalActiveAcc}
      onClose={() => setIsOpenModalActiveAcc(false)}
      size="lg"
      title={<div className="text-base font-semibold">Xác thực tài khoản</div>}
    >
      <>
        <h1 className="text-2xl font-semibold text-center text-gray-900">Xác thực tài khoản</h1>
        <p className="mt-1 text-sm text-gray-400 text-center font-medium">
          Vui lòng kiểm tra email để xác thực tài khoản của bạn
        </p>
        <form
          onSubmit={handleSubmit(async (data) => {
            const success = await verifyAccount(data, email);
            if (success) setIsOpenModalActiveAcc(false);
          })}
          className="space-y-4 w-full mt-8"
        >
          <div className="flex gap-2 ">
            <Input
              className="flex-1"
              disabled={loading || remaining > 0}
              placeholder="Nhập email đã đăng kí trên hệ thống"
              size="sm"
              radius="sm"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              disabled={!email || loading || remaining > 0}
              onClick={() => handleResend(email)}
              loading={loading}
              type="button"
              size="sm"
              radius="sm"
              title={remaining > 0 ? `Gửi lại mã sau ${remaining}s` : 'Gửi mã'}
              variant="outline"
            />
          </div>
          <Input
            {...register('verificationCode')}
            name="verificationCode"
            error={errors.verificationCode ? 'Vui lòng nhập mã xác thực' : ''}
            type="text"
            label="Mã xác thực"
            placeholder="Nhập mã xác thực đã gửi đến email"
            size="sm"
            radius="sm"
          />
          <Button
            size="sm"
            radius="sm"
            type="submit"
            loading={loading}
            title="Xác thực tài khoản"
            variant="filled"
            style={{ width: '100%' }}
          />
        </form>
      </>
    </Modal>
  );
}
