'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Order } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../libs/axios';
import {
  CreateOrderInput,
  CreateOrderSchema,
  UpdateOrderInput,
  UpdateOrderSchema,
} from '../../schemas/order/order.schema';
import { exportExcel } from '../../utils/export-excel/export';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useRequestHelper } from '../use-request-helper';

interface OrderFilters extends Record<string, FilterValue> {
  q?: string;
  status?: string;
  payment_method?: string;
  customer_name?: string;
}

export function useOrders() {
  const { loading, requestWrapper } = useRequestHelper();
  const { showSuccessToast } = useToast();
  const {
    paginationParams,
    setPaginationParams,
    filters,
    setFilters,
    pagination,
    setPagination,
    buildParams,
    setSortBy,
    setSort,
  } = useQueryParams<OrderFilters>({
    q: 'q',
    status: 'status',
    payment_method: 'payment_method',
    customer_name: 'customer_name',
  });

  // STATE
  const currentStore = useAtomValue(currentStoreAtom);
  const [orders, setOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order | null>(null);

  // FORM
  const createOrderForm = useForm<CreateOrderInput>({
    resolver: zodResolver(CreateOrderSchema),
  });

  const updateOrderForm = useForm<UpdateOrderInput>({
    resolver: zodResolver(UpdateOrderSchema),
  });

  // ACTION FUNCTIONS
  const getOrders = async () => {
    const res = await requestWrapper(() => api.get(`/orders?${buildParams().toString()}`));

    if (res?.data.success) {
      setOrders(res.data.data);
      setPagination(res.data.pagination);
    }
  };

  const getOrderById = async (orderId: string) => {
    const res = await requestWrapper(() => api.get(`/orders/${orderId}`));

    if (res?.data.success) {
      setOrder(res.data.data);
      return res.data.data;
    }
  };

  const getOrderByCode = async (code: string) => {
    const res = await requestWrapper(() => api.get(`/orders/code/${code}`));

    if (res?.data.success) {
      setOrder(res.data.data);
      return res.data.data;
    }
  };

  const createOrder = async (data: CreateOrderInput) => {
    const res = await requestWrapper(() => api.post(`/orders`, data));

    if (res?.data.success) {
      await getOrders();
      showSuccessToast(res.data.message || 'Tạo đơn hàng thành công');
      return res.data.data;
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.delete(`/orders/`, {
        data: { orderId },
      })
    );

    if (res?.data.success) {
      // Remove from local state
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      showSuccessToast(res.data.message || 'Xóa đơn hàng thành công');
      return true;
    }

    return false;
  };

  const getOrdersByCustomer = useCallback(
    async (customerId: string) => {
      const res = await requestWrapper(() =>
        api.get(`/orders/customer/${customerId}?${buildParams().toString()}`)
      );
      if (res?.data.success) {
        setOrders(res?.data?.data);
        setPagination(res?.data?.pagination);
      }
    },
    [buildParams, requestWrapper, setPagination]
  );

  const downloadExcelTemplate = useCallback(async () => {
    const res = await api.get(`/orders/excel/template`, {
      responseType: 'blob',
    });
    if (!res) return;
    exportExcel(
      res,
      `mau_danh_sach_don_hang_mua_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }, []);

  const exportExcelOrders = useCallback(async () => {
    const res = await api.get(`/orders/excel/export`, {
      responseType: 'blob',
    });
    exportExcel(
      res,
      `danh_sach_don_hang_mua_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }, []);

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, filters]);

  return {
    // Data
    orders,
    order,
    loading,
    pagination,
    paginationParams,
    filters,

    // Forms
    createOrderForm,
    updateOrderForm,

    // Actions
    getOrders,
    getOrderById,
    getOrderByCode,

    createOrder,
    deleteOrder,
    downloadExcelTemplate,
    exportExcelOrders,
    getOrdersByCustomer,
    // Utils
    setFilters,
    setPaginationParams,
    setSortBy,
    setSort,
    setOrder,
  };
}
