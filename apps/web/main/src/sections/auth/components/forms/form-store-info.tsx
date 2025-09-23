import React from 'react';
import { Button, Input } from '@repo/design-system/components/ui';
import { Info, Warehouse } from 'lucide-react';
import useAuth from '../../../../hooks/auth/use-auth';
export function FormBusinessInfo({ createStoreInfo }: { createStoreInfo: (data: any) => void }) {
  const { storeInfoForm, loading } = useAuth();

  return (
    <form
      onSubmit={storeInfoForm.handleSubmit(createStoreInfo)}
      className="flex flex-col gap-3 w-full h-fit"
    >
      <Input
        {...storeInfoForm.register('name')}
        error={storeInfoForm.formState.errors.name?.message}
        size="sm"
        type="text"
        name="name"
        label="Tên doanh nghiệp"
        placeholder="Doanh nghiệp ABC"
        leftSection={<Warehouse size={16} />}
      />
      <Input
        {...storeInfoForm.register('description')}
        error={storeInfoForm.formState.errors.description?.message}
        size="sm"
        type="text"
        name="description"
        label="Thông tin doanh nghiệp"
        placeholder="Chuyên nghiệp, giá rẻ, dễ dùng"
        leftSection={<Info size={16} />}
      />

      <Button disabled={loading} type="submit" size="sm" title="Tiếp tục" variant="filled" />
    </form>
  );
}
