'use client';
import { Popover, Tooltip } from '@mantine/core';
import { Button, NumberInput, Table } from '@repo/design-system/components/ui';
import { Variant } from '@repo/design-system/types';
import { Download, Percent, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { usePurchase } from '../../../hooks/purchase/use-purchase';
import { formatCurrency, truncateText } from '../../../utils';
import Header from '../components/purchase-order/header';

import { useBarcodeScanner, useCatalog } from '../../../hooks/catalog/use-catalog';
import ReturnProductLayout from '../../../layouts/return-product-layout';
import { CreatePurchaseOrderItem } from '../../../schemas/purchase/purchase.schema';
import FormStepUploadPurchase from '../../../sections/dashboard/components/purchase-order/form-step-upload-purchase';
import SidebarPurchase from '../components/purchase-order/sidebar';

const tableHeaders = [
  'Mã SP',
  'Tên sản phẩm',
  'Đơn vị',
  'Số lượng',
  'Giá nhập',
  'Chiết khấu %',
  'VAT %',
  'Thành tiền',
  'Hành động',
];

export function CreatePurchaseOrders() {
  // HOOK

  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([] as Variant[]);
  const [isOpenModalFormUpload, setIsOpenModalFormUpload] = useState<boolean>(false);

  const inputRef = useRef<HTMLDivElement>(null);
  // CUSTOM HOOK

  const {
    formPurchase: {
      control,
      watch,
      register,
      reset,
      handleSubmit,
      getValues,
      setValue,
      formState: { errors },
    },
    loading,
    createPurchaseOrder,
    downloadPurchaseOrderTemplate,
  } = usePurchase();
  const { scanBarcode, setIsScanMode, isScanMode } = useCatalog();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const processingBarcodesRef = useRef<Set<string>>(new Set());

  const handleScan = async (barcode: string) => {
    if (processingBarcodesRef.current.has(barcode)) return;
    processingBarcodesRef.current.add(barcode);

    try {
      const variant = await scanBarcode(barcode);
      if (variant) {
        const items = getValues('items') || [];
        const index = items.findIndex((item) => item.variant_id === variant.id);
        if (index !== -1) {
          const currentItem = items[index];
          const newQuantity = (Number(currentItem?.quantity) || 0) + 1;
          setValue(`items.${index}.quantity`, newQuantity);
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

        setSelectedVariants((prev) => [...prev, variant]);
      }
    } finally {
      setTimeout(() => {
        processingBarcodesRef.current.delete(barcode);
      }, 500);
    }
  };

  useBarcodeScanner({ onScan: handleScan });
  // Xóa sản phẩm
  const handleRemoveProduct = (id: string, index: number) => {
    setSelectedVariants(selectedVariants.filter((p) => p.id !== id));
    remove(index);
  };
  const handleChangeUnit = (index: number, unit: string) => {
    update(index, {
      ...fields[index],
      unit,
    });
  };

  const caculateTotalPerItem = (item: CreatePurchaseOrderItem, variant: Variant) => {
    const quantity = Number(item?.quantity) || 0;
    const unitCost = Number(item?.unit_cost) || 0;
    const taxRate = Number(item?.tax_rate) || 0;
    const discountRate = Number(item?.discount_rate) || 0;

    let factor = 1;
    if (item?.unit && variant?.conversions && variant?.conversions?.length > 0) {
      const conversions = variant.conversions.find((c) => c.name === item.unit);
      if (conversions) factor = conversions.factor;
    }
    const qty = quantity * factor;
    // Giá sau chiết khấu
    const subtotal = unitCost * qty;
    const discount_amount = subtotal * (discountRate / 100);
    const tax_amount = (subtotal - discount_amount) * (taxRate / 100);
    const total_price = subtotal - discount_amount + tax_amount;
    return { subtotal, total_price, discount_amount, tax_amount, qty, quantity };
  };

  return (
    <>
      <ReturnProductLayout
        sidebar={
          <SidebarPurchase
            register={register}
            control={control}
            errors={errors}
            reset={reset}
            createPurchaseOrder={createPurchaseOrder}
            handleSubmit={handleSubmit}
            loading={loading}
            watchedItems={watchedItems}
            caculateTotalPerItem={caculateTotalPerItem}
            selectedVariants={selectedVariants}
          />
        }
      >
        <Header
          setSelectedVariants={setSelectedVariants}
          append={append}
          // onScan={handleScan}
          setIsScanMode={setIsScanMode}
          isScanMode={isScanMode}
          fields={fields}
          title="Tạo đơn nhập hàng"
        />
        {/* Content Area */}
        <div className="flex-1 bg-white rounded-md shadow   h-full p-2 ">
          {fields.length === 0 ? (
            <div className="flex flex-col items-center  justify-center gap-4 h-full rounded-lg">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Thêm sản phẩm từ file excel
                </h2>
                <p className="text-gray-500 text-sm">
                  Xử lý dữ liệu (Tải lại file mẫu: Excel 2003 hoặc bản cũ hơn)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsOpenModalFormUpload(true)}
                  radius="sm"
                  title="Nhập file excel"
                  icon={<Upload size={16} />}
                />

                <Button
                  onClick={() => downloadPurchaseOrderTemplate()}
                  radius="sm"
                  title="Tải file mẫu"
                  icon={<Download size={16} />}
                  variant="outline"
                />
              </div>
            </div>
          ) : (
            <Table
              hasPagination={false}
              className="w-full overflow-auto scrollbar-none"
              hasMarginTop={false}
              hasPadding={false}
              data={fields}
              tableHeaders={tableHeaders}
              renderRow={(data, index) => {
                const variant = selectedVariants.find((p) => p.id === data.variant_id);
                const item = watchedItems[index];
                if (!variant) return null;
                return (
                  <>
                    <td className="px-4 py-2 text-sm text-gray-700">{variant?.sku || 'N/A'}</td>
                    <Tooltip label={variant?.name || 'N/A'} position="bottom" withArrow>
                      <td className="px-4 py-2 text-sm text-gray-700 text-nowrap">
                        {truncateText(variant?.name || 'N/A', 18)}
                      </td>
                    </Tooltip>
                    <Popover
                      width={140}
                      withArrow
                      shadow="md "
                      offset={-20}
                      position="bottom-start"
                      arrowPosition="side"
                    >
                      <Popover.Target>
                        <td className="px-4 py-2 text-sm text-pos-blue-500 font-semibold hover:underline cursor-pointer text-nowrap">
                          <span>{item?.unit || variant.product.baseUnit}</span>
                          <Popover.Dropdown className="p-0" p={8}>
                            <>
                              {item &&
                              variant?.conversions &&
                              variant?.conversions?.length === 0 ? (
                                <div className="w-full  text-gray-500 text-sm">
                                  {variant.product.baseUnit} (cơ bản)
                                </div>
                              ) : (
                                <>
                                  {variant &&
                                    variant?.conversions?.length > 0 &&
                                    variant?.conversions?.map((unit) => (
                                      <div
                                        onClick={() => handleChangeUnit(index, unit.name)}
                                        key={unit.id}
                                        className="space-y-2"
                                      >
                                        <div className=" text-gray-600 text-xs font-semibold pl-1 w-full py-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer line-clamp-1">
                                          {unit.name} (x{unit.factor})
                                        </div>
                                      </div>
                                    ))}
                                  <div
                                    onClick={() =>
                                      handleChangeUnit(index, variant.product.baseUnit)
                                    }
                                    className=" text-gray-600 text-xs font-semibold pl-1 w-full py-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer line-clamp-1"
                                  >
                                    {variant?.product?.baseUnit} (cơ bản)
                                  </div>
                                </>
                              )}
                            </>
                          </Popover.Dropdown>
                        </td>
                      </Popover.Target>
                    </Popover>
                    <td className="px-4 py-2 text-sm text-gray-700 ">
                      <div className="flex items-center gap-1">
                        <Controller
                          name={`items.${index}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <NumberInput
                              {...field}
                              min={1}
                              onChange={(e) => field.onChange(Number(e))}
                              size="sm"
                              radius="sm"
                              className="w-20 text-right"
                            />
                          )}
                        />
                        <span className="text-xs text-gray-500 text-nowrap">
                          {' '}
                          = {caculateTotalPerItem(item, variant).qty} {variant.product.baseUnit}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-2 text-sm text-gray-700">
                      <div ref={inputRef} className="flex items-center gap-1">
                        <Controller
                          name={`items.${index}.unit_cost`}
                          control={control}
                          render={({ field }) => (
                            <NumberInput
                              {...field}
                              type="text"
                              min={0}
                              size="sm"
                              defaultValue={variant?.cost || 0}
                              radius="sm"
                              className="w-28 text-right"
                            />
                          )}
                        />

                        <span className="text-xs text-gray-500 text-nowrap line-clamp-1 ">
                          / {variant.product.baseUnit}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700  ">
                      <div className="flex items-center gap-1">
                        <Controller
                          name={`items.${index}.discount_rate`}
                          control={control}
                          render={({ field }) => (
                            <NumberInput
                              {...field}
                              onChange={(e) => field.onChange(Number(e))}
                              size="sm"
                              radius="sm"
                              className="w-20 text-right"
                              rightSection={<Percent size={14} />}
                            />
                          )}
                        />
                        <span className="text-xs text-gray-500 text-nowrap">
                          {data
                            ? formatCurrency(caculateTotalPerItem(item, variant).discount_amount)
                            : 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 ">
                      <div className="flex items-center gap-1">
                        <Controller
                          name={`items.${index}.tax_rate`}
                          control={control}
                          render={({ field }) => (
                            <NumberInput
                              {...field}
                              onChange={(e) => field.onChange(Number(e))}
                              size="sm"
                              radius="sm"
                              className="w-20 text-right"
                              rightSection={<Percent size={14} />}
                            />
                          )}
                        />
                        <span className="text-xs text-gray-500 text-nowrap">
                          {data
                            ? formatCurrency(caculateTotalPerItem(item, variant).tax_amount)
                            : 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {data
                        ? formatCurrency(Number(caculateTotalPerItem(item, variant).total_price))
                        : 0}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProduct(data.id || '', index);
                        }}
                        className="text-gray-500 hover:text-red-500 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </>
                );
              }}
            />
          )}
        </div>
      </ReturnProductLayout>
      <FormStepUploadPurchase
        opened={isOpenModalFormUpload}
        onClose={() => setIsOpenModalFormUpload(false)}
      />
    </>
  );
}
