'use client';

import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Category } from '@repo/design-system/types';
import { useState } from 'react';
import { useRequestHelper } from '../use-request-helper';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { z } from 'zod';

// Schemas
const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(255, 'Tên danh mục không được vượt quá 255 ký tự'),
  description: z.string().max(1000, 'Mô tả không được vượt quá 1000 ký tự').optional(),
});

const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(255, 'Tên danh mục không được vượt quá 255 ký tự')
    .optional(),
  description: z.string().max(1000, 'Mô tả không được vượt quá 1000 ký tự').optional(),
});

type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

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
  const getCategories = async () => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore.id}/categories?${buildParams().toString()}`)
    );

    if (res?.data.success) {
      setCategories(res.data.data);
      setPagination(res.data.pagination);
      showSuccessToast(res.data.message);
    }
  };

  const createCategory = async (data: CreateCategoryInput) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() => api.post(`/stores/${currentStore.id}/categories`, data));

    if (res?.data.success) {
      getCategories();
      showSuccessToast(res.data.message);
      return res.data.data;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.delete(`/stores/${currentStore.id}/categories/${categoryId}`)
    );

    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getCategories();
    }
  };

  const updateCategory = async (categoryId: string, data: UpdateCategoryInput) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.patch(`/stores/${currentStore.id}/categories/${categoryId}`, data)
    );

    if (res?.data.success) {
      showSuccessToast(res.data.message);
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
    pagination,
    paginationParams,
    filters,
    categories,
    loading,
    createCategoryForm,
    updateCategoryForm,
    category,
  };
}
