import { Button, Input, Select } from '@repo/design-system/components/ui';
import { RefreshCcw } from 'lucide-react';
import React from 'react';
import { supplierStatusOptions } from '../view';
import { Textarea } from '@mantine/core';
import { useSupplier } from '../../../../../main/src/hooks/suplier/use-supplier';
import { Controller } from 'react-hook-form';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';

export function FormCreateSupplier({
  setIsOpenModal,
  onFetchNewData,
}: {
  isOpenModal: boolean;
  setIsOpenModal: (isOpenModal: boolean) => void;
  onFetchNewData?: () => void;
}) {
  const {
    supplierForm: {
      register,
      handleSubmit,
      getValues,
      setValue,
      formState: { errors },
      control,
    },
    loading,
    getSupplierByTaxCode,
    createSupplier,
  } = useSupplier();
  const { showErrorToast, showSuccessToast } = useToast();
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const success = await createSupplier(data);
        if (success) {
          setIsOpenModal(false);
          onFetchNewData?.();
        }
      })}
      className="space-y-6 mt-4"
    >
      <div className="space-y-1">
        <p className="text-sm text-gray-500">Mã số thuế</p>
        <div className="flex items-center gap-4">
          <Input
            {...register('tax_code')}
            size="sm"
            radius="sm"
            className="flex-1"
            placeholder="Nhập mã số thuế"
          />
          <Button
            onClick={async () => {
              const taxCode = getValues('tax_code');

              if (taxCode) {
                const supplier = await getSupplierByTaxCode(taxCode);

                if (supplier) {
                  setValue('name', supplier.name);
                  setValue('address', supplier.address ?? '');
                  showSuccessToast('Lấy thông tin thành công!');
                } else {
                  showErrorToast('Không tìm thấy nhà cung cấp');
                }
              }
            }}
            type="button"
            size="sm"
            radius="sm"
            //   className="flex-1"
            variant="light"
            loading={loading}
            title={loading ? 'Đang lấy dữ liệu' : 'Lấy dữ liệu'}
            icon={<RefreshCcw size={16} />}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ">
        <Input
          withAsterisk
          label="Tên nhà cung cấp"
          {...register('name')}
          error={errors.name?.message}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: Nguyễn Văn A"
        />
        <Input
          label="Mã nhà cung cấp"
          {...register('code')}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: NCC000001 (mã sẽ tự động sinh khi để trống)"
        />
      </div>
      <div className="flex items-center gap-4 ">
        <Input
          label="Số điện thoại"
          {...register('phone', {
            setValueAs: (v: string) => (v === '' ? undefined : v),
          })}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: 0123456789"
        />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...(register('email'),
          {
            setValueAs: (v: string) => (v === '' ? undefined : v),
          })}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: Og3dP@example.com"
        />
      </div>
      <div className="flex items-center gap-4 ">
        <Controller
          name="status"
          control={control}
          render={(filed) => (
            <Select
              {...filed}
              data={supplierStatusOptions}
              label="Trạng thái nhà cung cấp"
              size="sm"
              radius="sm"
              className="flex-1"
              placeholder="Trạng thái nhà cung cấp"
            />
          )}
        />
        <Input
          label="Địa chỉ"
          {...register('address')}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: Tp. HCM, Việt Nam"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-500">Ghi chú</p>

        <Textarea
          {...register('notes')}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ghi chú"
          cols={4}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          title={loading ? 'Đang tạo' : 'Tạo nhà cung cấp'}
          radius="sm"
          size="sm"
        />
      </div>
    </form>
  );
}
