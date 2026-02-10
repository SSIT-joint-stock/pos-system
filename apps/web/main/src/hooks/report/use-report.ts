import {
  ApiResponse,
  ReportCustomer,
  ReportCustomerMember,
  ReportOrderReturns,
  ReportOrders,
  ReportPurchaseInvoices,
  ReportStocks,
  ReportStoreMembers,
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
  const [reportStoreMembers, setReportStoreMembers] = useState<ReportStoreMembers[]>([]);
  const [reportStoreMember, setReportStoreMember] = useState<ReportCustomerMember | null>(null);

  const [reportOrders, setReportOrders] = useState<ReportOrders[]>([]);
  const [reportOrderReturns, setReportOrderReturns] = useState<ReportOrderReturns[]>([]);
  const [reportStocks, setReportStocks] = useState<ReportStocks[]>([]);
  const [reportPurchaseInvoices, setReportPurchaseInvoices] = useState<ReportPurchaseInvoices[]>(
    []
  );
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

  const getReportOrders = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/report/order-items?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setReportOrders(res?.data?.data as ReportOrders[]);
      setPagination(res?.data?.pagination);
    }
  }, [requestWrapper, buildParams, setPagination]);

  const getReportStoreMembers = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/report/store-members?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setReportStoreMembers(res?.data?.data as ReportStoreMembers[]);
      setPagination(res?.data?.pagination);
    }
  }, [requestWrapper, buildParams, setPagination]);

  const getReportStoreMember = useCallback(
    async (memberId: string) => {
      const res = await requestWrapper(() =>
        api.get<ApiResponse>(`/report/store-member/${memberId}`)
      );
      if (res?.data.success) {
        setReportStoreMember(res?.data?.data as ReportCustomerMember);
      }
    },
    [requestWrapper]
  );

  const getReportOrderReturns = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/report/order-returns?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setReportOrderReturns(res?.data?.data as ReportOrderReturns[]);
      setPagination(res?.data?.pagination);
    }
  }, [requestWrapper, buildParams, setPagination]);

  const getReportStocks = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/report/stocks?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setReportStocks(res?.data?.data as ReportStocks[]);
      setPagination(res?.data?.pagination);
    }
  }, [requestWrapper, buildParams, setPagination]);

  const getReportPurchaseInvoices = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/report/purchase-invoices?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setReportPurchaseInvoices(res?.data?.data as ReportPurchaseInvoices[]);
      setPagination(res?.data?.pagination);
    }
  }, [requestWrapper, buildParams, setPagination]);

  return {
    getReportSuppliers,
    getReportSupplier,
    getReportCustomers,
    getReportOrders,
    getReportStoreMembers,
    getReportStoreMember,
    getReportOrderReturns,
    getReportStocks,
    getReportPurchaseInvoices,
    reportStoreMember,
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
    reportOrders,
    reportStoreMembers,
    reportOrderReturns,
    reportStocks,
    reportPurchaseInvoices,
  };
}
