/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { MultiSelect } from '@mantine/core';
import {
  Button,
  Checkbox,
  Input,
  Loading,
  NumberInput,
  Select,
} from '@repo/design-system/components/ui';
import { useAttributes } from '@repo/design-system/hooks/client';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Category, Product, Tag, Variant } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import { Plus, Trash, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useProduct } from '../../../hooks/product/use-product';
import { useVariant } from '../../../hooks/variant/use-variant';
import { CreateProductInput, UpdateProductInput } from '../../../schemas/product/product.schema';
import { formatCurrency, formatDate } from '../../../utils';
import { DeleteConfirmationModal } from './delete-confirmation-modal';
import { FormVariant } from './form-variant';
export function FormProduct({
  categories,
  tags,
  productId,
  setOpenModalTag,
  setOpenModalCategory,
}: {
  categories?: Category[];
  tags?: Tag[];
  productId?: string;
  setOpenModalTag: (open: boolean) => void;
  setOpenModalCategory: (open: boolean) => void;
}) {
  const [openModalVariant, setOpenModalVariant] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [openModalDeleteVariant, setOpenModalDeleteVariant] = useState<boolean>(false);
  const currentStore = useAtomValue(currentStoreAtom);
  const {
    createProduct,
    getProductById,
    updateProduct,
    loading,
    createProductForm: {
      register,
      handleSubmit: handleSubmitCreate,
      reset,
      control,
      formState: { errors },
    },
    updateProductForm: {
      register: updateRegister,
      control: updateControl,

      formState: { errors: updateErrors },
      reset: updateReset,
      handleSubmit: handleSubmitUpdate,
    },
    product,
  } = useProduct();
  const { removeVariant, loading: loadingRemoveVariant } = useVariant();
  const {
    attributes,
    addAttribute,
    removeAttribute,
    updateAttribute,
    toMetaObject,
    removeAllAttributes,
    setAttributesFromMeta,
  } = useAttributes();
  useEffect(() => {
    if (!currentStore?.id || !productId) return;

    getProductById(productId);
  }, [productId, currentStore?.id]);
  useEffect(() => {
    if (!productId || !product) return;

    if (productId && product) {
      updateReset({
        name: product.name,
        description: product.description,
        sku: product.sku,
        barcode: product.barcode,
        baseUnit: product.baseUnit,
        product_status: product.product_status,
        image_url: product.image_url ?? undefined,
        tagIds: product.tags?.map((t) => t.id) ?? [],
        categoryIds: product.categories?.map((c) => c.id) ?? [],
      });
      setAttributesFromMeta(product.meta);
    }
  }, [productId, product, updateReset, setAttributesFromMeta]);
  const handleCreateProduct = async (data: CreateProductInput) => {
    const payload = {
      ...data,
      meta: toMetaObject(),
    };
    const success = await createProduct(payload);
    if (success) {
      reset();
      removeAllAttributes();
    }
  };
  const handleUpdateProduct = async (productId: string, data: UpdateProductInput) => {
    const payload = {
      ...data,
      meta: toMetaObject(),
    };
    const success = await updateProduct(productId, payload);
    if (success) {
      updateReset();
      getProductById(productId);
      removeAllAttributes();
    }
  };
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loading size="md" color="#3b82f6" />
        </div>
      ) : (
        <>
          <form
            onSubmit={
              productId
                ? handleSubmitUpdate((data) => handleUpdateProduct(productId, data))
                : handleSubmitCreate((data) => handleCreateProduct(data))
            }
            className=" w-full h-full mx-auto  mt-8 grid lg:grid-cols-[1fr_0.5fr] grid-cols-1 gap-3"
          >
            {/* left */}
            <div className="space-y-4 mb-6">
              {/* Product info */}
              <div className="bg-white p-5 rounded-md">
                <h2 className="text-base font-stretch-200% font-semibold text-gray-900">
                  Thông tin sản phẩm
                </h2>
                <div className="space-y-5 mt-4">
                  <div className="flex gap-2">
                    <Input
                      {...(productId ? updateRegister('name') : register('name'))}
                      error={productId ? updateErrors.name?.message : errors.name?.message}
                      size="sm"
                      withAsterisk
                      radius="sm"
                      className="flex-1"
                      label="Tên sản phẩm"
                      placeholder="Nhập tên sản phẩm"
                    />
                    <Input
                      {...(productId ? updateRegister('sku') : register('sku'))}
                      error={productId ? updateErrors.sku?.message : errors.sku?.message}
                      size="sm"
                      radius="sm"
                      className="flex-1"
                      label="Mã SKU"
                      placeholder="Nhập mã SKU (tự động tạo khi để trống)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="space-y-0.5 flex-1">
                      <Input
                        {...(productId ? updateRegister('baseUnit') : register('baseUnit'))}
                        error={
                          productId ? updateErrors.baseUnit?.message : errors.baseUnit?.message
                        }
                        size="sm"
                        radius="sm"
                        withAsterisk
                        label="Đơn vị tính "
                        placeholder="Nhập đơn vị tính"
                      />
                      <span className="text-xs text-gray-500">
                        Đơn vị nhỏ nhất dùng để theo dõi tồn kho.
                      </span>
                    </div>
                    <Controller
                      name="product_status"
                      control={
                        (productId ? updateControl : control) as Control<
                          CreateProductInput | UpdateProductInput
                        >
                      }
                      render={({ field }) => (
                        <Select
                          position="bottom"
                          {...field}
                          className="flex-1"
                          label="Trạng thái"
                          placeholder="Chọn trạng thái (tự đông chọn đang kinh doanh nếu không chọn)"
                          size="sm"
                          radius="sm"
                          data={[
                            { value: 'ACTIVE', label: 'Đang kinh doanh' },
                            { value: 'INACTIVE', label: 'Ngưng kinh doanh' },
                          ]}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Mô tả</span>
                    <Controller
                      name="description"
                      control={
                        (productId ? updateControl : control) as Control<
                          CreateProductInput | UpdateProductInput
                        >
                      }
                      render={({ field }) => (
                        <ReactQuill
                          value={field.value ?? ''}
                          onChange={(value: string) => field.onChange(value)}
                          onBlur={field.onBlur}
                          theme="snow"
                          placeholder="Nhập mô tả sản phẩm"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              {/* Product price */}
              {!productId && !product && (
                <div className="bg-white  p-5 rounded-md">
                  <h2 className="text-base font-stretch-200% font-semibold text-gray-900">
                    Thông tin giá
                  </h2>
                  <div className="space-y-5 mt-4">
                    <div className="flex gap-2">
                      <Controller
                        name="price"
                        control={
                          (productId ? updateControl : control) as Control<
                            CreateProductInput | UpdateProductInput
                          >
                        }
                        render={({ field }) => (
                          <NumberInput
                            {...field}
                            size="sm"
                            error={productId ? updateErrors.price?.message : errors.price?.message}
                            radius="sm"
                            className="flex-1"
                            label="Giá bán"
                            placeholder="Nhập giá bán sản phẩm"
                          />
                        )}
                      />
                      <Controller
                        name="cost"
                        control={
                          (productId ? updateControl : control) as Control<
                            CreateProductInput | UpdateProductInput
                          >
                        }
                        render={({ field }) => (
                          <NumberInput
                            {...field}
                            size="sm"
                            radius="sm"
                            className="flex-1"
                            label="Giá nhập"
                            placeholder="Nhập giá nhập sản phẩm"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Product inventory quantity */}
              {productId && product && product.variant.length ? (
                <div className="bg-white  p-5 rounded-md">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-base w-fit font-stretch-200% font-semibold text-gray-900">
                      Biến Thể & Quy Đổi
                    </h2>
                    <Button
                      onClick={() => {
                        setOpenModalVariant(true);
                        setIsEdit(false);
                      }}
                      icon={<Plus size={16} />}
                      title="Thêm biến thể"
                      size="xs"
                      radius="sm"
                      variant="outline"
                    />
                  </div>

                  <div className="mt-6 max-h-[400px] overflow-y-auto">
                    {product.variant.map((variant, index) => (
                      <div
                        key={variant.id}
                        className={`flex items-center justify-between gap-3 ${index === 0 ? 'border-t border-t-gray-100' : ''} border-b  border-b-gray-100 py-2.5 hover:bg-gray-50/60 transition-colors duration-300 cursor-pointer  w-full`}
                      >
                        <div
                          onClick={() => {
                            setOpenModalVariant(true);
                            setSelectedVariant(variant);
                            setIsEdit(true);
                          }}
                          className="  flex items-center justify-between flex-1"
                        >
                          <div className="flex flex-col gap-1.5">
                            <h3 className="text-sm font-semibold text-pos-blue-500">
                              {variant?.name}
                            </h3>
                            <span className="text-xs text-gray-600">
                              Mã biến thể:{' '}
                              <span className="font-semibold text-gray-900">{variant?.sku}</span>
                            </span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <p className="text-sm text-gray-600">
                              Giá bán:{' '}
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(variant?.price)}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Tồn kho:{' '}
                              <span className="font-semibold text-gray-900">{variant?.onHand}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setOpenModalDeleteVariant(true);
                            setSelectedVariant(variant);
                          }}
                          type="button"
                          className="text-red-500 bg-red-50 px-3 py-2.5 cursor-pointer rounded-md  "
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white  p-5 rounded-md">
                  <h2 className="text-base font-stretch-200% font-semibold text-gray-900">
                    Thông tin kho
                  </h2>

                  <div className="border border-gray-200 rounded-md overflow-hidden mt-4">
                    <table className="w-full">
                      {/* Table Header */}
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Kho lưu trữ
                          </th>

                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 text-nowrap">
                            Tồn kho
                          </th>
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody>
                        <tr>
                          <td className="px-6 py-4 text-sm  text-gray-800">Cửa hàng chính</td>
                          <td className="px-6 py-4 text-sm text-nowrap text-gray-500 space-y-1.5">
                            <Input
                              {...register('quantity' as const, {
                                setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)),
                              })}
                              type="number"
                              size="sm"
                              radius="sm"
                              placeholder="Nhập số lượng tồn"
                            />
                            <p className="text-xs text-gray-500">
                              Với số lượng khác 0 thì bản ghi cho biến động kho sẽ được tao.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* Product meta */}
              <div className="bg-white  p-5 rounded-md">
                <h2 className="text-base font-stretch-200% font-semibold text-gray-900 flex items-center justify-between">
                  Thuộc tính (Tùy chọn)
                  <Button
                    onClick={() => addAttribute()}
                    icon={<Plus size={16} />}
                    title="Thêm thuộc tính"
                    size="xs"
                    radius="sm"
                    variant="outline"
                  />
                </h2>

                {attributes.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-4">
                    Sản phẩm có nhiều thuộc tính khác nhau. Ví dụ: kích thước, màu sắc, tính chất,
                    ...
                  </p>
                ) : (
                  <div className="space-y-3 mt-4">
                    {attributes.map((attr) => (
                      <div key={attr.id} className="flex items-end gap-2">
                        <Input
                          size="sm"
                          radius="sm"
                          className="flex-1"
                          placeholder="Tên thuộc tính (ví dụ: Màu sắc)"
                          label="Tên thuộc tính"
                          value={attr.name}
                          onChange={(e) => updateAttribute(attr.id, 'name', e.target.value)}
                        />
                        <Input
                          size="sm"
                          radius="sm"
                          className="flex-1"
                          placeholder="Giá trị (ví dụ: Đỏ)"
                          label="Giá trị"
                          value={attr.value}
                          onChange={(e) => updateAttribute(attr.id, 'value', e.target.value)}
                        />
                        <button
                          onClick={() => removeAttribute(attr.id)}
                          className="p-2 rounded hover:bg-red-50 transition-colors duration-200 cursor-pointer text-red-500"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* right */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-md ">
                <h2 className="text-base font-stretch-200% font-semibold text-gray-900">
                  Ảnh sản phẩm
                </h2>
                <div className="space-y-1">
                  <Input
                    {...(productId ? updateRegister('image_url') : register('image_url'))}
                    className="mt-4"
                    type="text"
                    error={productId ? updateErrors.image_url?.message : errors.image_url?.message}
                    size="sm"
                    radius="sm"
                    placeholder="Nhập URL hình ảnh"
                    label="Url ảnh"
                  />
                  <span className="text-xs text-gray-500">Sử dụng image url</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white p-5 rounded-md space-y-4 ">
                  <h2 className="text-base font-stretch-200% font-semibold text-gray-900">
                    Thông tin thêm
                  </h2>
                  {/* Categories */}
                  <Controller
                    name="categoryIds"
                    control={
                      (productId ? updateControl : control) as Control<
                        CreateProductInput | UpdateProductInput
                      >
                    }
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        size="sm"
                        radius="sm"
                        comboboxProps={{
                          middlewares: { flip: false, shift: false },
                          transitionProps: { transition: 'pop', duration: 200 },
                        }}
                        searchable
                        className="flex-1"
                        placeholder="Chọn nhóm danh mục"
                        data={
                          categories?.map((item) => ({ value: item.id, label: item.name })) || []
                        }
                        value={field.value || []}
                        onChange={(val) => field.onChange(val)}
                        rightSection={
                          <button
                            type="button"
                            style={{ pointerEvents: 'auto' }}
                            onClick={() => {
                              setOpenModalCategory(true);
                            }}
                            className="p-2 rounded-md hover:bg-gray-100 hover:cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        }
                      />
                    )}
                  />

                  {/* Tags */}
                  <Controller
                    name="tagIds"
                    control={
                      (productId ? updateControl : control) as Control<
                        CreateProductInput | UpdateProductInput
                      >
                    }
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        size="sm"
                        radius="sm"
                        comboboxProps={{
                          middlewares: { flip: false, shift: false },
                          transitionProps: { transition: 'pop', duration: 200 },
                        }}
                        searchable
                        className="flex-1"
                        placeholder="Chọn nhóm thẻ (tag)"
                        data={tags?.map((item) => ({ value: item.id, label: item.name })) || []}
                        value={field.value || []}
                        onChange={(val) => field.onChange(val)}
                        rightSection={
                          <button
                            style={{ pointerEvents: 'auto' }}
                            type="button"
                            onClick={() => {
                              setOpenModalTag(true);
                            }}
                            className="p-2 rounded-md hover:bg-gray-100 hover:cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        }
                      />
                    )}
                  />

                  {!productId && (
                    <Controller
                      name="is_set_default_variant"
                      control={control}
                      defaultValue={true}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Checkbox
                            label="Mặc định tạo biến thể"
                            size="sm"
                            radius="sm"
                            checked={field.value || true}
                            onChange={(checked) => field.onChange(checked)}
                          />
                          <span className="text-xs text-gray-500 line-clamp-2">
                            Khi tạo sản phẩm cùng lúc tạo biến thể với thông tin cơ bản của sản phẩm
                            trên.
                          </span>
                        </div>
                      )}
                    />
                  )}
                </div>
                <Button
                  loading={loading}
                  type="submit"
                  title={productId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                  size="sm"
                  radius="sm"
                />
                {productId && (
                  <p className="text-gray-600 text-sm text-center">
                    Cập nhật lần cuối: {formatDate(product?.updatedAt || '')}
                  </p>
                )}
              </div>
            </div>
          </form>
          <FormVariant
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            variantId={selectedVariant?.id as string}
            product={product as Product}
            opened={openModalVariant}
            onClose={() => setOpenModalVariant(false)}
            getProductById={getProductById}
          />
          <DeleteConfirmationModal
            opened={openModalDeleteVariant}
            loading={loadingRemoveVariant}
            title="Xác nhận xóa biến thể"
            itemName={selectedVariant?.name || ''}
            onClose={() => setOpenModalDeleteVariant(false)}
            onConfirm={async () => {
              const success = await removeVariant(
                selectedVariant?.id as string,
                productId as string
              );
              if (success) {
                getProductById(productId as string);
                setOpenModalDeleteVariant(false);
              }
            }}
          />
        </>
      )}
    </>
  );
}
