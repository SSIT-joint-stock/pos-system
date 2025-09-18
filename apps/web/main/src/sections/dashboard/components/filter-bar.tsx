'use client';
import { AutoComplete, DatePickerInput, Select } from '@repo/design-system/components/ui';
import { Calendar1, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

type FilterOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  onSearch?: (value: string) => void;
  statusOptions?: FilterOption[];
  categoryOptions?: FilterOption[];
  onFilterChange?: (filters: { status?: string; category?: string; date?: [Date, Date] }) => void;
  actions?: React.ReactNode;
};

export default function FilterBar({
  onSearch,
  statusOptions = [],
  categoryOptions = [],
  onFilterChange,
  actions,
}: FilterBarProps) {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<[string | null, string | null]>([null, null]);
  const [searchValue, setSearchValue] = useState<string>('');
  // Handle date change with proper typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange?.({
        search: searchValue || undefined,
        status,
        category,
        date: date && date[0] && date[1] ? [date[0], date[1]] : undefined,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [status, category, date[1], searchValue]);

  return (
    <div className="flex items-center bg-white p-5 rounded-lg shadow">
      <div className="flex items-center w-full gap-2">
        {/* SEARCH */}
        <div className="w-[30%] border border-gray-200 rounded-md outline-none">
          <AutoComplete
            radius="md"
            onChange={(val) => {
              if (typeof val === 'string') {
                setSearchValue(val);
              }
            }}
            size="xs"
            leftSection={<Search size={16} />}
            variant="unstyled"
            placeholder="Tìm kiếm sản phẩm"
            data={['T-Shirt', 'Cap', 'Shoes', 'Watch', 'Sunglass']}
            className="w-full py-[1px] text-sm text-gray-900 font-medium placeholder:font-normal"
          />
        </div>
        {/* FILTER */}
        <div className="flex items-center gap-2">
          {statusOptions.length > 0 && (
            <Select
              data={statusOptions}
              position="bottom"
              placeholder="Trạng thái"
              value={status}
              onChange={setStatus}
              size="xs"
              radius="sm"
              className="w-[150px] text-xs font-medium"
            />
          )}
          {categoryOptions.length > 0 && (
            <Select
              data={categoryOptions}
              placeholder="Danh mục"
              position="bottom"
              value={category}
              onChange={setCategory}
              size="xs"
              radius="sm"
              className="w-[150px] text-xs font-medium"
            />
          )}
          <div className="w-[22ch] border border-gray-200 rounded-md outline-none">
            <DatePickerInput
              type="range"
              variant="unstyled"
              radius="md"
              clearable
              placeholder="VD: 15/08/2025-22/08/2025"
              size="xs"
              value={date}
              onChange={setDate}
              rightSection={<Calendar1 size={16} />}
              className="w-fit text-nowrap py-[1px] px-2 text-sm text-gray-900 font-medium placeholder:font-normal placeholder:text-gray-900"
            />
          </div>
        </div>
      </div>
      {/* ACTIONS */}
      <div className="flex items-center gap-2 justify-end w-fit">{actions}</div>
    </div>
  );
}
