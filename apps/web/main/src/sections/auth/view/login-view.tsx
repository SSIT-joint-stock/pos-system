'use client';
import Logo from '@main/components/common/Logo';
import useAuth from '@main/hooks/auth/use-auth';
import { FormBusinessInfo, FormLogin } from '@main/sections/auth/components/forms';
import { storesAtom } from '@repo/design-system/stores/auth';
import { useAtom } from 'jotai';
import { useState } from 'react';
import FormSelectStore from '../components/forms/form-select-store';
export type AuthOnboardingStep = 'LOGIN' | 'CREATE_STORE' | 'SELECT_STORE';

export function LoginView() {
  const [step, setStep] = useState<AuthOnboardingStep>('LOGIN');

  const [stores] = useAtom(storesAtom);
  const { login, selectStore, loginForm, loading } = useAuth();

  // Handle login success
  const handleLoginSuccess = async (data: any) => {
    const success = await login(data);
    if (!success.success) return;
    if (success.stores.length > 0 && success.stores) {
      setStep('SELECT_STORE');
    } else {
      setStep('CREATE_STORE');
    }
  };
  return (
    <>
      <Logo />

      <h1 className="md:text-2xl text-xl text-pos-blue-500 font-semibold text-center mt-4 select-none pointer-events-none">
        {step === 'LOGIN' && ' Đăng nhập vào tài khoản của bạn'}
        {step === 'CREATE_STORE' && ' Tạo thông tin cửa hàng của bạn'}
        {step === 'SELECT_STORE' && ' Chọn cửa hàng của bạn'}
      </h1>

      <p className="text-gray-500 text-center sm:text-sm text-xs md:mt-4 mt-2 mb-7 md:w-[360px] w-full select-none pointer-events-none">
        Trang đăng nhập ưu tiên bảo mật người dùng, mang đến trải nghiệm liền mạch, đảm bảo truy cập
        nhanh chóng và thuận tiện vào nhiều lợi ích của hệ thống.
      </p>
      {/* Step 1: Login Form */}
      {step === 'LOGIN' && (
        <FormLogin login={handleLoginSuccess} loginForm={loginForm} loading={loading} />
      )}

      {step === 'CREATE_STORE' && <FormBusinessInfo setStep={setStep} />}
      {step === 'SELECT_STORE' && (
        <FormSelectStore
          handleStoreSubmit={selectStore}
          loading={loading}
          stores={stores}
          setStep={setStep}
        />
      )}
    </>
  );
}
