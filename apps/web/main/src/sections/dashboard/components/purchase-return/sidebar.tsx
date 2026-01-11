// import { Textarea } from '@mantine/core';
import { Textarea } from '@mantine/core';
import { Button, DatePickerInput, Select } from '@repo/design-system/components/ui';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import { Check, Menu, Plus } from 'lucide-react';
import Image from 'next/image';
import { Controller, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { PurchaseReturnWithPurchaseOrder } from '../../../../schemas/purchase-return/purchase-return.schema';
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
      }
    | Promise<{ success: boolean }>;
  loadingCreate: boolean;
  control: any;
  total: number;
  itemsLength: number;

  register: UseFormRegister<PurchaseReturnWithPurchaseOrder>;
  handleSubmit: UseFormHandleSubmit<PurchaseReturnWithPurchaseOrder>;
}
export function Sidebar({
  purchaseOrder,
  loadingCreate,
  control,
  total,
  itemsLength,
  createPurchaseReturnWithPO,
  handleSubmit,
  handleSuccess,
}: SidebarProps) {
  return (
    <>
      <div className="w-1/4 bg-white rounded-lg  ">
        <form
          onSubmit={handleSubmit(async (data) => {
            const { success } = await createPurchaseReturnWithPO(purchaseOrder?.id as string, data);
            if (success) {
              handleSuccess();
            }
          })}
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
                        <span className="text-sm text-gray-500">
                          {purchaseOrder?.supplier?.code}
                        </span>
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
                  <Select
                    data={['Test']}
                    label={'Nhà cung cấp'}
                    placeholder="Tìm kiếm nhà cung cấp"
                    clearable
                    size="sm"
                    radius="sm"
                    position="bottom"
                    rightSection={
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-gray-200 transition duration-200 hover:cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <Plus size={16} />
                      </button>
                    }
                  />
                )}
                {/* Date */}
                <Controller
                  name="return_date"
                  control={control}
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
                    control={control}
                    render={({ field }) => (
                      <Textarea {...field} placeholder="Nhập lý do ..." size="sm" radius={'sm'} />
                    )}
                  />
                </div>
                <div className="flex-col flex gap-1">
                  <span className="text-sm text-gray-500">Ghi chú</span>
                  <Controller
                    name={`notes`}
                    control={control}
                    render={({ field }) => (
                      <Textarea {...field} placeholder="Nhập ghi chú ..." size="sm" radius={'sm'} />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-semibold text-base">Số lượng sản phẩm:</span>
                  <span className="text-gray-900 font-semibold">{itemsLength || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pos-blue-500 font-semibold text-base">
                    Giá trị hoàn trả:
                  </span>
                  <span className="text-pos-blue-500 font-semibold">
                    {formatCurrency(total || 0)}
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
      </div>
    </>
  );
}
