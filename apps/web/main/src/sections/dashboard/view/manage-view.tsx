/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { useProduct } from '../../../../../main/src/hooks/product/use-product';
import { formatDate } from '../../../../../main/src/utils/index';

import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
import { ActionButtons } from '../components/action-buttons';
import { DataActionBar } from '../components/data-action-bar';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';
import { DisplayField } from '../components/display-field';
const tableHeaders = [
  'Mã Sản Phẩm',
  'Sản Phẩm',
  'Số lượng biến thể',
  'Tổng danh mục',
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
    pagination,
    paginationParams,
    filters,
    uploadProductByExcel,
    setPaginationParams,
    setFilters,
    deleteProduct,
    getProductById,
    exampleProductExcel,
    getProducts,
  } = useProduct();
  const currentStore = useAtomValue(currentStoreAtom);

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
        'Mã sản phẩm': p.sku,
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
              label: 'Trạng thái sản phẩm',
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
          placeholderSearch="Nhập tên sản phẩm, mã sản phẩm, barcode..."
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
              <td
                className="px-4 py-3 text-sm  font-semibold text-pos-blue-600 hover:underline cursor-pointer"
                onClick={() => router.push(`manage-products/detail/${product.id}`)}
              >
                {product.sku}
              </td>

              <td className="px-4 py-3 text-sm font-semibold text-gray-900">{product.name}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-500">
                {product.variant.length}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-500">
                {product.categories.length}
              </td>

              <td className="px-4 py-3">
                <span className={`text-sm font-medium ${statusColors[product.product_status]}`}>
                  {formatProductStatus(product.product_status)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(product.createdAt)}</td>
              <td>
                <ActionButtons
                  onView={() => {
                    router.push(`manage-products/detail/${product.id}`);
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
