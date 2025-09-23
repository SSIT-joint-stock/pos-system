import { type Metadata } from "next";
import React from "react";
import { LoginView } from "@main/sections/auth/view";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào tài khoản của bạn",
};
export default function LoginPage() {
  return <LoginView />;
}
