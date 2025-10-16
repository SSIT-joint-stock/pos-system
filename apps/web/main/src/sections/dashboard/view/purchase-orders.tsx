'use client';
import React, { useState } from 'react';
import { Button, DatePickerInput, Input, Modal, Table } from '@repo/design-system/components/ui';
import {
  CircleCheck,
  CircleEllipsis,
  Edit,
  FileDown,
  FileUp,
  NotebookText,
  NotepadText,
  Plus,
  Receipt,
  Search,
  Trash,
} from 'lucide-react';
import { Drawer, Menu } from '@mantine/core';

import FormCreateProduct from '../components/form-create-product';
import { useCategories } from '../../../../../main/src/hooks/categories/use-categories';
import FormCreateCategory from '../components/form-create-category';
import { Product } from '@repo/design-system/types';
import { formatCurrency } from '../../../../../main/src/utils';
import { useProduct } from '../../../../../main/src/hooks/product/use-product';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
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

export function PurchaseOrders() {
  const [openTutorial, setOpenTutorial] = React.useState(false);
  const [openAddSupplier, setOpenAddSupplier] = React.useState(false);
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [openAction, setOpenAction] = React.useState(false);
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState<boolean>(false);
  const [selectProduct, setSelectProduct] = useState<Product>({} as Product);
  const [selectProducts, setSelectProducts] = useState<Partial<Product>[]>([]);
  const [isEditSelectProduct, setIsEditSelectProduct] = useState<boolean>(false);
  const [isCreateSelectProduct, setIsCreateSelectProduct] = useState<boolean>(false);

  const { createCategory, createCategoryForm, loading } = useCategories();
  const { createInvoiceProduct } = useProduct();
  const { showInfoToast } = useToast();

  const handleOpenTutorial = () => {
    setOpenTutorial(true);
  };
  const handleOpenAddSupplier = () => {
    setOpenAddSupplier(true);
  };
  const handleOpenAddProduct = () => {
    setOpenAddProduct(true);
  };
  const handleOpenAction = () => {
    setOpenAction(true);
  };
  const handleSubmitCreate = async (data: any) => {
    const result = await createCategory(data);
    if (result) {
      setOpenCreateCategoryModal(false);
      createCategoryForm.reset();
    }
  };
  const handleChangeProductField = (
    index: number,
    field: keyof Product | 'quantity',
    value: any
  ) => {
    setSelectProducts((prev) => {
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
  const totalAmount = React.useMemo(() => {
    return selectProducts.reduce((acc, p) => acc + (p.cost ?? 0) * (p.inventory?.quantity ?? 0), 0);
  }, [selectProducts]);
  const handleSubmitCreateInvoiceProducts = async () => {
    const items = selectProducts.map((p) => ({
      product_id: p.id,
      name: p.name,
      sku: p.sku,
      cost: Number(p.cost) ?? 0,
      price: Number(p.price) ?? 0,
      barcode: p.barcode,
      initial_quantity: Number(p.inventory?.quantity) ?? 1,
      description: p.description,
      categoryIds: p.categoryIds?.map((c) => c) ?? [],
      meta: {},
    }));
    await createInvoiceProduct(items as any);
    setSelectProducts([]);
  };
  console.log(selectProducts);

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Tutorial Modal */}
      <Drawer
        opened={openTutorial}
        position="right"
        title="Hướng dẫn sử dụng"
        onClose={() => {
          setOpenTutorial(false);
        }}
      >
        <div className="space-y-3  overflow-y-auto border border-gray-200 p-4 rounded-lg shadow-inner">
          <p className="text-gray-700">
            1. Mục đích: Chức năng phiếu nhập hàng giúp người dùng quản lý việc nhập hàng từ nhà
            cung cấp một cách hiệu quả và chính xác.
          </p>
          <p className="text-gray-700">2. Các bước thực hiện:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Nhập thông tin phiếu nhập: Chọn ngày nhập, nhà cung cấp, số hóa đơn và các thông tin
              liên quan khác.
            </li>
            <li>
              Thêm sản phẩm: Sử dụng thanh tìm kiếm để thêm sản phẩm đã có trong kho hoặc thêm sản
              phẩm mới nếu cần.
            </li>
            <li>
              Điền thông tin sản phẩm: Nhập số lượng, giá nhập, giá bán, chiết khấu và VAT cho từng
              sản phẩm.
            </li>
            <li>
              Xem tổng tiền hàng: Hệ thống sẽ tự động tính toán tổng tiền hàng dựa trên các sản phẩm
              đã nhập.
            </li>
            <li>Thanh toán: Chọn phương thức thanh toán và hoàn tất quá trình nhập hàng.</li>
          </ul>
          <p className="text-gray-700">3. Lưu ý:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Đảm bảo nhập đúng thông tin để tránh sai sót trong quá trình quản lý kho.</li>
            <li>Sử dụng chức năng tìm kiếm để nhanh chóng thêm sản phẩm đã có trong kho.</li>
            <li>Kiểm tra lại tổng tiền hàng trước khi hoàn tất thanh toán.</li>
          </ul>
        </div>
      </Drawer>
      {/* Add Supplier Modal */}
      <Modal
        opened={openAddSupplier}
        title="Thêm nhà phân phối - nhà cung cấp - nhà sản xuất - đối tác"
        size="xl"
        onClose={() => {
          setOpenAddSupplier(false);
        }}
      >
        <div className="px-4 py-2 space-y-4">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">Mã số thuế</p>
            <div className="flex items-center justify-center gap-3">
              <Input size="sm" placeholder="Nhập mã số thuế..." className="flex-1" />
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-pos-blue-500 hover:bg-pos-blue-600 transition-all">
                <Search size={16} className="text-white" />
                <span className="text-white text-sm">Tìm kiếm</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold">Tên nhà cung cấp</p>
              <Input size="sm" placeholder="Nhập tên nhà cung cấp" className="flex-1" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold">Số điện thoại</p>
              <Input size="sm" placeholder="Nhập số điện thoại" className="flex-1" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold">Email</p>
              <Input size="sm" placeholder="Nhập email" className="flex-1" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold">Địa chỉ</p>
              <Input size="sm" placeholder="Nhập địa chỉ" className="flex-1" />
            </div>
          </div>
          <button className="my-2.5 bg-pos-blue-500 w-full px-2 py-1 text-white text-lg font-semibold rounded-md hover:bg-pos-blue-600 transition-all duration-300 ">
            Tạo mới
          </button>
        </div>
      </Modal>
      {/* Add Product Modal */}
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
              onClick={() => setSelectProduct({} as Product)}
              className=" border border-pos-blue-500 rounded-md  px-8 py-1 text-pos-blue-500 cursor-pointer hover:bg-gray-100"
            >
              Làm mới
            </button>
          </div>
          <FormCreateProduct
            selectProduct={selectProduct}
            openAddProduct={openAddProduct}
            isEditSelectProduct={isEditSelectProduct}
            isCreateSelectProduct={isCreateSelectProduct}
            setSelectProducts={setSelectProducts as React.Dispatch<React.SetStateAction<any>>}
            setSelectProduct={setSelectProduct}
            setOpenAddProduct={setOpenAddProduct}
            setOpenCreateCategoryModal={setOpenCreateCategoryModal}
          />
        </div>
      </Drawer>
      {/* MODAL ADD CATEGORY */}
      <Modal
        opened={openCreateCategoryModal}
        onClose={() => {
          setOpenCreateCategoryModal(false);
        }}
        size="lg"
        title={
          <div className="flex items-center gap-3 font-semibold text-lg text-gray-600">
            <div className="bg-green-100 p-2 rounded-lg">
              <Plus size={18} className="text-green-600" />
            </div>
            <span>Tạo danh mục mới</span>
          </div>
        }
      >
        <FormCreateCategory
          createCategoryForm={createCategoryForm}
          handleSubmitCreate={handleSubmitCreate}
          setOpenCreateModal={setOpenCreateCategoryModal}
          loading={loading}
        />
      </Modal>

      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-md">
        <div className="flex items-center gap-3">
          <NotepadText size={30} className="text-pos-blue-500" />
          <h1 className="text-2xl font-bold text-pos-blue-500">PHIẾU NHẬP HÀNG</h1>
        </div>
        <div className="flex items-center  gap-9">
          {/* Action Modal */}
          <Menu
            width={200}
            position="bottom-end"
            opened={openAction}
            onClose={() => setOpenAction(false)}
          >
            <Menu.Target>
              <div
                onClick={handleOpenAction}
                className="flex items-center justify-center cursor-pointer gap-1  group transition-all duration-300"
              >
                <CircleEllipsis size={20} className="text-gray-500 group-hover:text-pos-blue-500" />
                <span className="text-sm text-gray-500 font-semibold group-hover:text-pos-blue-500">
                  Hành động
                </span>
              </div>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>
                <div className="flex items-center  gap-2">
                  <FileUp className="text-pos-blue-500" size={16} />
                  <span className="text-pos-blue-500">Xuất Excel</span>
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className="flex items-center  gap-2">
                  <FileUp size={16} className="text-pos-blue-500" />
                  <span className="text-pos-blue-500">Xuất JSON</span>
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className="flex items-center  gap-2">
                  <FileDown className="text-green-600" size={16} />
                  <span className="text-green-600">Nhập File</span>
                </div>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <div
            onClick={handleOpenTutorial}
            className="flex items-center justify-center  cursor-pointer gap-1 group transition-all duration-300"
          >
            <NotebookText size={20} className="text-gray-500 group-hover:text-pos-blue-500" />
            <span className="text-sm text-gray-500 font-semibold group-hover:text-pos-blue-500">
              Hướng dẫn
            </span>
          </div>
        </div>
      </div>

      {/* Form nhập thông tin phiếu nhập */}
      <div className="flex flex-col gap-4 bg-white rounded-xl shadow-sm py-3 px-5  border border-gray-100">
        {/* Ngày nhập && Số phiếu nhập  */}
        <div className="flex items-center gap-3">
          <DatePickerInput
            label="Ngày nhập"
            size="sm"
            placeholder="VD: 06/10/2025"
            className="flex-1"
          />
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-300">
              Nhà cung cấp
            </span>
            <div className="flex items-center gap-1 flex-1">
              <Input size="sm" placeholder="Tìm kiếm nhà cung cấp..." className="flex-1" />

              <Button
                size="sm"
                onClick={handleOpenAddSupplier}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-pos-blue-500 hover:bg-pos-blue-600 transition-all"
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
          <Input
            label="Số phiếu nhập"
            size="sm"
            placeholder="Tự động tạo"
            disabled
            className="flex-1"
          />
        </div>
        {/* Nhà cung cấp && Them san pham*/}

        <div className="flex items-center gap-3">
          <Input label="Số hóa đơn" size="sm" placeholder="Nhập số hóa đơn" className="flex-1" />
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-300">
              Thêm sản phầm đã có
            </span>
            <div className="flex items-center gap-1 flex-1">
              <Input size="sm" placeholder="Tìm kiếm sản phẩm..." className="flex-1" />

              <Button
                size="sm"
                onClick={() => {
                  handleOpenAddProduct();
                  setIsEditSelectProduct(false);
                  setIsCreateSelectProduct(true);
                  setSelectProduct({} as Product);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-pos-blue-500 hover:bg-pos-blue-600 transition-all"
              >
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm trong phiếu nhập */}

      <div className="flex-1 overflow-y-scroll">
        <Table
          hasMarginTop={false}
          tableHeaders={tableHeaders}
          data={selectProducts || []}
          hasPagination={false}
          className="h-full"
          renderRow={(product, index) => {
            return (
              <>
                <td className="px-4 py-2 text-sm text-gray-700">{product.sku || 'N/A'}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.name}</td>

                <td className="px-4 py-2 text-sm text-gray-700">
                  <Input
                    type="number"
                    min={1}
                    size="sm"
                    value={String(product.inventory?.quantity) ?? 0}
                    onChange={(e) => handleChangeProductField(index, 'quantity', e.target.value)}
                    className="w-24 text-right"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <Input
                    type="number"
                    size="sm"
                    value={String(product.cost) ?? 0}
                    onChange={(e) => handleChangeProductField(index, 'cost', e.target.value)}
                    className="w-24 text-right"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <Input
                    type="number"
                    size="sm"
                    value={String(product.price) ?? 0}
                    onChange={(e) => handleChangeProductField(index, 'price', e.target.value)}
                    className="w-24 text-right"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{0}%</td>
                <td className="px-4 py-2 text-sm text-gray-700">{0}%</td>
                <td className="px-4 py-2 text-sm text-gray-700">{0}%</td>
                <td className="px-4 py-2 text-sm text-gray-700">{formatCurrency(totalAmount)}</td>
                <td>
                  <div className="flex items-center gap-5 pl-4">
                    <button
                      title="Sửa sản phẩm"
                      onClick={() => {
                        // handleOpenAddProduct();
                        // setIsEditSelectProduct(true);
                        // setIsCreateSelectProduct(false);
                        // setSelectProduct(product as Product);
                        showInfoToast('Tính năng đang được cập nhật');
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      title="Xóa sản phẩm"
                      onClick={() =>
                        setSelectProducts((prev) => prev.filter((p) => p.sku !== product.sku))
                      }
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-red-50 text-red-500 rounded-md hover:opacity-100 hover:bg-red-500 hover:text-white opacity-70 transition-opacity duration-200 ml-auto"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </>
            );
          }}
        />
      </div>
      <div className="bg-white rounded-lg px-5 py-2 grid grid-cols-2 items-center gap-4">
        <Input
          size="sm"
          type="number"
          // placeholder="0 đ"
          // disabled
          className="placeholder:text-gray-800 font-bold"
          value={String(totalAmount * selectProducts.length)}
        />
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-1">
          <span className="text-sm text-gray-600 font-medium">Tổng tiền hàng:</span>
          <span className="text-lg text-pos-blue-500 font-bold">
            {formatCurrency(totalAmount * selectProducts.length)}
          </span>
        </div>
        <button className="flex items-center justify-center gap-3 border border-pos-blue-500 hover:border-pos-blue-600 text-pos-blue-500 hover:text-pos-blue-600 font-medium rounded-lg px-3 py-1 transition-all duration-300 shadow-sm">
          <CircleCheck size={18} />
          <span>Trả đủ</span>
        </button>
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-1">
          <span className="text-sm text-gray-600 font-medium">Hoàn tiền:</span>
          <span className="text-lg text-pos-blue-500 font-bold">
            {' '}
            {formatCurrency(totalAmount * selectProducts.length)}
          </span>
        </div>
        <button
          onClick={handleSubmitCreateInvoiceProducts}
          className="flex items-center justify-center gap-3 bg-pos-blue-500 hover:bg-pos-blue-600 text-white font-medium rounded-lg px-3 py-1 transition-all duration-300 shadow-sm cursor-pointer"
        >
          <Receipt size={18} />
          <span>Thanh toán</span>
        </button>
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-1">
          <span className="text-sm text-gray-600 font-medium">Cần trả nhà cung cấp:</span>
          <span className="text-lg text-pos-blue-500 font-bold">
            {' '}
            {formatCurrency(totalAmount * selectProducts.length)}
          </span>
        </div>
      </div>
    </div>
  );
}
