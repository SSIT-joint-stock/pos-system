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
import { Drawer, Menu, Textarea } from '@mantine/core';
import useCategories, {
  CategoryFormData,
} from '../../../../../main/src/hooks/categories/use-categories';
import FormCreateProduct from '../components/form-create-product';

const tableHeaders = [
  'Mã SP',
  'Tên sản phẩm',
  'Số lô',
  'Hạn dùng',
  'Đơn vị',
  'Số lượng',
  'Giá nhập',
  'Giá bán',
  'Chiết khấu %',
  'CK bằng tiền',
  'VAT %',
  'Thành tiền',
  'Hành động',
];
const purchaseOrders = [
  {
    stt: 1,
    maSP: 'SP001',
    tenSP: 'Sản phẩm A',
    soLo: 'L001',
    hanDung: '12/2025',
    donVi: 'Cái',
    soLuong: 100,
    giaNhap: 50000,
    giaBan: 70000,
    chietKhauPhanTram: 5,
    chietKhauBangTien: 2500,
    vatPhanTram: 10,
    thanhTien: 4750000,
    hanhDong: 'Xóa',
  },
  {
    stt: 2,
    maSP: 'SP002',
    tenSP: 'Sản phẩm B',
    soLo: 'L002',
    hanDung: '11/2024',
    donVi: 'Hộp',
    soLuong: 50,
    giaNhap: 80000,
    giaBan: 100000,
    chietKhauPhanTram: 0,
    chietKhauBangTien: 0,
    vatPhanTram: 5,
    thanhTien: 4000000,
    hanhDong: 'Xóa',
  },
  {
    stt: 3,
    maSP: 'SP003',
    tenSP: 'Sản phẩm C',
    soLo: 'L003',
    hanDung: '01/2026',
    donVi: 'Chai',
    soLuong: 200,
    giaNhap: 30000,
    giaBan: 45000,
    chietKhauPhanTram: 10,
    chietKhauBangTien: 3000,
    vatPhanTram: 8,
    thanhTien: 5400000,
    hanhDong: 'Xóa',
  },
  {
    stt: 3,
    maSP: 'SP003',
    tenSP: 'Sản phẩm C',
    soLo: 'L003',
    hanDung: '01/2026',
    donVi: 'Chai',
    soLuong: 200,
    giaNhap: 30000,
    giaBan: 45000,
    chietKhauPhanTram: 10,
    chietKhauBangTien: 3000,
    vatPhanTram: 8,
    thanhTien: 5400000,
    hanhDong: 'Xóa',
  },
  {
    stt: 3,
    maSP: 'SP003',
    tenSP: 'Sản phẩm C',
    soLo: 'L003',
    hanDung: '01/2026',
    donVi: 'Chai',
    soLuong: 200,
    giaNhap: 30000,
    giaBan: 45000,
    chietKhauPhanTram: 10,
    chietKhauBangTien: 3000,
    vatPhanTram: 8,
    thanhTien: 5400000,
    hanhDong: 'Xóa',
  },
  {
    stt: 3,
    maSP: 'SP003',
    tenSP: 'Sản phẩm C',
    soLo: 'L003',
    hanDung: '01/2026',
    donVi: 'Chai',
    soLuong: 200,
    giaNhap: 30000,
    giaBan: 45000,
    chietKhauPhanTram: 10,
    chietKhauBangTien: 3000,
    vatPhanTram: 8,
    thanhTien: 5400000,
    hanhDong: 'Xóa',
  },
  {
    stt: 3,
    maSP: 'SP003',
    tenSP: 'Sản phẩm C',
    soLo: 'L003',
    hanDung: '01/2026',
    donVi: 'Chai',
    soLuong: 200,
    giaNhap: 30000,
    giaBan: 45000,
    chietKhauPhanTram: 10,
    chietKhauBangTien: 3000,
    vatPhanTram: 8,
    thanhTien: 5400000,
    hanhDong: 'Xóa',
  },
  {
    stt: 3,
    maSP: 'SP003',
    tenSP: 'Sản phẩm C',
    soLo: 'L003',
    hanDung: '01/2026',
    donVi: 'Chai',
    soLuong: 200,
    giaNhap: 30000,
    giaBan: 45000,
    chietKhauPhanTram: 10,
    chietKhauBangTien: 3000,
    vatPhanTram: 8,
    thanhTien: 5400000,
    hanhDong: 'Xóa',
  },
  {
    stt: 3,
    maSP: 'SP003',
    tenSP: 'Sản phẩm C',
    soLo: 'L003',
    hanDung: '01/2026',
    donVi: 'Chai',
    soLuong: 200,
    giaNhap: 30000,
    giaBan: 45000,
    chietKhauPhanTram: 10,
    chietKhauBangTien: 3000,
    vatPhanTram: 8,
    thanhTien: 5400000,
    hanhDong: 'Xóa',
  },
  {
    stt: 3,
    maSP: 'SP003',
    tenSP: 'Sản phẩm C',
    soLo: 'L003',
    hanDung: '01/2026',
    donVi: 'Chai',
    soLuong: 200,
    giaNhap: 30000,
    giaBan: 45000,
    chietKhauPhanTram: 10,
    chietKhauBangTien: 3000,
    vatPhanTram: 8,
    thanhTien: 5400000,
    hanhDong: 'Xóa',
  },
];

