'use client';
import { Button, Input, Modal, Select, Table } from '@repo/design-system/components/ui';
import { useClickOutside } from '../../../../../../../packages/design-system/src/hooks/client';
import FilterBar from '../components/filter-bar';
import {
  BadgeAlert,
  Download,
  Edit,
  Eye,
  Pencil,
  ShoppingBag,
  ShoppingCart,
  Trash,
  Upload,
} from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { formatCurrency, formatDate } from '../../../../../main/src/utils/index';
import { useProduct } from '../../../../../main/src/hooks/product/use-product';
import { Controller } from 'react-hook-form';
import Image from 'next/image';
import { MultiSelect } from '@mantine/core';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { useCategories } from '../../../../../main/src/hooks/categories/use-categories';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const tableHeaders = [
  'Sản Phẩm',
  'Số lượng',
  'Mã Sản Phẩm',
  'Giá Nhập',
  'Giá Bán',
  'Trạng Thái',
  'Ngày Tạo',
  'Thao Tác',
];

const statusColors: Record<string, string> = {
  ACTIVE: 'text-green-500 bg-green-50 py-1.5 px-2.5 rounded-md',
  INACTIVE: 'text-red-500 bg-red-50 py-1.5 px-2.5 rounded-md',
};

const formatProductStatus = (status: string) => {
  const translations: Record<string, string> = {
    ACTIVE: 'Đang kinh doanh',
    INACTIVE: 'Ngừng kinh doanh',
    SOLD: 'Đã bán',
  };
  return translations[status] || status;
};

