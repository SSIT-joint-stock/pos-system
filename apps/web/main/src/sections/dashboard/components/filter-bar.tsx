"use client";
import {
  AutoComplete,
  DatePickerInput,
} from "@repo/design-system/components/ui";
import { Calendar1, ChevronDown,Search } from "lucide-react";
import * as React from "react";
type FilterBarProps = {
  onSearch?: (value: string) => void;
  actions?: React.ReactNode;
};

export default function FilterBar({ onSearch, actions }: FilterBarProps) {
  return (
    <div className="flex items-center bg-white p-5 rounded-md">
      <div className="flex items-center w-full gap-2">
        {/* SEARCH */}
        <div className="w-[30%] border border-gray-200 rounded-md   outline-none">
          <AutoComplete
            radius="md"
            size="xs"
            leftSection={<Search size={16} />}
            variant="unstyled"
            placeholder="Tìm kiếm sản phẩm"
            data={["T-Shirt", "Cap", "Shoes", "Watch", "Sunglass"]}
            comboboxProps={{
              transitionProps: { transition: "pop", duration: 200 },
            }}
            className="w-full  py-[1px] text-sm text-gray-900 font-medium placeholder:font-normal"
          />
        </div>
        {/* FILTER */}
        <div className="flex items-center gap-2 ">
          <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
            <span className="text-gray-900 font-medium text-xs">
              Trạng thái
            </span>
            <ChevronDown size={16} />
          </button>
          <button className="bg-white text-nowrap border border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
            <span className="text-gray-900 font-medium text-xs">Danh mục</span>
            <ChevronDown size={16} />
          </button>
          <div className="w-[22ch] border border-gray-200 rounded-md   outline-none">
            <DatePickerInput
              rightSection={<Calendar1  size={16}/>}
              type="range"
              variant="unstyled"
              radius="md"
              clearable
              placeholder="VD: 15/08/2025-22/08/2025"
              size="xs"
              className="w-fit text-nowrap  py-[1px] px-2 text-sm text-gray-900 font-medium placeholder:font-normal placeholder:text-gray-900"
            />
          </div>
        </div>
      </div>
      {/* ACTIONS */}
      <div className="flex items-center gap-2 justify-end w-fit">{actions}</div>
    </div>
  );
}
