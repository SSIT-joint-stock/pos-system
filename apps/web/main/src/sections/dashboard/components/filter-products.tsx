'use client';
import { ProductFilters } from '../../../../../main/src/hooks/product/use-product';
import { useCategories } from '../../../../../main/src/hooks/categories/use-categories';
import { createTheme, Drawer, MantineProvider } from '@mantine/core';
import { Checkbox, Select } from '@repo/design-system/components/ui';
import React, { useEffect } from 'react';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
const theme = createTheme({
  cursorType: 'pointer',
});
export default function FiltersProducts({
  isOpenFilterProducts,
  selectedCategoriesIds,
  sort,
  sortBy,
  setSort,
  setSortBy,
  setIsOpenFilterProducts,
  setSelectedCategoriesIds,
  setFilters,
}: {
  isOpenFilterProducts: boolean;
  selectedCategoriesIds: string[];
  sort: string;
  sortBy: string;
  setSort: (value: 'asc' | 'desc') => void;
  setSortBy: (value: string) => void;
  setIsOpenFilterProducts: (value: boolean) => void;
  setSelectedCategoriesIds: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}) {
  const { categories, getCategories } = useCategories();
  const { showSuccessToast } = useToast();

  const handleFilterApply = () => {
    setFilters((prev) => ({
      ...prev,
      categories: selectedCategoriesIds.join(','),
    }));
  };
  useEffect(() => {
    if (isOpenFilterProducts) {
      getCategories();
    }
  }, [isOpenFilterProducts]);

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
          <div className="mt-4 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-600">Nhóm sản phẩm</h2>
            <div className="flex flex-col gap-2.5 mt-2.5">
              <MantineProvider theme={theme}>
                <Checkbox
                  size="sm"
                  radius="sm"
                  label={'Tất cả'}
                  onChange={() => setSelectedCategoriesIds([])}
                  checked={selectedCategoriesIds.length === 0}
                />
              </MantineProvider>

              {categories.map((category) => {
                const isChecked = selectedCategoriesIds.includes(category.id);
                return (
                  <MantineProvider key={category.id} theme={theme}>
                    <Checkbox
                      key={category.id}
                      size="sm"
                      radius="sm"
                      label={category.name}
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setSelectedCategoriesIds((prev) =>
                            prev.filter((id) => id !== category.id)
                          );
                        } else {
                          setSelectedCategoriesIds((prev) => [...prev, category.id]);
                        }
                      }}
                    />
                  </MantineProvider>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-600">Sắp xếp</h2>
            <Select
              value={`${sortBy}-${sort}`}
              onChange={(value) => {
                const [sortByValue, sortValue] = value!.split('-');
                setSortBy(sortByValue);
                setSort(sortValue as 'asc' | 'desc');
              }}
              className="mt-1"
              position="bottom"
              size="sm"
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
              setSelectedCategoriesIds([]);
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
