'use client';
import { Button, Input, Modal, Select, Table } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import {
  BadgeAlert,
  ChevronRight,
  Download,
  Edit,
  Eye,
  Pencil,
  Plus,
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
import { MultiSelect, Textarea } from '@mantine/core';
import useCategories, {
  CategoryFormData,
} from '../../../../../main/src/hooks/categories/use-categories';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState<boolean>(false);
  const [inventoryModal, setInventorModal] = useState<boolean>(false);
  const [adjustValue, setAdjustValue] = useState({ delta: '0' });
  const [type, setType] = useState<string>('ADJUSTMENT');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<CategoryFormData>>({});
  const [metaFields, setMetaFields] = useState<Record<string, string>>({});
  const [openMetaFields, setOpenMetaFields] = useState<boolean>(false);
  const {
    products,
    loading,
    createProductForm,
    product,
    updateProductForm,
    pagination,
    paginationParams,
    applyStockMovement,
    uploadProductByExcel,
    setPaginationParams,
    setFilters,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductById,
  } = useProduct();
  const { categories, handleCreateCategory } = useCategories();
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

  return (
    <>
      {/* MODAL ADD PRODUCT */}
      <Modal
        opened={openAddModal}
        size="70%"
        onClose={() => setOpenAddModal(false)}
        title={<span className="text-xl font-semibold text-pos-blue-500">Thêm Sản Phẩm</span>}
      >
        <form
          onSubmit={createProductForm.handleSubmit(async (data) => {
            const productData = {
              ...data,
              meta: metaFields,
            };
            await createProduct(productData);
            createProductForm.reset();
            setMetaFields({});
            setOpenAddModal(false);
          })}
          className="space-y-4 mt-2"
        >
          <div className="flex items-center gap-3.5">
            {/* Name */}
            <Input
              className="flex-1"
              {...createProductForm.register('name')}
              error={createProductForm.formState.errors.name?.message}
              name="name"
              label="Tên sản phẩm"
              size="sm"
              radius="sm"
              withAsterisk
              placeholder="Nhập tên sản phẩm"
            />
            {/* SKU */}
            <Input
              className="flex-1"
              {...createProductForm.register('sku')}
              error={createProductForm.formState.errors.sku?.message}
              name="sku"
              label="SKU"
              size="sm"
              radius="sm"
              withAsterisk
              placeholder="Nhập mã SKU (duy nhất)"
            />
          </div>

          <div className="flex items-center gap-3.5">
            {/* Price */}
            <Input
              className="flex-1"
              {...createProductForm.register('price', { valueAsNumber: true })}
              error={createProductForm.formState.errors.price?.message}
              type="number"
              name="price"
              label="Giá bán"
              size="sm"
              withAsterisk
              radius="sm"
              placeholder="Nhập giá sản phẩm"
            />

            {/* Cost */}
            <Input
              className="flex-1"
              {...createProductForm.register('cost', { valueAsNumber: true })}
              error={createProductForm.formState.errors.cost?.message}
              type="number"
              name="cost"
              withAsterisk
              label="Giá nhập"
              size="sm"
              radius="sm"
              placeholder="Nhập giá nhập của sản phẩm"
            />
          </div>

          <div className="flex items-center gap-3.5">
            {/* Barcode */}
            <Input
              className="flex-1"
              {...createProductForm.register('barcode')}
              name="barcode"
              label="Barcode"
              size="sm"
              radius="sm"
              placeholder="Nhập barcode (nếu có)"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-500 font-medium">Nhóm danh mục</span>
              <div className="flex items-center gap-2.5">
                <Controller
                  name="categoryIds"
                  control={createProductForm.control}
                  render={({ field }) => (
                    <MultiSelect
                      {...field}
                      comboboxProps={{
                        middlewares: { flip: false, shift: false },
                        transitionProps: { transition: 'pop', duration: 200 },
                      }}
                      searchable
                      className="flex-1"
                      placeholder="Chọn nhóm danh mục"
                      data={[...categories].map((item) => ({ value: item.id, label: item.name }))}
                      value={field.value || []}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />

                <Button
                  onClick={() => setOpenCreateCategoryModal(true)}
                  radius="md"
                  size="sm"
                  type="button"
                  title={<Plus size={16} />}
                />
              </div>
            </div>
          </div>

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
            radius="sm"
            placeholder="Nhập mô tả sản phẩm"
          />

          {/* Product Status */}

          <Controller
            name="product_status"
            control={createProductForm.control}
            render={({ field }) => (
              <Select
                position="bottom"
                {...field}
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                size="sm"
                radius="sm"
                data={[
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'INACTIVE', label: 'INACTIVE' },
                ]}
              />
            )}
          />

          <div className="flex flex-col">
            <div
              onClick={() => setOpenMetaFields(!openMetaFields)}
              className="bg-pos-blue-50 h-fit p-2 rounded-md text-pos-blue-500 flex items-center justify-between cursor-pointer"
            >
              <span className={`text-base font-semibold `}>Thuộc tính bổ sung (Meta Data)</span>
              <ChevronRight
                className={`${openMetaFields ? 'rotate-90' : ''} transition-transform duration-300`}
              />
            </div>

            <div
              className={`${openMetaFields ? 'opacity-100 visible  max-h-fit' : ' opacity-0 invisible max-h-0'}   duration-200 transition-all `}
            >
              {/* Hiển thị các meta fields */}
              {Object.entries(metaFields).map(([key, value], index) => (
                <div key={index} className="flex items-center gap-3.5 mt-3.5">
                  <Input
                    size="sm"
                    radius="sm"
                    className="flex-1"
                    placeholder="Tên thuộc tính (vd: color)"
                    value={key}
                    onChange={(e) => {
                      const entries = Object.entries(metaFields);
                      const oldKey = entries[index][0];
                      const newMeta = { ...metaFields };
                      delete newMeta[oldKey];
                      newMeta[e.target.value] = value;
                      setMetaFields(newMeta);
                    }}
                  />
                  <Input
                    size="sm"
                    radius="sm"
                    className="flex-1"
                    placeholder="Giá trị (vd: red)"
                    value={value}
                    onChange={(e) => {
                      setMetaFields({ ...metaFields, [key]: e.target.value });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const entries = Object.entries(metaFields);
                      entries.splice(index, 1);
                      setMetaFields(Object.fromEntries(entries));
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                    title="Xóa thuộc tính"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newKey = `key_${Object.keys(metaFields).length + 1}`;
                  setMetaFields({ ...metaFields, [newKey]: '' });
                }}
                className="border border-pos-blue-500 rounded-md text-pos-blue-500 text-xs flex items-center gap-2 w-fit py-1.5 px-3.5 mt-3.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Plus size={16} />
                <span>Thêm thuộc tính</span>
              </button>
            </div>
          </div>
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
                      radius="md"
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
              { label: 'Điều chỉnh thủ công', value: 'ADJUSTMENT' },
              { label: 'Bán hàng', value: 'SALE' },
              { label: 'Nhập hàng', value: 'PURCHASE' },
              { label: 'Trả hàng bán', value: 'RETURN_SALE' },
              { label: 'Trả hàng mua', value: 'RETURN_PURCHASE' },
              { label: 'Chuyển kho nhập', value: 'TRANSFER_IMPORT' },
              { label: 'Chuyển kho xuất', value: 'TRANSFER_EXPORT' },
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
              <button
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
                className={`bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Upload size={16} />
                <span className="text-gray-900 font-medium text-xs">Tải lên dữ liệu</span>
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
                    {product?.inventory?.quantity}
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
                </tr>
              </>
            )}
          />
        </>
      </div>
    </>
  );
}
