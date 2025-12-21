'use client';
import React, { useState } from 'react';
import { Check, MailCheck, User } from 'lucide-react';
import { Stepper } from '@repo/design-system/components/ui';

import StepRegister from '../components/steps/step-register';
import Logo from '@main/components/common/Logo';

const steps = [
  {
    label: 'Tạo mới tài khoản',
    description: 'Vui lòng cung cấp thông tin chi tiết của bạn.',
    icon: <User size={16} />,
  },
  {
    label: 'Xác thực tài khoản',
    description: 'Xác minh mã được gửi đến email của bạn.',
    icon: <MailCheck size={16} />,
  },
  {
    label: 'Tạo mới tài khoản thành công',
    description: 'Tài khoản của bạn đã được tạo thành công. Nhấp vào bên dưới để đăng nhập.',
    icon: <Check size={16} />,
  },
];
export function RegisterView() {
  const [isActive, setIsActive] = useState<number>(0);
  return (
    <>
      {/* Left side */}
      <div className="bg-gray-50">
        <div className="py-8 px-10">
          {/* Logo */}
          <Logo />
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
      <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-6 ">
        {/* Steps */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 p-3 bg-pos-blue-50  text-pos-blue-500 rounded-full">
            {steps[isActive].icon}
          </div>
          <h2 className="text-xl font-semibold text-pos-blue-500">{steps[isActive].label}</h2>
          <p className="text-gray-500 text-xs mt-1">{steps[isActive].description}</p>
        </div>
        {StepRegister({ setIsActive, isActive })}
      </div>
    </>
  );
}
