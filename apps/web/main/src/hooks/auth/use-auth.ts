'use client';
import api from '../../libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
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
} from '../../sections/auth/data';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  accessTokenAtom,
  currentStoreAtom,
  storesAtom,
  currentUserAtom,
} from '@repo/design-system/stores/auth';
import { useRequestHelper } from '../use-request-helper';
import { CreateStoreInput, CreateStoreSchema } from '../../schemas/store/store.schema';
import { ApiResponse } from '@repo/types/response';
const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  VERIFY: '/auth/verify-email',
  RESEND: '/auth/reverify-email',
  BUSINESS: '/stores',
  LOGIN: '/auth/login',
  FORGOT: '/auth/forgot-password',
  RESET: '/auth/reset-password',
  SET_CURRENT_STORE: '/auth/set-current-store',
  PROFILE: '/auth/profile',
  LOGOUT: '/auth/logout',
};

export default function useAuth() {
  const { showSuccessToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();
  const [email, setEmail] = useState('');
  const router = useRouter();
  const currentStore = useAtomValue(currentStoreAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setCurrentStore = useSetAtom(currentStoreAtom);
  const setStores = useSetAtom(storesAtom);

  // ========== Forms ==========
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });
  const verifyEmailForm = useForm<VerifyAccountData>({
    resolver: zodResolver(verifyAccountSchema),
  });
  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const storeInfoForm = useForm<CreateStoreInput>({
    resolver: zodResolver(CreateStoreSchema),
  });
  const forgotPasswordForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const resetPasswordForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // ========== Auth Functions ==========
  const register = async (data: RegisterData) => {
    const res = await requestWrapper(() => api.post<ApiResponse>(AUTH_ENDPOINTS.REGISTER, data));
    if (res?.data.success) {
      showSuccessToast(res?.data?.message as string);
      localStorage.setItem('verifiedEmail', data.email);
      setEmail(res.data?.data?.user.email);
      return true;
    }
    return false;
  };
  const verifyAccount = async (data: VerifyAccountData, inptEmail?: string) => {
    const res = await requestWrapper(() =>
      api.post<ApiResponse>(AUTH_ENDPOINTS.VERIFY, {
        email: email || inptEmail,
        verificationCode: data.verificationCode,
      })
    );

    if (res?.data.success) {
      showSuccessToast(res?.data?.message as string);
      return true;
    }
    return false;
  };
  const handleVerificationCodeChange = (value: string) => {
    verifyEmailForm.setValue('verificationCode', value);
  };

  const resendCode = async (email: string) => {
    const res = await requestWrapper(() =>
      api.post<ApiResponse>(`${AUTH_ENDPOINTS.RESEND}`, { email })
    );
    if (res?.data.success) {
      showSuccessToast(res?.data?.message as string);
    }
  };

  const login = async (data: LoginData) => {
    const res = await requestWrapper(() => api.post<ApiResponse>(AUTH_ENDPOINTS.LOGIN, data));
    if (res?.data.success) {
      const { stores, access_token } = res.data.data;
      showSuccessToast(res?.data?.message as string);
      setAccessToken(access_token);
      setStores(stores);
      return true;
    }
    return false;
  };

  const profile = async () => {
    const res = await requestWrapper(() => api.get<ApiResponse>(AUTH_ENDPOINTS.PROFILE));
    if (res?.data.success) {
      const { user, store } = res.data.data;
      setCurrentUser(user);
      setCurrentStore(store);
    }
  };

  // Tạo store và tự động set làm current store
  const createStoreInfo = async (data: CreateStoreInput) => {
    const res = await requestWrapper(() => api.post<ApiResponse>(AUTH_ENDPOINTS.BUSINESS, data));

    if (res?.data.success) {
      const newStore = res.data.data;
      showSuccessToast(res?.data?.message as string);
      // Update stores list
      setStores([newStore]);

      // Tự động set làm current store
      const setStoreSuccess = await selectStore(newStore.id);

      return { success: true, store: newStore, autoSet: setStoreSuccess };
    }
    return { success: false, store: null, autoSet: false };
  };

  const selectStore = async (storeId: string) => {
    const res = await requestWrapper(() =>
      api.post<ApiResponse>(`${AUTH_ENDPOINTS.SET_CURRENT_STORE}/${storeId}`)
    );

    if (res?.data.success) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { access_token, user, store } = res?.data?.data;
      showSuccessToast(res?.data?.message as string);
      setAccessToken(access_token);
      setCurrentUser(user);
      setCurrentStore(store);
      return true;
    }
    return false;
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    const res = await requestWrapper(() => api.post<ApiResponse>(AUTH_ENDPOINTS.FORGOT, data));
    if (res?.data.success) showSuccessToast(res?.data?.message as string);
    return !!res;
  };

  const resetPassword = async (data: ResetPasswordData) => {
    const res = await requestWrapper(() => api.post<ApiResponse>(AUTH_ENDPOINTS.RESET, data));
    if (res?.data.success) showSuccessToast(res?.data?.message as string);
    return !!res;
  };

  const logout = async (redirectUrl?: string) => {
    const res = await requestWrapper(() => api.post<ApiResponse>(AUTH_ENDPOINTS.LOGOUT));

    if (res?.data.success) showSuccessToast(res?.data?.message as string);
    setAccessToken(null);
    setCurrentStore(null);
    setCurrentUser(null);

    router.push(redirectUrl || `${process.env.NEXT_PUBLIC_MAIN_URL}/auth/login`);

    return !!res;
  };
  // Redirect sang dashboard
  const goToDashboard = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_RETAIL_BASE_URL}/dashboard/store/${currentStore?.id}/overview`
    );
  };

  // ========== Expose ==========
  return {
    loading,
    // forms
    registerForm,
    verifyEmailForm,
    loginForm,
    storeInfoForm,
    forgotPasswordForm,
    resetPasswordForm,
    // actions
    register,
    verifyAccount,
    resendCode,
    createStoreInfo,
    login,
    selectStore,
    forgotPassword,
    resetPassword,
    profile,
    logout,
    goToDashboard,

    // utils

    setEmail,
    handleVerificationCodeChange,
  };
}
