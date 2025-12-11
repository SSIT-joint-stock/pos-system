'use client';
import Header from '../components/purchase-order/header';
import { useEffect, useRef, useState } from 'react';
import { Plus, Upload, Menu, User, X, Percent } from 'lucide-react';
import {
  Button,
  DatePickerInput,
  Input,
  Loading,
  Modal,
  Select,
  Table,
} from '@repo/design-system/components/ui';
import { Variant } from '@repo/design-system/types';
import { FormCreateSupplier } from '../components';
import { useSupplier } from '../../../hooks/suplier/use-supplier';
import { NumberInput, Popover } from '@mantine/core';
import { formatCurrency } from '../../../utils';

const tableHeaders = [
  'Mã SP',
  'Tên sản phẩm',
  'Đơn vị',
  'Số lượng',
  'Giá nhập',
  'Chiết khấu %',
  'VAT %',
  'Thành tiền',
  'Hành động',
];
export function PurchaseOrdersV2() {
  // HOOK

  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([] as Variant[]);
  const [openModalCreateSupplier, setOpenModalCreateSupplier] = useState<boolean>(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  // CUSTOM HOOK
  const {
    getSuppliers,
    suppliers,
    currentStore,
    loading: loadingSuppliers,
    setFilters,
  } = useSupplier();

  // Xóa sản phẩm
  const handleRemoveProduct = (id: string) => {
    setSelectedVariants(selectedVariants.filter((p) => p.id !== id));
  };

  // HOOK EFFECT
  useEffect(() => {
    if (!currentStore?.id) return;
    setFilters((prev) => {
      return {
        ...prev,
        limit: 20,
      };
    });
    getSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id, setFilters]);

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_0.4fr] grid-cols-1  h-full overflow-hidden gap-3 ">
        {/* Main Content - Left Side */}
        <div className="flex-1 flex flex-col  overflow-hidden">
          <Header setSelectedVariants={setSelectedVariants} />
          {/* Content Area */}
          <div className="flex-1 overflow-auto md:h-full h-screen  bg-white">
            {selectedVariants.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 h-full rounded-lg">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Thêm sản phẩm từ file excel
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Xử lý dữ liệu (Tải lại file mẫu: Excel 2003 hoặc bản cũ hơn)
                  </p>
                </div>
                <Button radius="sm" title="Tải file mẫu" icon={<Upload size={16} />} />
              </div>
            ) : (
              <Table
                hasPagination={false}
                data={selectedVariants}
                className="md:h-full h-screen"
                tableHeaders={tableHeaders}
                renderRow={(data) => (
                  <>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.sku || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{data?.name || 'N/A'}</td>
                    <Popover
                      width={140}
                      withArrow
                      shadow="md "
                      offset={-20}
                      position="bottom-start"
                      arrowPosition="side"
                    >
                      <Popover.Target>
                        <td className="px-4 py-2 text-sm text-pos-blue-500 font-semibold hover:underline cursor-pointer">
                          <span>{data?.product?.baseUnit || 'N/A'}</span>
                          <Popover.Dropdown className="p-0" p={8}>
                            <>
                              {data && data?.conversions && data?.conversions?.length === 0 ? (
                                <div className="w-full text-center text-gray-500 text-sm">
                                  Không có dữ liệu
                                </div>
                              ) : (
                                <>
                                  {data &&
                                    data?.conversions?.length > 0 &&
                                    data?.conversions?.map((unit) => (
                                      <div
                                        key={unit.id}
                                        className=" text-gray-600 text-xs font-semibold pl-1 w-full py-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer line-clamp-1"
                                      >
                                        {unit.name} (x{unit.factor})
                                      </div>
                                    ))}
                                </>
                              )}
                            </>
                          </Popover.Dropdown>
                        </td>
                      </Popover.Target>
                    </Popover>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <Input
                        type="number"
                        min={1}
                        size="sm"
                        autoFocus
                        name="quantity"
                        defaultValue={1}
                        radius="sm"
                        className="w-24 text-right"
                      />
                    </td>

                    <td className="px-4 py-2 text-sm text-gray-700">
                      <div ref={inputRef}>
                        {editingVariantId === data.id ? (
                          <NumberInput
                            type="text"
                            onBlur={() => setEditingVariantId(null)}
                            autoFocus
                            size="sm"
                            defaultValue={data?.cost || 0}
                            radius="sm"
                            onChange={(value) => console.log(value)}
                            className="w-24 text-right"
                          />
                        ) : (
                          <Input
                            type="text"
                            size="sm"
                            radius="sm"
                            className="w-24 text-right"
                            onFocus={() => setEditingVariantId(data.id)}
                            defaultValue={formatCurrency(data?.cost) || '0'}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <Input
                        type="number"
                        size="sm"
                        defaultValue={0}
                        radius="sm"
                        className="w-24 text-right"
                        rightSection={<Percent size={14} />}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <Input
                        type="number"
                        size="sm"
                        radius="sm"
                        defaultValue={0}
                        className="w-24 text-right"
                        rightSection={<Percent size={14} />}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700"></td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProduct(data.id || '');
                        }}
                        className="text-gray-500 hover:text-red-500 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </>
                )}
              />
            )}
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="w-full bg-white rounded-lg  ">
          <div className="p-6 flex flex-col justify-between h-full">
            {/* Header */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between  pb-4 border-b border-b-gray-300">
                <h3 className="text-lg font-semibold text-gray-700">Chi tiết giao dịch</h3>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Menu size={18} />
                </button>
              </div>

              {/* Form Fields */}
              <div>
                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <DatePickerInput
                      className="flex-1"
                      label="Ngày nhập"
                      defaultValue={new Date()}
                      size="sm"
                      radius="sm"
                      clearable
                      placeholder="Nhập ngày nhập"
                    />
                    <Input
                      className="flex-1 "
                      size="sm"
                      radius="sm"
                      placeholder="Nhập số hóa đơn"
                      label="Số hóa đơn"
                    />
                  </div>
                  {/* Nhà cung cấp */}
                  <Select
                    data={suppliers.map((supplier) => ({
                      label: supplier?.name,
                      value: supplier?.id,
                    }))}
                    leftSection={
                      loadingSuppliers ? <Loading color="#3b82f6" /> : <User size={16} />
                    }
                    label={'Nhà cung cấp'}
                    placeholder="Tìm kiếm nhà cung cấp"
                    clearable
                    size="sm"
                    radius="sm"
                    position="bottom"
                    rightSection={
                      <button
                        type="button"
                        onClick={() => setOpenModalCreateSupplier(true)}
                        className="p-2 rounded hover:bg-gray-200 transition duration-200 hover:cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <Plus size={16} />
                      </button>
                    }
                  />
                  <Input
                    size="sm"
                    radius="sm"
                    placeholder="Mã phiếu tự động"
                    disabled
                    label="Mã phiếu nhập"
                  />
                  <div className="flex items-center gap-4 my-5">
                    <Input className="flex-1" placeholder="Số tiền trả" size="sm" radius="sm" />
                    <Button size="sm" radius="sm" title="Trả đủ" />
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-base">Tổng tiền hàng:</span>
                    <span className="text-gray-800 font-semibold"></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-base">Tổng tiền hoàn:</span>
                    <span className="text-gray-800 font-semibold"></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-pos-blue-500 text-lg font-medium">
                      Cần trả nhà cung cấp:
                    </span>
                    <span className="text-pos-blue-500 text-lg font-semibold"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Button title="Xác nhận thanh toán" />
          </div>
        </div>
      </div>
      <Modal
        title="Thêm nhà cung cấp"
        size="xl"
        opened={openModalCreateSupplier}
        onClose={() => setOpenModalCreateSupplier(false)}
      >
        <FormCreateSupplier setIsOpenModal={setOpenModalCreateSupplier} />
      </Modal>
    </>
  );
}
