'use client';
import { useEffect, useState } from 'react';
import { Inventory } from '@repo/design-system/types/inventory';
import { useRequestHelper } from '../use-request-helper';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { FilterValue, useQueryParams } from '../query/use-query-params';
interface InventoryFilters extends Record<string, FilterValue> {
  status?: string;
  productName?: string;
  date?: [string, string];
}
export default function useInventory() {
  const currentStore = useAtomValue(currentStoreAtom);
  const { showSuccessToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const {
    paginationParams,
    setPaginationParams,
    filters,
    setFilters,
    pagination,
    setPagination,
    buildParams,
  } = useQueryParams<InventoryFilters>({
    productName: 'productName',
  });
  // ACTION FUNCTION
  const getInventories = async () => {
    if (!currentStore?.id) return;
    const storeId = currentStore?.id ?? '';
    const res = await requestWrapper(() =>
      api.get(`stores/${storeId}/inventories?${buildParams().toString()}`)
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
