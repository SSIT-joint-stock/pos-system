'use client';
import { formatCurrency } from '../../../../utils';
import { useVariant } from '../../../../hooks/variant/use-variant';
import { Tooltip } from '@mantine/core';
import { Button, Input, Loading, Modal } from '@repo/design-system/components/ui';
import { useClickOutside } from '@repo/design-system/hooks/client';
import { Ellipsis, MoveLeft, Plus, SaveAll, ScanBarcode, Search, SearchX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

import { useProduct } from '../../../../hooks/product/use-product';
import { CreatePurchaseOrderItem } from '../../../../schemas/purchase/purchase.schema';
import { Variant } from '@repo/design-system/types';
import { useRouter } from 'next/navigation';

export default function Header({
  setSelectedVariants,
  append,
  fields,
}: {
  setSelectedVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
  append: (selectedVariant: CreatePurchaseOrderItem) => void;
  fields: CreatePurchaseOrderItem[];
}) {
  // HOOK
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isFocusInputSearch, setIsFocusInputSearch] = useState<boolean>(false);
  const [isOpenModalQuickCreateProduct, setIsOpenModalQuickCreateProduct] =
    useState<boolean>(false);
  //   CUSTOM HOOk
  const {
    variants,
    loading,
    filters,
    pagination,
    paginationParams,
    getVariantsInStore,
    setFilters,
    setPaginationParams,
  } = useVariant();
  const debouncedSearch = useDebounceCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      q: value,
    }));

    getVariantsInStore();
  }, 500);

  // FUNCTION
  useClickOutside(ref, () => setIsFocusInputSearch(false));
  useEffect(() => {
    getVariantsInStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, paginationParams]);

  return (
    <>
      <div className="w-full bg-white mb-3 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-8  lg:w-2/3 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 cursor-pointer justify-center border border-gray-200 bg-white text-gray-500 rounded-md"
            >
              <MoveLeft size={18} />
            </button>
            <h1 className="text-xl font-semibold text-pos-blue-500 text-nowrap">Phiếu nhập hàng</h1>
          </div>

          <div className="relative w-fit flex items-center gap-2 flex-1" ref={ref}>
            <Input
              type="search"
              radius="sm"
              leftSection={<Search size={16} />}
              size="sm"
              onChange={(e) => {
                debouncedSearch(e.target.value);
              }}
              onFocus={() => setIsFocusInputSearch(true)}
              className="flex-1"
              placeholder="Tìm kiếm theo tên, mã SKU, mã vạch Barcode... "
              rightSection={
                <>
                  {loading ? (
                    <Loading color="#3b82f6" size="sm" />
                  ) : (
                    <button
                      onClick={() => setIsOpenModalQuickCreateProduct(true)}
                      type="button"
                      className="p-2 rounded hover:bg-gray-200 transition duration-200 hover:cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </>
              }
            />
            <Button title="Mở rộng" variant="outline" size="sm" radius="sm" />
            <div
              className={`absolute top-full mt-1 left-0 w-full border border-gray-200  bg-white z-50 shadow-md rounded-md  p-3   ${isFocusInputSearch ? 'opacity-100 visible' : 'opacity-0 invisible'}   transition-all max-h-[400px] overflow-x-scroll`}
            >
              {variants.length === 0 ? (
                <div className="text-center items-center flex flex-col gap-2 p-4">
                  <SearchX size={68} color="#3b82f6" />
                  <span className="text-xl font-semibold w-full">
                    Không tìm thấy dữ liệu phù hợp với kết quả tìm kiếm
                  </span>
                  <span className="text-sm text-gray-500 w-full">
                    Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm
                  </span>
                </div>
              ) : (
                <>
                  {variants?.map((variant) => (
                    <div
                      key={variant.id}
                      onClick={() => {
                        const existed = fields.some((item) => item.variant_id === variant.id);

                        if (existed) {
                          setIsFocusInputSearch(false);
                          return;
                        }

                        append({
                          variant_id: variant.id,
                          product_id: variant.product_id,
                          quantity: 1,
                          unit_cost: variant.cost || 0,
                          tax_rate: 0,
                          discount_rate: 0,
                          unit: variant.product.baseUnit,
                        });

                        setSelectedVariants((prev) => [...prev, variant]);
                        setIsFocusInputSearch(false);
                      }}
                      className="border-b cursor-pointer border-b-gray-200 flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="space-y-1">
                        <h3 className="text-base text-gray-900 font-semibold">{variant.name}</h3>
                        <p className="text-xs text-gray-500">{variant.sku}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Giá nhập:{' '}
                          <span className="font-semibold text-pos-blue-500 text-right w-full">
                            {formatCurrency(variant?.cost || 0)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Tồn kho:{' '}
                          <span className="font-semibold text-gray-900 text-right w-full">
                            {variant?.onHand}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                  {pagination?.hasNext && (
                    <div className="mt-4 flex items-center justify-center">
                      <Button
                        onClick={() =>
                          setPaginationParams((prev) => ({
                            ...prev,
                            limit: prev.limit + 10,
                          }))
                        }
                        title="Tải thêm"
                        variant="outline"
                        size="sm"
                        radius="sm"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <ActionButton />
      </div>
      <FormQuickCreateProduct
        opened={isOpenModalQuickCreateProduct}
        onClose={() => setIsOpenModalQuickCreateProduct(false)}
        setSelectedVariants={setSelectedVariants}
        getVariantsInStore={getVariantsInStore}
        append={append}
      />
    </>
  );
}

function ActionButton() {
  return (
    <div className="lg:flex items-center gap-2 hidden ">
      <Tooltip label="Quét mã vạch" position="bottom" withArrow>
        <button className="w-8 h-8 flex items-center justify-center text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50  transition duration-200 cursor-pointer">
          <ScanBarcode size={16} />
        </button>
      </Tooltip>
      <Tooltip label="Tải file" position="bottom" withArrow>
        <button className="w-8 h-8 flex items-center justify-center text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50  transition duration-200 cursor-pointer">
          <SaveAll size={16} />
        </button>
      </Tooltip>

      <Tooltip label="Hướng dẫn" position="bottom" withArrow>
        <button className="w-8 h-8 flex items-center justify-center text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50  transition duration-200 cursor-pointer">
          <Ellipsis size={16} />
        </button>
      </Tooltip>
    </div>
  );
}

function FormQuickCreateProduct({
  opened,
  setSelectedVariants,
  onClose,
  getVariantsInStore,
  append,
}: {
  opened: boolean;
  setSelectedVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
  onClose: () => void;
  getVariantsInStore?: () => void;
  append: (selectedVariant: CreatePurchaseOrderItem) => void;
}) {
  const {
    createProduct,
    createProductForm: {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    },
    loading,
  } = useProduct();
  return (
    <Modal
      title={
        <div className="flex items-center gap-4">
          <span className="text-gray-900 font-semibold text-xl ">Thêm nhanh sản phẩm</span>
          <Button
            variant="outline"
            title="Làm mới"
            size="xs"
            radius="sm"
            loading={loading}
            onClick={() => reset()}
          />
        </div>
      }
      size="xl"
      opened={opened}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          const success = await createProduct(data);
          if (success?.success) {
            append({
              variant_id: success?.data.id,
              product_id: success?.data.product_id,
              quantity: 1,
              unit_cost: success.data.cost || 0,
              tax_rate: 0,
              discount_rate: 0,
              unit: success?.data?.baseUnit,
            });
            setSelectedVariants((prev) => [...prev, success.data]);
            reset();
            onClose();
            getVariantsInStore?.();
          }
        })}
        className="space-y-4"
      >
        <Input
          {...register('name')}
          label="Tên sản phẩm"
          size="sm"
          radius="sm"
          placeholder="Nhập tên sản phẩm"
          error={errors.name?.message}
          withAsterisk
        />
        <div className="flex gap-2.5">
          <Input
            {...register('sku')}
            error={errors.sku?.message}
            label="Mã sản phẩm/SKU"
            className="flex-1"
            size="sm"
            radius="sm"
            placeholder="Tự động nhập khi bỏ qua"
          />
          <Input
            {...register('barcode')}
            label="Mã barcode"
            error={errors.barcode?.message}
            className="flex-1"
            size="sm"
            radius="sm"
            placeholder="Nhập mã barcode"
          />
        </div>
        <div className="flex gap-2.5">
          <Input
            {...register('cost', {
              valueAsNumber: true,
            })}
            label="Giá nhập"
            className="flex-1"
            error={errors.cost?.message}
            size="sm"
            radius="sm"
            type="number"
            defaultValue={0}
            placeholder="Nhập giá nhập"
          />
          <Input
            {...register('price', {
              valueAsNumber: true,
            })}
            error={errors.price?.message}
            label="Giá bán"
            className="flex-1"
            size="sm"
            radius="sm"
            type="number"
            defaultValue={0}
            placeholder="Nhập giá bán"
          />
        </div>
        <div className="flex gap-2.5">
          <Input
            withAsterisk
            {...register('baseUnit')}
            error={errors.baseUnit?.message}
            label="Đơn vị cơ bản"
            size="sm"
            className="flex-1"
            placeholder="Nhập đơn vị cơ bản"
            type="text"
            radius="sm"
          />
          <Input
            label="Số lượng đặt"
            size="sm"
            defaultValue={1}
            className="flex-1"
            type="number"
            radius="sm"
            placeholder="Nhập số lượng đặt"
          />
        </div>
        <div className="flex items-center gap-4 justify-end">
          <Button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            title="Hủy"
            variant="outline"
            size="sm"
            radius="sm"
          />

          <Button loading={loading} type="submit" title="Thêm sản phẩm" size="sm" radius="sm" />
        </div>
      </form>
    </Modal>
  );
}
