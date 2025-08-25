"use client";
import api from "@main/libs/axios";
import useToast from "@repo/design-system/hooks/client/use-toast-notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  BusinessInfoData,
  businessInfoSchema,
  LoginData,
  loginSchema,
  RegisterData,
  registerSchema,
  VerifyAccountData,
  verifyAccountSchema,
} from "@main/sections/auth/data";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { showErrorToast, showSuccessToast } = useToast();
  const router = useRouter();

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });
  const verifyEmailForm = useForm<VerifyAccountData>({
    resolver: zodResolver(verifyAccountSchema),
  });
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });
  const businessInfoForm = useForm<BusinessInfoData>({
    resolver: zodResolver(businessInfoSchema),
  });
  // function for register
  const handleSignup = async (
    data: RegisterData,
    saveUserId: (id: string) => void
  ) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      showSuccessToast("Đăng ký thành công");
      const email = res.data?.data?.user?.email;
      const userId = res.data?.data?.user?.id;
      if (res.data.success) {
        saveUserId(userId);
        setEmail(email);
      }
      setLoading(false);
      return true;
    } catch (err: any) {
      setLoading(false);
      const message =
        err.response?.data?.error?.message ||
        "Có lỗi hệ thống, vui lòng thử lại sau";
      showErrorToast(message);
      console.error(err);
    }
  };

  // function for verify email
  const handleActiveAccount = async (data: VerifyAccountData) => {
    setLoading(true);
    try {
      await api.post(`/auth/verify-code`, {
        email,
        verificationCode: data.verificationCode,
      });
      showSuccessToast("Xác thực tài khoản thành công");
      setLoading(false);
      return true;
    } catch (err: any) {
      setLoading(false);
      const message =
        err.response?.data?.error?.message ||
        "Có lỗi hệ thống, vui lòng thử lại sau";
      showErrorToast(message);
      console.error(err);
    }
  };

  const handleVerificationCodeChange = (value: string) => {
    verifyEmailForm.setValue("verificationCode", value);
  };

  // functions for resend code
  const handleResendCode = async () => {
    try {
      const res = await api.post(`/auth/resend-code?email=${email}`);
      console.log(res.data);
      showSuccessToast("Gửi lại mã xác thực thành công");
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message ||
        "Có lỗi hệ thống, vui lòng thử lại sau";
      showErrorToast(message);
      console.error(err);
    }
  };

  // functions for business info
  const handleCreatedBusinessInfo = async (data: BusinessInfoData) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/business", data);
      showSuccessToast(res.data.message);
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Có lỗi hệ thống, vui lài sau";
      showErrorToast(message);
    }
  };

  // functions for login
  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    try {
      await api.post("/auth/login", data);
      showSuccessToast("Đăng nhập thành công!");
      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      const message =
        (error as any).response?.data?.error?.message ||
        "Có lỗi hệ thống, vui lòng thử lại sau";
      showErrorToast(message);
      setLoading(false);
    }
  };

  return {
    loading,

    registerForm,
    verifyEmailForm,
    loginForm,
    businessInfoForm,
    setLoading,
    handleSignup,
    handleActiveAccount,
    handleVerificationCodeChange,
    handleResendCode,
    handleLogin,
    handleCreatedBusinessInfo,
  };
}
