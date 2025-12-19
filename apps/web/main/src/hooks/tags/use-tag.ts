'use client';

import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { useCallback, useState } from 'react';
import { useRequestHelper } from '../use-request-helper';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { ApiResponse } from '@repo/types/response';
import { Tag } from '@repo/design-system/types';
import {
  CreateTagInput,
  CreateTagSchema,
  UpdateTagInput,
  UpdateTagSchema,
} from '../../schemas/tag/tag.schema';

interface CategoryFilters extends Record<string, FilterValue> {
  q?: string;
  startDate?: string;
  endDate?: string;
}

export function useTags() {
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
  const [tags, setTags] = useState<Tag[]>([]);
  const [tag, setTag] = useState<Tag>();

  // FORM
  const createTagForm = useForm<CreateTagInput>({
    resolver: zodResolver(CreateTagSchema),
  });

  const updateTagForm = useForm<UpdateTagInput>({
    resolver: zodResolver(UpdateTagSchema),
  });

  // ACTION FUNCTIONS
  const getTags = useCallback(async () => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.get(`/tag/${currentStore.id}/?${buildParams().toString()}`)
    );

    if (res?.data.success) {
      setTags(res.data.data);
      setPagination(res.data.pagination);
      showSuccessToast(res.data.message);
    }
  }, [currentStore, buildParams, requestWrapper, showSuccessToast, setPagination, setTags]);

  const createTag = async (data: CreateTagInput) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() => api.post<ApiResponse>(`/tag/${currentStore.id}/`, data));

    if (res?.data.success) {
      getTags();
      showSuccessToast((res.data.message as string) || 'Tạo tên thẻ thành công!');
      return true;
    }
    return false;
  };

  const deleteTag = async (tagId: string) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.delete<ApiResponse>(`/tag/${tagId}/${currentStore.id}/`)
    );

    if (res?.data.success) {
      showSuccessToast(res.data.message as string);
      getTags();
    }
  };

  const updateTag = async (tagId: string, data: UpdateTagInput) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() =>
      api.patch<ApiResponse>(`/tag/${tagId}/${currentStore.id}`, data)
    );

    if (res?.data.success) {
      showSuccessToast(res.data.message as string);
      getTags();
    }
  };

  const getTagById = async (tagId: string) => {
    if (!currentStore?.id) return;

    const res = await api.get(`/tag/${tagId}/${currentStore.id}`);

    if (res?.data.success) {
      setTag(res.data.data);
    }
  };

  return {
    getTags,
    createTag,
    deleteTag,
    updateTag,
    getTagById,
    setPagination,
    setFilters,
    setPaginationParams,
    setSortBy,
    setSort,
    tags,
    pagination,
    paginationParams,
    filters,
    tag,
    loading,
    createTagForm,
    updateTagForm,
  };
}
