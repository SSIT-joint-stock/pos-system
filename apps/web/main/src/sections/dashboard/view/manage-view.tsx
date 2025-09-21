'use client';
import { Button, Input, Modal, Select, Table } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import {
  BadgeAlert,
  CirclePlus,
  Download,
  Edit,
  Eye,
  Filter,
  Pencil,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash,
} from 'lucide-react';
import React, { FormEvent, useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '../../../../../main/src/utils/index';
import { useProduct } from '../../../../../main/src/hooks/product/use-product';
import { Controller } from 'react-hook-form';
import Image from 'next/image';

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
  ACTIVE: ' text-pos-blue-500',
  INACTIVE: 'text-gray-700',
};

export function ManageView() {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [inventoryModal, setInventorModal] = useState<boolean>(false);
  const [adjustValue, setAdjustValue] = useState({ delta: '0' });
  const [type, setType] = useState<string>('ADJUSTMENT');
  const {
    products,
    loading,
    createProductForm,
    product,
    updateProductForm,
    pagination,
    paginationParams,
    applyStockMovement,
    setPaginationParams,
    setFilters,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductById,
  } = useProduct();
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
      });
    }
  }, [product, updateProductForm]);
  console.log(product);
  return (
    <>
      {/* MODAL ADD PRODUCT */}
      <Modal
        opened={openAddModal}
        size="lg"
        onClose={() => setOpenAddModal(false)}
        title={
          <div className="flex items-center  gap-2 text-sm text-gray-500 font-medium">
            <CirclePlus size={16} />
            <p>Thêm Sản Phẩm</p>
          </div>
        }
      >
        <form
          onSubmit={createProductForm.handleSubmit(async (data) => {
            await createProduct(data);
            createProductForm.reset();
            setOpenAddModal(false);
          })}
          className="space-y-4"
        >
          {/* Name */}
          <Input
            {...createProductForm.register('name')}
            error={createProductForm.formState.errors.name?.message}
            name="name"
            label="Tên sản phẩm"
            size="sm"
            radius="xs"
            placeholder="Nhập tên sản phẩm"
          />

          {/* SKU */}
          <Input
            {...createProductForm.register('sku')}
            error={createProductForm.formState.errors.sku?.message}
            name="sku"
            label="SKU"
            size="sm"
            radius="xs"
            placeholder="Nhập mã SKU (duy nhất)"
          />

          {/* Barcode */}
          <Input
            {...createProductForm.register('barcode')}
            name="barcode"
            label="Barcode"
            size="sm"
            radius="xs"
            placeholder="Nhập barcode (nếu có)"
          />

          {/* Price */}
          <Input
            {...createProductForm.register('price', { valueAsNumber: true })}
            error={createProductForm.formState.errors.price?.message}
            type="number"
            name="price"
            label="Giá bán"
            size="sm"
            radius="xs"
            placeholder="Nhập giá sản phẩm"
          />

          {/* Cost */}
          <Input
            {...createProductForm.register('cost', { valueAsNumber: true })}
            error={createProductForm.formState.errors.cost?.message}
            type="number"
            name="cost"
            label="Giá nhập"
            size="sm"
            radius="xs"
            placeholder="Nhập giá nhập của sản phẩm"
          />

          {/* Image URL */}
          <Input
            {...createProductForm.register('image_url')}
            name="image_url"
            label="Image URL"
            size="sm"
            radius="xs"
            placeholder="https://example.com/image.png"
          />

          {/* Description */}
          <Input
            {...createProductForm.register('description')}
            name="description"
            label="Mô tả"
            size="sm"
            radius="xs"
            placeholder="Nhập mô tả sản phẩm"
          />

          {/* Product Status */}

          <Controller
            name="product_status"
            control={createProductForm.control}
            render={({ field }) => (
              <Select
                {...field}
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                size="sm"
                radius="xs"
                data={[
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'INACTIVE', label: 'INACTIVE' },
                ]}
              />
            )}
          />

          {/* Meta
            <Textarea label="Meta (JSON)" placeholder='Ví dụ: {"color":"red","size":"L"}' autosize minRows={3} /> */}

          {/* Action buttons */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOpenAddModal(false)}
              className="text-red-500 hover:bg-red-50 duration-300 py-2 px-6 transition-colors cursor-pointer rounded-md"
            >
              Hủy
            </button>
            <Button type="submit" title="Thêm sản phẩm" size="sm" radius="md" />
          </div>
        </form>
      </Modal>

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
          <div className="flex flex-col gap-2">
            <Button
              color="red"
              size={'md'}
              onClick={() => {
                deleteProduct(product?.id);
                setDeleteModal(false);
              }}
              className="bg-red-600 rounded-lg text-white cursor-pointer font-bold w-full "
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
        size="xl"
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
            await updateProduct(product?.id, data);
            setOpenEditModal(false);
          })}
          className={`${openEditModal ? 'space-y-4' : '"space-y-6"'}`}
        >
          {/* IMAGE + INFO GRID */}
          <div
            className={`${openEditModal ? 'flex flex-col gap-6' : 'grid grid-cols-1 md:grid-cols-3 gap-6'}`}
          >
            {/* IMAGE */}
            <div className="flex flex-col items-center">
              <Image
                width={1000}
                height={1000}
                src={'/placeholder.jpg'}
                alt={product?.name}
                className="w-48 h-48 object-cover rounded-lg shadow"
                unoptimized
              />
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
                <Input size="sm" {...updateProductForm.register('sku')} name="sku" label="SKU" />
              ) : (
                <div>
                  <p className="text-sm text-gray-500">SKU</p>
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
                      radius="xs"
                      data={[
                        { value: 'ACTIVE', label: 'ACTIVE' },
                        { value: 'INACTIVE', label: 'INACTIVE' },
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

          {/* Created + Updated */}
          {product && product.createdAt && product.updatedAt && (
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-sm text-gray-500">
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
              { label: 'Điều chỉnh thủ công', value: 'ADJUSTMENT' },
              { label: 'Bán hàng', value: 'SALE' },
              { label: 'Nhập hàng', value: 'PURCHASE' },
              { label: 'Trả hàng bán', value: 'RETURN_SALE' },
              { label: 'Trả hàng mua', value: 'RETURN_PURCHASE' },
              { label: 'Chuyển kho nhập', value: 'TRANSFER_IMPORT' },
              { label: 'Chuyển kho xuất', value: 'TRANSFER_EXPORT' },
            ]}
            value={type}
            onChange={(value) => setType(value)}
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
      <div className="flex flex-col h-full ">
        {/* ACTION */}
        <FilterBar
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
              <button
                onClick={() => window.print()}
                className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300"
              >
                <Download size={16} />
                <span className="text-gray-900 font-medium text-xs"> Xuất dữ liệu</span>
              </button>
              <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Filter size={16} />
                <span className="text-gray-900 font-medium text-xs">Lọc sản phẩm</span>
              </button>
              <button
                onClick={() => {
                  setOpenAddModal(true);
                }}
                className="bg-pos-blue-50 border text-nowrap  border-pos-blue-500 rounded-md flex items-center gap-2 py-2 px-4  text-pos-blue-500 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              >
                <Plus size={16} />
                <span className="font-medium text-xs "> Thêm sản phẩm</span>
              </button>
            </>
          }
        />

        {/* TABLE AND PAGINATION */}

        <>
          <Table
            totalPages={pagination?.totalPages}
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
            renderRow={(product, idx) => (
              <>
                <tr
                  key={product?.id || idx}
                  className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="px-4 py-2 text-xs font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-2 text-xs font-medium text-gray-900">
                    {product.inventory.quantity}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">{product.sku}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {formatCurrency(product.cost)}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {formatCurrency(product.price)}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`text-xs font-medium rounded-xl ${statusColors[product.product_status]}`}
                    >
                      {product.product_status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {formatDate(product.createdAt)}
                  </td>
                  <td>
                    <div className="flex items-center gap-5 pl-4">
                      <button
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
                        onClick={() => {
                          setOpenEditModal(true);
                          getProductById(product.id);
                        }}
                        className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setInventorModal(true);
                          getProductById(product.id);
                        }}
                        className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-green-50 text-green-500 rounded-md hover:opacity-100 hover:bg-green-500 hover:text-green-50 opacity-70 transition-opacity duration-200"
                      >
                        <ShoppingBag size={16} />
                      </button>
                      <button
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
                </tr>
              </>
            )}
          />
        </>
      </div>
    </>
  );
}
