/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '../../../../../main/src/utils/index';
import * as XLSX from 'xlsx';
import { useProduct } from '../../../../../main/src/hooks/product/use-product';

import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';
import { DataActionBar } from '../components/data-action-bar';
import { ActionButtons } from '../components/action-buttons';
import { DisplayField } from '../components/display-field';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
import { useRouter } from 'next/navigation';
const tableHeaders = [
  'Mã Sản Phẩm',
  'Sản Phẩm',
  'Tồn kho (gốc)',
  'Có thể bán',
  'Đang về kho',
  'Giá Nhập',
  'Giá Bán',
  'Trạng Thái',
  'Ngày Tạo',
  'Thao Tác',
];

const statusColors: Record<string, string> = {
  ACTIVE: ' text-green-500 bg-green-50 py-1.5 px-2.5 rounded-sm',
  INACTIVE: 'text-red-500 bg-red-50 py-1.5 px-2.5 rounded-sm',
};

const formatProductStatus = (status: string) => {
  const translations: Record<string, string> = {
    ACTIVE: 'Đang kinh doanh ',
    INACTIVE: 'Ngừng kinh doanh',
    SOLD: 'Đã bán hết',
  };
  return translations[status] || status;
};

export function ManageView() {
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const router = useRouter();
  const {
    products,
    loading,
    product,
    updateProductForm,
    pagination,
    paginationParams,
    filters,
    uploadProductByExcel,
    setPaginationParams,
    setFilters,
    deleteProduct,
    updateProduct,
    getProductById,
    exampleProductExcel,
    getProducts,
  } = useProduct();
  const currentStore = useAtomValue(currentStoreAtom);
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
        categoryIds: product.categories?.map((category) => category.id) || [],
      });
    }
  }, [product, updateProductForm]);
  useEffect(() => {
    if (!currentStore?.id) return;
    getProducts();
  }, [currentStore?.id, paginationParams, filters]);

  const handleExportExcel = () => {
    {
      if (!products || products.length === 0) {
        alert('Không có dữ liệu để xuất');
        return;
      }

      const formatted = products.map((p) => ({
        'Sản phẩm': p.name,
        'Số lượng': p.inventory?.quantity ?? '',
        'Mã sản phẩm': p.sku,
        'Giá nhập': p.cost,
        'Giá bán': p.price,
        'Trạng thái': formatProductStatus(p.product_status),
        'Ngày tạo': formatDate(p.createdAt),
      }));

      const worksheet = XLSX.utils.json_to_sheet(formatted);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sản phẩm');

      XLSX.writeFile(workbook, 'products.xlsx');
    }
  };
  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Danh sách sản phẩm">
          <Button
            onClick={() => router.push(`manage-products/create`)}
            size="sm"
            radius="sm"
            title={'Thêm sản phẩm'}
            icon={<Plus size={'16'} />}
          />
        </DisplayField>

        <DataActionBar
          dataComplete={[...new Set(products?.map((p) => p.name) || [])]}
          statusOptions={[
            {
              width: '280px',
              key: 'product_status',
              label: 'Trạng thái đơn hàng',
              options: [
                { value: 'ACTIVE', label: 'Đang kinh doanh ' },
                { value: 'INACTIVE', label: 'Ngừng kinh doanh' },
                { value: 'SOLD', label: 'Đã bán hết' },
              ],
            },
          ]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              product_status: newFilters.product_status,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          onExport={handleExportExcel}
          onUpload={uploadProductByExcel}
          onDownloadTemplate={exampleProductExcel}
          loading={loading}
          placeholderSearch="Nhập tên sản phẩm, mã sản phẩm"
        />

        {/* TABLE AND PAGINATION */}

        <Table
          hasMarginTop={false}
          total={pagination?.total}
          page={pagination?.page}
          totalPages={pagination?.totalPages}
          limit={pagination?.limit}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageSizeChange={(size) =>
            setPaginationParams((prev) => ({
              ...prev,
              limit: size,
            }))
          }
          onPageChange={(page) =>
            setPaginationParams((prev) => ({
              ...prev,
              page,
            }))
          }
          tableHeaders={tableHeaders}
          data={products}
          isLoading={loading}
          renderRow={(product) => (
            <>
              <td className="px-4 py-3 text-sm  font-semibold text-pos-blue-600">{product.sku}</td>

              <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-500">
                {product?.inventory?.quantity}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-500">
                {product?.inventory?.quantity}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-500">
                {product?.inventory?.quantity}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-500">
                {formatCurrency(product.cost)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-500">
                {formatCurrency(product.price)}
              </td>

              <td className="px-4 py-3">
                <span className={`text-sm font-medium ${statusColors[product.product_status]}`}>
                  {formatProductStatus(product.product_status)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(product.createdAt)}</td>
              <td>
                {/* <div className="flex items-center gap-5 pl-4">
                    <button
                      title="Xem chi tiết"
                      data-tooltip-target="tooltip-default"
                      onClick={() => {
                        setOpenViewModal(true);
                        getProductById(product.id);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-gray-700 hover:text-white opacity-70 transition-opacity duration-200"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      title="Sửa sản phẩm"
                      onClick={() => {
                        setOpenEditModal(true);
                        getProductById(product.id);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      title="Điều chỉnh số lượng"
                      onClick={() => {
                        setInventorModal(true);
                        getProductById(product.id);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-green-50 text-green-500 rounded-md hover:opacity-100 hover:bg-green-500 hover:text-green-50 opacity-70 transition-opacity duration-200"
                    >
                      <ShoppingBag size={16} />
                    </button>
                    <button
                      title="Xóa sản phẩm"
                      onClick={() => {
                        setDeleteModal(true);
                        getProductById(product.id);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-red-50 text-red-500 rounded-md hover:opacity-100 hover:bg-red-500 hover:text-white opacity-70 transition-opacity duration-200 ml-auto"
                    >
                      <Trash size={16} />
                    </button>
                  </div> */}
                <ActionButtons
                  onView={() => {
                    router.push(`manage-products/detail/${product.id}`);
                    getProductById(product.id);
                  }}
                  onDelete={() => {
                    setDeleteModal(true);
                    getProductById(product.id);
                  }}
                />
              </td>
            </>
          )}
        />
      </DashboardViewLayout>

      {/* DELETE MODAL */}
      <DeleteConfirmationModal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={async () => {
          if (product && product.id) {
            await deleteProduct(product?.id);
          }
          setDeleteModal(false);
        }}
        loading={loading}
        itemName={product?.name}
      />
    </>
  );
}
