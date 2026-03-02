'use client';
import { TableSkeleton } from '@repo/design-system/components/ui/loading-skeleton-table';
import * as React from 'react';
import { numericalOrder } from '../../../../../../apps/web/main/src/utils';
import { Pagination } from '../pagination';
import { Select } from '../select';
export type TableProps<T> = {
  limit?: number;
  total?: number;
  size?: string;
  tableHeaders: string[];
  data: T[];
  page?: number;
  totalPages?: number;
  pageSize?: number;
  renderRow: (row: T, idx: number) => React.ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  loading?: React.ReactNode;
  hasMarginTop?: boolean;
  hasPagination?: boolean;
  className?: string;
  link?: string;
  hasPadding?: boolean;
};

export function Table<T>({
  total = 0,
  tableHeaders,
  page = 1,
  data,
  renderRow,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  isLoading,
  hasMarginTop = true,
  limit = 10,
  hasPagination = true,
  hasPadding = true,
  className,
}: TableProps<T>) {
  const finalHeader = ['STT', ...tableHeaders];
  return (
    <div
      className={`bg-white text-nowrap  ${hasPadding ? 'p-4' : ''}  ${hasMarginTop ? 'mt-0' : ''} flex-col flex overflow-y-auto  rounded-lg ${className} h-full`}
    >
      {/* TABLE */}
      <div
        className={`overflow-auto flex-1 scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-transparent `}
      >
        <table className={`table-auto w-full border-collapse ${data.length === 0 ? 'h-full' : ''}`}>
          <thead className="sticky top-0 z-20 bg-gray-50">
            <tr className="text-left text-base text-gray-800">
              {finalHeader.map((item, idx) => (
                <th key={idx} className="px-4 py-2 font-semibold text-nowrap">
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="h-full">
            {isLoading ? (
              <TableSkeleton numColumns={finalHeader.length} numRows={pageSize} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={finalHeader.length} className="text-center py-6 space-y-3">
                  <h4 className="text-2xl font-semibold text-pos-blue-500">Không có dữ liệu</h4>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto text-wrap">
                    Danh sách hiện đang trống. Thử thay đổi bộ lọc hoặc thêm mới dữ liệu để bắt đầu
                    quản lý.
                  </p>
                </td>
              </tr>
            ) : (
              <>
                {data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {numericalOrder(idx, page, limit, total)}
                    </td>
                    {renderRow(item, idx)}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {hasPagination && (
        <div className="mt-2 flex items-center justify-between border-t border-t-gray-100 pt-3.5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-800 font-medium">Hiển thị:</span>
              <div className="w-fit">
                <Select
                  value={String(pageSize)}
                  size="xs"
                  radius="sm"
                  data={['10', '20', '30', '40', '50']}
                  className="w-[10ch]"
                  onChange={(val) => onPageSizeChange?.(Number(val))}
                />
              </div>

              <span className="text-sm text-gray-800 font-medium">{`Trang ${page} trong ${totalPages}`}</span>
            </div>
            <div className="text-sm text-gray-800 font-medium">
              Tổng số lượng:{' '}
              <span className="text-base text-pos-blue-500 font-semibold">{total}</span>
            </div>
          </div>

          <Pagination
            size="sm"
            radius="sm"
            // boundaries={2}
            // siblings={2}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
