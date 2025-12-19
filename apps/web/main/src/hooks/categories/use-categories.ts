'use client';

import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Category } from '@repo/design-system/types';
import { useCallback, useState } from 'react';
import { useRequestHelper } from '../use-request-helper';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { ApiResponse } from '@repo/types/response';
import {
  CreateCategoryInput,
  CreateCategorySchema,
  UpdateCategoryInput,
  UpdateCategorySchema,
} from '../../schemas/category/category.schema';
import { exportExcel } from '../../utils/export-excel/export';

interface CategoryFilters extends Record<string, FilterValue> {
  q?: string;
  startDate?: string;
  endDate?: string;
}

export function useCategories() {
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
  } = useQueryParams<CategoryFilters>({
    q: 'q',
    startDate: 'startDate',
    endDate: 'endDate',
  });

  // STATE
  const currentStore = useAtomValue(currentStoreAtom);
  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>();

  // FORM
  const createCategoryForm = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema),
  });

  const updateCategoryForm = useForm<UpdateCategoryInput>({
    resolver: zodResolver(UpdateCategorySchema),
  });

  // ACTION FUNCTIONS
  const getCategories = useCallback(async () => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore.id}/categories?${buildParams().toString()}`)
    );

    if (res?.data.success) {
      setCategories(res.data.data);
      setPagination(res.data.pagination);
      showSuccessToast(res.data.message);
    }
  }, [buildParams, requestWrapper, setPagination, showSuccessToast, currentStore?.id]);

  const createCategory = async (data: CreateCategoryInput) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.post<ApiResponse>(`/stores/${currentStore.id}/categories`, data)
    );

    if (res?.data.success) {
      getCategories();
      showSuccessToast(res.data.message as string);
      return true;
    }
    return false;
  };

  const deleteCategory = async (categoryId: string) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.delete<ApiResponse>(`/stores/${currentStore.id}/categories/${categoryId}`)
    );

    if (res?.data.success) {
      showSuccessToast(res.data.message as string);
      getCategories();
    }
  };

  const updateCategory = async (categoryId: string, data: UpdateCategoryInput) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.patch<ApiResponse>(`/stores/${currentStore.id}/categories/${categoryId}`, data)
    );

    if (res?.data.success) {
      showSuccessToast(res.data.message as string);
      getCategories();
    }
  };

  const getCategoryById = async (categoryId: string) => {
    if (!currentStore?.id) return;

    const res = await api.get(`/stores/${currentStore.id}/categories/${categoryId}`);

    if (res?.data.success) {
      setCategory(res.data.data);
    }
  };

  const downloadExampleCategory = useCallback(async () => {
    if (!currentStore?.id) return;
    const res = await api.get(`/stores/${currentStore.id}/categories/excel/example`, {
      responseType: 'blob',
    });
    if (!res) return;
    exportExcel(
      res,
      `mau_danh_sach_danh_muc_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }, [currentStore?.id]);

  const exportExcelCategory = useCallback(async () => {
    if (!currentStore?.id) return;
    setLoadingExport(true);
    const res = await api.get(`/stores/${currentStore.id}/categories/excel/export`, {
      responseType: 'blob',
    });

    if (!res) return;

    exportExcel(
      res,
      `danh_sach_danh_muc_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    setLoadingExport(false);
  }, [currentStore?.id]);

  const importCategories = useCallback(
    async (file: File) => {
      if (!currentStore?.id) return;
      const formData = new FormData();
      formData.append('excel_category', file);
      const res = await requestWrapper(() =>
        api.post<ApiResponse>(`/stores/${currentStore.id}/categories/excel/import`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        getCategories();
      }
    },
    [currentStore?.id, requestWrapper, getCategories, showSuccessToast]
  );

  return {
    getCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
    setFilters,
    setPaginationParams,
    setSortBy,
    setSort,
    setCategories,
    downloadExampleCategory,
    exportExcelCategory,
    importCategories,
    pagination,
    paginationParams,
    filters,
    categories,
    loading,
    createCategoryForm,
    updateCategoryForm,
    category,
    loadingExport,
  };
}
