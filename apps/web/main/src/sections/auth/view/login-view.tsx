'use client';
import Logo from '@main/components/common/Logo';
import useAuth from '@main/hooks/auth/useAuth';
import { FormBusinessInfo, FormLogin } from '@main/sections/auth/components/forms';
import { currentStoreAtom, storesAtom } from '@repo/design-system/stores/auth';
import { useAtom } from 'jotai';
import { useState } from 'react';
import FormSelectStore from '../components/forms/form-select-store';

export function LoginView() {
  const [isStepActive, setIsStepActive] = useState<number>(0);
  const { login, selectStore, createBusinessInfo, goToDashboard, loginForm, loading } = useAuth();
  const [stores] = useAtom(storesAtom);
  const [currentStore, setCurrentStoreLocal] = useAtom(currentStoreAtom);

  // Handle login success
  const handleLoginSuccess = async (data: any) => {
    const success = await login(data);
    if (success) {
      setIsStepActive(1);
    }
  };

  // Handle store selection and redirect
  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStore?.id) {
      const success = await selectStore(currentStore.id);
      if (success) {
        goToDashboard();
      }
    }
  };

  // Handle store change
  const handleStoreChange = (storeId: string) => {
    const selectedStore = stores.find((store) => store.id === storeId);
    setCurrentStoreLocal(selectedStore || null);
  };

  // Handle create business and auto redirect
  const handleCreateBusiness = async (data: any) => {
    const result = await createBusinessInfo(data);
    if (result.success && result.autoSet) {
      goToDashboard();
    }
  };

  return (
    <>
      <Logo />

      <h1 className="md:text-2xl text-xl text-pos-blue-500 font-semibold text-center mt-4 select-none pointer-events-none">
        Đăng nhập vào tài khoản của bạn
      </h1>

      <p className="text-gray-400 text-center sm:text-sm text-xs md:mt-4 mt-2 mb-3 md:w-[360px] w-full select-none pointer-events-none">
        Trang đăng nhập ưu tiên bảo mật người dùng, mang đến trải nghiệm liền mạch, đảm bảo truy cập
        nhanh chóng và thuận tiện vào nhiều lợi ích của hệ thống.
      </p>

      {/* Step 1: Login Form */}
      {isStepActive === 0 && (
        <FormLogin login={handleLoginSuccess} loginForm={loginForm} loading={loading} />
      )}

      {/* Step 2: Store Selection or Create */}
      {isStepActive === 1 && (
        <>
          {stores.length > 0 && stores ? (
            // User has stores - show selection
            <FormSelectStore
              currentStore={currentStore}
              handleStoreSubmit={handleStoreSubmit}
              handleStoreChange={handleStoreChange}
              loading={loading}
              stores={stores}
            />
          ) : (
            // User has no stores - show create form
            <FormBusinessInfo createBusinessInfo={handleCreateBusiness} />
          )}
        </>
      )}
    </>
  );
}
