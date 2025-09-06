import Logo from '@main/components/common/Logo';
import { FormLogin } from '@main/sections/auth/components/forms';

export function LoginView() {
  return (
    <>
      {/* Logo */}
      <Logo />
      {/* Title & description */}
      <h1 className="md:text-2xl text-xl text-pos-blue-500 font-semibold text-center mt-4 select-none pointer-events-none">
        Đăng nhập vào tài khoản của bạn
      </h1>
      <p className="text-gray-400 text-center sm:text-sm text-xs  md:mt-4 mt-2 mb-3 md:w-[360px] w-full select-none pointer-events-none">
        Trang đăng nhập ưu tiên bảo mật người dùng, mang đến trải nghiệm liền mạch, đảm bảo truy cập
        nhanh chóng và thuận tiện vào nhiều lợi ích của hệ thống.
      </p>
      {/* Form */}
      <FormLogin />
    </>
  );
}
