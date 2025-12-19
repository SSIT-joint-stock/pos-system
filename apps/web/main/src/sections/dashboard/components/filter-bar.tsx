import { AutoComplete, DatePickerInput, Select } from '@repo/design-system/components/ui';
import { Calendar1, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type DynamicFilter = {
  key: string;
  label?: string;
  options: { label: string; value: string }[];
  width?: string;
};
type FilterBarProps = {
  onSearch?: (value: string) => void;
  filters?: DynamicFilter[];
  onFilterChange?: (filters: Record<string, any>) => void;
  actions?: React.ReactNode;
  hasBg?: boolean;
  setWidth?: string;
  hasDatePicker?: boolean;
  placeholderInputSearch?: string;
  dataComplete?: string[];
};

export default function FilterBar({
  onSearch,
  filters = [],
  onFilterChange,
  actions,
  hasBg = true,
  setWidth = '38%',
  hasDatePicker = true,
  placeholderInputSearch,
  dataComplete,
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState<string>('');
  const [date, setDate] = useState<string[]>([]);
  const [filterValues, setFilterValues] = useState<Record<string, string | undefined>>({});

  const hasMounted = useRef(false);

  // theo dõi tất cả filter + date
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    onFilterChange?.({
      ...filterValues,
      date: date.length === 2 ? [date[0], date[1]] : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues, date]);

  const handleChange = (key: string, value: string | null) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value ?? undefined,
    }));
  };

  const handleSearchClick = () => {
    onSearch?.(searchValue);
  };

  return (
    <div className={`flex items-center ${hasBg ? 'bg-white p-5 rounded-lg ' : ''}`}>
      <div className="flex items-center w-full gap-2">
        {/* SEARCH */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchClick();
          }}
          style={{ width: setWidth }}
          className="flex items-center overflow-hidden"
        >
          <AutoComplete
            onChange={setSearchValue}
            size="sm"
            radius="sm"
            placeholder={placeholderInputSearch ?? 'Tìm kiếm'}
            data={dataComplete ?? []}
            className="flex-1"
            rightSection={
              <button
                type="button"
                onClick={handleSearchClick}
                className="p-2 rounded-md hover:bg-gray-100 hover:cursor-pointer"
              >
                <Search size={16} />
              </button>
            }
          />
        </form>

        {/* DYNAMIC SELECT FILTERS */}
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <Select
              key={f.key}
              data={f.options}
              placeholder={f.label}
              value={filterValues[f.key]}
              onChange={(val) => handleChange(f.key, val)}
              size="sm"
              radius="sm"
              position="bottom"
              style={{ width: f.width ?? '200px' }}
            />
          ))}

          {/* DATE FILTER */}
          {hasDatePicker && (
            <div className="w-[26ch] rounded-md">
              <DatePickerInput
                type="range"
                radius="sm"
                clearable
                placeholder="VD: 15/08/2025 - 22/08/2025"
                size="sm"
                value={date}
                onChange={(val) => setDate((val as string[]) || [])}
                rightSection={<Calendar1 size={16} />}
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
