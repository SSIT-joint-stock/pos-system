import { NumberInput, Table } from '@mantine/core';
import { useVariant } from '../../../hooks/variant/use-variant';
import { Button, Input, Modal } from '@repo/design-system/components/ui';
import { Product } from '@repo/design-system/types';
import { PencilLine, Plus, Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { formatDate, truncateText } from '../../../utils';

export function FormVariant({
  opened,
  product,
  isEdit,
  variantId,
  onClose,
  getProductById,
  setIsEdit,
}: {
  variantId?: string;
  isEdit?: boolean;
  opened: boolean;
  product: Product;
  onClose: () => void;
  getProductById: (id: string) => void;
  setIsEdit?: (isEdit: boolean) => void;
}) {
  const currentStore = useAtomValue(currentStoreAtom);
  const {
    createVariant,
    getVariant,
    updateVariant,
    conversionsFiledArray: { append, remove, fields },
    formVariant: {
      formState: { errors },
      register,
      control,
      handleSubmit,
      reset,
    },

    variant,
    loading,
  } = useVariant();
  useEffect(() => {
    if (!variantId || !product?.id || !isEdit) return;
    getVariant(variantId, product.id);
  }, [isEdit, variantId, product?.id]);
  useEffect(() => {
    if (isEdit && variant) {
      reset({
        name: variant?.name || '',
        price: variant?.price || 0,
        barcode: variant?.barcode || '',
        sku: variant?.sku || '',
        conversions: variant?.conversions.map((c) => ({
          name: c.name,
          factor: c.factor,
        })),
      });
    } else {
      reset({
        name: '',
        price: 0,
        barcode: '',
        sku: '',
        conversions: [],
        stock: 0,
      });
    }
  }, [reset, variant, isEdit]);
  return (
    <Modal
      title={
        <p className="text-base font-semibold">
          {isEdit ? `Thông tin "${variant?.name}"` : 'Tạo mới biến thể'}
        </p>
      }
      size="xl"
      opened={opened}
      onClose={onClose}
    >
      <form
        action=""
        onSubmit={handleSubmit(async (data) => {
          if (isEdit && variant) {
            const success = await updateVariant(variant?.id, product?.id, data);
            if (success) {
              onClose();
              reset();
              getProductById?.(product?.id);
              setIsEdit?.(false);
            }
          } else {
            const success = await createVariant(data, product?.id);
            if (success) {
              onClose();
              reset();
              getProductById?.(product?.id);
              remove();
            }
          }
        })}
        className="h-full w-full space-y-6"
      >
        {/* Info */}
        <div className="border border-gray-50 p-4  rounded-md mt-4">
          <h2 className="text-base font-stretch-200% font-semibold text-gray-900">
            Thông tin biến thể
          </h2>
          <div className="space-y-5 mt-4">
            <div className="flex gap-2">
              <Input
                size="sm"
                {...register('name')}
                error={errors.name?.message}
                withAsterisk
                className="flex-1"
                radius="sm"
                label="Tên biến thể"
                placeholder="Nhập tên biến thể"
              />
              <Input
                size="sm"
                {...register('price', {
                  valueAsNumber: true,
                })}
                className="flex-1"
                radius="sm"
                defaultValue={0}
                label="Giá bán biến thể "
                placeholder="Nhập giá bán biến thể"
              />
            </div>
            <div className="flex gap-2">
              <div className="space-y-0.5 flex-1">
                <Input
                  {...register('sku')}
                  size="sm"
                  radius="sm"
                  label="Mã SKU"
                  placeholder="Nhập mã SKU (VD: BT000001)"
                />
                <span className="text-xs text-gray-400">Tự động tạo khi để trống</span>
              </div>
              <Input
                {...register('barcode')}
                size="sm"
                radius="sm"
                className="flex-1"
                label="Mã vạch/ Barcode"
                placeholder="Nhập mã vạch/ Barcode"
              />
            </div>
          </div>
        </div>
        {/* Inventory */}
        <div className="border border-gray-50 p-4  rounded-md ">
          <h2 className="text-base font-stretch-200% font-semibold text-gray-900">Thông tin kho</h2>
          <div className="mt-4">
            {isEdit && variantId ? (
              <Table>
                <Table.Thead className="bg-gray-50">
                  <Table.Tr>
                    <Table.Th>Kho lưu trữ</Table.Th>
                    <Table.Th>Tồn kho</Table.Th>
                    <Table.Th>Hàng đang về</Table.Th>
                    <Table.Th>Hàng hỏng</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>{truncateText(currentStore?.name || '', 36)}</Table.Td>
                    <Table.Td>
                      <button
                        type="button"
                        className="flex items-center gap-2 hover:bg-pos-blue-50 hover:text-pos-blue-500 py-1.5 px-2 rounded-md transition-all duration-200 cursor-pointer"
                      >
                        {variant?.onHand || 0}
                        <PencilLine size={14} />
                      </button>
                    </Table.Td>
                    <Table.Td>{variant?.reserved || 0}</Table.Td>
                    <Table.Td>{variant?.damaged || 0}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            ) : (
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Kho lưu trữ
                    </th>

                    <th className="px-6 py-4 text-left "></th>
                    <th className="px-6 py-4 text-left "></th>
                    <th className="px-6 py-4 text-left "></th>
                    <th className="px-6 py-4 text-left "></th>
                    <th className="px-6 py-4 text-left "></th>
                    <th className="px-6 py-4 text-left "></th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 text-nowrap">
                      Tồn kho
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  <tr>
                    <td className="px-6 py-4 text-sm  text-gray-800">Cửa hàng chính</td>
                    <td className="px-6 py-4 "></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm text-nowrap text-gray-500 ">
                      <Input
                        {...register('stock', {
                          valueAsNumber: true,
                        })}
                        defaultValue={0}
                        type="number"
                        size="sm"
                        radius="sm"
                        placeholder="Nhập số lượng tồn"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* Unit */}
        <div className="border border-gray-50 p-4 rounded-md ">
          <h2 className="text-base font-stretch-200% font-semibold text-gray-900 flex items-center justify-between">
            Quy Đổi Đơn Vị (Tùy Chọn)
            <Button
              onClick={() =>
                append({
                  name: '',
                  factor: 0,
                })
              }
              icon={<Plus size={16} />}
              title="Thêm đơn vị"
              size="xs"
              radius="sm"
              variant="outline"
            />
          </h2>
          <div className="mt-5">
            {fields.length === 0 ? (
              <p className="text-sm text-gray-500">
                Chưa có đơn vị quy đổi (chỉ bán theo &lsquo;{product?.baseUnit.trim()}&lsquo;).
              </p>
            ) : (
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div className="flex items-center justify-between" key={field.id}>
                    <div className="flex  gap-4 ">
                      <Input
                        {...register(`conversions.${index}.name`)}
                        size="sm"
                        type="text"
                        radius="sm"
                        className="flex-1"
                        error={errors?.conversions?.[index]?.name?.message}
                        placeholder="Nhập tên đơn vị"
                      />
                      <span className=" text-base text-gray-600">=</span>
                      <Controller
                        control={control}
                        name={`conversions.${index}.factor`}
                        defaultValue={field.factor ?? 0}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <NumberInput
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            ref={ref}
                            size="sm"
                            radius="sm"
                            className="flex-1"
                            placeholder="Nhập giá trị quy đổi"
                            error={errors?.conversions?.[index]?.factor?.message}
                          />
                        )}
                      />
                      <span className="text-sm font-semibold text-pos-blue-500">
                        {product?.baseUnit}
                      </span>
                    </div>
                    <button
                      onClick={() => remove(index)}
                      type="button"
                      className="hover:text-red-500 cursor-pointer text-gray-500 transition-colors duration-200"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Cập nhật lần cuối: {formatDate(variant?.updatedAt || new Date())}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              title="Hủy"
              size="sm"
              radius="sm"
              variant="outline"
              onClick={() => {
                onClose();
              }}
            />
            <Button
              loading={loading}
              type="submit"
              title={isEdit ? 'Cập nhật biến thể' : 'Lưu biến thể'}
              radius="sm"
              size="sm"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
