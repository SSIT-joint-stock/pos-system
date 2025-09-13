'use client';
import api from '../../libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  BusinessInfoData,
  businessInfoSchema,
  ForgotPasswordData,
  forgotPasswordSchema,
  LoginData,
  loginSchema,
  RegisterData,
  registerSchema,
  ResetPasswordData,
  resetPasswordSchema,
  VerifyAccountData,
  verifyAccountSchema,
} from '../../../src/sections/auth/data';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import {
  accessTokenAtom,
  currentStoreAtom,
  storesAtom,
  currentUserAtom,
} from '@repo/design-system/stores/auth';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  VERIFY: '/auth/verify-email',
  RESEND: '/auth/resend-code',
  BUSINESS: '/stores',
  LOGIN: '/auth/login',
  FORGOT: '/auth/forgot-password',
  RESET: '/auth/reset-password',
  SET_CURRENT_STORE: '/auth/set-current-store',
};

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [, setCurrentUser] = useAtom(currentUserAtom);
  const [, setStores] = useAtom(storesAtom);
  const [, setCurrentStore] = useAtom(currentStoreAtom);
  const [email, setEmail] = useState('');
  const { showErrorToast, showSuccessToast } = useToast();
  const router = useRouter();

  // ========== Forms ==========
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });
  const verifyEmailForm = useForm<VerifyAccountData>({
    resolver: zodResolver(verifyAccountSchema),
  });
  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const businessInfoForm = useForm<BusinessInfoData>({
    resolver: zodResolver(businessInfoSchema),
  });
  const forgotPasswordForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const resetPasswordForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // ========== Helper Request Wrapper ==========
  const requestWrapper = async <T>(
    fn: () => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    setLoading(true);
    try {
      const res = await fn();
      if (successMessage) showSuccessToast(successMessage);
      return res;
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Có lỗi hệ thống, vui lòng thử lại sau';
      showErrorToast(message);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ========== Auth Functions ==========
  const register = async (data: RegisterData) => {
    const res = await requestWrapper(
      () => api.post(AUTH_ENDPOINTS.REGISTER, data),
      'Đăng ký tạo tài khoản thành công'
    );
    if (res?.data.success) {
      setEmail(res.data?.data?.user.email);
      return true;
    }
    return false;
  };

  const verifyAccount = async (data: VerifyAccountData) => {
    const res = await requestWrapper(
      () =>
        api.post(AUTH_ENDPOINTS.VERIFY, {
          email,
          verificationCode: data.verificationCode,
        }),
      'Xác thực tài khoản thành công'
    );
    return !!res;
  };

  const handleVerificationCodeChange = (value: string) => {
    verifyEmailForm.setValue('verificationCode', value);
  };

  const resendCode = async () => {
    await requestWrapper(
      () => api.post(`${AUTH_ENDPOINTS.RESEND}`, { email }),
      'Gửi lại mã xác thực thành công'
    );
  };

  const login = async (data: LoginData) => {
    const res = await requestWrapper(
      () => api.post(AUTH_ENDPOINTS.LOGIN, data),
      'Đăng nhập thành công!'
    );
    if (res?.data.success) {
      const { user, stores, access_token } = res.data.data;
      setAccessToken(access_token);
      setCurrentUser(user);
      setStores(stores);
      return true;
    }
    return false;
  };

  const profile = async () => {
    const res = await requestWrapper(() => api.get('/auth/profile'));
    if (res?.data.success) {
      const { user, store } = res.data.data;
      setCurrentUser(user);
      setCurrentStore(store);
    }
  };

  // Tạo store và tự động set làm current store
  const createBusinessInfo = async (data: BusinessInfoData) => {
    const res = await requestWrapper(
      () => api.post(AUTH_ENDPOINTS.BUSINESS, data),
      'Tạo cửa hàng thành công!'
    );

    if (res?.data.success) {
      const newStore = res.data.data;

      // Update stores list
      setStores([newStore]);

      // Tự động set làm current store
      const setStoreSuccess = await selectStore(newStore.id);

      return { success: true, store: newStore, autoSet: setStoreSuccess };
    }
    return { success: false, store: null, autoSet: false };
  };

  const selectStore = async (storeId: string) => {
    const res = await requestWrapper(
      () => api.post(`${AUTH_ENDPOINTS.SET_CURRENT_STORE}/${storeId}`),
      'Đã chọn cửa hàng thành công!'
    );

    if (res?.data.success) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { access_token } = res?.data?.data;
      setAccessToken(access_token);
      setCurrentStore(res.data.data);
      return true;
    }
    return false;
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    const res = await requestWrapper(() => api.post(AUTH_ENDPOINTS.FORGOT, data));
    if (res) showSuccessToast(res.data.message);
    return !!res;
  };

  const resetPassword = async (data: ResetPasswordData) => {
    const res = await requestWrapper(() => api.post(AUTH_ENDPOINTS.RESET, data));
    if (res) showSuccessToast(res.data.message);
    return !!res;
  };

  // Redirect sang dashboard
  const goToDashboard = () => {
    router.push('http://localhost:3001/dashboard');
  };

  // ========== Expose ==========
  return {
    loading,
    // forms
    registerForm,
    verifyEmailForm,
    loginForm,
    businessInfoForm,
    forgotPasswordForm,
    resetPasswordForm,
    // actions
    register,
    verifyAccount,
    resendCode,
    createBusinessInfo,
    login,
    selectStore,
    forgotPassword,
    resetPassword,
    profile,
    goToDashboard,
    // utils
    setLoading,
    setEmail,
    handleVerificationCodeChange,
  };
}
