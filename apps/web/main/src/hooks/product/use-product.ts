'use client';

import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Product } from '@repo/design-system/types';
import { useEffect, useState } from 'react';
import { useRequestHelper } from '../use-request-helper';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useForm } from 'react-hook-form';
import {
  CreateProductInput,
  CreateProductSchema,
  UpdateProductInput,
  UpdateProductSchema,
} from '../../../../main/src/schemas/product/product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilterValue, useQueryParams } from '../query/use-query-params';
interface ProductFilters extends Record<string, FilterValue> {
  q?: string;
  product_status?: string;
}

export function useProduct() {
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
  } = useQueryParams<ProductFilters>({
    q: 'q',
    product_status: 'product_status',
  });
  console.log(pagination);
  // STATE
  const currentStore = useAtomValue(currentStoreAtom);
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>();
  // FORM
  const createProductForm = useForm<CreateProductInput>({
    resolver: zodResolver(CreateProductSchema),
  });
  const updateProductForm = useForm<UpdateProductInput>({
    resolver: zodResolver(UpdateProductSchema),
  });
  // ACTION FUNCTION
  const getProducts = async () => {
    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore?.id}/products/filter-product?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setProducts(res.data.data);
      setPagination(res.data.pagination);
      showSuccessToast(res.data.message);
    }
  };
  const createProduct = async (data: CreateProductInput) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() => api.post(`/stores/${currentStore?.id}/products`, data));
    if (res?.data.success) {
      getProducts();
      showSuccessToast(res.data.message);
      return res.data.data;
    }
  };
  const deleteProduct = async (productId: string) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.delete(`/stores/${currentStore?.id}/products/${productId}`)
    );
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getProducts();
    }
  };
  const updateProduct = async (productId: string, updateProductForm: UpdateProductInput) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.patch(`/stores/${currentStore?.id}/products/${productId}`, updateProductForm)
    );
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getProducts();
    }
  };
  const getProductById = async (productId: string) => {
    if (!currentStore?.id) return;
    const res = await api.get(`/stores/${currentStore?.id}/products/${productId}`);

    if (res?.data.success) {
      setProduct(res.data.data);
    }
  };
  const applyStockMovement = async (productId: string, delta: number, type: string) => {
    if (!currentStore?.id) return;
    const storeId = currentStore?.id ?? '';
    const res = await requestWrapper(() =>
      api.put(`stores/${storeId}/inventories/applyStockMovement/${productId}`, {
        delta,
        type,
      })
    );
    if (res?.data.success) {
      getProducts();
      showSuccessToast(res.data.message);
    }
  };
  const uploadProductByExcel = async (file: File) => {
    if (!currentStore?.id) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await requestWrapper(() =>
      api.post(`/stores/${currentStore?.id}/products/import-excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
    if (res?.data.success) {
      getProducts();
      showSuccessToast(res.data.message);
    }
  };
  const exampleProductExcel = async () => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.post(
        `/stores/${currentStore?.id}/products/example-product-excel`,
        {},
        {
          responseType: 'blob',
        }
      )
    );
    const url = window.URL.createObjectURL(new Blob([res?.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'example-product-excel.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    showSuccessToast('Download successfully!!');
  };
  useEffect(() => {
    if (!currentStore?.id) return;
    getProducts();
  }, [currentStore?.id, paginationParams, filters]);

  return {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    applyStockMovement,
    setFilters,
    setPaginationParams,
    setSortBy,
    setSort,
    uploadProductByExcel,
    exampleProductExcel,
    pagination,
    paginationParams,
    filters,
    products,
    loading,
    createProductForm,
    updateProductForm,
    product,
  };
}
