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
  ACTIVE: ' text-green-500 bg-green-50 py-1.5 px-2.5 rounded-md',
  INACTIVE: 'text-red-500 bg-red-50 py-1.5 px-2.5 rounded-md',
};

const formatProductStatus = (status: string) => {
  const translations: Record<string, string> = {
    ACTIVE: 'Đang kinh doanh ',
    INACTIVE: 'Ngừng kinh doanh',
    SOLD: 'Đã bán',
  };
  return translations[status] || status;
};

export function ManageView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [inventoryModal, setInventorModal] = useState<boolean>(false);
  const [adjustValue, setAdjustValue] = useState({ delta: '0' });
  const [type, setType] = useState<string>('SALE');

  const [openUploadOption, setOpenUploadOption] = useState<boolean>(false);

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
              size={'md'}
              onClick={() => {
                if (product && product.id) {
                  deleteProduct(product.id);
                }
                setDeleteModal(false);
              }}
              className="bg-red-600 rounded-lg text-white cursor-pointer font-bold "
              title="Xác nhận xóa"
            />

            <button
              onClick={() => {
                setDeleteModal(false);
              }}
              className="cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL VIEW and EDIT PRODUCT */}
      <Modal
        opened={openViewModal || openEditModal}
        onClose={() => {
          setOpenViewModal(false);
          setOpenEditModal(false);
        }}
        size="70%"
        title={
          openEditModal ? (
            <div className="flex items-center gap-2 font-medium text-gray-600">
              <Pencil size={20} />
              <p>Chỉnh sửa sản phẩm</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-medium text-gray-600">
              <ShoppingCart size={20} />
              <p>Xem thông tin sản phẩm</p>
            </div>
          )
        }
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
                  <p className="font-medium text-gray-800">{product?.barcode || '—'}</p>
                </div>
              )}

              {/* Price */}
              {openEditModal ? (
                <Input
                  size="sm"
                  type="number"
                  {...updateProductForm.register('price', { valueAsNumber: true })}
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

              {/* Cost */}
              {openEditModal ? (
                <Input
                  size="sm"
                  type="number"
                  {...updateProductForm.register('cost', { valueAsNumber: true })}
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
              <p className="text-gray-700">{product?.description || '—'}</p>
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

          {/* Actions */}
          {openEditModal && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => setOpenEditModal(false)}
                style={{
                  color: 'red',
                  border: 'none',
                  background: 'transparent',
                }}
                size="sm"
                title="Hủy"
              />

              <Button type="submit" title="Cập nhật" size="sm" />
            </div>
          )}
        </form>
      </Modal>

      {/* MODAL Apply Stock Movement */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <ShoppingBag size={16} />
            Điều chỉnh tồn kho
          </div>
        }
        opened={inventoryModal}
        onClose={() => setInventorModal(false)}
      >
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (product && product.id) {
              applyStockMovement(product?.id, parseInt(adjustValue.delta), type);
            }
            setInventorModal(false);
            setAdjustValue({ delta: '0' });
            setType('ADJUSTMENT');
          }}
          className="flex flex-col gap-4"
          action=""
        >
          <Select
            position="bottom"
            label="Loại điều chỉnh"
            data={[
              { label: 'Bán hàng', value: 'SALE' },
              { label: 'Trả hàng bán', value: 'RETURN_SALE' },
            ]}
            value={type}
            onChange={(value) => setType(value || 'ADJUSTMENT')}
            defaultValue={type}
          />
          <Input
            value={adjustValue?.delta?.toString() || ''}
            onChange={(e) => setAdjustValue({ ...adjustValue, delta: e.target.value })}
            type="string"
            placeholder="Số lượng"
          />
          <Button type="submit" title={'Áp dụng điều chỉnh'} />
        </form>
      </Modal>

      {/* TABLE AND FILTER */}
      <div className="flex flex-col h-full ">
        {/* ACTION */}
        <FilterBar
          dataComplete={[...new Set(products?.map((p) => p.name) || [])]}
          statusOptions={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'INACTIVE', label: 'INACTIVE' },
            { value: 'SOLD', label: 'SOLD' },
          ]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              product_status: newFilters.status,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          actions={
            <>
              <div className="relative" ref={uploadMenuRef}>
                <button
                  onClick={() => setOpenUploadOption((prev) => !prev)}
                  disabled={loading}
                  className={`bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Upload size={16} />
                  <span className="text-gray-900 font-medium text-sm">Tải lên dữ liệu</span>
                </button>

                {openUploadOption && (
                  <div className="absolute top-full left-0 mt-1 z-50 flex flex-col  rounded-md shadow-md shadow-gray-100">
                    <button
                      disabled={loading}
                      onClick={() => fileInputRef.current?.click()}
                      className={`bg-white  text-nowrap  py-2 px-4 text-left hover:bg-gray-50 rounded-t-md  cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-gray-900 font-medium text-sm">
                        Tải lên dữ liệu (Excel)
                      </span>
                      <input
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log(file);
                            uploadProductByExcel(file);
                          }
                        }}
                        hidden
                        type="file"
                        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      />
                    </button>
                    <button
                      disabled={loading}
                      onClick={exampleProductExcel}
                      className={`bg-white  text-nowrap  hover:bg-gray-50   py-2 px-4 text-left rounded-b-md cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-gray-900 font-medium text-sm">
                        Tải file mẫu (Excel)
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => window.print()}
                className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                <span className="text-gray-900 font-medium text-sm"> Xuất dữ liệu</span>
              </button>
            </>
          }
        />

        {/* TABLE AND PAGINATION */}

        <>
          <Table
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
                <td className="px-4 py-2 text-xs font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-2 text-xs font-medium text-gray-900">
                  {product?.inventory?.quantity}
                </td>
                <td className="px-4 py-2 text-xs text-gray-500">{product.sku}</td>
                <td className="px-4 py-2 text-xs text-gray-500">{formatCurrency(product.cost)}</td>
                <td className="px-4 py-2 text-xs text-gray-500">{formatCurrency(product.price)}</td>

                <td className="px-4 py-2">
                  <span
                    className={`text-xs font-medium rounded-xl ${statusColors[product.product_status]}`}
                  >
                    {formatProductStatus(product.product_status)}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs text-gray-500">{formatDate(product.createdAt)}</td>
                <td>
                  <div className="flex items-center gap-5 pl-4">
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
                  </div>
                </td>
              </>
            )}
          />
        </>
      </div>
    </>
  );
}
