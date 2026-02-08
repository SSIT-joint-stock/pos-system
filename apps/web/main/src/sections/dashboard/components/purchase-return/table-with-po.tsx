import { Textarea, Tooltip } from '@mantine/core';
import { NumberInput, Table } from '@repo/design-system/components/ui';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import { ChevronDown } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import {
  PurchaseReturnItem,
  PurchaseReturnWithPurchaseOrder,
} from '../../../../schemas/purchase-return/purchase-return.schema';
import { formatCurrency, truncateText } from '../../../../utils';
const tableHeaders = [
  'Tên sản phẩm',
  'Đơn vị nhập',
  'Số lượng',
  'Đơn giá trả',
  'Lý do',
  'Thành tiền',
];

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
      className="overflow-auto"
      hasPadding={false}
      isLoading={loading}
      tableHeaders={tableHeaders}
      data={fields}
      hasPagination={false}
      hasMarginTop={false}
      renderRow={(data, index) => {
        const poItem = purchaseOrder.items[index];
        const item = watchedItems[index];

        // 1. Lấy hệ số quy đổi (Ví dụ: Thùng = 24 lon thì factor = 24)
        const factor = Number(poItem?.applied_factor || 1);

        // 2. Tính số lượng tối đa có thể trả THEO ĐƠN VỊ PO
        // Công thức: (Tổng base - Đã trả base) / factor
        const maxReturnableInPoUnit =
          (Number(poItem?.total_base_qty || 0) - Number(poItem?.quantity_returned || 0)) / factor;

        // 3. Tính đơn giá thực tế cho 1 ĐƠN VỊ PO (Đã bao gồm thuế/CK phân bổ)
        // Backend tính realUnitCost = costPerBase * factor, ta tái hiện ở FE để show "Thành tiền" đúng
        const baseUnitCost = Number(poItem?.unit_cost ?? 0);
        const totalBaseInLine = Number(poItem.total_base_qty || 1);
        const taxPerBase = Number(poItem.tax_amount || 0) / totalBaseInLine;
        const discountPerBase = Number(poItem.discount_amount || 0) / totalBaseInLine;

        // Đơn giá thực tế của 1 đơn vị PO (Ví dụ: Giá của 1 Thùng sau khi phân bổ thuế/ck)
        const realUnitCostOfPoItem =
          (baseUnitCost / factor + taxPerBase - discountPerBase) * factor;

        return (
          <>
            {poItem && (
              <>
                <Tooltip label={poItem?.item_name} position="bottom">
                  <td className="px-4 py-2.5 text-sm font-semibold text-blue-600 ">
                    {truncateText(poItem?.item_name, 30) || 'N/A'}
                  </td>
                </Tooltip>

                {/* Hiển thị đơn vị nhập từ PO */}
                <td className="px-4 py-2.5 text-sm font-semibold">{poItem?.unit || 'N/A'}</td>

                <td className="px-4 py-2.5">
                  <div className="flex flex-col gap-1">
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          value={field.value ?? ''}
                          onChange={(val) => {
                            if (val === '' || val === null) {
                              field.onChange(null);
                              return;
                            }
                            const num = Number(val);
                            // Chặn không cho nhập quá số lượng còn lại trong PO
                            if (num > maxReturnableInPoUnit) {
                              field.onChange(maxReturnableInPoUnit);
                              return;
                            }
                            field.onChange(num);
                          }}
                          min={0}
                          max={maxReturnableInPoUnit}
                          hideControls
                          placeholder="0"
                          size="sm"
                          radius="sm"
                          className="w-32"
                        />
                      )}
                    />
                    {/* Hiển thị thông tin hỗ trợ người dùng */}
                    <p className="text-[11px] text-gray-500">
                      Có thể trả:{' '}
                      <span className="font-bold text-orange-600">{maxReturnableInPoUnit}</span>{' '}
                      {poItem?.unit}
                    </p>
                    {factor > 1 && (
                      <p className="text-[10px] text-gray-400 italic">
                        (1 {poItem.unit} = {factor} đơn vị gốc)
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 cursor-pointer relative group">
                  <span className="flex items-center gap-2">
                    {formatCurrency(realUnitCostOfPoItem)}
                    <ChevronDown size={14} />
                  </span>
                  {/* Tooltip chi tiết đơn giá */}
                  <div className="absolute top-full mt-1 left-0 w-64 bg-white z-50 shadow-xl border border-gray-200 rounded-md p-3 hidden group-hover:block">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Giá nhập (gốc):</span> <span>{formatCurrency(baseUnitCost)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Thuế quy đổi:</span> <span>+{formatCurrency(taxPerBase)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>CK quy đổi:</span> <span>-{formatCurrency(discountPerBase)}</span>
                      </div>
                      <div className="border-t pt-1 mt-1 font-bold flex justify-between">
                        <span>Giá thực tế:</span>
                        <span>{formatCurrency(realUnitCostOfPoItem)}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2.5 text-sm">
                  <Controller
                    name={`items.${index}.reason`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        onChange={(value) => field.onChange(value)}
                        placeholder="Lý do..."
                        autosize
                        minRows={2}
                        size="sm"
                        radius={'sm'}
                      />
                    )}
                  />
                </td>

                <td className="px-4 py-2.5 text-sm font-bold text-pos-blue-600">
                  {formatCurrency(Number(item?.quantity || 0) * realUnitCostOfPoItem)}
                </td>
              </>
            )}
          </>
        );
      }}
    />
  );
}
