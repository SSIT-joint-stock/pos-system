"use client";
import React, { useState } from "react";
import { Building2, Check, MailCheck, User } from "lucide-react";
import { RouterLink } from "@repo/design-system/routes/components";
import { Button, Stepper } from "@repo/design-system/components/ui";
import {
  FormActiveAccount,
  FormRegister,
  FormBusinessInfo,
} from "../components/Form";
import useAuth from "@main/hooks/auth/useAuth";

const steps = [
  {
    label: "Tạo mới tài khoản",
    description: "Vui lòng cung cấp thông tin chi tiết của bạn.",
    icon: <User size={16} />,
  },
  {
    label: "Xác thực tài khoản",
    description: "Xác minh mã được gửi đến email của bạn.",
    icon: <MailCheck size={16} />,
  },
  {
    label: "Thông tin doang nghiệp",
    description: "Xây dựng tài khoản doanh nghiệp.",
    icon: <Building2 size={16} />,
  },
  {
    label: "Tạo mới tài khoản thành công",
    description:
      "Tài khoản của bạn đã được tạo thành công. Nhấp vào bên dưới để đăng nhập.",
    icon: <Check size={16} />,
  },
];
export function RegisterView() {
  const [userId, setUserId] = useState<string>("");
  const [isActive, setIsActive] = useState<number>(0);
  const { handleSignup, handleActiveAccount, handleCreatedBusinessInfo } =
    useAuth();

  return (
    <>
      {/* Left side */}
      <div className="bg-gray-50">
        <div className="py-8 px-10">
          {/* Logo */}
          <RouterLink href={"/"} className="flex items-center gap-2">
            <span className="text-pos-blue-500 font-bold text-xl w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
              ★
            </span>
            <span className="text-xl font-medium text-pos-blue-400">
              POS-SYSTEM
            </span>
          </RouterLink>
          <div className="mt-10">
            <Stepper
              active={isActive}
              setActive={setIsActive}
              orientation="vertical"
              steps={steps}
              size="xs"
            />
          </div>
        </div>
      </div>
      {/* Form */}
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 ">
        {/* Steps */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 p-3 bg-pos-blue-50  text-pos-blue-500 rounded-full">
            {steps[isActive].icon}
          </div>
          <h2 className="text-xl font-semibold text-pos-blue-500">
            {steps[isActive].label}
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            {steps[isActive].description}
          </p>
        </div>
        {isActive === 0 && (
          <FormRegister
            onSubmit={async (data) => {
              const success = await handleSignup(data, setUserId);
              if (success) setIsActive(1);
            }}
          />
        )}

        {isActive === 1 && (
          <FormActiveAccount
            setActive={setIsActive}
            onSubmit={async (data) => {
              const success = await handleActiveAccount(data);
              if (success) setIsActive(2);
            }}
          />
        )}
        {isActive === 2 && (
          <FormBusinessInfo
            onSubmit={async (data) => {
              const success = await handleCreatedBusinessInfo(data);
              if (success) setIsActive(3);
            }}
            userId={userId}
            setActive={setIsActive}
          />
        )}
        {isActive === 3 && (
          <div className="w-full">
            <RouterLink className="w-full flex" href="/auth/login">
              <Button
                className="flex-1"
                size="sm"
                type="submit"
                title="Tiếp tục"
                variant="filled"
              />
            </RouterLink>
          </div>
        )}
      </div>
    </>
  );
}
