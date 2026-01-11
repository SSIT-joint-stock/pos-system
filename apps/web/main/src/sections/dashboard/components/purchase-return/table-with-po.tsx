import { NumberInput, Textarea, Tooltip } from '@mantine/core';
import { Table } from '@repo/design-system/components/ui';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import { ChevronDown } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import {
  PurchaseReturnItem,
  PurchaseReturnWithPurchaseOrder,
} from '../../../../schemas/purchase-return/purchase-return.schema';
import { formatCurrency, truncateText } from '../../../../utils';
const tableHeaders = ['Tên sản phẩm', 'Đơn vị', 'Số lượng', 'Đơn giá trả', 'Lý do', 'Thành tiền'];

export interface TableWithPoProps {
  loading: boolean;
  fields: PurchaseReturnItem[];
  watchedItems: PurchaseReturnItem[];
  purchaseOrder: PurchaseOrder;
  control: Control<PurchaseReturnWithPurchaseOrder>;
}
export default function TableWithPo({
  loading,
  fields,
  purchaseOrder,
  control,
  watchedItems,
}: TableWithPoProps) {
  return (
    <Table
      hasPadding={false}
      isLoading={loading}
      tableHeaders={tableHeaders}
      data={fields}
      hasPagination={false}
      hasMarginTop={false}
      renderRow={(data, index) => {
        const poItem = purchaseOrder.items[index];
        const item = watchedItems[index];
        const baseUnitCost = Number(poItem?.unit_cost ?? 0);
        const taxPerUnit =
          poItem.tax_amount && poItem.quantity
            ? Number(poItem.tax_amount) / Number(poItem.quantity)
            : 0;

        const discountPerUnit =
          poItem.discount_amount && poItem.quantity
            ? Number(poItem.discount_amount) / Number(poItem.quantity)
            : 0;

        const realUnitCost = baseUnitCost + taxPerUnit - discountPerUnit;
        return (
          <>
            <Tooltip label={poItem?.item_name} position="bottom">
              <td className="px-4 py-2.5 text-sm font-semibold text-blue-600 ">
                {truncateText(poItem?.item_name, 30) || 'N/A'}
              </td>
            </Tooltip>
            <td className="px-4 py-2.5 text-sm font-semibold ">{poItem?.unit || 'N/A'}</td>
            <td className="px-4 py-2.5  ">
              <div className="flex items-center gap-2">
                <Controller
                  name={`items.${index}.quantity`}
                  control={control}
                  rules={{
                    min: 0,
                    max: poItem.quantity,
                  }}
                  render={({ field }) => (
                    <NumberInput
                      value={field.value ?? ''}
                      onChange={(val) => {
                        // Cho phép rỗng khi user xoá
                        if (val === '' || val === null) {
                          field.onChange(null);
                          return;
                        }

                        const num = Number(val);
                        if (num < 0) return;
                        if (num > Number(poItem.quantity)) {
                          field.onChange(poItem.quantity);
                          return;
                        }

                        field.onChange(num);
                      }}
                      onBlur={() => {
                        // Khi blur mà rỗng → set về 0
                        if (field.value === null || field.value === undefined) {
                          field.onChange(0);
                        }
                      }}
                      min={0}
                      max={Number(poItem.quantity)}
                      clampBehavior="strict"
                      allowDecimal={false}
                      hideControls
                      placeholder="0"
                      size="sm"
                      radius="sm"
                      className="w-32"
                    />
                  )}
                />
                <p className="text-sm ">
                  {item?.quantity}/
                  {Number(poItem?.quantity) - Number(poItem?.quantity_returned || 0)} {poItem.unit}
                </p>
              </div>
            </td>
            <td className="px-4 py-2.5 text-sm font-semibold  hover:bg-gray-200 transition-colors duration-200 cursor-pointer rounded-md relative group">
              <span className="flex items-center gap-2">
                {formatCurrency(realUnitCost) || 'N/A'}
                <ChevronDown size={16} />
              </span>
              <div className="absolute top-full mt-1 left-0 w-sm bg-white z-10 shadow rounded-md p-4 space-y-3 hidden group-hover:block">
                <div className="flex items-center justify-between">
                  <span>Giá nhập gốc</span>
                  <span>{formatCurrency(baseUnitCost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Thuế / đơn vị</span>
                  <span>{formatCurrency(taxPerUnit)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chiết khấu / đơn vị</span>
                  <span>- {formatCurrency(discountPerUnit)}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between font-semibold border-t-gray-300">
                  <span>Đơn giá thực tế</span>
                  <span>{formatCurrency(realUnitCost)}</span>
                </div>
              </div>
            </td>
            <td className="px-4 py-2.5 text-sm font-semibold  ">
              <Controller
                name={`items.${index}.reason`}
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Lý do trả sản phẩm ..."
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    className="text-sm text-gray-500 placeholder:text-sm placeholder:font-medium font-medium"
                  />
                )}
              />
            </td>
            <td className="px-4 py-2.5 text-sm font-semibold  ">
              {formatCurrency(Number(item?.quantity) * Number(realUnitCost))}
            </td>
          </>
        );
      }}
    />
  );
}
