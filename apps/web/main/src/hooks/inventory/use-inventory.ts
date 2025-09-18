'use client';
import { useEffect, useState } from 'react';
import { Inventory } from '@repo/design-system/types/inventory';
import { useRequestHelper } from '../use-request-helper';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}
interface FilterParams {
  status?: string;
  category?: string;
  date?: [Date, Date];
  search?: string;
  productName?: string;
}

export default function useInventory() {
  const currentStore = useAtomValue(currentStoreAtom);
  const { showSuccessToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState<FilterParams>({});
  const params = new URLSearchParams({
    page: paginationParams.page.toString(),
    limit: paginationParams.limit.toString(),
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  if (filters.status) {
    params.append('status', filters.status);
  }

  if (filters.date && filters.date.length === 2) {
    params.append('startDate', filters.date[0]?.toString());
    params.append('endDate', filters.date[1]?.toString());
  }

  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.productName) {
    params.append('productName', filters.productName);
  }
  // ACTION FUNCTION
  const getInventories = async () => {
    if (!currentStore?.id) return;
    const storeId = currentStore?.id ?? '';
    const res = await requestWrapper(() =>
      api.get(`stores/${storeId}/inventories?${params.toString()}`)
    );
    if (res?.data.success) {
      setInventories(res.data?.data);
      setPagination(res.data?.pagination);
    }
  };
  const adjustQuantity = async (inventoryId: string, delta: number) => {
    if (!currentStore?.id) return;
    const storeId = currentStore?.id ?? '';
    const res = await requestWrapper(() =>
      api.put(`stores/${storeId}/inventories/${inventoryId}`, { delta })
    );
    if (res?.data.success) {
      getInventories();
      showSuccessToast(res.data.message);
    }
  };
  const revalueInventory = async (inventoryId: string, discount: number, total: number) => {
    if (!currentStore?.id) return;
    const storeId = currentStore?.id ?? '';
    const res = await requestWrapper(() =>
      api.patch(`stores/${storeId}/inventories/revalue/${inventoryId}`, { discount, total })
    );
    if (res?.data.success) {
      getInventories();
      showSuccessToast(res.data.message);
    }
  };
  const setStatus = async (inventoryId: string, status: string) => {
    if (!currentStore?.id) return;
    const storeId = currentStore?.id ?? '';
    const res = await requestWrapper(() =>
      api.put(`stores/${storeId}/inventories/status/${inventoryId}`, { status })
    );
    if (res?.data.success) {
      getInventories();
      showSuccessToast(res.data.message);
    }
  };
  useEffect(() => {
    getInventories();
  }, [currentStore?.id, paginationParams, filters]);
  return {
    loading,
    inventories,
    pagination,
    params,
    paginationParams,
    getInventories,
    adjustQuantity,
    revalueInventory,
    setStatus,
    setPaginationParams,
    filters,
    setFilters,
  };
}
