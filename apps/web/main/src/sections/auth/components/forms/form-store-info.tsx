'use client';
import Logo from '@main/components/common/Logo';
import { AuthOnboardingStep } from '@main/sections/auth/view';
import { Button, Input } from '@repo/design-system/components/ui';
import { Info, MoveLeft, Phone, Warehouse } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '../../../../hooks/auth/use-auth';
export function FormBusinessInfo({ setStep }: { setStep?: (step: AuthOnboardingStep) => void }) {
  const { storeInfoForm, loading, createStoreInfo } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      {/* FOR OAUTH  */}
      {pathname?.includes('create-store') && (
        <>
          <Logo />

          <h1 className="md:text-2xl text-xl text-pos-blue-500 font-semibold text-center mt-4 select-none pointer-events-none">
            Tạo thông tin cửa hàng của bạn
          </h1>

          <p className="text-gray-500 text-center sm:text-sm text-xs md:mt-4 mt-2 mb-7 md:w-[360px] w-full select-none pointer-events-none">
            Trang đăng nhập ưu tiên bảo mật người dùng, mang đến trải nghiệm liền mạch, đảm bảo truy
            cập nhanh chóng và thuận tiện vào nhiều lợi ích của hệ thống.
          </p>
        </>
      )}
      {/* FOR AUTH MANUAL AND OAUTH WHEN LOGIN ACCOUNT NOT HAVE STORE */}
      <form
        onSubmit={storeInfoForm.handleSubmit(async (data) => {
          const result = await createStoreInfo(data);
          if (result.success && result.autoSet) {
            router.push(
              `${process.env.NEXT_PUBLIC_RETAIL_BASE_URL}/dashboard/store/${result.store?.id}/overview`
            );
          }
        })}
        className="space-y-4 w-full h-fit"
      >
        <Input
          {...storeInfoForm.register('name')}
          error={storeInfoForm.formState.errors.name?.message}
          size="sm"
          radius="sm"
          type="text"
          name="name"
          label="Tên doanh nghiệp"
          withAsterisk
          placeholder="Doanh nghiệp ABC"
          leftSection={<Warehouse size={16} />}
        />
        <Input
          {...storeInfoForm.register('phone_number')}
          error={storeInfoForm.formState.errors.phone_number?.message}
          size="sm"
          radius="sm"
          type="text"
          name="phone_number"
          label="Số điện thoại"
          placeholder="0123456789"
          leftSection={<Phone size={16} />}
        />
        <Input
          {...storeInfoForm.register('description')}
          error={storeInfoForm.formState.errors.description?.message}
          size="sm"
          radius="sm"
          type="text"
          name="description"
          label="Thông tin doanh nghiệp"
          placeholder="Chuyên nghiệp, giá rẻ, dễ dùng"
          leftSection={<Info size={16} />}
        />
        <Button
          type="submit"
          size="sm"
          radius="sm"
          title="Tiếp tục"
          style={{ width: '100%' }}
          loading={loading}
          variant="filled"
        />
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            onClick={() =>
              pathname?.includes('create-store') ? router.push('/auth/login') : setStep?.('LOGIN')
            }
            className="flex items-center gap-2 cursor-pointer text-gray-500 group transition-all duration-300 hover:text-pos-blue-500  "
          >
            <MoveLeft
              size={16}
              className=" group-hover:-translate-x-2 transition-all duration-300"
            />
            <span className="text-xs font-medium ">Quay lại trang đăng nhập</span>
          </button>
        </div>
      </form>
    </>
  );
}
