'use client';
import api from '../../../../main/src/libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { ApiResponse, Supplier } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import { useRequestHelper } from '../use-request-helper';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useState } from 'react';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useForm } from 'react-hook-form';
import {
  CreateSupplierInput,
  CreateSupplierSchema,
} from '../../../../main/src/schemas/supplier/supplier.schema';
import { zodResolver } from '@hookform/resolvers/zod';
interface SupplierFilters extends Record<string, FilterValue> {
  q?: string;
}

export function useSupplier() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierInfoByTaxCode, setSupplierInfoByTaxCode] = useState<Supplier | null>(null);
  const { loading, requestWrapper } = useRequestHelper();
  const { showSuccessToast } = useToast();
  const {
    paginationParams,
    filters,
    pagination,
    setPaginationParams,
    setFilters,
    setPagination,
    buildParams,
    setSortBy,
    setSort,
  } = useQueryParams<SupplierFilters>();
  const currentStore = useAtomValue(currentStoreAtom);
  const supplierForm = useForm<CreateSupplierInput>({
    resolver: zodResolver(CreateSupplierSchema),
  });
  const getSuppliers = async () => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/supplier/${currentStore?.id}?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setSuppliers(res?.data?.data as Supplier[]);
      setPagination(res?.data.pagination);
    }
  };
  const createSupplier = async (data: CreateSupplierInput) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.post<ApiResponse>(`/supplier/${currentStore?.id}`, data)
    );
    if (res?.data.success) {
      supplierForm.reset();
      showSuccessToast(res.data.message as string);
      return true;
    }
    return false;
  };

  // COMMON
  const getSupplierByTaxCode = async (taxCode: string) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.get<ApiResponse<{ data: Supplier }>>(`/common/tax/${taxCode}`)
    );
    if (res?.data.success) {
      const supplier = res.data.data.data as Supplier;
      setSupplierInfoByTaxCode(supplier);
      return supplier;
    }
    return false;
  };
  return {
    loading,
    suppliers,
    paginationParams,
    filters,
    pagination,
    currentStore,
    supplierForm,
    supplierInfoByTaxCode,
    getSupplierByTaxCode,
    createSupplier,
    setPaginationParams,
    getSuppliers,
    setFilters,
    setPagination,
    buildParams,
    setSortBy,
    setSort,
  };
}
