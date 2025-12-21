'use client';
import React from 'react';
import { Button, Input } from '@repo/design-system/components/ui';
import { ForgotPasswordData } from '../../data';
import useAuth from '../../../../hooks/auth/use-auth';

export function FormForgotPassword({ onSubmit }: { onSubmit: (data: ForgotPasswordData) => void }) {
  const {
    forgotPasswordForm: {
      register,
      handleSubmit,
      formState: { errors },
    },
    loading,
  } = useAuth();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4 ">
      <Input
        {...register('email')}
        disabled={loading}
        name="email"
        error={errors.email?.message}
        type="email"
        label="Email"
        placeholder="Nhập email"
        size="sm"
        radius="sm"
      />
      <Button loading={loading} type="submit" title="Tiếp tục" size="sm" radius="sm" />
    </form>
  );
}
