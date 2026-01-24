import { DateInput } from '@mantine/dates';
import { Button, Input, Modal, NumberInput, Select } from '@repo/design-system/components/ui';
import { PurchaseReturn } from '@repo/design-system/types';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import { Calendar } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { paymentMethods } from '../../../../constants/status';
import { usePurchase } from '../../../../hooks/purchase/use-purchase';
import { formatCurrency } from '../../../../utils';

export default function FormAccpetImportPayment({
  setIsOpenModalAcceptPayment,
  getPurchaseOrder,
  isOpenModalAcceptPayment,
  purchaseOrder,
}: {
  setIsOpenModalAcceptPayment: React.Dispatch<React.SetStateAction<boolean>>;
  getPurchaseOrder?: (id: string) => void;
  getPurchaseReturn?: (id: string) => void;
  isOpenModalAcceptPayment: boolean;
  purchaseOrder?: PurchaseOrder;
  purchaseReturn?: PurchaseReturn;
}) {
  const [isFocusInput, setIsFocusInput] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);
  const {
    acceptPaymentPurchase,
    formAcceptPayment: {
      control,
      formState: { errors },
      watch,
      register,
      handleSubmit,
    },
    loading,
  } = usePurchase();

  const unitCost = watch('unit_cost');

  return (
    <Modal
      size="xl"
      title={<span className="text-lg font-semibold">Xác nhận thanh toán</span>}
      opened={isOpenModalAcceptPayment}
      onClose={() => setIsOpenModalAcceptPayment(false)}
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          if (purchaseOrder) {
            const success = await acceptPaymentPurchase?.(purchaseOrder?.id, data);
            if (success) {
              setIsOpenModalAcceptPayment(false);
              getPurchaseOrder?.(purchaseOrder?.id);
            }
          }
        })}
      >
        <div className="mt-4 space-y-5" ref={ref}>
          <div className="flex gap-2">
            {
              <Controller
                name="payment_method"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    error={errors.payment_method && 'Chọn phương thức thanh toán'}
                    label="Phương thức thanh toán"
                    data={paymentMethods}
                    position="bottom"
                    placeholder="Chọn phương thức thanh toán"
                    size="sm"
                    className="flex-1"
                    radius="sm"
                  />
                )}
              />
            }
            <div className="flex-1">
              {isFocusInput ? (
                <Controller
                  name="unit_cost"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      size="sm"
                      max={Number(purchaseOrder?.total)}
                      radius="sm"
                      autoFocus
                      // value={field.value ?? purchaseOrder?.total ?? 0}
                      readOnly
                      defaultValue={purchaseOrder?.total || 0}
                      // className="flex-1"
                      onBlur={() => setIsFocusInput(false)}
                      placeholder="Số tiền thanh toán"
                      label={'Số tiền thanh toán'}
                    />
                  )}
                />
              ) : (
                <Input
                  size="sm"
                  defaultValue={
                    formatCurrency(
                      unitCost === undefined ? purchaseOrder?.total : String(unitCost)
                    ) || 0
                  }
                  radius="sm"
                  readOnly
                  onFocus={() => setIsFocusInput(true)}
                  className="flex-1"
                  placeholder="Số tiền thanh toán"
                  label={'Số tiền thanh toán'}
                />
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Controller
              name="payment_date"
              control={control}
              render={({ field }) => (
                <DateInput
                  {...field}
                  size="sm"
                  radius="sm"
                  rightSection={<Calendar size={16} />}
                  className="flex-1"
                  clearable
                  maxDate={new Date()}
                  valueFormat="YYYY-MM-DD"
                  defaultValue={new Date()}
                  placeholder="Ngày thanh toán"
                  label={<span className="text-sm text-gray-500">Ngày ghi nhận</span>}
                />
              )}
            />
            <Input
              {...register('reference')}
              size="sm"
              radius="sm"
              placeholder="Nhập mã tham chiếu"
              label="Tham chiếu"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button
              title="Hủy"
              onClick={() => setIsOpenModalAcceptPayment(false)}
              size="sm"
              type="button"
              radius="sm"
              variant="outline"
            />
            <Button loading={loading} title="Xác nhận" type="submit" size="sm" radius="sm" />
          </div>
        </div>
      </form>
    </Modal>
  );
}
