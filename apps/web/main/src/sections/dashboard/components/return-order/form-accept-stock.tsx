import { Button, Modal, NumberInput, Table } from '@repo/design-system/components/ui';
import { IOrderReturn } from '@repo/design-system/types';
import { useEffect } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { AcceptQuantity } from '../../../../schemas/order/order-return.schema';

export function FormAcceptStock({
  isOpen,
  orderReturn,
  acceptQuantityForm,
  acceptStockQuantity,
  onClose,
  getReturnOrder,
}: {
  isOpen: boolean;
  orderReturn: IOrderReturn | null;
  acceptQuantityForm: UseFormReturn<AcceptQuantity>;
  acceptStockQuantity: (id: string, data: AcceptQuantity) => Promise<boolean>;
  onClose: () => void;
  getReturnOrder: (returnId: string) => Promise<void>;
}) {
  const { handleSubmit, control } = acceptQuantityForm;
  const { fields, append } = useFieldArray({
    control,
    name: 'items',
  });
  useEffect(() => {
    if (!isOpen) return;
    if (!orderReturn) return;
    acceptQuantityForm.reset();
    fields.splice(0, fields.length);
    orderReturn.items.forEach((item) => {
      append({
        order_return_item_id: item.id,
        quantity: item.quantity - item.quantity_refunded,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orderReturn]);
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="60%"
      title={<p className="text-base font-semibold">Xác nhận nhập kho</p>}
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          if (!orderReturn) return;
          const success = await acceptStockQuantity(orderReturn?.id, data);
          if (success) {
            onClose();
            getReturnOrder(orderReturn?.id);
          }
        })}
      >
        {orderReturn && (
          <Table
            hasPadding={false}
            hasPagination={false}
            tableHeaders={['Sản phẩm', 'Số lượng nhận', 'Đã nhập kho']}
            data={fields || []}
            renderRow={(data, index) => {
              const item = orderReturn.items.find((it) => it.id === data.order_return_item_id);

              if (!item) return null;
              console.log(item);
              const maxQuantityOrder = item?.quantity - item?.quantity_refunded;
              return (
                <>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold"> {item?.item_name || 'N/A'}</span>

                      <span className="text-sm font-semibold text-pos-blue-500">
                        {item.variant.sku}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-1">
                          <NumberInput
                            {...field}
                            value={field.value ?? ''}
                            onChange={(val) => {
                              if (val === '' || val === null) {
                                field.onChange(0);
                                return;
                              }
                              const num = Number(val);
                              if (num > maxQuantityOrder) {
                                field.onChange(maxQuantityOrder);
                                return;
                              }
                              field.onChange(num);
                            }}
                            min={0}
                            max={maxQuantityOrder}
                            hideControls
                            placeholder="0"
                            size="sm"
                            radius="sm"
                            className="w-32"
                          />
                          <p className="text-xs text-gray-500">Có thể trả: {maxQuantityOrder}</p>
                        </div>
                      )}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                    {item?.quantity_refunded || 0}
                  </td>
                </>
              );
            }}
          />
        )}
        <div className="flex items-center justify-end mt-4 gap-2">
          <Button
            size="sm"
            radius="sm"
            variant="outline"
            title="Hủy"
            onClick={onClose}
            type="button"
          />

          <Button size="sm" radius="sm" title="Xác nhận" type="submit" />
        </div>
      </form>
    </Modal>
  );
}
