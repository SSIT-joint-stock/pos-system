import { DateInput } from '@mantine/dates';
import { Button, Input, Modal, NumberInput, Select } from '@repo/design-system/components/ui';
import { IOrderReturn } from '@repo/design-system/types';
import { Calendar } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { paymentMethods } from '../../../../constants/status';
import { AcceptPaymentReturn } from '../../../../schemas/order/order-return.schema';
import { formatCurrency } from '../../../../utils';

export function FormAcceptPayment({
  setIsOpenModalAcceptPayment,
  acceptPaymentReturn,
  getReturnOrder,
  orderReturn,
  isOpenModalAcceptPayment,
  acceptPaymentForm,
}: {
  setIsOpenModalAcceptPayment: React.Dispatch<React.SetStateAction<boolean>>;
  acceptPaymentReturn: (id: string, data: AcceptPaymentReturn) => Promise<boolean>;
  getReturnOrder: (returnId: string) => Promise<void>;
  isOpenModalAcceptPayment: boolean;
  orderReturn: IOrderReturn;
  acceptPaymentForm: UseFormReturn<AcceptPaymentReturn>;
}) {
  const {
    control,
    setValue,
    register,
    handleSubmit,

    formState: { errors },
  } = acceptPaymentForm;
  useEffect(() => {
    if (orderReturn?.suggest_total) {
      setValue('amount', Number(orderReturn.suggest_total), {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderReturn?.suggest_total]);
  return (
    <Modal
      size="xl"
      title={<span className="text-lg font-semibold">Xác nhận thanh toán</span>}
      opened={isOpenModalAcceptPayment}
      onClose={() => setIsOpenModalAcceptPayment(false)}
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          const success = await acceptPaymentReturn(orderReturn.id, data);
          console.log(success);
          if (success) {
            setIsOpenModalAcceptPayment(false);
            getReturnOrder(orderReturn.id);
            acceptPaymentForm.reset();
          }
        })}
      >
        <div className="mt-4 space-y-5">
          <div className="flex gap-2">
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

            <div className="flex-1">
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <NumberInput
                      {...field}
                      value={field.value ?? Number(orderReturn?.suggest_total) ?? 0}
                      onChange={(value) => field.onChange(Number(value) || 0)}
                      min={0}
                      max={Number(orderReturn?.suggest_total)}
                      size={'sm'}
                      radius="sm"
                      placeholder="Số tiền thanh toán"
                      label={'Số tiền thanh toán'}
                    />
                    <span className="text-xs text-gray-500">
                      Hoàn tối đa: {formatCurrency(orderReturn?.suggest_total || 0)}
                    </span>
                  </div>
                )}
              />
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
            <Button title="Xác nhận" type="submit" size="sm" radius="sm" />
          </div>
        </div>
      </form>
    </Modal>
  );
}
