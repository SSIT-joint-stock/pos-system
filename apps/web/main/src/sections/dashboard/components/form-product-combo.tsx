'use client';

import { Button, Input, Loading, NumberInput } from '@repo/design-system/components/ui';
import { Variant } from '@repo/design-system/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useBundles } from '../../../hooks/catalog/use-bundles';
import { CreateBundleInput, UpdateBundleInput } from '../../../schemas/product/bundle.schema';
import { BundleItemSelection } from './bundle-item-selection';

export function FormProductCombo({ bundleId }: { bundleId?: string }) {
  const router = useRouter();
  const {
    createBundle,
    updateBundle,
    getBundleById,
    loading,
    bundle,
    createBundleForm,
    updateBundleForm,
  } = useBundles();

  const isEdit = !!bundleId;

  const { fields, append, remove, update } = useFieldArray({
    control: isEdit ? (updateBundleForm.control as any) : (createBundleForm.control as any),
    name: 'items',
  });

  useEffect(() => {
    if (bundleId) {
      getBundleById(bundleId);
    }
  }, [bundleId, getBundleById]);

  useEffect(() => {
    if (isEdit && bundle) {
      updateBundleForm.reset({
        name: bundle.name,
        sku: bundle.sku,
        price: Number(bundle.price),
        quantity: bundle.quantity,
        items: bundle.items.map((item) => ({
          variantId: item.variantId,
          variant_name: item.variant_name,
          quantity: item.quantity,
        })),
      });
    }
  }, [bundle, isEdit, updateBundleForm]);

  const onAddVariant = (variant: Variant) => {
    append({
      variantId: variant.id,
      variant_name: variant.name,
      quantity: 1,
    });
  };

  const onUpdateQuantity = (variantId: string, quantity: number) => {
    const index = fields.findIndex((f: any) => f.variantId === variantId);
    if (index > -1) {
      update(index, { ...fields[index], quantity } as any);
    }
  };

  const handleCreate = async (data: CreateBundleInput) => {
    const result = await createBundle(data);
    if (result?.success) {
      router.back();
    }
  };

  const handleUpdate = async (data: UpdateBundleInput) => {
    if (!bundleId) return;
    const success = await updateBundle(bundleId, data);
    if (success) {
      router.back();
    }
  };

  if (loading && isEdit && !bundle) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loading size="md" color="#3b82f6" />
      </div>
    );
  }

  const currentRegister = isEdit ? updateBundleForm.register : createBundleForm.register;
  const currentErrors = isEdit ? updateBundleForm.formState.errors : createBundleForm.formState.errors;
  const currentControl = isEdit ? updateBundleForm.control : createBundleForm.control;
  const currentHandleSubmit = isEdit 
    ? updateBundleForm.handleSubmit(handleUpdate) 
    : createBundleForm.handleSubmit(handleCreate);

  return (
    <form
      onSubmit={currentHandleSubmit}
      className="space-y-6 mt-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Thông tin Combo
            </h2>
            
            <Input
              {...currentRegister('name')}
              label="Tên nhóm sản phẩm (Combo)"
              placeholder="Nhập tên combo"
              error={currentErrors.name?.message}
              withAsterisk
              size="sm"
              radius="sm"
            />

            <Input
              {...currentRegister('sku')}
              label="Mã SKU"
              placeholder="Nhập mã SKU"
              error={currentErrors.sku?.message}
              withAsterisk
              size="sm"
              radius="sm"
            />

            <div className="space-y-4 pt-2">
              <Controller
                control={currentControl as any}
                name="price"
                render={({ field }) => (
                  <NumberInput
                    {...(field as any)}
                    label="Giá bán combo"
                    placeholder="0"
                    error={currentErrors.price?.message}
                    size="sm"
                    radius="sm"
                  />
                )}
              />
              
              <Controller
                control={currentControl as any}
                name="quantity"
                render={({ field }) => (
                  <NumberInput
                    {...(field as any)}
                    label="Số lượng tồn kho"
                    placeholder="0"
                    error={currentErrors.quantity?.message}
                    size="sm"
                    radius="sm"
                  />
                )}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              title="Quay lại"
              className="flex-1"
              onClick={() => router.back()}
              radius="sm"
            />
            <Button
              loading={loading}
              type="submit"
              title={isEdit ? 'Cập nhật Combo' : 'Tạo Combo'}
              className="flex-1"
              radius="sm"
            />
          </div>
        </div>

        {/* Right Column: Item Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              Thành phần Combo
            </h2>
            
            <BundleItemSelection
              items={fields as any}
              onAdd={onAddVariant}
              onRemove={(id) => {
                const idx = fields.findIndex((f: any) => f.variantId === id);
                if (idx > -1) remove(idx);
              }}
              onUpdateQuantity={onUpdateQuantity}
            />
            
            {currentErrors.items?.message && (
              <p className="text-xs text-red-500 mt-2">{currentErrors.items.message}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
