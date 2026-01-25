import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { ApiResponse, IOrderReturn } from '@repo/design-system/types';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FilterValue, useQueryParams } from '../../hooks/query/use-query-params';
import { useRequestHelper } from '../../hooks/use-request-helper';
import api from '../../libs/axios';
import {
  AcceptPaymentReturn,
  AcceptPaymentReturnSchema,
  AcceptQuantitySchema,
  OrderReturn,
  OrderReturnSchema,
} from '../../schemas/order/order-return.schema';
import { AcceptQuantity } from './../../schemas/order/order-return.schema';

interface OrderReturnFilters extends Record<string, FilterValue> {
  q?: string;
  return_type?: string;
  return_status?: string;
}

export function useOrderReturn() {
  const [orderReturns, setOrderReturns] = useState<IOrderReturn[]>([]);
  const [orderReturn, setOrderReturn] = useState<IOrderReturn | null>();
  const { loading, requestWrapper } = useRequestHelper();
  const { showSuccessToast } = useToast();
  const {
    setPaginationParams,
    setFilters,
    setSort,
    setPagination,
    buildParams,
    setSortBy,
    paginationParams,
    filters,
    pagination,
  } = useQueryParams<OrderReturnFilters>({
    q: 'q',
    return_type: 'return_type',
    return_status: 'return_status',
  });

  const orderReturnForm = useForm<OrderReturn>({
    resolver: zodResolver(OrderReturnSchema),
  });
  const acceptQuantityForm = useForm<AcceptQuantity>({
    resolver: zodResolver(AcceptQuantitySchema),
  });
  const acceptPaymentForm = useForm<AcceptPaymentReturn>({
    resolver: zodResolver(AcceptPaymentReturnSchema),
  });
  const createReturnOrder = async (orderId: string, data: OrderReturn) => {
    const res = await requestWrapper(() => api.post<ApiResponse>(`/order-return/${orderId}`, data));
    if (res?.data.success) {
      showSuccessToast(res?.data?.message as string);
      return {
        success: true,
        data: res.data.data as IOrderReturn,
      };
    }
    return {
      success: false,
      data: null,
    };
  };

  const acceptStockQuantity = async (returnId: string, data: AcceptQuantity) => {
    const res = await requestWrapper(() =>
      api.patch<ApiResponse>(`/order-return/accept-stock/${returnId}`, data)
    );
    if (res?.data.success) {
      showSuccessToast(res?.data?.message as string);
      return true;
    }
    return false;
  };
  const acceptPaymentReturn = async (returnId: string, data: AcceptPaymentReturn) => {
    const res = await requestWrapper(() =>
      api.post<ApiResponse>(`/order-return/accept-payment/${returnId}`, data)
    );
    if (res?.data.success) {
      showSuccessToast(res?.data?.message as string);
      return true;
    }
    return false;
  };

  const getAllReturnOrder = useCallback(async () => {
    const res = await requestWrapper(() => api.get(`/order-return?${buildParams().toString()}`));

    if (res?.data.success) {
      setOrderReturns(res.data.data);
      setPagination(res.data.pagination);
    }
  }, [buildParams, requestWrapper, setPagination]);

  const getReturnOrder = useCallback(
    async (orderId: string) => {
      const res = await requestWrapper(() => api.get(`/order-return/${orderId}`));

      if (res?.data.success) {
        setOrderReturn(res.data.data);
      }
    },
    [requestWrapper]
  );

  const cancelOrderReturn = async (returnId: string) => {
    const res = await requestWrapper(() =>
      api.patch<ApiResponse>(`order-return/cancel-return/${returnId}`)
    );
    if (res?.data.success) {
      showSuccessToast(res?.data?.message as string);
      return true;
    }
    return false;
  };
  return {
    loading,
    orderReturnForm,
    orderReturns,
    orderReturn,
    pagination,
    paginationParams,
    filters,
    acceptQuantityForm,
    acceptPaymentForm,
    setPaginationParams,
    setFilters,
    setSort,
    setSortBy,
    setPagination,
    createReturnOrder,
    getAllReturnOrder,
    getReturnOrder,
    cancelOrderReturn,
    acceptStockQuantity,
    acceptPaymentReturn,
  };
}
