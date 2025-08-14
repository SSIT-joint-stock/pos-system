import { FormLogin } from "@main/sections/auth/components/form";
import { RouterLink } from "@repo/design-system/routes/components";

export function LoginView() {
  return (
    <>
      {/* Logo */}
      <RouterLink href={"/"} className="flex items-center gap-2">
        <span className="text-blue-500 font-bold text-xl w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
          ★
        </span>
        <span className="text-xl font-medium text-blue-400">POS-SYSTEM</span>
      </RouterLink>
      {/* Title & description */}
      <h1 className="md:text-2xl text-xl text-pos-blue-500 font-semibold text-center mt-4">
        Đăng nhập vào tài khoản của bạn
      </h1>
      <p className="text-gray-400 text-center sm:text-sm text-xs  md:mt-4 mt-2 mb-3 md:w-[360px] w-full">
        Trang đăng nhập ưu tiên bảo mật người dùng, mang đến trải nghiệm liền
        mạch, đảm bảo truy cập nhanh chóng và thuận tiện vào nhiều lợi ích của
        hệ thống.
      </p>
      {/* Form */}
      <FormLogin />
    </>
  );
}
