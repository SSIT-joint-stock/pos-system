'use client';
// import { Textarea } from '@mantine/core';
import { Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
  Button,
  DatePickerInput,
  Loading,
  LoadingCreatedToDetail,
  Modal,
  Select,
} from '@repo/design-system/components/ui';
import { PurchaseReturn } from '@repo/design-system/types';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import { Check, Menu, Plus, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Controller, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { useSupplier } from '../../../../hooks/suplier/use-supplier';
import {
  PurchaseReturnWithoutPO,
  PurchaseReturnWithPurchaseOrder,
} from '../../../../schemas/purchase-return/purchase-return.schema';
import { FormCreateSupplier } from '../../../../sections/dashboard/components/form-create-supplier';
import { formatCurrency } from '../../../../utils';

export interface SidebarProps {
  purchaseOrder?: PurchaseOrder | null;
  handleSuccess: () => void;

  createPurchaseReturnWithPO: (
    purchaseReturnId: string,
    data: PurchaseReturnWithPurchaseOrder
  ) =>
    | {
        success: boolean;
        data: PurchaseReturn | null;
      }
    | Promise<{ success: boolean; data: PurchaseReturn | null }>;
  createPurchaseReturnWithoutPO: (data: PurchaseReturnWithoutPO) =>
    | {
        success: boolean;
        data: PurchaseReturn | null;
      }
    | Promise<{ success: boolean; data: PurchaseReturn | null }>;
  loadingCreate: boolean;
  control: any;

  total: number;
  totalWithoutPO: number;

  itemsLength: number;
  itemsLengthWithoutPO: number;

  errorsWithoutPO: any;
  controlWithoutPO: any;

  register: UseFormRegister<PurchaseReturnWithPurchaseOrder>;
  handleSubmitWithPO: UseFormHandleSubmit<PurchaseReturnWithPurchaseOrder>;
  handleSubmitWithoutPO: UseFormHandleSubmit<PurchaseReturnWithoutPO>;
}
export function Sidebar({
  purchaseOrder,
  loadingCreate,
  control,
  controlWithoutPO,
  total,
  totalWithoutPO,
  itemsLength,
  itemsLengthWithoutPO,
  errorsWithoutPO,
  createPurchaseReturnWithPO,
  createPurchaseReturnWithoutPO,
  handleSubmitWithPO,
  handleSubmitWithoutPO,
  handleSuccess,
}: SidebarProps) {
  const router = useRouter();
  const [isOpenModalCreateSupplier, setIsOpenModalCreateSupplier] = useState<boolean>(false);
  const [searchSupplier, setSearchSupplier] = useState<string>('');
  const [debouncedSearch] = useDebouncedValue(searchSupplier, 500);
  const [isPendingForCreated, startTransition] = useTransition();

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
    if (!currentStore?.id || purchaseOrder) return;
    getSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id, filters]);

  return (
    <>
      <form
        onSubmit={
          purchaseOrder
            ? handleSubmitWithPO(async (data) => {
                const response = await createPurchaseReturnWithPO(purchaseOrder.id, data);
                if (response.success) {
                  handleSuccess();
                  startTransition(() => {
                    router.push(
                      `/dashboard/store/${currentStore?.id}/export-invoices/detail/${response?.data?.id}`
                    );
                  });
                }
              })
            : handleSubmitWithoutPO(async (data) => {
                const response = await createPurchaseReturnWithoutPO(data);
                if (response.success) {
                  handleSuccess();
                  startTransition(() => {
                    router.push(
                      `/dashboard/store/${currentStore?.id}/export-invoices/detail/${response?.data?.id}`
                    );
                  });
                }
              })
        }
        className="p-6 flex flex-col justify-between h-full"
      >
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between  pb-4 border-b border-b-gray-300">
            <h3 className="text-lg font-semibold text-gray-700">Chi tiết đơn trả hàng</h3>
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer">
              <Menu size={18} />
            </button>
          </div>

          {/* Form Fields */}
          <div>
            <div className="space-y-4">
              {/* Nhà cung cấp */}
              {purchaseOrder ? (
                <div className="">
                  <h3 className="text-sm font-medium text-gray-500">Nhà cung cấp</h3>
                  <div className="flex items-center gap-2.5 mt-2">
                    <Image
                      src={'/avatar.png'}
                      width={28}
                      height={28}
                      alt="avatar"
                      className="w-10 h-10 rounded-full shrink-0 overflow-hidden object-cover "
                      unoptimized
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-pos-blue-500 font-semibold text-sm">
                        {purchaseOrder?.supplier?.name}
                      </span>
                      <span className="text-sm text-gray-500">{purchaseOrder?.supplier?.code}</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500 font-medium">
                      {purchaseOrder?.supplier?.tax_code || 'Chưa cập nhật MST'}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {purchaseOrder?.supplier?.phone || 'Chưa cập nhật SĐT'}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {purchaseOrder?.supplier?.email || 'Chưa cập nhật email'}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {purchaseOrder?.supplier?.address || 'Chưa cập nhật địa chỉ'}
                    </p>
                  </div>
                </div>
              ) : (
                <Controller
                  name="supplier_id"
                  control={purchaseOrder ? control : controlWithoutPO}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Nhà cung cấp</p>
                      <Select
                        {...field}
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
                        error={errorsWithoutPO.supplier_id ? 'Vui lòng chọn nhà cung cấp' : ''}
                        size="sm"
                        className="flex-1"
                        radius="sm"
                        value={field.value ?? null}
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
                    </div>
                  )}
                />
              )}
              {/* Date */}
              <Controller
                name="return_date"
                control={purchaseOrder ? control : controlWithoutPO}
                render={({ field }) => (
                  <DatePickerInput
                    {...field}
                    label="Ngày xuất"
                    size="sm"
                    radius="sm"
                    defaultValue={new Date()}
                    clearable
                    placeholder="Nhập ngày xuất"
                  />
                )}
              />

              <div className="flex-col flex gap-1">
                <span className="text-sm text-gray-500">Lý do</span>
                <Controller
                  name={`reason`}
                  control={purchaseOrder ? control : controlWithoutPO}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Nhập lý do ..." size="sm" radius={'sm'} />
                  )}
                />
              </div>
              <div className="flex-col flex gap-1">
                <span className="text-sm text-gray-500">Ghi chú</span>
                <Controller
                  name={`notes`}
                  control={purchaseOrder ? control : controlWithoutPO}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Nhập ghi chú ..." size="sm" radius={'sm'} />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-semibold text-base">Số lượng sản phẩm:</span>
                <span className="text-gray-900 font-semibold">
                  {purchaseOrder ? itemsLength : itemsLengthWithoutPO}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-pos-blue-500 font-semibold text-base">Giá trị hoàn trả:</span>
                <span className="text-pos-blue-500 font-semibold">
                  {purchaseOrder ? formatCurrency(total || 0) : formatCurrency(totalWithoutPO || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 ">
          <Button
            loading={loadingCreate}
            type="submit"
            title="Tạo đơn trả hàng nhập"
            icon={<Check size={18} />}
            size="sm"
            radius="sm"
            className="flex-1"
          />
        </div>
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
