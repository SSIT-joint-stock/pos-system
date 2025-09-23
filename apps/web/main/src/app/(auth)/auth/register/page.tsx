import { type Metadata } from "next";
import { RegisterView } from "@main/sections/auth/view/";
import React from "react";
export const metadata: Metadata = {
  title: "Đăng ký tạo tài khoản",
  description: "Đăng ký tạo tài khoản",
};
export default function SignupPage() {
  return <RegisterView />;
}
