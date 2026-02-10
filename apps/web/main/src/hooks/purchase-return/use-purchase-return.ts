import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { ApiResponse, PurchaseReturn } from '@repo/design-system/types';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FilterValue, useQueryParams } from '../../hooks/query/use-query-params';
import { useRequestHelper } from '../../hooks/use-request-helper';
import api from '../../libs/axios';
import {
  AcceptPaymentExport,
  AcceptPaymentExportSChema,
  PurchaseReturnWithoutPO,
  PurchaseReturnWithoutPOSchema,
  PurchaseReturnWithPurchaseOrder,
  PurchaseReturnWithPurchaseOrderSchema,
} from '../../schemas/purchase-return/purchase-return.schema';

export interface PurchaseOrderFilters extends Record<string, FilterValue> {
  q?: string;
  payment_status?: string;
  status?: string;
}

export function usePurchaseReturn() {
  const { showSuccessToast } = useToast();
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
  } = useQueryParams<PurchaseOrderFilters>({
    q: 'q',
    payment_status: 'payment_status',
    status: 'status',
  });
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>([]);
  const [purchaseReturn, setPurchaseReturn] = useState<PurchaseReturn | null>(null);
  // Form
  const formPurchaseWithPO = useForm<PurchaseReturnWithPurchaseOrder>({
    resolver: zodResolver(PurchaseReturnWithPurchaseOrderSchema),
    defaultValues: {
      items: [],
    },
  });
  const formPurchaseWithoutPO = useForm<PurchaseReturnWithoutPO>({
    resolver: zodResolver(PurchaseReturnWithoutPOSchema),
    defaultValues: {
      items: [],
    },
  });
  const formAcceptPaymentExport = useForm<AcceptPaymentExport>({
    resolver: zodResolver(AcceptPaymentExportSChema),
  });

  const createPurchaseReturnWithPO = useCallback(
    async (purchaseReturnId: string, data: PurchaseReturnWithPurchaseOrder) => {
      const res = await requestWrapper(() =>
        api.post<ApiResponse>(`/purchase-return/order/${purchaseReturnId}`, data)
      );
      if (res?.data.success) {
        showSuccessToast(res?.data?.message as string);
        return {
          success: true,
          data: res.data.data as PurchaseReturn,
        };
      }
      return {
        success: false,
        data: null,
      };
    },
    [requestWrapper, showSuccessToast]
  );

  const createPurchaseReturnWithoutPO = useCallback(
    async (data: PurchaseReturnWithoutPO) => {
      const res = await requestWrapper(() => api.post<ApiResponse>(`/purchase-return/free`, data));
      if (res?.data.success) {
        showSuccessToast(res?.data?.message as string);
        return {
          success: true,
          data: res.data.data as PurchaseReturn,
        };
      }
      return {
        success: false,
        data: null,
      };
    },
    [requestWrapper, showSuccessToast]
  );
  const getPurchaseReturns = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/purchase-return?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setPurchaseReturns(res?.data?.data as PurchaseReturn[]);
      setPagination(res?.data?.pagination);
    }
  }, [requestWrapper, buildParams, setPagination]);

  const getPurchaseReturn = useCallback(
    async (id: string) => {
      const res = await requestWrapper(() => api.get<ApiResponse>(`/purchase-return/${id}`));
      if (res?.data.success) {
        setPurchaseReturn(res?.data?.data as PurchaseReturn);
      }
    },
    [requestWrapper]
  );

  const acceptPaymentExport = useCallback(
    async (id: string, data: AcceptPaymentExport) => {
      const res = await requestWrapper(() =>
        api.put<ApiResponse>(`/purchase-return/accept-payment/${id}`, data)
      );
      if (res?.data.success) {
        showSuccessToast(res?.data?.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );

  return {
    formPurchaseWithPO,
    formPurchaseWithoutPO,
    formAcceptPaymentExport,
    loading,
    purchaseReturns,
    purchaseReturn,

    pagination,
    paginationParams,
    sort,
    sortBy,
    filters,
    setPaginationParams,
    setFilters,
    setPagination,
    buildParams,
    setSortBy,
    setSort,

    createPurchaseReturnWithoutPO,
    createPurchaseReturnWithPO,
    getPurchaseReturns,
    getPurchaseReturn,
    acceptPaymentExport,
  };
}
