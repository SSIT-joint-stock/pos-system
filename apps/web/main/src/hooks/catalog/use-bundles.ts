'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Bundle } from '@repo/design-system/types';
import { ApiResponse } from '@repo/types/response';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../libs/axios';
import {
  CreateBundleInput,
  CreateBundleSchema,
  UpdateBundleInput,
  UpdateBundleSchema,
} from '../../schemas/product/bundle.schema';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useRequestHelper } from '../use-request-helper';

export interface BundleFilters extends Record<string, FilterValue> {
  q?: string;
}

export function useBundles() {
  const { loading, requestWrapper } = useRequestHelper();
  const { showSuccessToast } = useToast();
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
  } = useQueryParams<BundleFilters>({
    q: 'q',
  });

  // STATE
  const currentStore = useAtomValue(currentStoreAtom);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [bundle, setBundle] = useState<Bundle>();

  // FORM
  const createBundleForm = useForm<CreateBundleInput>({
    resolver: zodResolver(CreateBundleSchema),
    defaultValues: {
      items: [],
      price: 0,
      quantity: 0,
    },
  });

  const updateBundleForm = useForm<UpdateBundleInput>({
    resolver: zodResolver(UpdateBundleSchema),
  });

  // ACTION FUNCTIONS
  const getBundles = useCallback(async () => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() => api.get(`/bundles?${buildParams().toString()}`));
    if (res?.data.success) {
      setBundles(res.data.data);
      setPagination(res.data.pagination);
    }
  }, [buildParams, requestWrapper, setPagination, currentStore?.id]);

  const createBundle = useCallback(
    async (data: CreateBundleInput) => {
      if (!currentStore?.id) return;
      const cleanedData = {
        ...data,
        items: data.items.map(({ variantId, quantity }) => ({ variantId, quantity })),
      };
      const res = await requestWrapper(() => api.post<ApiResponse>(`/bundles`, cleanedData));
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return {
          success: true,
          data: res.data.data,
        };
      }
      return {
        success: false,
      };
    },
    [currentStore?.id, requestWrapper, showSuccessToast]
  );

  const updateBundle = useCallback(
    async (bundleId: string, data: UpdateBundleInput) => {
      if (!currentStore?.id) return;
      const cleanedData = {
        ...data,
        items: data.items?.map(({ variantId, quantity }) => ({ variantId, quantity })),
      };
      const res = await requestWrapper(() =>
        api.patch<ApiResponse>(`/bundles/${bundleId}`, cleanedData)
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [currentStore?.id, requestWrapper, showSuccessToast]
  );

  const deleteBundle = useCallback(
    async (bundleId: string) => {
      if (!currentStore?.id) return;
      const res = await requestWrapper(() => api.delete<ApiResponse>(`/bundles/${bundleId}`));
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        getBundles();
        return true;
      }
      return false;
    },
    [currentStore?.id, requestWrapper, showSuccessToast, getBundles]
  );

  const getBundleById = useCallback(
    async (bundleId: string) => {
      if (!currentStore?.id) return;
      const res = await api.get<ApiResponse>(`/bundles/${bundleId}`);
      if (res?.data.success) {
        setBundle(res.data.data);
      }
    },
    [currentStore?.id]
  );

  return {
    loading,
    bundles,
    bundle,
    createBundleForm,
    updateBundleForm,
    getBundles,
    createBundle,
    updateBundle,
    deleteBundle,
    getBundleById,
    setFilters,
    setPaginationParams,
    setSortBy,
    setSort,
    pagination,
    paginationParams,
    filters,
    sort,
    sortBy,
  };
}
