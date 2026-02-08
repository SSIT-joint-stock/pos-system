'use client';
import { Drawer } from '@mantine/core';
import { Select } from '@repo/design-system/components/ui';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import React from 'react';
import { ProductFilters } from '../../../../../main/src/hooks/product/use-product';

export default function FiltersProducts({
  isOpenFilterProducts,
  sort,
  sortBy,
  setSort,
  setSortBy,
  setIsOpenFilterProducts,
  setFilters,
}: {
  isOpenFilterProducts: boolean;
  sort: string;
  sortBy: string;
  setSort: (value: 'asc' | 'desc') => void;
  setSortBy: (value: string) => void;
  setIsOpenFilterProducts: (value: boolean) => void;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}) {
  const { showSuccessToast } = useToast();

  const handleFilterApply = () => {
    setFilters((prev) => ({
      ...prev,
    }));
  };

  return (
    <Drawer
      size="md"
      position="right"
      opened={isOpenFilterProducts}
      onClose={() => setIsOpenFilterProducts(false)}
      title={<div className="text-2xl font-semibold text-pos-blue-500">Bộ Lọc</div>}
      styles={{
        body: {
          height: '90%', // ép full viewport
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 0,
        },
      }}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Nội dung có thể cuộn nếu dài */}
        <div className="flex-1 overflow-y-auto">
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-600">Sắp xếp</h2>
            <Select
              value={`${sortBy}-${sort}`}
              onChange={(value) => {
                const [sortByValue, sortValue] = value!.split('-');
                setSortBy(sortByValue);
                setSort(sortValue as 'asc' | 'desc');
              }}
              allowDeselect={false}
              className="mt-1"
              position="bottom"
              size="sm"
              radius="sm"
              data={[
                {
                  label: 'Thời gian tạo giảm dần',
                  sortBy: 'createdAt',
                  sort: 'desc',
                  value: 'createdAt-desc',
                },
                {
                  label: 'Thời gian tạo tăng dần',
                  sortBy: 'createdAt',
                  sort: 'asc',
                  value: 'createdAt-asc',
                },
                { label: 'Tên: A - Z', sortBy: 'name', sort: 'asc', value: 'name-asc' },
                { label: 'Tên: Z - A', sortBy: 'name', sort: 'desc', value: 'name-desc' },
                { label: 'Giá bán tăng dần', sortBy: 'price', sort: 'asc', value: 'price-asc' },
                { label: 'Giá bán giảm dần', sortBy: 'price', sort: 'desc', value: 'price-desc' },
              ]}
            />
          </div>
        </div>

        {/* Footer cố định ở đáy */}
        <div className=" flex items-center justify-between text-sm font-semibold shrink-0 ">
          <button
            onClick={() => {
              setSort('desc');
              setSortBy('createdAt');
            }}
            className="text-red-500 border border-red-500 py-2 px-4 rounded-md hover:cursor-pointer"
          >
            Đặt lại
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpenFilterProducts(false)}
              className="text-pos-blue-500 bg-pos-blue-50 py-2 px-4 rounded-md hover:cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                handleFilterApply();
                setIsOpenFilterProducts(false);
                // setSelectedCategoriesIds([]);
                showSuccessToast('Bộ lọc đã được áp dụng!');
              }}
              className="bg-pos-blue-500 text-pos-blue-50 py-2 px-4 rounded-md hover:cursor-pointer"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
