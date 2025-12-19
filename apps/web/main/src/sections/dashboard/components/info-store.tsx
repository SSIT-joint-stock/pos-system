'use client';
import useStore from '../../../hooks/store/use-store';
import api from '../../../libs/axios';
import { useEffect, useState } from 'react';
import { Textarea } from '@mantine/core';
import { Button, Input, Loading, Select } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Communes, Province } from '@repo/design-system/types';
import { ApiResponse } from '@repo/types/response';
import { useAtomValue } from 'jotai';
import { Clock, Info, MapPin, MapPinPlusIcon, Phone, Store } from 'lucide-react';
import { Controller } from 'react-hook-form';

export function InfoStore() {
  const [provinces, setProvinces] = useState<Province[]>();
  const [communes, setCommunes] = useState<Communes[]>();
  const [provinceCode, setProvinceCode] = useState<string>('');
  // const [isEdit, setIsEdit] = useState<boolean>(true);
  const currentStore = useAtomValue(currentStoreAtom);
  const {
    store,
    loading,
    updateStore,
    updateStoreForm: { register, reset, handleSubmit, getValues, control },
    getStoreDetail,
  } = useStore();
  useEffect(() => {
    if (!currentStore?.id) return;
    getStoreDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id]);
  useEffect(() => {
    if (store) {
      reset({
        name: store.name || '',
        description: store.description || '',
        phone_number: store.phone_number || '',
        address: store.address || '',
        city: store.city || '',
        state: store.state || '',
        business_hour: store.business_hour || '',
      });
    }
    // Fetch communes ngay nếu có city
    if (store?.city) {
      setProvinceCode(store.city);
    }
  }, [store, reset]);

  useEffect(() => {
    const handleGetProvinces = async () => {
      const res = await api.get<ApiResponse>('/common/provinces-vn');
      if (res.data.success) {
        setProvinces(res.data?.data?.provinces);
      }
    };

    handleGetProvinces();
  }, []);
  useEffect(() => {
    if (!provinceCode) return;
    const handleGetCommunes = async () => {
      const res = await api.get<ApiResponse>(`/common/communes/${provinceCode}`);
      if (res.data.success) {
        setCommunes(res.data?.data?.communes);
      }
    };
    handleGetCommunes();
  }, [provinceCode]);

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-semibold text-pos-blue-500 border-b-2 pb-1 border-b-pos-blue-500 w-fit">
        Thông tin cửa hàng
      </h1>
      <form
        onSubmit={handleSubmit(async () => {
          await updateStore(getValues());
          // setIsEdit(true);
        })}
        className="w-full space-y-4"
        action=""
      >
        <div className="flex items-center w-full gap-4">
          <Input
            {...register('name')}
            // disabled={isEdit === true}
            // variant={isEdit === true ? 'filled' : 'default'}
            name="name"
            placeholder="Tên cửa hàng"
            rightSection={<Store size={18} />}
            className="flex-1"
            withAsterisk
            label="Tên cửa hàng"
            size="md"
            radius="sm"
          />
          <Input
            placeholder="Nhập hotline cửa hàng"
            // variant={isEdit === true ? 'filled' : 'default'}
            // disabled={isEdit === true}
            rightSection={<Phone size={18} />}
            {...register('phone_number')}
            className="flex-1"
            label="Hotline cửa hàng"
            size="md"
            radius="sm"
          />
        </div>
        <div className="flex items-center w-full gap-4">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                // disabled={isEdit === true}
                // variant={isEdit === true ? 'filled' : 'default'}
                data={
                  provinces?.map((item) => ({
                    label: item.name,
                    value: item.code,
                  })) ?? []
                }
                onChange={(value) => {
                  field.onChange(value);
                  setProvinceCode(value || '');
                }}
                placeholder="Chọn tỉnh/thành phố"
                position="bottom"
                searchable
                clearable
                className="flex-1"
                label="Tỉnh/Thành phố"
                rightSection={<MapPinPlusIcon size={18} />}
                size="md"
                radius="sm"
              />
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                // disabled={isEdit === true}
                // variant={isEdit === true ? 'filled' : 'default'}
                data={
                  communes?.map((item) => ({
                    label: item.name,
                    value: item.code,
                  })) ?? []
                }
                placeholder="Chọn phường/xã"
                position="bottom"
                searchable
                clearable
                className="flex-1"
                label="Phường/Xã"
                rightSection={<MapPinPlusIcon size={18} />}
                size="md"
                radius="sm"
              />
            )}
          />
        </div>
        <div className="flex items-center w-full gap-4">
          <Input
            {...register('address')}
            // variant={isEdit === true ? 'filled' : 'default'}
            // disabled={isEdit === true}
            className="flex-1"
            size="md"
            radius="sm"
            label="Địa chỉ"
            rightSection={<MapPin size={18} />}
          />
          <Input
            {...register('business_hour')}
            // variant={isEdit === true ? 'filled' : 'default'}
            // disabled={isEdit === true}
            className="flex-1"
            size="md"
            radius="sm"
            placeholder="08:00 - 24:00"
            rightSection={<Clock size={18} />}
            label="Giờ hoạt động"
          />
        </div>
        <Textarea
          {...register('description')}
          // disabled={isEdit === true}
          // variant={isEdit === true ? 'filled' : 'default'}
          rightSection={<Info size={18} />}
          radius={'sm'}
          size="md"
          label={<span className="text-sm text-gray-500">Mô tả cửa hàng</span>}
        />
        <div className="flex items-center justify-end gap-3">
          {/* <Button
            disabled={isEdit === false}
            onClick={() => setIsEdit(false)}
            type="button"
            title="Sửa"
            size="sm"
            variant="light"
          /> */}
          <Button
            disabled={loading}
            type="submit"
            title={loading ? <Loading /> : 'Cập nhật'}
            size="sm"
          />
        </div>
      </form>
    </div>
  );
}
