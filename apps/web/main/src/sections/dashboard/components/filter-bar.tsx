'use client';
import { AutoComplete, DatePickerInput, Select } from '@repo/design-system/components/ui';
import { Calendar1, Search } from 'lucide-react';
import * as React from 'react';

type FilterOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  onSearch?: (value: string) => void;
  statusOptions?: FilterOption[];
  categoryOptions?: FilterOption[];
  onFilterChange?: (filters: {
    status?: string;
    category?: string;
    date?: [string, string];
  }) => void;
  actions?: React.ReactNode;
  hasBg?: boolean;
  setWidth?: string;
  hasDatePicker?: boolean;
  placeholderInputSearch?: string;
  dataComplete?: string[];
};

export default function FilterBar({
  onSearch,
  statusOptions = [],
  categoryOptions = [],
  onFilterChange,
  actions,
  hasBg = true,
  setWidth = '34%',
  hasDatePicker = true,
  placeholderInputSearch,
  dataComplete,
}: FilterBarProps) {
  const [status, setStatus] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [date, setDate] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>('');

  // Ref to track if component has mounted
  const hasMounted = React.useRef(false);

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    // Check if both dates are actually selected and not null
    if (!date || date.length < 2) {
      onFilterChange?.({
        status,
        category,
        date: undefined,
      });
      return;
    }

    onFilterChange?.({
      status,
      category,
      date: [date[0]?.toString() ?? '', date[1]?.toString() ?? ''] as [string, string],
    });
  }, [status, category, date]);
  // Handle search when button is clicked
  const handleSearchClick = () => {
    const timeout = setTimeout(() => {
      if (onSearch) {
        onSearch(searchValue);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  };

  return (
    <div className={`flex items-center ${hasBg ? 'bg-white p-5 rounded-lg shadow' : ''}`}>
      <div className="flex items-center w-full gap-2">
        {/* SEARCH */}
        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleSearchClick();
          }}
          style={{ width: setWidth }}
          className={` flex items-center overflow-hidden`}
        >
          <AutoComplete
            onChange={setSearchValue}
            size="sm"
            radius="sm"
            leftSection={<Search size={16} />}
            // variant="unstyled"
            placeholder={placeholderInputSearch ?? 'Tìm kiếm sản phẩm'}
            data={dataComplete || ['T-Shirt', 'Cap', 'Shoes', 'Watch', 'Sunglass']}
            className="flex-1"
            rightSection={
              <button
                onClick={handleSearchClick}
                className="bg-pos-blue-500 text-white "
                title="Tìm kiếm"
              >
                <Search size={16} />
              </button>
            }
          />
        </form>

        {/* FILTER */}
        <div className="flex items-center gap-2">
          {statusOptions.length > 0 && (
            <Select
              data={statusOptions}
              position="bottom"
              placeholder="Trạng thái"
              value={status}
              onChange={(value) => setStatus(value ?? undefined)}
              size="sm"
              radius="sm"
              className="w-[200px] text-sm font-medium"
            />
          )}

          {categoryOptions.length > 0 && (
            <Select
              data={categoryOptions}
              placeholder="Danh mục"
              position="bottom"
              value={category}
              onChange={(value) => setCategory(value ?? undefined)}
              size="xs"
              radius="sm"
              className="w-[150px] text-xs font-medium"
            />
          )}

          {hasDatePicker && (
            <div className="w-[26ch] rounded-md outline-none">
              <DatePickerInput
                type="range"
                // variant="unstyled"
                radius="sm"
                clearable
                placeholder="VD: 15/08/2025-22/08/2025"
                size="sm"
                value={date}
                onChange={(val) => setDate((val as string[]) || [])}
                rightSection={<Calendar1 size={16} />}
                // className="w-full text-nowrap border border-gray-500 py-[1px] px-2 text-sm text-gray-900 font-medium placeholder:font-normal placeholder:text-gray-900"
              />
            </div>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 justify-end w-fit">{actions}</div>
    </div>
  );
}
