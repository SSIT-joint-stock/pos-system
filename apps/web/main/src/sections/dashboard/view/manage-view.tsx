/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Button, Input, Select, Table } from '@repo/design-system/components/ui';
import { Pencil, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '../../../../../main/src/utils/index';
import * as XLSX from 'xlsx';
import { useProduct } from '../../../../../main/src/hooks/product/use-product';
import { Controller } from 'react-hook-form';
import Image from 'next/image';
import { MultiSelect } from '@mantine/core';

import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { useCategories } from '../../../../../main/src/hooks/categories/use-categories';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';
import { ModalFormWrapper } from '../components/modal-form-wrapper';
import { DataActionBar } from '../components/data-action-bar';
import { ActionButtons } from '../components/action-buttons';
import { DisplayField } from '../components/display-field';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
const tableHeaders = [
  'Mã Sản Phẩm',
  'Sản Phẩm',
  'Số lượng',
  'Giá Nhập',
  'Giá Bán',
  'Trạng Thái',
  'Ngày Tạo',
  'Thao Tác',
];

const statusColors: Record<string, string> = {
  ACTIVE: ' text-green-500 bg-green-50 py-1.5 px-2.5 rounded-md',
  INACTIVE: 'text-red-500 bg-red-50 py-1.5 px-2.5 rounded-md',
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
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

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
  const { categories, getCategories } = useCategories();
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
  useEffect(() => {
    if (!currentStore?.id) return;
    getCategories();
  }, [currentStore?.id]);

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
        <DisplayField label="Danh sách sản phẩm" />

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

              <td className="px-4 py-3 text-base font-medium text-gray-500">{product.name}</td>
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
                <span
                  className={`text-sm font-medium rounded-xl ${statusColors[product.product_status]}`}
                >
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
                    setOpenViewModal(true);
                    getProductById(product.id);
                  }}
                  onEdit={() => {
                    setOpenEditModal(true);
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

      {/* MODAL VIEW and EDIT PRODUCT */}
      <ModalFormWrapper
        opened={openEditModal || openViewModal}
        onClose={() => {
          setOpenEditModal(false);
          setOpenViewModal(false);
        }}
        title={openEditModal ? 'Chỉnh sửa sản phẩm' : 'Xem thông tin sản phẩm'}
        icon={openEditModal ? <Pencil size={20} /> : <ShoppingCart size={20} />}
        onSubmit={updateProductForm.handleSubmit(async (data) => {
          if (product && product.id) {
            await updateProduct(product?.id, data);
          }
          setOpenEditModal(false);
        })}
        loading={loading}
      >
        <form
          onSubmit={updateProductForm.handleSubmit(async (data) => {
            if (product && product.id) {
              await updateProduct(product?.id, data);
            }
            setOpenEditModal(false);
          })}
          className={`${openEditModal ? 'space-y-3.5' : '"space-y-5.5"'}`}
        >
          {/* IMAGE + INFO GRID */}
          <div
            className={`${openEditModal ? 'flex flex-col gap-5.5' : 'grid grid-cols-1 md:grid-cols-3 gap-5.5'}`}
          >
            {/* IMAGE */}
            <div>
              <div className={`${openEditModal ? 'flex items-center justify-center' : ''}`}>
                <Image
                  width={1000}
                  height={1000}
                  src={'/placeholder.jpg'}
                  alt={product?.name || 'Image name'}
                  className="w-48 h-48 object-cover rounded-lg shadow"
                  unoptimized
                />
              </div>

              {openEditModal && (
                <Input
                  size="sm"
                  {...updateProductForm.register('image_url')}
                  name="image_url"
                  label="Image URL"
                  className="mt-4 w-full"
                />
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4  ">
              {/* Name */}
              {openEditModal ? (
                <Input
                  size="sm"
                  {...updateProductForm.register('name')}
                  name="name"
                  label="Tên sản phẩm"
                />
              ) : (
                <div>
                  <p className="text-sm text-gray-500">Tên sản phẩm</p>
                  <p className="font-medium text-gray-800">{product?.name}</p>
                </div>
              )}

              {/* SKU */}
              {openEditModal ? (
                <Input
                  size="sm"
                  {...updateProductForm.register('sku')}
                  error={updateProductForm.formState.errors.sku?.message}
                  name="sku"
                  label="Mã sản phẩm"
                />
              ) : (
                <div>
                  <p className="text-sm text-gray-500">Mã sản phẩm</p>
                  <p className="font-medium text-gray-800">{product?.sku}</p>
                </div>
              )}

              {/* Cost */}
              {openEditModal ? (
                <Input
                  size="sm"
                  type="number"
                  {...updateProductForm.register('cost', {
                    valueAsNumber: true,
                  })}
                  name="cost"
                  label="Giá vốn"
                  min={0}
                />
              ) : (
                <div>
                  <p className="text-sm text-gray-500">Giá vốn</p>
                  <p className="font-medium text-gray-800">{formatCurrency(product?.cost)}</p>
                </div>
              )}

              {/* Price */}
              {openEditModal ? (
                <Input
                  size="sm"
                  type="number"
                  {...updateProductForm.register('price', {
                    valueAsNumber: true,
                  })}
                  name="price"
                  label="Giá bán"
                  min={0}
                />
              ) : (
                <div>
                  <p className="text-sm text-gray-500">Giá bán</p>
                  <p className="font-medium text-gray-800">{formatCurrency(product?.price)}</p>
                </div>
              )}

              {/* Barcode */}
              {openEditModal ? (
                <Input
                  size="sm"
                  {...updateProductForm.register('barcode')}
                  name="barcode"
                  label="Barcode"
                />
              ) : (
                <div>
                  <p className="text-sm text-gray-500">Barcode</p>
                  <p className="font-medium text-gray-800">
                    {product?.barcode || (
                      <span className="text-gray-400 italic">Chưa cập nhật</span>
                    )}
                  </p>
                </div>
              )}

              {/* Status */}
              {openEditModal ? (
                <Controller
                  name="product_status"
                  control={updateProductForm.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Trạng thái"
                      placeholder="Chọn trạng thái"
                      size="sm"
                      radius="md"
                      data={[
                        { value: 'ACTIVE', label: 'Đang kinh doanh' },
                        { value: 'INACTIVE', label: 'Ngừng kinh doanh' },
                      ]}
                    />
                  )}
                />
              ) : (
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      product?.product_status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product?.product_status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {openEditModal ? (
            <Input
              size="sm"
              {...updateProductForm.register('description')}
              name="description"
              label="Mô tả"
            />
          ) : (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Mô tả</p>
              <p className="text-gray-700">
                {product?.description || (
                  <span className="text-gray-400 italic">Chưa có mô tả</span>
                )}
              </p>
            </div>
          )}
          {/* Categories */}
          {openEditModal ? (
            <Controller
              name="categoryIds"
              control={updateProductForm.control}
              render={({ field }) => (
                <>
                  <span className="text-sm font-medium text-gray-500">Nhóm danh mục</span>
                  <MultiSelect
                    radius={'md'}
                    {...field}
                    data={(categories || []).map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    placeholder="Chọn nhóm danh mục"
                    value={field.value || []}
                    onChange={field.onChange}
                    searchable
                  />
                </>
              )}
            />
          ) : (
            <>
              {product?.categories && product?.categories.length > 0 && (
                <>
                  <p className="text-sm text-gray-500">Nhóm danh mục</p>
                  <span className="px-4 py-1 mt-2  rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {product?.categories.map((c) => c.name).join(', ')}
                  </span>
                </>
              )}
            </>
          )}

          {/* Created + Updated */}
          {product && product.createdAt && product.updatedAt && (
            <div className="border-t border-gray-200 pt-4 mt-4 flex items-center justify-between text-sm text-gray-500">
              <p>Ngày tạo: {formatDate(product?.createdAt)}</p>
              <p>Lần cuối cập nhật: {formatDate(product?.updatedAt)}</p>
            </div>
          )}
          {openEditModal && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => setOpenEditModal(false)}
                style={{ color: 'red', border: 'none', background: 'transparent' }}
                size="sm"
                title="Hủy"
              />
              <Button type="submit" title="Cập nhật" size="sm" disabled={loading} />
            </div>
          )}
        </form>
      </ModalFormWrapper>
    </>
  );
}