export function PurchaseOrders() {
  const [openTutorial, setOpenTutorial] = React.useState(false);
  const [openAddSupplier, setOpenAddSupplier] = React.useState(false);
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [openAction, setOpenAction] = React.useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
  });
  const { handleCreateCategory } = useCategories();
  const [formErrors, setFormErrors] = useState<Partial<CategoryFormData>>({});
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState<boolean>(false);

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
        title="Thêm sản phẩm mới"
        position="right"
        size="xl"
        opened={openAddProduct}
        onClose={() => {
          setOpenAddProduct(false);
        }}
      >
        <div className="bg-gray-100 rounded-md p-4 ">
          <div className="flex items-center justify-between">
            <h3 className="text-xl text-pos-blue-500 font-bold ">Tạo sản phẩm</h3>
            <button className=" border border-pos-blue-500 rounded-md  px-8 py-1 text-pos-blue-500 cursor-pointer hover:bg-gray-100">
              Làm mới
            </button>
          </div>
          <FormCreateProduct
            openAddProduct={openAddProduct}
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
          setFormData({ name: '', description: '' });
          setFormErrors({});
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
        <div className="space-y-4">
          <Input
            label="Tên danh mục"
            placeholder="Nhập tên danh mục..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            maxLength={255}
          />

          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả danh mục (tùy chọn)..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={formErrors.description}
            minRows={3}
            maxLength={1000}
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setOpenCreateCategoryModal(false);
                setFormData({ name: '', description: '' });
                setFormErrors({});
              }}
              className="text-red-500 hover:underline"
            >
              Hủy
            </button>
            <Button
              onClick={() => {
                handleCreateCategory(formData);
                setOpenCreateCategoryModal(false);
                setFormData({ name: '', description: '' });
                setFormErrors({});
              }}
              title="Tạo danh mục"
              size="sm"
              radius="md"
              // disabled={submitting}
            />
          </div>
        </div>
      </Modal>

      <div className="flex items-center justify-between">
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
                onClick={handleOpenAddProduct}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-pos-blue-500 hover:bg-pos-blue-600 transition-all"
              >
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm trong phiếu nhập */}

      <div className="flex-1 h-full">
        <Table
          hasMarginTop={false}
          tableHeaders={tableHeaders}
          data={purchaseOrders}
          hasPagination={false}
          className="h-full"
          renderRow={(product) => {
            return (
              <>
                <td className="px-4 py-2 text-sm text-gray-700">{product.maSP}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.tenSP}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.soLo}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.hanDung}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.donVi}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.soLuong}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {product.giaNhap.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {product.giaBan.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.chietKhauPhanTram}%</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {product.chietKhauBangTien.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.vatPhanTram}%</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {product.thanhTien.toLocaleString()}
                </td>
                <td>
                  <div className="flex items-center gap-5 pl-4">
                    <button
                      title="Sửa sản phẩm"
                      onClick={() => {
                        //   setOpenEditModal(true);
                        //   getProductById(product.id);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      title="Xóa sản phẩm"
                      onClick={() => {
                        //   setDeleteModal(true);
                        //   getProductById(product.id);
                      }}
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
          placeholder="0 đ"
          className="placeholder:text-gray-800 font-bold"
        />
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-1">
          <span className="text-sm text-gray-600 font-medium">Tổng tiền hàng:</span>
          <span className="text-lg text-pos-blue-500 font-bold">0 đ</span>
        </div>
        <button className="flex items-center justify-center gap-3 border border-pos-blue-500 hover:border-pos-blue-600 text-pos-blue-500 hover:text-pos-blue-600 font-medium rounded-lg px-3 py-1 transition-all duration-300 shadow-sm">
          <CircleCheck size={18} />
          <span>Trả đủ</span>
        </button>
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-1">
          <span className="text-sm text-gray-600 font-medium">Hoàn tiền:</span>
          <span className="text-lg text-pos-blue-500 font-bold">0 đ</span>
        </div>
        <button className="flex items-center justify-center gap-3 bg-pos-blue-500 hover:bg-pos-blue-600 text-white font-medium rounded-lg px-3 py-1 transition-all duration-300 shadow-sm">
          <Receipt size={18} />
          <span>Thanh toán</span>
        </button>
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-1">
          <span className="text-sm text-gray-600 font-medium">Cần trả nhà cung cấp:</span>
          <span className="text-lg text-pos-blue-500 font-bold">0 đ</span>
        </div>
      </div>
    </div>
  );
}
