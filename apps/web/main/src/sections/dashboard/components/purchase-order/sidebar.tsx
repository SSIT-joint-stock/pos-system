'use client';
import { DateInput } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import {
  Button,
  Loading,
  LoadingCreatedToDetail,
  Modal,
  Select,
} from '@repo/design-system/components/ui';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Variant } from '@repo/design-system/types';
import { Menu, Plus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from 'react-hook-form';
import { useSupplier } from '../../../../hooks/suplier/use-supplier';
import {
  CreatePurchaseOrder,
  CreatePurchaseOrderItem,
} from '../../../../schemas/purchase/purchase.schema';
import { formatCurrency } from '../../../../utils';
import { FormCreateSupplier } from '../form-create-supplier';

type SidebarPurchaseProps = {
  handleSubmit: UseFormHandleSubmit<CreatePurchaseOrder>;
  reset: UseFormReset<CreatePurchaseOrder>;
  createPurchaseOrder: (data: CreatePurchaseOrder) => Promise<any>;
  register: UseFormRegister<CreatePurchaseOrder>;
  control: Control<CreatePurchaseOrder>;
  errors: FieldErrors<CreatePurchaseOrder>;
  loading: boolean;
  watchedItems: CreatePurchaseOrderItem[];
  selectedVariants: Variant[];
  caculateTotalPerItem: (
    item: CreatePurchaseOrderItem,
    variant: Variant
  ) => {
    subtotal: number;
    total_price: number;
    discount_amount: number;
    tax_amount: number;
  };
};
export default function SidebarPurchase({
  handleSubmit,
  reset,
  createPurchaseOrder,
  register,
  control,
  errors,
  loading,
  watchedItems,
  caculateTotalPerItem,
  selectedVariants,
}: SidebarPurchaseProps) {
  const { showErrorToast } = useToast();
  const [isPendingForCreated, startTransition] = useTransition();
  const [searchSupplier, setSearchSupplier] = useState<string>('');
  const [debouncedSearch] = useDebouncedValue(searchSupplier, 500);

  const [isOpenModalCreateSupplier, setIsOpenModalCreateSupplier] = useState<boolean>(false);
  const router = useRouter();
  const {
    getSuppliers,
    setFilters,
    suppliers,
    currentStore,
    filters,
    loading: loadingSuppliers,
  } = useSupplier();

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: 'ACTIVE',
      q: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    if (!currentStore?.id) return;
    getSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id, filters]);

  const totalPrice = useMemo(() => {
    return watchedItems.reduce(
      (total, item) => {
        const variant = selectedVariants.find((v) => v.id === item.variant_id);
        if (!variant) return total;
        const { total_price, subtotal } = caculateTotalPerItem(item, variant);
        return {
          total: total.total + Number(total_price),
          subtotal: total.subtotal + Number(subtotal),
        };
      },
      { total: 0, subtotal: 0 }
    );
  }, [watchedItems, selectedVariants, caculateTotalPerItem]);

  return (
    <>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (data.items.length === 0) {
            showErrorToast('Không có sản phẩm trong đơn nhập. Vui lòng thử lại! ');
          } else {
            const success = await createPurchaseOrder(data);
            if (success.success) {
              reset();
              startTransition(() => {
                router.push(
                  `/dashboard/store/${currentStore?.id}/import-invoices/detail/${success?.data?.id}`
                );
              });
            }
          }
        })}
        className="p-6 flex flex-col justify-between h-full w-full"
      >
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between  pb-4 border-b border-b-gray-300">
            <h3 className="text-lg font-semibold text-gray-700">Chi tiết đơn nhập</h3>
            <button type="button" className="p-1 hover:bg-gray-200 rounded">
              <Menu size={18} />
            </button>
          </div>

          {/* Form Fields */}
          <div>
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-center gap-2">
                <Controller
                  name="order_date"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      className="flex-1"
                      {...field}
                      label={<p className="text-sm text-gray-500">Ngày nhập hàng</p>}
                      defaultValue={new Date()}
                      size="sm"
                      valueFormat="DD/MM/YYYY"
                      radius="sm"
                      clearable
                      placeholder="Nhập ngày nhập"
                    />
                  )}
                />
                <Controller
                  name="expected_date"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      className="flex-1"
                      {...field}
                      label={<p className="text-sm text-gray-500">Ngày dự kiến nhận hàng</p>}
                      defaultValue={new Date()}
                      size="sm"
                      valueFormat="DD/MM/YYYY"
                      radius="sm"
                      clearable
                      placeholder="Nhập ngày dự kiến nhận hàng"
                    />
                  )}
                />
              </div>
              {/* Nhà cung cấp */}

              <Controller
                name="supplier_id"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Nhà cung cấp</p>
                    <div className="flex items-center gap-2">
                      <Select
                        {...field}
                        // for search
                        searchable
                        onSearchChange={setSearchSupplier}
                        searchValue={searchSupplier}
                        data={suppliers.map((supplier) => ({
                          label: supplier?.name,
                          value: supplier?.id,
                        }))}
                        filter={({ options }) => options}
                        nothingFoundMessage="Không tìm thấy nhà cung cấp"
                        leftSection={<User size={16} />}
                        placeholder="Tìm kiếm nhà cung cấp"
                        clearable
                        error={errors.supplier_id ? 'Vui lòng chọn nhà cung cấp' : ''}
                        size="sm"
                        className="flex-1"
                        radius="sm"
                        position="bottom"
                        rightSection={
                          loadingSuppliers ? (
                            <Loading color="#3b82f6" size="xs" />
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setIsOpenModalCreateSupplier(true)}
                                className="p-2 rounded hover:bg-gray-200 transition duration-200 hover:cursor-pointer"
                                style={{ pointerEvents: 'auto' }}
                              >
                                <Plus size={16} />
                              </button>
                            </>
                          )
                        }
                      />
                      {/* <Button
                        onClick={() => setIsOpenModalCreateSupplier(true)}
                        title="Thêm"
                        size="sm"
                        radius="sm"
                        variant="outline"
                      /> */}
                    </div>
                  </div>
                )}
              />

              <div className="flex flex-col gap-1 my-5">
                <span className="text-sm text-gray-500">Ghi chú</span>
                <textarea
                  rows={4}
                  {...register('notes')}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-pos-blue-500"
                  placeholder="Ghi chú"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8 border-t pt-4 border-t-gray-200">
              <h3 className="text-gray-900 text-base font-semibold">Thanh toán</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-semibold text-sm">
                  Tổng tiền trước thuế ({watchedItems.length || 0} sản phẩm):
                </span>
                <span className="text-gray-900 font-semibold text-base">
                  {formatCurrency(totalPrice?.subtotal || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-semibold text-sm">
                  Tổng tiền hàng sau thuế ({watchedItems.length || 0} sản phẩm):
                </span>
                <span className="text-gray-900 font-semibold text-base">
                  {formatCurrency(totalPrice?.total || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-pos-blue-500 text-sm font-semibold">
                  Cần trả nhà cung cấp:
                </span>
                <span className="text-pos-blue-500 text-base font-semibold">
                  {formatCurrency(totalPrice?.total || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Button type="submit" loading={loading} title="Tạo đơn nhập hàng" size="sm" radius="sm" />
      </form>

      <Modal
        title={<p className="text-base font-semibold">Thêm nhà cung cấp</p>}
        size="xl"
        opened={isOpenModalCreateSupplier}
        onClose={() => setIsOpenModalCreateSupplier(false)}
      >
        <FormCreateSupplier
          setIsOpenModal={setIsOpenModalCreateSupplier}
          onFetchNewData={getSuppliers}
          isEditForm={false}
        />
      </Modal>

      {isPendingForCreated && <LoadingCreatedToDetail />}
    </>
  );
}
