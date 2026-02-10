/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Drawer, Switch, Tooltip } from '@mantine/core';
import { Button, Checkbox, Input, Loading, Modal } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState, useTransition } from 'react';
import { payment_method } from '../../../constants/method';
import useStore from '../../../hooks/store/use-store';
import { InfoConfigPayment } from '../../../sections/dashboard/components/info-config-payment';
import QrCode from '../../../sections/dashboard/components/qr-code';
import { formatCurrency } from '../../../utils';
import { selectedVariant } from '../view';

export default function BillOrder({
  selectedPaymentMethod,
  setChangePaymentMethods,
  setOpenModalOrder,
  setPriceCustomerPay,
  setIsCustomerPayFull,
  handleCreateOrder,
  setIsFocusedInputPriceCustomerPay,
  openModalOrder,

  priceCustomerPay,
  isCustomerPayFull = true,
  summary,
  loading,
}: {
  selectedPaymentMethod: payment_method | null;
  setChangePaymentMethods: React.Dispatch<React.SetStateAction<payment_method | null>>;
  setOpenModalOrder: React.Dispatch<React.SetStateAction<boolean>>;
  setPriceCustomerPay: React.Dispatch<React.SetStateAction<string>>;
  setIsCustomerPayFull: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVariants: React.Dispatch<React.SetStateAction<selectedVariant[]>>;
  setIsFocusedInputPriceCustomerPay: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateOrder: () => void;
  openModalOrder: boolean;

  priceCustomerPay: string;
  isCustomerPayFull: boolean;
  summary: {
    total: number;
    subTotal: number;
    taxAmount: number;
  };
  loading: boolean;
}) {
  const [isOpenSettingBank, setIsOpenSettingBank] = useState<boolean>(false);
  const [isOpenQrCode, setIsOpenQrCode] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { store, getStoreDetail } = useStore();
  const currentStore = useAtomValue(currentStoreAtom);
  function getJumpPayments(total: number, count = 5): number[] {
    const tiers = [
      1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000,
      10000000,
    ];

    if (total >= tiers[tiers.length - 1]) {
      const base = Math.ceil(total / 1_000_000) * 1_000_000;
      return Array.from({ length: count }, (_, i) => base * (i + 1));
    }

    const startIndex = tiers.findIndex((v) => v >= total);

    return tiers.slice(startIndex, startIndex + count);
  }
  const quickPayments = React.useMemo(() => {
    return getJumpPayments(summary.total);
  }, [summary.total]);

  useEffect(() => {
    if (!currentStore?.id) return;
    if (openModalOrder) {
      startTransition(() => {
        getStoreDetail();
      });
    }
  }, [currentStore, openModalOrder]);

  return (
    <>
      <Drawer
        title={<p className="text-base font-semibold">Xác nhận thanh toán</p>}
        opened={openModalOrder}
        styles={{
          body: {
            height: '92%',
            paddingBottom: 0,
          },
        }}
        size="lg"
        position="right"
        onClose={() => setOpenModalOrder(false)}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-600">Phương thức thanh toán</span>
              <div className="flex gap-2">
                <Button
                  title="Tiền mặt"
                  variant={selectedPaymentMethod === payment_method.CASH ? 'filled' : 'outline'}
                  onClick={() => setChangePaymentMethods(payment_method.CASH)}
                  size="sm"
                  radius="xl"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Chuyển khoản"
                  variant={
                    selectedPaymentMethod === payment_method.BANK_TRANSFER ? 'filled' : 'outline'
                  }
                  onClick={() => setChangePaymentMethods(payment_method.BANK_TRANSFER)}
                  size="sm"
                  radius="xl"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm  text-gray-600"> Số tiền khách trả </span>

              <Input
                radius="sm"
                size="sm"
                value={priceCustomerPay.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                placeholder="Số tiền khách trả"
                type="text"
                // defaultValue={String(summary?.total)}
                style={{ flex: 1 }}
                onFocus={() => setIsFocusedInputPriceCustomerPay(true)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPriceCustomerPay(value);
                  if (summary.total > Number(value)) {
                    setIsCustomerPayFull(false);
                  } else if (
                    summary?.total <= Number(value) ||
                    summary?.total - Number(value) === 0
                  ) {
                    setIsCustomerPayFull(true);
                  }
                }}
              />
              <div className="flex justify-end">
                <Button
                  radius="sm"
                  size="sm"
                  onClick={() => {
                    setIsCustomerPayFull(true);
                    setPriceCustomerPay(String(summary?.total));
                  }}
                  title="Trả đủ"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Checkbox
                checked={!isCustomerPayFull || priceCustomerPay === '0'}
                onChange={() => {
                  setIsCustomerPayFull((prev) => !prev);
                  if (isCustomerPayFull) {
                    setPriceCustomerPay('0');
                  } else {
                    setPriceCustomerPay(String(summary?.total));
                  }
                }}
                size="sm"
                radius="sm"
                label={
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-semibold">Khách ghi nợ</span>
                  </div>
                }
              />
              <span
                className={`text-sm  ${isCustomerPayFull && Number(priceCustomerPay) >= summary?.total ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}
              >
                {isCustomerPayFull && summary?.total - Number(priceCustomerPay || 0) <= 0
                  ? 'Tiền thừa trả lại khách: ' +
                    formatCurrency(Number(priceCustomerPay || 0) - summary?.total)
                  : `Khách chưa trả đủ: ${formatCurrency(summary?.total - Number(priceCustomerPay || 0))}`}
              </span>
            </div>
            {selectedPaymentMethod === payment_method.CASH && quickPayments.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5">
                {quickPayments.map((amount) => (
                  <div
                    key={amount}
                    onClick={() => {
                      setPriceCustomerPay(String(amount));
                      setIsCustomerPayFull(true);
                    }}
                    className={`bg-gray-50 text-gray-500 rounded-full p-2
          text-center font-semibold cursor-pointer
          hover:bg-pos-blue-50 hover:text-pos-blue-500 ${Number(priceCustomerPay) === amount && 'bg-pos-blue-50 text-pos-blue-500'}`}
                  >
                    {formatCurrency(amount)}
                  </div>
                ))}
              </div>
            )}

            {selectedPaymentMethod === payment_method.BANK_TRANSFER && (
              <div className="flex items-center justify-center ">
                {isPending ? (
                  <p className="text-center text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Loading color="#3b82f6" size="sm" />
                    Đang lấy thông tin mã qr
                  </p>
                ) : store?.store_payment &&
                  store.store_payment.length > 0 &&
                  store.store_payment[0].bank_qr_image_url ? (
                  <Tooltip label="Mở rộng" position="bottom">
                    <div
                      onClick={() => setIsOpenQrCode(true)}
                      className="flex flex-col items-center gap-2 p-2.5 rounded-md border border-gray-200  hover:cursor-pointer  hover:border-gray-300 transition-all duration-300"
                    >
                      <p className="text-sm font-medium text-gray-700">Quét mã để thanh toán</p>
                      <Image
                        src={`${store?.store_payment[0].bank_qr_image_url}&amount=${priceCustomerPay}`}
                        alt="QR Payment"
                        width={200}
                        height={200}
                        className="rounded-lg border"
                        unoptimized
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <div className="text-center  text-base  ">
                    <span className="font-semibold"> Chưa cấu hình QR thanh toán.</span>
                    <div>
                      <span className="text-sm text-gray-500">
                        {' '}
                        Vui lòng cấu hình trong cài đặt cửa hàng hoặc{' '}
                      </span>
                      <button onClick={() => setIsOpenSettingBank(true)} className="font-medium">
                        <span className="text-sm  font-semibold hover:underline text-pos-blue-500 cursor-pointer">
                          cấu hình tài khoản thụ hưởng
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <hr className="border-b border-b-white border-t-gray-400 " />
            <div className="grid grid-cols-2 justify-between">
              <span className="text-base text-gray-800 font-semibold"> Tổng tiền trước thuế </span>{' '}
              <span className="text-right font-semibold">{formatCurrency(summary?.subTotal)}</span>
            </div>
            <div className="grid grid-cols-2 justify-between">
              <span className="text-base text-gray-800 font-semibold"> Thuế đơn hàng </span>
              <span className="text-right font-semibold">{formatCurrency(summary?.taxAmount)}</span>
            </div>

            <div className="grid grid-cols-2 justify-between">
              <span className="text-pos-blue-500 font-semibold text-lg">
                {' '}
                Tổng tiền thanh toán{' '}
              </span>
              <span className="text-right text-pos-blue-500 font-semibold text-lg">
                {formatCurrency(summary?.total)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-800">Tự động in hóa đơn khi thanh toán</p>
              <Switch />
            </div>
          </div>
          <div className="flex items-center ">
            <Button
              loading={loading}
              onClick={() => {
                handleCreateOrder();
              }}
              radius="sm"
              title="Thanh toán"
              style={{ flex: 1 }}
            />
          </div>
        </div>
      </Drawer>
      <Modal
        title={<span className="text-base font-semibold">Cấu hình tài khoản thụ hưởng</span>}
        size="xl"
        opened={isOpenSettingBank}
        onClose={() => setIsOpenSettingBank(false)}
      >
        <InfoConfigPayment
          isModal={isOpenSettingBank}
          setIsOpenSettingBank={setIsOpenSettingBank}
        />
      </Modal>
      <QrCode
        isOpenModalQrCode={isOpenQrCode}
        setIsOpenQrCode={setIsOpenQrCode}
        customer_pay_amount={Number(priceCustomerPay)}
      />
    </>
  );
}
