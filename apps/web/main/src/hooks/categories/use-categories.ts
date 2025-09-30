'use client';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Category } from '@repo/design-system/types';
import { useRequestHelper } from '../use-request-helper';
import { currentStoreAtom } from '@repo/design-system/stores/auth';

// Interface cho bộ lọc
export interface CategoryFilters {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'name' | 'updatedAt';
  sort: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Interface cho form tạo/sửa category
export interface CategoryFormData {
  name: string;
  description: string;
}

export default function useCategories() {
  const currentStore = useAtomValue(currentStoreAtom);
  const { showSuccessToast, showErrorToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sort: 'desc',
  });

  // Lấy danh sách categories với bộ lọc
  const handleGetCategories = async (customFilters?: Partial<CategoryFilters>) => {
    if (!currentStore?.id) return;

    const currentFilters = { ...filters, ...customFilters };
    const queryParams = new URLSearchParams();

    queryParams.append('page', currentFilters.page.toString());
    queryParams.append('limit', currentFilters.limit.toString());
    queryParams.append('sortBy', currentFilters.sortBy);
    queryParams.append('sort', currentFilters.sort);

    if (currentFilters.startDate) queryParams.append('startDate', currentFilters.startDate);
    if (currentFilters.endDate) queryParams.append('endDate', currentFilters.endDate);
    if (currentFilters.search) queryParams.append('search', currentFilters.search);

    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore.id}/categories?${queryParams.toString()}`)
    );

    if (res?.data.success) {
      setCategories(res.data.data || []);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    }
  };

  // Lấy chi tiết category
  const handleGetCategoryById = async (id: string) => {
    if (!currentStore?.id) return;

    const res = await requestWrapper(() => api.get(`/stores/${currentStore.id}/categories/${id}`));

    if (res?.data.success) {
      setSelectedCategory(res.data.data);
    }
  };

  // Validate form
  const validateForm = (data: CategoryFormData): Partial<CategoryFormData> => {
    const errors: Partial<CategoryFormData> = {};

    if (!data.name.trim()) {
      errors.name = 'Tên danh mục là bắt buộc';
    } else if (data.name.length > 255) {
      errors.name = 'Tên danh mục không được vượt quá 255 ký tự';
    }

    if (data.description && data.description.length > 1000) {
      errors.description = 'Mô tả không được vượt quá 1000 ký tự';
    }

    return errors;
  };

  // Tạo category mới
  const handleCreateCategory = async (formData: CategoryFormData) => {
    if (!currentStore?.id) return { success: false };

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    setSubmitting(true);
    try {
      await api.post(`/stores/${currentStore.id}/categories`, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      showSuccessToast('Tạo danh mục thành công');
      await handleGetCategories();
      return { success: true };
    } catch (error: any) {
      if (error.response?.data?.error?.code === 'CONFLICT') {
        showErrorToast('Tên danh mục đã tồn tại');
        return { success: false, errors: { name: 'Tên danh mục đã tồn tại' } };
      } else {
        showErrorToast('Lỗi khi tạo danh mục');
        return { success: false };
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Cập nhật category
  const handleUpdateCategory = async (id: string, formData: CategoryFormData) => {
    if (!currentStore?.id) return { success: false };

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    setSubmitting(true);
    try {
      await api.patch(`/stores/${currentStore.id}/categories/${id}`, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      showSuccessToast('Cập nhật danh mục thành công');
      await handleGetCategories();
      return { success: true };
    } catch (error: any) {
      if (error.response?.data?.error?.code === 'CONFLICT') {
        showErrorToast('Tên danh mục đã tồn tại');
        return { success: false, errors: { name: 'Tên danh mục đã tồn tại' } };
      } else {
        showErrorToast('Lỗi khi cập nhật danh mục');
        return { success: false };
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa category
  const handleDeleteCategory = async (id: string) => {
    if (!currentStore?.id) return { success: false };

    setSubmitting(true);
    try {
      await api.delete(`/stores/${currentStore.id}/categories/${id}`);
      showSuccessToast('Xóa danh mục thành công');
      await handleGetCategories();
      return { success: true };
    } catch (error) {
      showErrorToast('Lỗi khi xóa danh mục');
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  // Áp dụng bộ lọc
  const applyFilters = (newFilters: Partial<CategoryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    handleGetCategories(updatedFilters);
  };

  // Reset bộ lọc
  const resetFilters = () => {
    const defaultFilters: CategoryFilters = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sort: 'desc',
    };
    setFilters(defaultFilters);
    handleGetCategories(defaultFilters);
  };

  // Đổi trang
  const changePage = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    handleGetCategories(newFilters);
  };
  useEffect(() => {
    if (!currentStore?.id) return;
    handleGetCategories();
  }, [currentStore?.id]);
  return {
    // State
    loading,
    submitting,
    categories,
    selectedCategory,
    pagination,
    filters,

    // Setters
    setSelectedCategory,

    // Actions
    handleGetCategories,
    handleGetCategoryById,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    applyFilters,
    resetFilters,
    changePage,
    validateForm,
  };
}
