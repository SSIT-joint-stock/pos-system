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
};

export default function FilterBar({
  onSearch,
  statusOptions = [],
  categoryOptions = [],
  onFilterChange,
  actions,
  hasBg = true,
  setWidth = '34%',
}: FilterBarProps) {
  const [status, setStatus] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [date, setDate] = React.useState<[string | null, string | null]>([null, null]);
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
        date: null,
      });
      return;
    }

    onFilterChange?.({
      status,
      category,
      date: [date[0], date[1]],
    });
  }, [status, category, date]);
  // Handle search when button is clicked
  const handleSearchClick = () => {
    const timedout = setTimeout(() => {
      if (onSearch) {
        onSearch(searchValue);
      }
    }, 1000);
    return () => clearTimeout(timedout);
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
          className={` flex items-center border border-gray-200 rounded-md overflow-hidden`}
        >
          <AutoComplete
            onChange={setSearchValue}
            size="xs"
            leftSection={<Search size={16} />}
            variant="unstyled"
            placeholder="Tìm kiếm sản phẩm"
            data={['T-Shirt', 'Cap', 'Shoes', 'Watch', 'Sunglass']}
            className="flex-1 py-[1px] text-sm text-gray-900 font-medium placeholder:font-normal"
            rightSection={
              <button
                onClick={handleSearchClick}
                className="bg-pos-blue-500 text-white p-2"
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
              onChange={setStatus}
              size="xs"
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
              className="w-full text-nowrap py-[1px] px-2 text-sm text-gray-900 font-medium placeholder:font-normal placeholder:text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 justify-end w-fit">{actions}</div>
    </div>
  );
}
