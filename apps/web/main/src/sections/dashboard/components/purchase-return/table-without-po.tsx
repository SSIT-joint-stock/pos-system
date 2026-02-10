import { Textarea, Tooltip } from '@mantine/core';
import { Button, Modal, NumberInput, Table } from '@repo/design-system/components/ui';
import { Variant } from '@repo/design-system/types';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { PurchaseReturnItem } from '../../../../schemas/purchase-return/purchase-return.schema';
import { formatCurrency, truncateText } from '../../../../utils';

interface TableWithoutPoProps {
  fieldsWithoutPO: PurchaseReturnItem[];
  watchWithoutPO: PurchaseReturnItem[];
  selectedVariants: Variant[];
  loading: boolean;
  control: any;
  removeWithoutPO: (index: number) => void;
  updateWithoutPO: (index: number, value: PurchaseReturnItem) => void;
  setSelectedVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}
const tableHeaders = [
  'Tên sản phẩm',
  'Đơn vị',
  'Số lượng',
  'Đơn giá trả',
  'Lý do',
  'Thành tiền',
  '',
];

export default function TableWithoutPO({
  fieldsWithoutPO,
  loading,
  control,
  watchWithoutPO,
  selectedVariants,
  removeWithoutPO,
  updateWithoutPO,
  setSelectedVariants,
}: TableWithoutPoProps) {
  const [isOpenModalChangePrice, setIsOpenModalChangePrice] = useState(false);
  const [indexChangePrice, setIndexChangePrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  return (
    <>
      <Table
        className="overflow-auto"
        hasPadding={false}
        isLoading={loading}
        tableHeaders={tableHeaders}
        data={fieldsWithoutPO}
        hasPagination={false}
        hasMarginTop={false}
        renderRow={(data, index) => {
          const variant = selectedVariants.find((p) => p.id === data.variant_id);
          const item = watchWithoutPO[index];
          const cost = item?.unit_cost || 0;
          if (!variant) return null;
          return (
            <>
              <Tooltip label={variant?.name} position="bottom">
                <td className="px-4 py-2.5 text-sm font-semibold text-blue-600 ">
                  {truncateText(variant?.name, 30) || 'N/A'}
                </td>
              </Tooltip>
              <td className="px-4 py-2.5 text-sm font-semibold ">
                {variant?.product.baseUnit || 'N/A'}
              </td>
              <td className="px-4 py-2.5  ">
                <div className="flex items-center gap-2">
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    rules={{
                      min: 0,
                      max: variant.onHand,
                    }}
                    render={({ field }) => (
                      <NumberInput
                        value={field.value ?? ''}
                        onChange={(val) => {
                          if (val === '' || val === null) {
                            field.onChange(null);
                            return;
                          }

                          const num = Number(val);
                          if (num < 0) return;
                          if (num > Number(variant.onHand)) {
                            field.onChange(variant.onHand);
                            return;
                          }

                          field.onChange(num);
                        }}
                        onBlur={() => {
                          if (field.value === null || field.value === undefined) {
                            field.onChange(null);
                          }
                        }}
                        min={0}
                        max={Number(variant.onHand)}
                        hideControls
                        placeholder="0"
                        size="sm"
                        radius="sm"
                        className="w-24"
                      />
                    )}
                  />
                  <p className="text-sm ">
                    {item?.quantity}/{Number(variant.onHand)} {variant.product.baseUnit}
                  </p>
                </div>
              </td>
              <td
                onClick={() => {
                  setIsOpenModalChangePrice(true);
                  setIndexChangePrice(index);
                }}
                className="px-4 py-2.5 text-sm font-semibold text-pos-blue-500 hover:underline   cursor-pointer rounded-md "
              >
                {formatCurrency(cost) || 'N/A'}
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
                {formatCurrency(Number(item?.quantity) * cost)}
              </td>

              <td className="px-4 py-2.5 text-sm font-semibold  text-red-500 cursor-pointer  ">
                <X
                  size={20}
                  onClick={() => {
                    removeWithoutPO(index);
                    setSelectedVariants?.((prev) => prev.filter((p) => p.id !== data.variant_id));
                  }}
                />
              </td>
            </>
          );
        }}
      />
      <Modal
        title={<p className="text-base font-semibold">Thay đổi giá trị đơn giá nhập</p>}
        opened={isOpenModalChangePrice}
        onClose={() => setIsOpenModalChangePrice(false)}
        size="md"
      >
        <div className="space-y-6  ">
          <NumberInput
            onChange={(value) => setPriceChange(Number(value))}
            label="Giá trị hàng"
            placeholder="Nhập giá trị ..."
            size="sm"
            radius="sm"
            min={0}
            error={priceChange < 0 ? 'Giá trị phải lớn hơn 0' : undefined}
          />

          <div className="flex items-center gap-2 justify-end">
            <Button
              title="Hủy"
              onClick={() => setIsOpenModalChangePrice(false)}
              variant="outline"
              radius="sm"
              size="sm"
            />
            <Button
              disabled={priceChange < 0}
              size="sm"
              radius="sm"
              title="Lưu giá trị"
              onClick={() => {
                const currentItem = watchWithoutPO[indexChangePrice];

                updateWithoutPO(indexChangePrice, {
                  ...currentItem,
                  unit_cost: priceChange,
                });

                setIsOpenModalChangePrice(false);
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
