"use client";
import * as React from "react";
import { Select } from "../select";
import { Pagination } from "../pagination";

export type TableProps<T> = {
  size?: string;
  tableHeaders: string[];
  data: T[];
  page?: number;
  totalPages?: number;
  pageSize?: number;
  renderRow: (row: T, idx: number) => React.ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

export function Table<T>({
//   size,
  tableHeaders,
  data,
  renderRow,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: TableProps<T>) {
  return (
    <div className="bg-white rounded-md p-5 mt-5 flex-col flex overflow-y-auto">
      {/* TABLE */}
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-transparent">
        <table className="table-fixed w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="text-left text-base text-gray-800">
              {tableHeaders.map((item, idx) => (
                <th key={idx} className="px-4 py-2 font-semibold">
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>{data.map((row, idx) => renderRow(row, idx))}</tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-800 font-medium">Hiển thị:</span>
          <div className="w-fit">
            <Select
              value={String(pageSize)}
              size="xs"
              radius="sm"
              data={["10", "20", "30", "40", "50"]}
              className="w-[10ch]"
              onChange={(val) => onPageSizeChange?.(Number(val))}
            />
          </div>
        </div>

        <Pagination size="sm" total={totalPages} onChange={onPageChange} />
      </div>
    </div>
  );
}
