'use client';

import { Input, Loading, NumberInput } from '@repo/design-system/components/ui';
import { useClickOutside } from '@repo/design-system/hooks/client';
import { Variant } from '@repo/design-system/types';
import { Search, SearchX, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useVariant } from '../../../hooks/variant/use-variant';
import { BundleItemInput } from '../../../schemas/product/bundle.schema';
import { formatCurrency } from '../../../utils';

interface BundleItemSelectionProps {
  items: BundleItemInput[];
  onAdd: (variant: Variant) => void;
  onRemove: (variantId: string) => void;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
}

export function BundleItemSelection({
  items,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: BundleItemSelectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocusInputSearch, setIsFocusInputSearch] = useState<boolean>(false);
  const { variants, loading, filters, getVariantsInStore, setFilters } = useVariant();

  const debouncedSearch = useDebounceCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      q: value,
    }));
    getVariantsInStore();
  }, 500);

  useClickOutside(ref, () => {
    setIsFocusInputSearch(false);
  });

  useEffect(() => {
    if (isFocusInputSearch) {
      getVariantsInStore();
    }
  }, [filters, isFocusInputSearch]);

  return (
    <div className="space-y-4">
      <div className="relative" ref={ref}>
        <Input
          type="search"
          radius="sm"
          leftSection={<Search size={16} />}
          size="sm"
          onChange={(e) => debouncedSearch(e.target.value)}
          onFocus={() => setIsFocusInputSearch(true)}
          placeholder="Tìm kiếm sản phẩm để thêm vào combo..."
          className="w-full"
          rightSection={loading ? <Loading color="#3b82f6" size="xs" /> : null}
        />

        {isFocusInputSearch && (
          <div className="absolute top-full mt-1 left-0 w-full border border-gray-200 bg-white z-50 shadow-md rounded-md p-3 max-h-[300px] overflow-y-auto">
            {variants.length === 0 ? (
              <div className="text-center items-center flex flex-col gap-2 p-4">
                <SearchX size={48} className="text-gray-400" />
                <span className="text-sm text-gray-500">Không tìm thấy sản phẩm</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {variants.map((variant) => {
                  const isAdded = items.some((item) => item.variantId === variant.id);
                  return (
                    <div
                      key={variant.id}
                      onClick={() => !isAdded && onAdd(variant)}
                      className={`flex items-center justify-between py-2 px-2 hover:bg-gray-50 cursor-pointer ${isAdded ? 'opacity-50 grayscale' : ''}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{variant.name}</span>
                        <span className="text-xs text-gray-500">{variant.sku}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-pos-blue-600">
                          {formatCurrency(variant.price)}
                        </div>
                        <div className="text-xs text-gray-500">Tồn: {variant.onHand}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Items List */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Sản phẩm</th>
              <th className="px-4 py-2 text-center font-semibold w-24">Số lượng</th>
              <th className="px-4 py-2 text-right font-semibold w-32">Giá từng món</th>
              <th className="px-4 py-2 text-center font-semibold w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">
                  Chưa có sản phẩm nào được chọn
                </td>
              </tr>
            ) : (
              items.map((item) => {
                if (!item.variantId || !variants) return null;
                const variant = variants?.find((v) => v.id === item.variantId);
                return (
                  <tr key={item.variantId} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.variant_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <NumberInput
                        size="sm"
                        min={1}
                        value={item.quantity}
                        onChange={(val) => onUpdateQuantity(item.variantId, Number(val))}
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatCurrency(item.quantity * (variant?.price || 0))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onRemove(item.variantId)}
                        className="text-red-400 hover:text-red-600 p-1 hover:cursor-pointer transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
