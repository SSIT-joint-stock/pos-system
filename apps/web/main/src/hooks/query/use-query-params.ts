'use client';
import { useState } from 'react';

interface PaginationParams {
  page: number;
  limit: number;
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export type FilterValue = string | number | boolean | [string, string] | undefined;

export function useQueryParams<T extends Record<string, FilterValue>>(
  mapping?: Record<keyof T, string>
) {
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const [filters, setFilters] = useState<T>({} as T);
  const [pagination, setPagination] = useState<Pagination>();

  const buildParams = () => {
    const params = new URLSearchParams({
      page: paginationParams.page.toString(),
      limit: paginationParams.limit.toString(),
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      const queryKey = mapping?.[key as keyof T] ?? key;

      if (Array.isArray(value) && value.length === 2) {
        const [start, end] = value;
        console.log(start, end);
        if (start) {
          params.append('startDate', start);
        }

        if (end) {
          params.append('endDate', end);
        }

        return;
      }

      params.append(queryKey, value.toString());
    });
    return params;
  };

  return {
    paginationParams,
    setPaginationParams,
    filters,
    setFilters,
    pagination,
    setPagination,
    buildParams,
  };
}
