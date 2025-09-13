import React from 'react';
import { Button, Input } from '@repo/design-system/components/ui';
import { Info, Warehouse } from 'lucide-react';
import useAuth from '@main/hooks/auth/useAuth';
export function FormBusinessInfo({
  createBusinessInfo,
}: {
  createBusinessInfo: (data: any) => void;
}) {
  const { businessInfoForm, loading } = useAuth();

  return (
    <form
      onSubmit={businessInfoForm.handleSubmit(createBusinessInfo)}
      className="flex flex-col gap-3 w-full h-fit"
    >
      <Input
        {...businessInfoForm.register('name')}
        error={businessInfoForm.formState.errors.name?.message}
        size="sm"
        type="text"
        name="name"
        label="Tên doanh nghiệp"
        placeholder="Doanh nghiệp ABC"
        leftSection={<Warehouse size={16} />}
      />
      <Input
        {...businessInfoForm.register('description')}
        error={businessInfoForm.formState.errors.description?.message}
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
