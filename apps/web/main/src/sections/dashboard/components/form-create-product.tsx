/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { MultiSelect } from '@mantine/core';
import { Button, Input, Loading, Select } from '@repo/design-system/components/ui';
import { useClickOutside } from '@repo/design-system/hooks/client';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Product } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import { ChevronRight, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useCategories } from '../../../../../main/src/hooks/categories/use-categories';
import { useProduct } from '../../../../../main/src/hooks/product/use-product';

export default function FormCreateProduct({
  setOpenAddProduct,
  setOpenCreateCategoryModal,
  setSelectProduct,
  setSelectProducts,
  openAddProduct,
  selectProduct,
  isEditSelectProduct,
  isCreateSelectProduct,
}: {
  setOpenAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCreateCategoryModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectProduct?: React.Dispatch<React.SetStateAction<Product>>;
  setSelectProducts?: React.Dispatch<React.SetStateAction<Partial<Product>[]>>;
  openAddProduct: boolean;
  selectProduct?: Product;
  isEditSelectProduct?: boolean;
  isCreateSelectProduct?: boolean;
}) {
  const refFocusInputSearch = useRef<HTMLDivElement>(null);
  const [metaFields, setMetaFields] = useState<Record<string, string>>({});
  const [openMetaFields, setOpenMetaFields] = useState<boolean>(false);
  const [isFocusInputSearch, setIsFocusInputSearch] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const currentStore = useAtomValue(currentStoreAtom);
  const {
    createProductForm,
    updateProductForm,
    products,
    filters,
    loading,

    setFilters,
    getProducts,
    setProducts,
    setPaginationParams,
  } = useProduct();
  const { categories, getCategories } = useCategories();
  const { showSuccessToast } = useToast();
  useClickOutside(refFocusInputSearch, () => {
    setIsFocusInputSearch(false);
  });
  useEffect(() => {
    if (!currentStore?.id) return;
    if (!isFocusInputSearch) return;

    const timeout = setTimeout(() => {
      if (search?.trim() !== '') {
        setFilters((prev) => ({
          ...prev,
          q: search,
        }));
        setPaginationParams((prev) => ({
          ...prev,
          limit: 20,
        }));
        getProducts();
      }
      if (!openAddProduct) {
        setProducts([]);
      }
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters.q, isFocusInputSearch, currentStore?.id]);
  useEffect(() => {
    if (!currentStore?.id) return;
    getCategories();
  }, [currentStore?.id]);
  // Effect cho việc chọn product từ dropdown
  useEffect(() => {
    if (!selectProduct) return;
    if (isEditSelectProduct) return;

    if (isCreateSelectProduct && !isEditSelectProduct) {
      createProductForm.reset({
        name: selectProduct?.name ?? '',
        sku: selectProduct?.sku ?? '',
        barcode: selectProduct?.barcode ?? '',
        categoryIds: selectProduct?.categories?.map((c) => c.id) ?? [],
        image_url: selectProduct?.image_url ?? '',
        description: selectProduct?.description ?? '',
        product_status: selectProduct?.product_status ?? 'ACTIVE',
      });

      setMetaFields(selectProduct?.meta ?? {});
      setIsFocusInputSearch(false);
      setSearch(selectProduct.name);
    }
  }, [selectProduct, isEditSelectProduct, isCreateSelectProduct]);

  // // Effect riêng cho việc edit product
  // useEffect(() => {
  //   if (!isEditSelectProduct && !selectProduct && !isCreateSelectProduct) return;

  //   updateProductForm.reset({
  //     name: selectProduct?.name ?? '',
  //     sku: selectProduct?.sku ?? '',
  //     price: selectProduct?.price ?? 0,
  //     cost: selectProduct?.cost ?? 0,
  //     barcode: selectProduct?.barcode ?? '',
  //     categoryIds: selectProduct?.categories?.map((c) => c.id) ?? [],
  //     image_url: selectProduct?.image_url ?? '',
  //     description: selectProduct?.description ?? '',
  //     product_status: selectProduct?.product_status ?? 'ACTIVE',
  //   });

  //   setMetaFields(selectProduct?.meta ?? {});
  //   setSearch(''); // Clear search
  //   setIsFocusInputSearch(false);
  // }, [isEditSelectProduct, selectProduct, isCreateSelectProduct, selectProduct?.sku]);
  return (
    <>
      <div ref={refFocusInputSearch} className="mt-4 relative">
        <Input
          onFocus={() => setIsFocusInputSearch(true)}
          radius="sm"
          size="sm"
          placeholder="Tìm kiếm hàng hóa"
          label="Tìm kiếm sản phẩm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          rightSection={loading ? <Loading color="#3b82f6" size="sm" /> : null}
        />
        <div
          className={`absolute top-full mt-1 left-0 w-xl  bg-white z-50 shadow-md rounded-md  p-3   ${isFocusInputSearch ? 'opacity-100 visible' : 'opacity-0 invisible'}  duration-200 transition-all ease-in-out`}
        >
          {/* nội dung gợi ý */}
          {products.length === 0 ? (
            <div className="text-sm font-medium flex items-center justify-center w-full h-36">
              <span className="text-gray-500">Không tìm thấy sản phẩm</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 h-72 overflow-hidden overflow-y-auto">
                {products.map((product) => (
                  <div
                    onClick={() => {
                      setSelectProduct?.(product);
                      setIsFocusInputSearch(false);
                    }}
                    key={product.id}
                    className="bg-gray-50/80 py-2 px-4 flex items-center gap-2 rounded-md hover:bg-gray-100 duration-200 transition-colors cursor-pointer"
                  >
                    <Image
                      src={'/placeholder.jpg'}
                      width={68}
                      height={68}
                      alt="test"
                      className="rounded-md object-cover"
                    />
                    <div className="flex flex-col w-full gap-1">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="text-base font-semibold text-pos-blue-500 truncate">
                          {product?.name}
                        </h2>
                        <span className="text-sm text-gray-500 font-semibold">
                          {/* Tồn kho: {product?.inventory.quantity} */}
                        </span>
                      </div>
                      {product?.categories?.length > 0 && (
                        <span className="text-sm text-gray-500 font-semibold">
                          Danh mục: {product?.categories?.map((item) => item.name).join(', ')}
                        </span>
                      )}
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-gray-500 font-semibold">
                          {/* Giá nhập: {formatCurrency(product?.cost)} */}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">
                          {/* Giá bán: {formatCurrency(product?.price)} */}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <form
        onSubmit={createProductForm.handleSubmit(async (data) => {
          const productData = {
            ...data,
            meta: metaFields,
            inventory: {
              quantity: 1,
            },
          };
          if (setSelectProducts) {
            setSelectProducts((prev) => [...prev, productData]);
          }
          setMetaFields({});
          // setOpenAddProduct(false);
          setSelectProduct?.(undefined as unknown as Product);
          setSearch('');
          createProductForm.reset({
            name: '',
            sku: '',
            price: 0,
            cost: 0,
            barcode: '',
            categoryIds: [],
            image_url: '',
            description: '',
            product_status: 'ACTIVE',
          });

          showSuccessToast('Thêm sản phẩm thành công');
        })}
        className="space-y-3.5 mt-6"
      >
        {/* Name */}
        <Input
          className="flex-1"
          {...(isEditSelectProduct
            ? updateProductForm.register('name')
            : createProductForm.register('name'))}
          error={
            isEditSelectProduct
              ? updateProductForm.formState.errors.name?.message
              : createProductForm.formState.errors.name?.message
          }
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
          {...(isEditSelectProduct
            ? updateProductForm.register('sku')
            : createProductForm.register('sku'))}
          error={
            isEditSelectProduct
              ? updateProductForm.formState.errors.sku?.message
              : createProductForm.formState.errors.sku?.message
          }
          name="sku"
          label="SKU"
          size="sm"
          radius="sm"
          withAsterisk
          placeholder="Nhập mã SKU (duy nhất)"
        />

        {/* Price */}
        <Input
          className="flex-1"
          {...(isEditSelectProduct
            ? updateProductForm.register('price', { valueAsNumber: true })
            : createProductForm.register('price', { valueAsNumber: true }))}
          error={
            isEditSelectProduct
              ? updateProductForm.formState.errors.price?.message
              : createProductForm.formState.errors.price?.message
          }
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
          {...(isEditSelectProduct
            ? updateProductForm.register('cost', { valueAsNumber: true })
            : createProductForm.register('cost', { valueAsNumber: true }))}
          error={
            isEditSelectProduct
              ? updateProductForm.formState.errors.cost?.message
              : createProductForm.formState.errors.cost?.message
          }
          type="number"
          name="cost"
          withAsterisk
          label="Giá nhập"
          size="sm"
          radius="sm"
          placeholder="Nhập giá nhập của sản phẩm"
        />

        {/* Barcode */}
        <Input
          className="flex-1"
          {...(isEditSelectProduct
            ? updateProductForm.register('barcode')
            : createProductForm.register('barcode'))}
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
              control={
                isEditSelectProduct
                  ? (updateProductForm.control as any)
                  : (createProductForm.control as any)
              }
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
              defaultValue={selectProduct?.categories?.map((c) => c.id) ?? []}
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

        {/* Image URL */}
        <Input
          {...(isEditSelectProduct
            ? updateProductForm.register('image_url')
            : createProductForm.register('image_url'))}
          name="image_url"
          label="Image URL"
          size="sm"
          radius="xs"
          placeholder="https://example.com/image.png"
        />

        {/* Description */}
        <Input
          {...(isEditSelectProduct
            ? updateProductForm.register('description')
            : createProductForm.register('description'))}
          name="description"
          label="Mô tả"
          size="sm"
          radius="sm"
          placeholder="Nhập mô tả sản phẩm"
        />

        {/* Product Status */}

        <Controller
          name="product_status"
          control={
            isEditSelectProduct
              ? (updateProductForm.control as any)
              : (createProductForm.control as any)
          }
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
            onClick={() => setOpenAddProduct(false)}
            className="text-red-500 hover:bg-red-50 duration-300 py-2 px-6 transition-colors cursor-pointer rounded-md"
          >
            Hủy
          </button>
          <Button type="submit" title="Thêm sản phẩm" size="sm" radius="md" />
        </div>
      </form>
    </>
  );
}
