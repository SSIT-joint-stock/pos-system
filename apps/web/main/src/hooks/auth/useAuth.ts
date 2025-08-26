"use client";
import api from "@main/libs/axios";
import useToast from "@repo/design-system/hooks/client/use-toast-notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
} from "@main/sections/auth/data";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  VERIFY: "/auth/verify-code",
  RESEND: "/auth/resend-code",
  BUSINESS: "/auth/business",
  LOGIN: "/auth/login",
  FORGOT: "/auth/forgot-password",
  RESET: "/auth/reset-password",
};

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
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
      const message =
        err.response?.data?.error?.message ||
        "Có lỗi hệ thống, vui lòng thử lại sau";
      showErrorToast(message);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ========== Auth Functions ==========
  const signup = async (
    data: RegisterData,
    saveUserId: (id: string) => void
  ) => {
    const res = await requestWrapper(
      () => api.post(AUTH_ENDPOINTS.REGISTER, data),
      "Đăng ký thành công"
    );
    if (res?.data?.success) {
      saveUserId(res.data.data.user.id);
      setEmail(res.data.data.user.email);
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
      "Xác thực tài khoản thành công"
    );
    return !!res;
  };
  const handleVerificationCodeChange = (value: string) => {
    verifyEmailForm.setValue("verificationCode", value);
  };

  const resendCode = async () => {
    await requestWrapper(
      () =>
        api.post(`${AUTH_ENDPOINTS.RESEND}`, {
          email,
        }),
      "Gửi lại mã xác thực thành công"
    );
  };

  const createBusinessInfo = async (data: BusinessInfoData) => {
    const res = await requestWrapper(() =>
      api.post(AUTH_ENDPOINTS.BUSINESS, data)
    );
    if (res) showSuccessToast(res.data.message);
    return !!res;
  };

  const login = async (data: LoginData) => {
    const res = await requestWrapper(
      () => api.post(AUTH_ENDPOINTS.LOGIN, data),
      "Đăng nhập thành công!"
    );
    if (res) router.push("/dashboard");
  };

  const forgotPassword = async (data: ForgotPasswordData) => {
    const res = await requestWrapper(() =>
      api.post(AUTH_ENDPOINTS.FORGOT, data)
    );
    if (res) showSuccessToast(res.data.message);
    return !!res;
  };

  const resetPassword = async (data: ResetPasswordData) => {
    const res = await requestWrapper(() =>
      api.post(AUTH_ENDPOINTS.RESET, data)
    );
    if (res) showSuccessToast(res.data.message);
    return !!res;
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
    signup,
    verifyAccount,
    resendCode,
    createBusinessInfo,
    login,
    forgotPassword,
    resetPassword,
    // utils
    setLoading,
    setEmail,
    handleVerificationCodeChange,
  };
}
