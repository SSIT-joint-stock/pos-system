'use client';
import { Button, Input } from '@repo/design-system/components/ui';
import { Customer } from '@repo/design-system/types';
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../../../schemas/customer/customer.schema';

interface FormCreateCustomerProps {
  createCustomer?: (data: CreateCustomerInput) => Promise<any>;
  updateCustomer?: (id: string, data: UpdateCustomerInput) => Promise<any>;
  onSuccess?: () => void;
  setOpenAddModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenEditModal?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCustomer?: Customer;
  isEditForm?: boolean;
  createCustomerForm?: UseFormReturn<CreateCustomerInput>;
  updateCustomerForm?: UseFormReturn<UpdateCustomerInput>;
}
export default function FormCreateCustomer({
  createCustomer,
  onSuccess,
  setOpenAddModal,
  setOpenEditModal,
  updateCustomer,
  createCustomerForm,
  selectedCustomer,
  updateCustomerForm,
  isEditForm = false,
}: FormCreateCustomerProps) {
  const handleSubmitCreate = async (data: CreateCustomerInput) => {
    if (!isEditForm && createCustomer && setOpenAddModal) {
      await createCustomer(data);
      onSuccess?.();
      setOpenAddModal(false);
      createCustomerForm?.reset();
    }
  };
  const handleSubmitUpdate = async (data: UpdateCustomerInput) => {
    if (isEditForm && updateCustomer && selectedCustomer?.id && setOpenEditModal) {
      await updateCustomer(selectedCustomer?.id, data);
      onSuccess?.();
      setOpenEditModal(false);
      updateCustomerForm?.reset();
    }
  };
  useEffect(() => {
    if (isEditForm && selectedCustomer && updateCustomerForm) {
      updateCustomerForm.reset({
        name: selectedCustomer.name || '',
        phone: selectedCustomer.phone || '',
        email: selectedCustomer.email || '',
        address: selectedCustomer.address || '',
        city: selectedCustomer.city || '',
        state: selectedCustomer.state || '',
        zip: selectedCustomer.zip || '',
        country: selectedCustomer.country || '',
      });
    }
  }, [isEditForm, selectedCustomer, updateCustomerForm]);
  return (
    <form
      onSubmit={
        isEditForm
          ? updateCustomerForm?.handleSubmit(handleSubmitUpdate)
          : createCustomerForm?.handleSubmit(handleSubmitCreate)
      }
      className="flex flex-col gap-4"
    >
      <div className="flex gap-3">
        <Input
          withAsterisk={isEditForm ? false : true}
          label="Tên khách hàng"
          {...(isEditForm
            ? updateCustomerForm?.register('name')
            : createCustomerForm?.register('name'))}
          error={createCustomerForm?.formState.errors.name?.message}
          name="name"
          placeholder="Nhập tên khách hàng"
          className="flex-1"
          size="sm"
          radius="sm"
        />
        <Input
          label="Số điện thoại"
          {...(isEditForm
            ? updateCustomerForm?.register('phone')
            : createCustomerForm?.register('phone'))}
          name="phone"
          type="tel"
          placeholder="Nhập số điên thoại"
          className="flex-1"
          onChange={(e) => {
            // Chỉ cho phép số
            const onlyNums = e.target.value.replace(/\D/g, '');
            e.target.value = onlyNums;

            // Đẩy vào react-hook-form
            if (isEditForm) {
              updateCustomerForm?.setValue('phone', onlyNums);
            } else {
              createCustomerForm?.setValue('phone', onlyNums);
            }
          }}
          size="sm"
          radius="sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <Input
          label="Email"
          {...(isEditForm
            ? updateCustomerForm?.register('email')
            : createCustomerForm?.register('email'))}
          name="email"
          placeholder="Nhập email khách hàng"
          className="flex-1"
          size="sm"
          radius="sm"
        />
        <Input
          label="Địa chỉ"
          {...(isEditForm
            ? updateCustomerForm?.register('address')
            : createCustomerForm?.register('address'))}
          name="address"
          placeholder="Nhập địa chỉ khách hàng"
          className="flex-1"
          size="sm"
          radius="sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <Input
          label="Thành phố"
          {...(isEditForm
            ? updateCustomerForm?.register('city')
            : createCustomerForm?.register('city'))}
          name="city"
          placeholder="Nhập thành phố"
          className="flex-1"
          size="sm"
          radius="sm"
        />
        <Input
          label="Mã zip"
          {...(isEditForm
            ? updateCustomerForm?.register('zip')
            : createCustomerForm?.register('zip'))}
          name="zip"
          placeholder="Nhập mã zip"
          className="flex-1"
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, '');
            e.target.value = onlyNums;

            if (isEditForm) {
              updateCustomerForm?.setValue('zip', onlyNums);
            } else {
              createCustomerForm?.setValue('zip', onlyNums);
            }
          }}
          size="sm"
          radius="sm"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button
          size="sm"
          radius="sm"
          disabled={
            isEditForm
              ? updateCustomerForm?.formState.isSubmitting
              : createCustomerForm?.formState.isSubmitting
          }
          type="submit"
          title={isEditForm ? 'Sửa khách hàng' : 'Tạo khách hàng'}
        />
      </div>
    </form>
  );
}
