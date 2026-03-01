'use client';

import { Table } from '@repo/design-system/components/ui';
import { useClickOutside } from '@repo/design-system/hooks/client';
import { Product, Variant } from '@repo/design-system/types';
import { useEffect, useRef, useState } from 'react';
import { useVariant } from '../../../hooks/variant/use-variant';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { FormVariant } from '../../../sections/dashboard/components';
import { ActionButtons } from '../../../sections/dashboard/components/action-buttons';
import { DataActionBar } from '../../../sections/dashboard/components/data-action-bar';
import { DeleteConfirmationModal } from '../../../sections/dashboard/components/delete-confirmation-modal';
import { DisplayField } from '../../../sections/dashboard/components/display-field';
import { formatCurrency, formatDate, truncateText } from '../../../utils';

const tableHeaders = [
  'Tên biến thể',
  'Mã biến thể',
  'Đơn vị gốc',
  'Đơn vị quy đổi',
  'Tồn kho',
  'Đơn đang về',
  'Giá bán',
  'Giá nhập',
  'Ngày tạo',
  'Thao tác',
];

export function InventoryManageView() {
  const refVariantSelect = useRef<HTMLDivElement>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isOpenModalVariant, setIsOpenModalVariant] = useState<boolean>(false);
  const [isOpenModalDeleteVariant, setIsOpenModalDeleteVariant] = useState<boolean>(false);
  const [isOpenMoreUnit, setIsOpenMoreUnit] = useState<boolean>(false);
  const {
    getVariantsInStore,
    removeVariant,
    setFilters,
    setPaginationParams,
    exportInventoryExcel,
    filters,
    variants,
    loading,
    pagination,
    paginationParams,
  } = useVariant();

  useEffect(() => {
    getVariantsInStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, filters]);
  useClickOutside(refVariantSelect, () => {
    setIsOpenMoreUnit(false);
  });

  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Quản lý hàng tồn kho">
          {/* <Button size="sm" radius="sm" title={'Thêm sản phẩm'} icon={<Plus size={'16'} />} /> */}
        </DisplayField>

        <DataActionBar
          isHaveUpload={false}
          dataComplete={[...new Set(variants?.map((p) => p.name) || [])]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          onExport={exportInventoryExcel}
          // onUpload={uploadProductByExcel}
          // onDownloadTemplate={exampleProductExcel}
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
          data={variants}
          isLoading={loading}
          renderRow={(variant) => (
            <>
              {/* <td
                className="px-4 py-3 text-sm  font-semibold text-pos-blue-600 hover:underline cursor-pointer"
                onClick={() => router.push(`manage-products/detail/${product.id}`)}
              >
                {product.sku}
              </td> */}

              <td className="px-4 py-2 ">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-900">{variant.name}</span>
                  <p className="text-sm text-gray-500">
                    SP gốc: {truncateText(variant.product?.name, 30)} -{' '}
                    <span>{variant.product?.sku}</span>
                  </p>
                </div>
              </td>
              <td className="px-4 py-2  text-sm  font-semibold text-pos-blue-600 hover:underline cursor-pointer">
                {variant?.sku}
              </td>
              <td className="px-4 py-2  font-medium text-gray-500 ">
                <span className="bg-pos-blue-50 text-pos-blue-500 text-sm rounded-sm p-2">
                  {variant?.product?.baseUnit}
                </span>
              </td>

              <td
                onClick={() => {
                  setSelectedVariant(variant);
                  setIsOpenMoreUnit(true);
                }}
                className="px-4 py-2 text-pos-blue-500 font-semibold text-sm cursor-pointer hover:underline"
              >
                <div className="relative" ref={refVariantSelect}>
                  <span className="">{variant?.conversions.length}</span>
                  <div
                    className={`space-y-3 absolute top-full left-0 bg-white px-2 py-3 text-nowrap  rounded-md w-fit shadow z-10 transform ease-in-out duration-200  ${isOpenMoreUnit && selectedVariant?.id === variant.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  >
                    {variant?.conversions.length === 0 ? (
                      <span className="text-sm text-gray-500 font-medium text-center ">
                        Không có đơn vị quy đổi!
                      </span>
                    ) : (
                      <>
                        {' '}
                        {variant.conversions.map((conversion) => (
                          <div
                            key={conversion.id}
                            className="text-sm font-semibold text-gray-500  flex items-center gap-2 "
                          >
                            <span>{conversion?.name}</span> =
                            <div>
                              <span>{conversion?.factor}</span>{' '}
                              <span>{variant?.product?.baseUnit}</span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 font-semibold">
                <span className="text-pos-blue-500"> {variant?.onHand}</span> /{' '}
                {variant?.product?.baseUnit}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 font-semibold">
                {' '}
                <span className="text-pos-blue-500"> {variant?.reserved}</span> /{' '}
                {variant?.product?.baseUnit}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 font-semibold">
                {formatCurrency(variant?.price)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 font-semibold">
                {formatCurrency(variant?.cost)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 font-semibold">
                {formatDate(variant?.createdAt)}
              </td>
              <td>
                <ActionButtons
                  onView={() => {
                    setSelectedVariant(variant);
                    setIsOpenModalVariant(true);
                  }}
                  onDelete={() => {
                    setSelectedVariant(variant);
                    setIsOpenModalDeleteVariant(true);
                  }}
                />
              </td>
            </>
          )}
        />
      </DashboardViewLayout>
      {selectedVariant && selectedVariant.id && selectedVariant?.product?.id && (
        <FormVariant
          isEdit={true || isOpenModalVariant}
          opened={isOpenModalVariant}
          onClose={() => setIsOpenModalVariant(false)}
          variantId={selectedVariant?.id || ''}
          product={selectedVariant?.product || ({} as Product)}
          baseProductUnit={selectedVariant?.product?.baseUnit || ''}
          getVariants={getVariantsInStore}
        />
      )}
      <DeleteConfirmationModal
        opened={isOpenModalDeleteVariant}
        loading={loading}
        title="Xác nhận xóa biến thể"
        itemName={selectedVariant?.name || ''}
        onClose={() => setIsOpenModalDeleteVariant(false)}
        onConfirm={async () => {
          const success = await removeVariant(
            selectedVariant?.id as string,
            selectedVariant?.product?.id as string
          );
          if (success) {
            getVariantsInStore();
            setIsOpenModalDeleteVariant(false);
          }
        }}
      />
    </>
  );
}
