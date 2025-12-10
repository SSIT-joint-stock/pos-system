import { formatCurrency } from '../../../../../main/src/utils';
import { Drawer, Switch } from '@mantine/core';
import { Button, Checkbox, Input, Select } from '@repo/design-system/components/ui';
import React, { ChangeEvent } from 'react';
import { selectedVariant } from '../view';
import { payment_method } from '../../../constants/method';

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
  isCustomerPayFull,
  totalPrice,
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
  totalPrice: number;
  loading: boolean;
}) {
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
                  value={priceCustomerPay.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  placeholder="Số tiền khách trả"
                  type="text"
                  style={{ flex: 1 }}
                  onFocus={() => setIsFocusedInputPriceCustomerPay(true)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPriceCustomerPay(value);
                    if (totalPrice > Number(value)) {
                      setIsCustomerPayFull(false);
                    } else if (totalPrice <= Number(value) || totalPrice - Number(value) === 0) {
                      setIsCustomerPayFull(true);
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    setIsCustomerPayFull(true);
                    setPriceCustomerPay(String(totalPrice));
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
                    setPriceCustomerPay(String(totalPrice));
                  }
                }}
                size="sm"
                radius="sm"
                label="Khách ghi nợ"
              />
              <span
                className={`text-sm  ${isCustomerPayFull && Number(priceCustomerPay) >= totalPrice ? 'text-green-500 font-medium' : 'text-red-500 font-semibold'}`}
              >
                {isCustomerPayFull && totalPrice - Number(priceCustomerPay || 0) <= 0
                  ? 'Tiền thừa trả lại khách: ' +
                    formatCurrency(Number(priceCustomerPay || 0) - totalPrice)
                  : `Khách chưa trả đủ: ${formatCurrency(totalPrice - Number(priceCustomerPay || 0))}`}
              </span>
            </div>
            <hr className="border-b border-b-white border-t-gray-400 " />
            <div className="grid grid-cols-2 justify-between">
              <span> Tổng tiền trước thuế </span>{' '}
              <span className="text-right">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="grid grid-cols-2 justify-between">
              <span> Thuế đơn hàng </span>
              <span className="text-right">0 %</span>
            </div>
            <div className="grid grid-cols-2 justify-between">
              <span> Tổng tiền thuế </span>
              <span className="text-right">{formatCurrency(0)}</span>
            </div>
            <div className="grid grid-cols-2 justify-between">
              <span className="text-pos-blue-500 font-semibold text-lg">
                {' '}
                Tổng tiền thanh toán{' '}
              </span>
              <span className="text-right text-pos-blue-500 font-semibold text-lg">
                {formatCurrency(totalPrice)}
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
    </>
  );
}
