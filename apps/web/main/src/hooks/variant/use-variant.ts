import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Variant } from '@repo/design-system/types';
import { ApiResponse } from '@repo/types/response';
import { useCallback, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { STOCK_MOVEMENT_STATUS } from '../../constants/status';
import api from '../../libs/axios';
import {
  CreateVariantInput,
  CreateVariantSchema,
  UpdateVariantInput,
} from '../../schemas/variant/variant.schema';
import { exportExcel } from '../../utils/export-excel/export';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useRequestHelper } from '../use-request-helper';
export interface VariantFilter extends Record<string, FilterValue> {
  q?: string;
}
export function useVariant() {
  //     HOOKS
  const [variant, setVariant] = useState<Variant | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [status, setStatus] = useState<string>(STOCK_MOVEMENT_STATUS[0].value || '');
  const [delta, setDelta] = useState<number>(0);
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
  } = useQueryParams<VariantFilter>({
    q: 'q',
  });

  //   FORM
  const formVariant = useForm<CreateVariantInput>({
    resolver: zodResolver(CreateVariantSchema),
    defaultValues: {
      conversions: [],
    },
  });

  const conversionsFiledArray = useFieldArray({
    control: formVariant.control,
    name: 'conversions',
  });

  //   FUNC
  const getVariantsInStore = useCallback(async () => {
    const res = await requestWrapper(() => api.get(`/variant?${buildParams().toString()}`));
    if (res?.data.success) {
      setVariants(res.data.data);
      setPagination(res.data.pagination);
    }
  }, [setPagination, setVariants, buildParams, requestWrapper]);
  const createVariant = useCallback(
    async (data: CreateVariantInput, productId: string) => {
      const res = await requestWrapper(() =>
        api.post<ApiResponse>(`/variant/${productId}/create`, data)
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );
  const getVariant = useCallback(
    async (id: string, productId: string) => {
      const res = await requestWrapper(() =>
        api.get<ApiResponse>(`/variant/${id}/product/${productId}`)
      );
      if (res?.data.success) {
        setVariant(res.data.data);
      }
    },
    [requestWrapper]
  );
  const updateVariant = useCallback(
    async (id: string, productId: string, data: UpdateVariantInput) => {
      const res = await requestWrapper(() =>
        api.patch<ApiResponse>(`/variant/${id}/update/${productId}`, data)
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );
  const removeVariant = useCallback(
    async (id: string, productId: string) => {
      const res = await requestWrapper(() =>
        api.delete<ApiResponse>(`/variant/${id}/remove/${productId}`)
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );
  const applyStock = useCallback(
    async (id: string, productId: string, delta: number, status: string) => {
      const res = await requestWrapper(() =>
        api.patch<ApiResponse>(`/variant/${id}/apply-stock/${productId}`, {
          delta,
          type: status,
        })
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );

  // EXCEL
  const exportInventoryExcel = useCallback(async () => {
    await requestWrapper(async () => {
      const res = await api.get('/variant/excel/export/', {
        responseType: 'blob',
      });

      exportExcel(
        res,
        `ton_kho_${new Date().toLocaleDateString()}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });
  }, [requestWrapper]);
  return {
    formVariant,
    loading,
    conversionsFiledArray,
    variant,
    delta,
    status,
    variants,
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

    setStatus,
    setDelta,
    applyStock,
    createVariant,
    getVariant,
    updateVariant,
    removeVariant,
    getVariantsInStore,
    exportInventoryExcel,
  };
}
