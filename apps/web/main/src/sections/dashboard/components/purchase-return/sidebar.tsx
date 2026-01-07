// import { Textarea } from '@mantine/core';
import { Textarea } from '@mantine/core';
import { Button, DatePickerInput, Select } from '@repo/design-system/components/ui';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import { Check, Menu, Plus } from 'lucide-react';
import Image from 'next/image';

export function Sidebar({ purchaseOrder }: { purchaseOrder?: PurchaseOrder }) {
  return (
    <div className="w-1/4 bg-white rounded-lg  ">
      <div className="p-6 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between  pb-4 border-b border-b-gray-300">
            <h3 className="text-lg font-semibold text-gray-700">Chi tiết đơn trả hàng</h3>
            <button className="p-1 hover:bg-gray-200 rounded">
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
              <DatePickerInput
                label="Ngày xuất"
                size="sm"
                radius="sm"
                defaultValue={new Date()}
                clearable
                placeholder="Nhập ngày xuất"
              />
              <div className="flex-col flex gap-1">
                <span className="text-sm text-gray-500">Lý do</span>
                <Textarea placeholder="Nhập lý do ..." size="sm" radius={'sm'} />
              </div>
              <div className="flex-col flex gap-1">
                <span className="text-sm text-gray-500">Ghi chú</span>
                <Textarea placeholder="Nhập ghi chú ..." size="sm" radius={'sm'} />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <div className="flex items-center justify-between">
                <span className="text-pos-blue-500 font-semibold text-base">Tổng tiền hàng:</span>
                <span className="text-pos-blue-500 font-semibold"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 ">
          <Button
            title="Hoàn thành"
            icon={<Check size={18} />}
            size="sm"
            radius="sm"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
