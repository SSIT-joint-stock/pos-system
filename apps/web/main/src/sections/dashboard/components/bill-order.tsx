'use client';
import { Drawer, Switch } from '@mantine/core';
import { Button, Checkbox, Input, Modal, Select } from '@repo/design-system/components/ui';
import React, { ChangeEvent, useState } from 'react';
import { formatCurrency } from '../../../../../main/src/utils';
import { payment_method } from '../../../constants/method';
import { InfoConfigPayment } from '../../../sections/dashboard/components/info-config-payment';
import { selectedVariant } from '../view';

export default function BillOrder({
  setChangePaymentMethods,
  setOpenModalOrder,
  setPriceCustomerPay,
  setIsCustomerPayFull,
  handleCreateOrder,
  setIsFocusedInputPriceCustomerPay,
  openModalOrder,
  paymentMethods,
  priceCustomerPay,
  isCustomerPayFull = true,
  summary,
  loading,
}: {
  setChangePaymentMethods: React.Dispatch<React.SetStateAction<payment_method | null>>;
  setOpenModalOrder: React.Dispatch<React.SetStateAction<boolean>>;
  setPriceCustomerPay: React.Dispatch<React.SetStateAction<string>>;
  setIsCustomerPayFull: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVariants: React.Dispatch<React.SetStateAction<selectedVariant[]>>;
  setIsFocusedInputPriceCustomerPay: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateOrder: () => void;
  openModalOrder: boolean;
  paymentMethods: { label: string; value: string }[];
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

  return (
    <>
      <Drawer
        title={'Xác nhận thanh toán'}
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
          <div className="flex flex-col gap-4">
            <Select
              name="paymentMethod"
              radius="sm"
              size="sm"
              onChange={(value) => setChangePaymentMethods(value as payment_method)}
              position="bottom"
              label={'Phương thức thanh toán'}
              defaultValue={paymentMethods[0].value}
              data={paymentMethods}
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm  text-gray-500"> Số tiền khách trả </span>
              <div className="flex items-center gap-2 ">
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
              <button
                onClick={() => setIsOpenSettingBank(true)}
                className="text-left hover:underline text-pos-blue-500 mt-2 cursor-pointer w-fit"
              >
                <span className="text-sm  font-semibold">Cấu hình tài khoản thụ hưởng</span>
              </button>
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
                label="Khách ghi nợ"
              />
              <span
                className={`text-sm  ${isCustomerPayFull && Number(priceCustomerPay) >= summary?.total ? 'text-green-500 font-medium' : 'text-red-500 font-semibold'}`}
              >
                {isCustomerPayFull && summary?.total - Number(priceCustomerPay || 0) <= 0
                  ? 'Tiền thừa trả lại khách: ' +
                    formatCurrency(Number(priceCustomerPay || 0) - summary?.total)
                  : `Khách chưa trả đủ: ${formatCurrency(summary?.total - Number(priceCustomerPay || 0))}`}
              </span>
            </div>
            {quickPayments.length > 0 && (
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
            <hr className="border-b border-b-white border-t-gray-400 " />
            <div className="grid grid-cols-2 justify-between">
              <span className="text-base text-gray-800 font-semibold"> Tổng tiền trước thuế </span>{' '}
              <span className="text-right">{formatCurrency(summary?.subTotal)}</span>
            </div>
            <div className="grid grid-cols-2 justify-between">
              <span className="text-base text-gray-800 font-semibold"> Thuế đơn hàng </span>
              <span className="text-right">{formatCurrency(summary?.taxAmount)}</span>
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
    </>
  );
}
