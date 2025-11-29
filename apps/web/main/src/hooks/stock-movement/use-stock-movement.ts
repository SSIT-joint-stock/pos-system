import { StockMovement } from './../../../../../../packages/design-system/src/types/stock-movement';
import api from '../../../../main/src/libs/axios';
import { useAtomValue } from 'jotai';
import { useRequestHelper } from '../use-request-helper';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useState } from 'react';

export interface StockMovementFilter extends Record<string, FilterValue> {
  type?: string;
}

export function useStockMovement() {
  const { requestWrapper, loading } = useRequestHelper();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const currentStore = useAtomValue(currentStoreAtom);
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
  } = useQueryParams<StockMovementFilter>();
  const handleGetStockMovement = async () => {
    try {
      const res = await requestWrapper(() =>
        api.get(`/stores/${currentStore?.id}/stock-movement?${buildParams().toString()}`)
      );
      if (res?.data.success) {
        setMovements(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return {
    paginationParams,
    sort,
    sortBy,
    filters,
    pagination,
    movements,
    loading,
    currentStore,
    handleGetStockMovement,
    setPaginationParams,
    setFilters,
    setPagination,
    buildParams,
    setSortBy,
    setSort,
  };
}
