'use client';
import { useState } from 'react';
import { Plus, Trash2, Upload, Menu, ScanBarcode, SaveAll, Ellipsis } from 'lucide-react';
import { Button, DatePickerInput, Input, Select } from '@repo/design-system/components/ui';
import { Drawer, Tooltip } from '@mantine/core';
import FormCreateProduct from '../components/form-create-product';
import { Product } from '@repo/design-system/types';

export function PurchaseOrdersV2() {
  const [products, setProducts] = useState<Partial<Product>[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>({} as Product);
  const [isEditSelectProduct, setIsEditSelectProduct] = useState<boolean>(false);
  const [isCreateSelectProduct, setIsCreateSelectProduct] = useState<boolean>(false);
  const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState<boolean>(false);

  // Xử lý thay đổi field sản phẩm
  const handleChangeProductField = (
    index: number,
    field: keyof Product | 'quantity',
    value: any
  ) => {
    setProducts((prev) => {
      const updated = [...prev];
      const product = updated[index];

      if (field === 'quantity') {
        // quantity nằm trong inventory
        updated[index] = {
          ...product,
          inventory: {
            ...product.inventory,
            quantity: Number(value),
          },
        };
      } else {
        // các field còn lại (price, cost, name, ...)
        updated[index] = {
          ...product,
          [field]: ['price', 'cost'].includes(field) ? Number(value) : value,
        };
      }

      return updated;
    });
  };

  // Tính tổng tiền
  const totalAmount = products.reduce(
    (acc, p) => acc + (p.cost ?? 0) * (p.inventory?.quantity ?? 0),
    0
  );

  // Xóa sản phẩm
  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((p) => p.sku !== id));
    setSelectedProduct({} as Product);
  };

  // Thêm sản phẩm mới
  const handleAddProduct = () => {
    setOpenAddProduct(true);
    setIsEditSelectProduct(false);
    setIsCreateSelectProduct(true);
    setSelectedProduct({} as Product);
  };

  // Format tiền tệ
  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const tableHeaders = [
    'Mã SP',
    'Tên sản phẩm',
    'Số lượng',
    'Giá nhập',
    'Giá bán',
    'Chiết khấu %',
    'CK bằng tiền',
    'VAT %',
    'Thành tiền',
    'Hành động',
  ];

  return (
    <>
      <div className="flex h-full overflow-hidden gap-6 ">
        {/* Main Content - Left Side */}
        <div className="flex-1 flex flex-col  overflow-hidden">
          {/* Header */}
          <div className="w-full bg-white mb-6 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-8  w-1/2">
              <h1 className="text-xl font-semibold text-gray-600 text-nowrap">Phiếu nhập hàng</h1>

              <Input
                radius="sm"
                size="sm"
                style={{ width: '100%' }}
                placeholder="Tìm kiếm hàng theo mã hoặc theo tên "
                rightSection={
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="p-2 rounded hover:bg-gray-200 transition duration-200 hover:cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Plus size={16} />
                  </button>
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Tooltip label="Quét mã vạch" position="bottom" withArrow>
                <button className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50  transition duration-200 cursor-pointer">
                  <ScanBarcode size={20} />
                </button>
              </Tooltip>
              <Tooltip label="Tải file" position="bottom" withArrow>
                <button className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50  transition duration-200 cursor-pointer">
                  <SaveAll size={20} />
                </button>
              </Tooltip>

              <Tooltip label="Hướng dẫn" position="bottom" withArrow>
                <button className="w-10 h-10 flex items-center justify-center text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50  transition duration-200 cursor-pointer">
                  <Ellipsis size={20} />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow flex items-center justify-center overflow-auto h-full">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4">
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
              <table className="w-full h-full table-auto border-collapse overflow-y-scroll">
                <thead className="bg-gray-100 border-b sticky top-0">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.sku}
                      onClick={() => setSelectedProduct(product as Product)}
                      className={`border-b cursor-pointer transition ${
                        selectedProduct?.sku === product.sku ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-2 text-sm text-gray-700">{product.sku || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{product.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <Input
                          type="number"
                          min={1}
                          size="sm"
                          value={String(product.inventory?.quantity) ?? 0}
                          onChange={(e) =>
                            handleChangeProductField(index, 'quantity', e.target.value)
                          }
                          className="w-24 text-right"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <Input
                          type="number"
                          size="sm"
                          value={String(product.cost) ?? 0}
                          onChange={(e) => handleChangeProductField(index, 'cost', e.target.value)}
                          className="w-24 text-right"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <Input
                          type="number"
                          size="sm"
                          value={String(product.price) ?? 0}
                          onChange={(e) => handleChangeProductField(index, 'price', e.target.value)}
                          className="w-24 text-right"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{0}%</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{0}%</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{0}%</td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {formatCurrency((product.cost ?? 0) * (product.inventory?.quantity ?? 0))}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProduct(product.sku || '');
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Add Button */}
          {products.length > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleAddProduct}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus size={18} />
                Thêm sản phẩm
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - Right Side */}
        <div className="w-1/4 bg-white rounded-lg  ">
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
                      size="sm"
                      radius="sm"
                      clearable
                      placeholder="Nhập ngày nhập"
                    />
                    <Input
                      className="flex-1"
                      size="sm"
                      radius="sm"
                      placeholder="Nhập số hóa đơn"
                      label="Số hóa đơn"
                    />
                  </div>
                  {/* Nhà cung cấp */}
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
                    <span className="text-gray-800 font-semibold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-base">Tổng tiền hoàn:</span>
                    <span className="text-gray-800 font-semibold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-pos-blue-500 text-lg font-medium">
                      Cần trả nhà cung cấp:
                    </span>
                    <span className="text-pos-blue-500 text-lg font-semibold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <Button title="Xác nhận thanh toán" />
          </div>
        </div>
      </div>

      {/* Add Product Drawer */}
      <Drawer
        title={isEditSelectProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        position="right"
        size="xl"
        opened={openAddProduct}
        onClose={() => {
          setOpenAddProduct(false);
        }}
      >
        <div className="bg-gray-100 rounded-md p-4 ">
          <div className="flex items-center justify-between">
            <h3 className="text-xl text-pos-blue-500 font-bold ">
              {isEditSelectProduct ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
            </h3>
            <button
              onClick={() => setSelectedProduct({} as Product)}
              className=" border border-pos-blue-500 rounded-md  px-8 py-1 text-pos-blue-500 cursor-pointer hover:bg-gray-100"
            >
              Làm mới
            </button>
          </div>
          <FormCreateProduct
            selectProduct={selectedProduct}
            openAddProduct={openAddProduct}
            isEditSelectProduct={isEditSelectProduct}
            isCreateSelectProduct={isCreateSelectProduct}
            setSelectProducts={setProducts as React.Dispatch<React.SetStateAction<any>>}
            setSelectProduct={setSelectedProduct}
            setOpenAddProduct={setOpenAddProduct}
            setOpenCreateCategoryModal={setOpenCreateCategoryModal}
          />
        </div>
      </Drawer>
    </>
  );
}
