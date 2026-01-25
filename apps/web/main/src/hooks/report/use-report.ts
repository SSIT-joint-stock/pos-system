import {
  ApiResponse,
  ReportCustomer,
  ReportSupplier,
  ReportSupplierDetailResponse,
} from '@repo/design-system/types';
import { useCallback, useState } from 'react';
import { FilterValue, useQueryParams } from '../../hooks/query/use-query-params';
import { useRequestHelper } from '../../hooks/use-request-helper';
import api from '../../libs/axios';

export interface ReportSupplierFilter extends Record<string, FilterValue> {
  q?: string;
}
export function useReport() {
  // hooks
  const [reportSuppliers, setReportSuppliers] = useState<ReportSupplier[]>([]);
  const [reportSupplier, setReportSupplier] = useState<ReportSupplierDetailResponse>();
  const [reportCustomers, setReportCustomers] = useState<ReportCustomer[]>([]);
  const { loading, requestWrapper } = useRequestHelper();
  const {
    paginationParams,
    sort,
    sortBy,
    filters,
    pagination,

    setPaginationParams,
    setFilters,
    setPagination,
    buildParams,
    setSortBy,
    setSort,
  } = useQueryParams<ReportSupplierFilter>({
    q: 'q',
  });

  // get report suppliers
  const getReportSuppliers = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/report/suppliers?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setReportSuppliers(res?.data?.data as ReportSupplier[]);
      setPagination(res?.data?.pagination);
    }
  }, [requestWrapper, buildParams, setPagination]);

  const getReportSupplier = useCallback(
    async (supplierId: string) => {
      const res = await requestWrapper(() =>
        api.get<ApiResponse>(`/report/supplier/${supplierId}`)
      );
      if (res?.data.success) {
        setReportSupplier(res?.data?.data as ReportSupplierDetailResponse);
      }
    },
    [requestWrapper]
  );

  const getReportCustomers = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/report/customers?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setReportCustomers(res?.data?.data as ReportCustomer[]);
      setPagination(res?.data?.pagination);
    }
  }, [requestWrapper, buildParams, setPagination]);
  return {
    getReportSuppliers,
    getReportSupplier,
    getReportCustomers,
    setPaginationParams,
    setFilters,
    setPagination,
    setSort,
    setSortBy,
    loading,
    pagination,
    paginationParams,
    sort,
    sortBy,
    filters,
    reportSuppliers,
    reportSupplier,
    reportCustomers,
  };
}
