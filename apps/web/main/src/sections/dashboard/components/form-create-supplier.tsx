/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Textarea } from '@mantine/core';
import { Button, Input, Select } from '@repo/design-system/components/ui';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Supplier } from '@repo/design-system/types';
import { RefreshCcw } from 'lucide-react';
import React, { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useSupplier } from '../../../hooks/suplier/use-supplier';
import {
  CreateSupplierInput,
  UpdateSupplierInput,
} from '../../../schemas/supplier/supplier.schema';
import { supplierStatusOptions } from '../view';

export function FormCreateSupplier({
  setIsOpenModal,
  onFetchNewData,
  setIsEditForm,
  setOpenViewModal,
  isEditForm,
  selectedSupplier,
}: {
  isOpenModal?: boolean;
  isEditForm?: boolean;
  selectedSupplier?: Supplier;
  setOpenViewModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditForm?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModal?: (isOpenModal: boolean) => void;
  onFetchNewData?: () => void;
}) {
  const {
    supplierForm: {
      register: createRegister,
      control: createControl,
      formState: { errors: createErrors },
      handleSubmit: createHandleSubmit,
      getValues,
      setValue,
    },
    loading,
    supplierInfo,
    updateSupplierForm: {
      register: updateRegister,
      reset,
      control: updateControl,
      formState: { errors: updateErrors },
      handleSubmit: updateHandleSubmit,
    },
    getSupplier,
    updateSupplier,
    getSupplierByTaxCode,
    createSupplier,
  } = useSupplier();
  const { showErrorToast, showSuccessToast } = useToast();
  const handleCreate = async (data: CreateSupplierInput) => {
    const success = await createSupplier(data);
    if (success) {
      setIsOpenModal?.(false);
      onFetchNewData?.();
    }
  };
  const handleUpdate = async (data: UpdateSupplierInput) => {
    const success = await updateSupplier(data, selectedSupplier?.id || '');
    if (success) {
      setOpenViewModal?.(false);
      onFetchNewData?.();
      setIsEditForm?.(false);
    }
  };

  useEffect(() => {
    if (isEditForm && selectedSupplier) {
      getSupplier(selectedSupplier.id);
    }
  }, [isEditForm, selectedSupplier]);
  useEffect(() => {
    if (isEditForm && supplierInfo) {
      reset({
        name: supplierInfo.name || '',
        phone: supplierInfo.phone || '',
        email: supplierInfo.email || '',
        address: supplierInfo.address || '',
        // bank_account: supplierInfo.bank_account || '',
        tax_code: supplierInfo.tax_code || '',
        code: supplierInfo.code || '',
        notes: supplierInfo.notes || '',
        status: supplierInfo.status || '',
      });
    }
  }, [isEditForm, reset, supplierInfo]);

  return (
    <form
      onSubmit={isEditForm ? updateHandleSubmit(handleUpdate) : createHandleSubmit(handleCreate)}
      className="space-y-6 "
    >
      <div className="space-y-1">
        <p className="text-sm text-gray-500">Mã số thuế</p>
        <div className="flex items-center gap-4">
          <Input
            {...(isEditForm ? updateRegister('tax_code') : createRegister('tax_code'))}
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
      <div className="flex  gap-4 ">
        <Input
          withAsterisk
          label="Tên nhà cung cấp"
          {...(isEditForm ? updateRegister('name') : createRegister('name'))}
          error={createErrors.name?.message}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: Nguyễn Văn A"
        />
        <Input
          label="Mã nhà cung cấp"
          {...(isEditForm ? updateRegister('code') : createRegister('code'))}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: NCC000001 (mã sẽ tự động sinh khi để trống)"
        />
      </div>
      <div className="flex items-center gap-4 ">
        <Input
          label="Số điện thoại"
          {...(isEditForm
            ? updateRegister('phone', {
                setValueAs: (v: string) => (v === '' ? undefined : v),
              })
            : createRegister('phone', {
                setValueAs: (v: string) => (v === '' ? undefined : v),
              }))}
          error={createErrors.phone?.message}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: 0123456789"
        />
        <Input
          label="Email"
          type="email"
          error={isEditForm ? updateErrors.email?.message : createErrors.email?.message}
          {...(isEditForm
            ? updateRegister('email', {
                setValueAs: (v: string) => (v === '' ? undefined : v),
              })
            : createRegister('email', {
                setValueAs: (v: string) => (v === '' ? undefined : v),
              }))}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: Og3dP@example.com"
        />
      </div>
      <div className="flex items-center gap-4 ">
        <Controller
          name="status"
          control={
            (isEditForm ? updateControl : createControl) as Control<
              CreateSupplierInput | UpdateSupplierInput
            >
          }
          render={({ field }) => (
            <Select
              {...field}
              data={supplierStatusOptions}
              label="Trạng thái nhà cung cấp"
              size="sm"
              radius="sm"
              className="flex-1"
              placeholder="Chọn trạng thái"
            />
          )}
        />

        <Input
          label="Địa chỉ"
          {...(isEditForm ? updateRegister('address') : createRegister('address'))}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ví dụ: Tp. HCM, Việt Nam"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-500">Ghi chú</p>

        <Textarea
          {...(isEditForm ? updateRegister('notes') : createRegister('notes'))}
          size="sm"
          radius="sm"
          className="flex-1"
          placeholder="Ghi chú"
          cols={4}
        />
      </div>
      <div className="flex justify-end items-center gap-4">
        <Button
          type="button"
          title="Hủy bỏ"
          onClick={() => {
            reset();
            setOpenViewModal?.(false);
          }}
          variant="outline"
          radius="sm"
          size="sm"
        />
        <Button
          type="submit"
          disabled={loading}
          title={
            loading ? 'Đang tạo' : <>{isEditForm ? 'Cập nhật thông tin' : 'Tạo nhà cung cấp'}</>
          }
          radius="sm"
          size="sm"
        />
      </div>
    </form>
  );
}