export function ManageView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [inventoryModal, setInventorModal] = useState(false);
  const [adjustValue, setAdjustValue] = useState({ delta: '0' });
  const [type, setType] = useState('SALE');
  const [openUploadOption, setOpenUploadOption] = useState(false);

  const {
    products,
    loading,
    product,
    updateProductForm,
    pagination,
    paginationParams,
    filters,
    applyStockMovement,
    uploadProductByExcel,
    setPaginationParams,
    setFilters,
    deleteProduct,
    updateProduct,
    getProductById,
    exampleProductExcel,
    getProducts,
  } = useProduct();

  const { categories, getCategories } = useCategories();
  const currentStore = useAtomValue(currentStoreAtom);
  useClickOutside(uploadMenuRef, () => setOpenUploadOption(false));

  useEffect(() => {
    if (product) {
      updateProductForm.reset({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        price: product.price || 0,
        cost: product.cost || 0,
        image_url: product.image_url || '',
        description: product.description || '',
        product_status: product.product_status || 'ACTIVE',
        categoryIds: product.categories?.map((c) => c.id) || [],
      });
    }
  }, [product, updateProductForm]);

  useEffect(() => {
    if (!currentStore?.id) return;
    getProducts();
  }, [currentStore?.id, paginationParams, filters]);

  useEffect(() => {
    if (!currentStore?.id) return;
    getCategories();
  }, [currentStore?.id]);

  // ✅ Export to Excel
  const handleExportExcel = () => {
    if (!products || products.length === 0) {
      alert('Không có dữ liệu để xuất.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      products.map((p) => ({
        'Tên Sản Phẩm': p.name,
        'Mã Sản Phẩm': p.sku,
        'Số Lượng': p.inventory?.quantity ?? 0,
        'Giá Nhập': p.cost,
        'Giá Bán': p.price,
        'Trạng Thái': formatProductStatus(p.product_status),
        'Ngày Tạo': formatDate(p.createdAt),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sản phẩm');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'products.xlsx');
  };

  return (
    <>
      {/* DELETE MODAL */}
      <Modal opened={deleteModal} size="sm" onClose={() => setDeleteModal(false)}>
        <div className="space-y-3 flex flex-col items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
              <BadgeAlert size={38} />
            </div>
            <div className="text-lg font-bold text-center">Bạn Có Chắc Chắn Muốn Xóa?</div>
            <div className="text-sm text-gray-500 text-center">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan của trường này sẽ biến mất.
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Button
              style={{ width: '100%' }}
              color="red"
              size="md"
              onClick={() => {
                if (product?.id) deleteProduct(product.id);
                setDeleteModal(false);
              }}
              className="bg-red-600 rounded-lg text-white cursor-pointer font-bold"
              title="Xác nhận xóa"
            />
            <button onClick={() => setDeleteModal(false)} className="cursor-pointer">
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* TABLE + FILTER BAR */}
      <div className="flex flex-col h-full">
        <FilterBar
          dataComplete={[...new Set(products?.map((p) => p.name) || [])]}
          statusOptions={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'INACTIVE', label: 'INACTIVE' },
            { value: 'SOLD', label: 'SOLD' },
          ]}
          onFilterChange={(newFilters) =>
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              product_status: newFilters.status,
            }))
          }
          onSearch={(value) => setFilters((prev) => ({ ...prev, q: value }))}
          actions={
            <>
              {/* UPLOAD BUTTON GROUP */}
              <div className="relative" ref={uploadMenuRef}>
                <button
                  onClick={() => setOpenUploadOption((prev) => !prev)}
                  disabled={loading}
                  className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={16} />
                  <span className="text-gray-900 font-medium text-sm">Tải lên dữ liệu</span>
                </button>

                {openUploadOption && (
                  <div className="absolute top-full left-0 mt-1 z-50 flex flex-col rounded-md shadow-md shadow-gray-100">
                    <button
                      disabled={loading}
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white py-2 px-4 text-left hover:bg-gray-50 rounded-t-md cursor-pointer"
                    >
                      <span className="text-gray-900 font-medium text-sm">
                        Tải lên dữ liệu (Excel)
                      </span>
                      <input
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadProductByExcel(file);
                        }}
                        hidden
                        type="file"
                        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      />
                    </button>
                    <button
                      disabled={loading}
                      onClick={exampleProductExcel}
                      className="bg-white hover:bg-gray-50 py-2 px-4 text-left rounded-b-md cursor-pointer"
                    >
                      <span className="text-gray-900 font-medium text-sm">
                        Tải file mẫu (Excel)
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* ✅ FIXED EXPORT BUTTON */}
              <button
                onClick={handleExportExcel}
                className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center justify-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <Download size={16} className="shrink-0" />
                <span className="text-gray-900 font-medium text-sm whitespace-nowrap">
                  Xuất dữ liệu
                </span>
              </button>
            </>
          }
        />

        {/* TABLE */}
        <Table
          total={pagination?.total}
          page={pagination?.page}
          totalPages={pagination?.totalPages}
          limit={pagination?.limit}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageSizeChange={(size) => setPaginationParams((prev) => ({ ...prev, limit: size }))}
          onPageChange={(page) => setPaginationParams((prev) => ({ ...prev, page }))}
          tableHeaders={tableHeaders}
          data={products}
          isLoading={loading}
          renderRow={(p) => (
            <>
              <td className="px-4 py-2 text-xs font-medium text-gray-900">{p.name}</td>
              <td className="px-4 py-2 text-xs font-medium text-gray-900">
                {p?.inventory?.quantity}
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">{p.sku}</td>
              <td className="px-4 py-2 text-xs text-gray-500">{formatCurrency(p.cost)}</td>
              <td className="px-4 py-2 text-xs text-gray-500">{formatCurrency(p.price)}</td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs font-medium rounded-xl ${statusColors[p.product_status]}`}
                >
                  {formatProductStatus(p.product_status)}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">{formatDate(p.createdAt)}</td>
              <td>
                <div className="flex items-center gap-5 pl-4">
                  <button
                    title="Xem chi tiết"
                    onClick={() => {
                      setOpenViewModal(true);
                      getProductById(p.id);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:bg-gray-700 hover:text-white transition"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    title="Sửa sản phẩm"
                    onClick={() => {
                      setOpenEditModal(true);
                      getProductById(p.id);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-pos-blue-50 text-pos-blue-500 rounded-md hover:bg-pos-blue-500 hover:text-white transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    title="Điều chỉnh số lượng"
                    onClick={() => {
                      setInventorModal(true);
                      getProductById(p.id);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-green-50 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition"
                  >
                    <ShoppingBag size={16} />
                  </button>
                  <button
                    title="Xóa sản phẩm"
                    onClick={() => {
                      setDeleteModal(true);
                      getProductById(p.id);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition ml-auto"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </div>
    </>
  );
}
