'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select } from '@repo/design-system/components/ui';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { BankInfo, CurrentBankInfo } from '@repo/design-system/types';
import { ApiResponse } from '@repo/types/response';
import { useAtomValue, useSetAtom } from 'jotai';
import { QrCode as QrCodeIC } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useStore from '../../../hooks/store/use-store';
import api from '../../../libs/axios';
import {
  ConfigInfoPayment,
  ConfigInfoPaymentInput,
} from '../../../schemas/info-payment/info-payment.schema';
import QrCode from './qr-code';

export function InfoConfigPayment({
  tab,
  isModal = false,
  setIsOpenSettingBank,
}: {
  tab?: string;
  isModal?: boolean;
  setIsOpenSettingBank?: (isOpen: boolean) => void;
}) {
  const [banks, setBanks] = useState<BankInfo[]>([]);
  const [currentBank, setCurrentBank] = useState<CurrentBankInfo | null>(null);
  const [isOpenQrPayment, setIsOpenQrPayment] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const currentStore = useAtomValue(currentStoreAtom);
  const setCurrentStore = useSetAtom(currentStoreAtom);
  const { showSuccessToast } = useToast();
  const configInfoPaymentForm = useForm<ConfigInfoPaymentInput>({
    resolver: zodResolver(ConfigInfoPayment),
  });
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = configInfoPaymentForm;
  const { getStoreDetail } = useStore();

  const handleConfigInfo = async (data: ConfigInfoPaymentInput) => {
    if (!currentStore?.id) return;
    setLoading(true);
    const res = await api.post<ApiResponse>(`/store-payment/${currentStore?.id}`, data);
    if (res?.data.success) {
      showSuccessToast(res.data.message as string);
      setCurrentStore({
        ...currentStore,
        qrPayment: res.data?.data?.bank_qr_image_url as string,
      });
      getStoreDetail();
      setIsOpenSettingBank?.(false);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'payment' || isModal === true) {
      api.get<ApiResponse<{ data: BankInfo[] }>>('/common/banks').then((res) => {
        setBanks(res?.data?.data?.data || []);
      });
    }
  }, [tab, isModal]);
  useEffect(() => {
    if (!currentStore?.id) return;
    api
      .get<ApiResponse>(`/store-payment/${currentStore?.id}`)
      .then((res) => {
        if (res.data.success) setCurrentBank(res.data.data);
      })
      .catch(() => {
        setCurrentBank(null);
      });
  }, [currentStore?.id]);
  useEffect(() => {
    if (currentBank) {
      reset({
        bank_code: currentBank?.bank_code,
        bank_name: currentBank?.bank_name,
        bank_account_name: currentBank?.bank_account_name,
        bank_account_number: currentBank?.bank_account_number,
      });
    }
  }, [currentBank, reset]);

  return (
    <>
      <div className="space-y-12">
        {tab === 'payment' && (
          <div className="flex items-center gap-6">
            <h1
              className={`text-3xl font-semibold text-pos-blue-500 border-b-2 pb-1 border-b-pos-blue-500 w-fit `}
            >
              Thiết lập thanh toán
            </h1>
            <button
              onClick={() => setIsOpenQrPayment(true)}
              className="border border-gray-300 cursor-pointer  p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              <QrCodeIC size={22} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(handleConfigInfo)} className="w-full space-y-6">
          <div className="flex items-center gap-3 w-full ">
            <Controller
              name="bank_code"
              control={configInfoPaymentForm.control}
              render={(filed) => {
                return (
                  <Select
                    {...filed.field}
                    error={errors.bank_code?.message}
                    onChange={(value) => {
                      setValue('bank_name', value as string);
                      filed.field.onChange(value);
                    }}
                    searchable
                    clearable
                    placeholder="Không sử dụng"
                    className="flex-1"
                    data={
                      banks.length > 0
                        ? banks?.map((item) => ({
                            label: item.shortName + ' - ' + item.name,
                            value: item.code,
                          }))
                        : []
                    }
                    label="Ngân hàng"
                    radius="sm"
                    size={isModal ? 'sm' : 'md'}
                    position="bottom"
                  />
                );
              }}
            />

            <Input
              radius="sm"
              size={isModal ? 'sm' : 'md'}
              {...register('bank_name')}
              error={errors.bank_name?.message}
              disabled
              className="flex-1"
              label="Tên ngân hàng hiển thị"
              placeholder="Tên ngân hàng hiện thị trên hóa đơn"
            />
          </div>
          <div className="flex items-center gap-3 w-full">
            <Input
              {...register('bank_account_number')}
              error={errors.bank_account_number?.message}
              radius="sm"
              size={isModal ? 'sm' : 'md'}
              className="flex-1"
              label="Số tài khoản"
              placeholder="Nhập số tài khoản"
            />
            <Input
              {...register('bank_account_name')}
              onChange={(e) => {
                const upper = e.target.value.toUpperCase();
                setValue('bank_account_name', upper, { shouldValidate: true });
              }}
              error={errors.bank_account_name?.message}
              radius="sm"
              size={isModal ? 'sm' : 'md'}
              className="flex-1 "
              label="Tên người thụ hưởng"
              placeholder="Nhập người thụ hưởng"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              type="submit"
              title={loading ? 'Đang cập nhật' : 'Cập nhật'}
              size={isModal ? 'sm' : 'md'}
              radius="sm"
              loading={loading}
            />
          </div>
        </form>
      </div>
      <QrCode isOpenModalQrCode={isOpenQrPayment} setIsOpenQrCode={setIsOpenQrPayment} />
    </>
  );
}
