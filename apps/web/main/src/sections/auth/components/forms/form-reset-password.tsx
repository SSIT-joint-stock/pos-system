'use client';
import React from 'react';
import { ResetPasswordData } from '../../data';
import { Button, Input } from '@repo/design-system/components/ui';
import useAuth from '../../../../hooks/auth/use-auth';
import { MoveLeft } from 'lucide-react';

export function FormResetPassword({
  onSubmit,
  setModalSteps,
}: {
  onSubmit: (data: ResetPasswordData) => void;
  setModalSteps: (step: number) => void;
}) {
  const {
    resetPasswordForm: {
      register,
      handleSubmit,
      formState: { errors },
    },
    loading,
  } = useAuth();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4" action="">
      <Input
        {...register('resetToken')}
        disabled={loading}
        error={errors.resetToken?.message}
        type="text"
        label="Mã xác thực"
        placeholder="Nhập mã xác thực"
        size="sm"
        radius="sm"
      />
      <Input
        {...register('password')}
        disabled={loading}
        isInputPassword
        error={errors.password?.message}
        type="password"
        label="Mật khẩu "
        placeholder="Nhập mật khẩu"
        radius="sm"
        size="sm"
      />
      <Input
        {...register('confirmPassword')}
        disabled={loading}
        isInputPassword
        error={errors.confirmPassword?.message}
        type="password"
        label="Xác thực mật mật khẩu"
        placeholder="Nhập xác thực mật khẩu "
        size="sm"
        radius="sm"
      />
      <Button loading={loading} type="submit" title="Đặt lại mật khẩu" size="sm" radius="sm" />
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          onClick={() => setModalSteps(1)}
          className="flex items-center gap-2 cursor-pointer text-gray-500 group transition-all duration-300 hover:text-pos-blue-500  "
        >
          <MoveLeft size={16} className=" group-hover:-translate-x-2 transition-all duration-300" />
          <span className="text-xs font-medium ">Quay lại</span>
        </button>
      </div>
    </form>
  );
}
