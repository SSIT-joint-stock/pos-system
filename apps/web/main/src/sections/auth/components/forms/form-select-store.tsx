import Logo from '@main/components/common/Logo';
import { AuthOnboardingStep } from '@main/sections/auth/view';
import { Button, Select } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Store } from '@repo/design-system/types/store';
import { useAtom } from 'jotai';
import { MoveLeft, Warehouse } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function FormSelectStore({
  handleStoreSubmit,
  setStep,
  stores,
  loading,
}: {
  handleStoreSubmit?: (storeId: string) => void;
  handleStoreChange?: (storeId: string) => void;
  setStep?: (step: AuthOnboardingStep) => void;
  stores: Store[];
  currentStore?: Store | null;
  loading?: boolean;
}) {
  const [storeId, setStoreId] = useState<string>('');
  const [, setCurrentStoreLocal] = useAtom(currentStoreAtom);
  const pathname = usePathname();
  const router = useRouter();
  const handleStoreChange = (storeId: string) => {
    if (!storeId) {
      setCurrentStoreLocal(null);
      return;
    }
    const selectedStore = stores.find((store) => store.id === storeId);
    setCurrentStoreLocal(selectedStore || null);
  };
  return (
    <>
      {/* FOR OAUTH  */}
      {pathname?.includes('select-store') && (
        <>
          <Logo />

          <h1 className="md:text-2xl text-xl text-pos-blue-500 font-semibold text-center mt-4 select-none pointer-events-none">
            Chọn cửa hàng của bạn
          </h1>

          <p className="text-gray-500 text-center sm:text-sm text-xs md:mt-4 mt-2 mb-7 md:w-[360px] w-full select-none pointer-events-none">
            Trang đăng nhập ưu tiên bảo mật người dùng, mang đến trải nghiệm liền mạch, đảm bảo truy
            cập nhanh chóng và thuận tiện vào nhiều lợi ích của hệ thống.
          </p>
        </>
      )}
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (handleStoreSubmit) {
            await handleStoreSubmit(storeId);

            // Chuyển hướng sau khi API đã hoàn tất
            router.push(
              `${process.env.NEXT_PUBLIC_RETAIL_BASE_URL}/dashboard/store/${storeId}/overview`
            );
          }
        }}
      >
        <Select
          radius="sm"
          size="sm"
          leftSection={<Warehouse size={17} />}
          placeholder="Chọn cửa hàng của bạn"
          searchable
          label="Chọn cửa hàng"
          data={stores.map((store: any) => ({
            label: store.name,
            value: store.id,
            description: store.description || 'Cửa hàng không có mô tả',
            member: store.members?.length || 0,
          }))}
          onChange={(value) => {
            setStoreId(value as string);
            handleStoreChange(value as string);
          }}
        />
        <Button
          type="submit"
          title="Đăng nhập"
          size="sm"
          radius="sm"
          loading={loading}
          disabled={!storeId}
        />
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            onClick={() =>
              pathname?.includes('select-store') ? router.push('/auth/login') : setStep?.('LOGIN')
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
