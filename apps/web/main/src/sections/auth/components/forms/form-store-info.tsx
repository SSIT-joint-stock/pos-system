import React from 'react';
import { Button, Input } from '@repo/design-system/components/ui';
import { Info, MoveLeft, Phone, Warehouse } from 'lucide-react';
import useAuth from '../../../../hooks/auth/use-auth';
export function FormBusinessInfo({
  createStoreInfo,
  setIsStepActive,
}: {
  createStoreInfo: (data: any) => void;
  setIsStepActive: (step: number) => void;
}) {
  const { storeInfoForm, loading } = useAuth();

  return (
    <form onSubmit={storeInfoForm.handleSubmit(createStoreInfo)} className="space-y-4 w-full h-fit">
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
          onClick={() => setIsStepActive(0)}
          className="flex items-center gap-2 cursor-pointer text-gray-500 group transition-all duration-300 hover:text-pos-blue-500  "
        >
          <MoveLeft size={16} className=" group-hover:-translate-x-2 transition-all duration-300" />
          <span className="text-xs font-medium ">Quay lại trang đăng nhập</span>
        </button>
      </div>
    </form>
  );
}
