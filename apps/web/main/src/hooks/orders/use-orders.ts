'use client';
import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Order } from '@repo/design-system/types';
import { useEffect, useState } from 'react';
import { useRequestHelper } from '../use-request-helper';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import {
  CreateOrderInput,
  CreateOrderSchema,
  UpdateOrderInput,
  UpdateOrderSchema,
} from '../../../../main/src/schemas/order/order.schema';

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
  const [order, setOrder] = useState<Order>();

  // FORM
  const createOrderForm = useForm<CreateOrderInput>({
    resolver: zodResolver(CreateOrderSchema),
  });

  const updateOrderForm = useForm<UpdateOrderInput>({
    resolver: zodResolver(UpdateOrderSchema),
  });

  // ACTION FUNCTIONS
  const getOrders = async () => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore?.id}/orders?${buildParams().toString()}`)
    );

    if (res?.data.success) {
      setOrders(res.data.data);
      setPagination(res.data.pagination);
    }
  };

  const getOrderById = async (orderId: string) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore?.id}/orders/${orderId}`)
    );

    if (res?.data.success) {
      setOrder(res.data.data);
      return res.data.data;
    }
  };

  const createOrder = async (data: CreateOrderInput) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() => api.post(`/stores/${currentStore?.id}/orders`, data));

    if (res?.data.success) {
      await getOrders();
      showSuccessToast(res.data.message || 'Tạo đơn hàng thành công');
      return res.data.data;
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.delete(`/stores/${currentStore?.id}/orders/`, {
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

  // Load orders when dependencies change
  useEffect(() => {
    if (!currentStore?.id) return;
    getOrders();
  }, [currentStore?.id, paginationParams, filters]);

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

    createOrder,
    deleteOrder,

    // Utils
    setFilters,
    setPaginationParams,
    setSortBy,
    setSort,
  };
}
