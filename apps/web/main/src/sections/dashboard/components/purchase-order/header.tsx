'use client';
import { Tooltip } from '@mantine/core';
import { Button, Input, Loading, Modal, NumberInput } from '@repo/design-system/components/ui';
import { useClickOutside } from '@repo/design-system/hooks/client';
import { Ellipsis, MoveLeft, Plus, SaveAll, ScanBarcode, Search, SearchX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useVariant } from '../../../../hooks/variant/use-variant';
import { formatCurrency } from '../../../../utils';

import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Order, Variant } from '@repo/design-system/types';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import { usePathname, useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { useProduct } from '../../../../hooks/product/use-product';
import { PurchaseReturnItem } from '../../../../schemas/purchase-return/purchase-return.schema';
import { CreatePurchaseOrderItem } from '../../../../schemas/purchase/purchase.schema';

export default function Header({
  setSelectedVariants,
  append,
  appendPurchaseReturnWithoutPO,
  setIsOpenModalSelectPurchase,
  setIsOpenSearch,
  setPurchaseOrder,
  setOrder,
  setIsScanMode,
  isScanMode,
  isOpenSearch,
  selectedVariants,
  fields,
  fieldsWithoutPO,
  purchaseOrder,
  title,
  haveSearch = true,
}: {
  setSelectedVariants?: React.Dispatch<React.SetStateAction<Variant[]>>;
  setPurchaseOrder?: (purchaseOrder: PurchaseOrder | null) => void;
  setOrder?: (order: Order | null) => void;
  append?: (selectedVariant: CreatePurchaseOrderItem, options?: { shouldFocus: boolean }) => void;
  appendPurchaseReturnWithoutPO?: (
    selectedVariant: PurchaseReturnItem,
    options?: { shouldFocus: boolean }
  ) => void;
  setIsOpenModalSelectPurchase?: (isOpen: boolean) => void;
  setIsOpenSearch?: (isOpen: boolean) => void;
  isScanMode?: boolean;
  setIsScanMode?: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenSearch?: boolean;
  selectedVariants?: Variant[];
  fields?: CreatePurchaseOrderItem[];
  fieldsWithoutPO?: PurchaseReturnItem[];
  purchaseOrder?: PurchaseOrder | null;
  title?: string | React.ReactNode;
  haveSearch?: boolean;
}) {
  // HOOK
  const ref = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
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
  useClickOutside(ref, () => {
    setIsFocusInputSearch(false);
    setIsOpenSearch?.(false);
  });
  useEffect(() => {
    getVariantsInStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, paginationParams]);

  return (
    <>
      <div className="w-full bg-white mb-3 p-4 rounded-md flex items-center justify-between">
        <div className={`flex items-center gap-8  lg:w-3/4 w-full`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                router.back();
                setPurchaseOrder?.(null);
                setOrder?.(null);
              }}
              className="w-9 h-9 flex items-center hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 cursor-pointer justify-center border border-gray-200 bg-white text-gray-500 rounded-md"
            >
              <MoveLeft size={18} />
            </button>
            <h1 className="text-xl font-semibold text-pos-blue-500 text-nowrap">{title}</h1>
          </div>

          {!purchaseOrder && (
            <div
              className={`relative w-fit flex items-center gap-2 flex-1 ${haveSearch ? 'block' : 'hidden'}`}
              ref={ref}
            >
              <Input
                type="search"
                radius="sm"
                leftSection={<Search size={16} />}
                size="sm"
                onChange={(e) => {
                  debouncedSearch(e.target.value);
                }}
                onFocus={() => {
                  setIsFocusInputSearch(true);
                  setIsOpenSearch?.(true);
                }}
                autoFocus={isFocusInputSearch || isOpenSearch}
                className="flex-1"
                placeholder="Tìm kiếm theo tên, mã SKU, mã vạch Barcode... "
                rightSection={
                  <>
                    {loading ? (
                      <Loading color="#3b82f6" size="xs" />
                    ) : (
                      <>
                        {pathName?.includes('purchase-order') && !selectedVariants?.length && (
                          <button
                            onClick={() => {
                              setIsFocusInputSearch?.(false);
                              setIsOpenModalQuickCreateProduct(true);
                            }}
                            type="button"
                            className="p-2 rounded hover:bg-gray-200 transition duration-200 hover:cursor-pointer"
                            style={{ pointerEvents: 'auto' }}
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </>
                    )}
                  </>
                }
              />
              <Button title="Mở rộng" variant="outline" size="sm" radius="sm" />
              <div
                className={`absolute top-full mt-1 left-0 w-full border border-gray-200  bg-white z-50 shadow-md rounded-md  p-3   ${isFocusInputSearch || isOpenSearch ? 'opacity-100 visible' : 'opacity-0 invisible'}   transition-all max-h-[400px] overflow-x-scroll`}
              >
                {pathName?.includes('outbound-orders') && !selectedVariants?.length && (
                  <button
                    onClick={() => {
                      setIsFocusInputSearch?.(false);
                      setIsOpenModalSelectPurchase?.(true);
                    }}
                    className="text-pos-blue-500 hover:underline cursor-pointer mb-3 px-2 py-1"
                  >
                    <span className="text-sm font-semibold">Trả hàng nhập theo đơn</span>
                  </button>
                )}
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
                          const existed =
                            fields?.some((item) => item.variant_id === variant.id) ||
                            fieldsWithoutPO?.some((item) => item.variant_id === variant.id);
                          if (existed) {
                            setIsFocusInputSearch(false);
                            setIsOpenSearch?.(false);
                            return;
                          }

                          append?.(
                            {
                              variant_id: variant.id,
                              product_id: variant.product_id,
                              quantity: 1,
                              unit_cost: variant.cost || 0,
                              tax_rate: 0,
                              discount_rate: 0,
                              unit: variant.product.baseUnit,
                            },
                            { shouldFocus: false }
                          );
                          appendPurchaseReturnWithoutPO?.(
                            {
                              variant_id: variant.id,
                              product_id: variant.product_id,
                              quantity: 0,
                              unit_cost: variant.cost || 0,
                            },
                            { shouldFocus: false }
                          );

                          setSelectedVariants?.((prev) => [...prev, variant]);
                          setIsFocusInputSearch(false);
                          setIsOpenSearch?.(false);
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
          )}
        </div>
        <ActionButton isScanMode={isScanMode} setIsScanMode={setIsScanMode} />
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

function ActionButton({
  setIsScanMode,
  isScanMode,
}: {
  isScanMode?: boolean;
  setIsScanMode?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { showSuccessToast } = useToast();
  return (
    <div className="lg:flex items-center gap-2 hidden ">
      <>
        <Tooltip label="Quét mã vạch" position="bottom" withArrow>
          <button
            onClick={() => {
              setIsScanMode?.(!isScanMode);
              if (isScanMode) {
                showSuccessToast('Tắt chế độ tìm kiếm mã vạch');
              } else {
                showSuccessToast('Bật chế độ tìm kiếm mã vạch');
              }
            }}
            className={`w-8 h-8 flex items-center justify-center text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50  transition duration-200 cursor-pointer ${isScanMode && 'border-pos-blue-500 text-pos-blue-500'}`}
          >
            <ScanBarcode size={16} />
          </button>
        </Tooltip>
        <Tooltip label="Tải file" position="bottom" withArrow>
          <button className="w-8 h-8 flex items-center justify-center text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50  transition duration-200 cursor-pointer">
            <SaveAll size={16} />
          </button>
        </Tooltip>
      </>

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
  setSelectedVariants?: React.Dispatch<React.SetStateAction<Variant[]>>;
  onClose: () => void;
  getVariantsInStore?: () => void;
  append?: (selectedVariant: CreatePurchaseOrderItem, options?: { shouldFocus: boolean }) => void;
}) {
  const {
    createProduct,
    createProductForm: {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
    },
    loading,
  } = useProduct();
  const [quantityPurchase, setQuantityPurchase] = useState<number>(1);
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
            append?.(
              {
                variant_id: success?.data.id,
                product_id: success?.data.product_id,
                quantity: quantityPurchase || 1,
                unit_cost: success.data.cost || 0,
                tax_rate: 0,
                discount_rate: 0,
                unit: success?.data?.baseUnit,
              },
              { shouldFocus: false }
            );
            setSelectedVariants?.((prev) => [...prev, success.data]);
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
        <div className="flex gap-2.5 w-full">
          <Controller
            control={control}
            name="cost"
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Giá nhập"
                className="flex-1"
                style={{ width: '100%' }}
                error={errors.cost?.message}
                size="sm"
                radius="sm"
                placeholder="Nhập giá nhập"
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Giá bán"
                className="flex-1"
                style={{ width: '100%' }}
                error={errors.price?.message}
                size="sm"
                radius="sm"
                placeholder="Nhập giá bán"
              />
            )}
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
          <NumberInput
            label="Số lượng đặt"
            size="sm"
            defaultValue={1}
            min={1}
            onChange={(value) => setQuantityPurchase(Number(value))}
            className="flex-1"
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
