'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { ApiResponse, Supplier } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../../main/src/libs/axios';
import {
  CreateSupplierInput,
  CreateSupplierSchema,
  UpdateSupplierInput,
  UpdateSupplierSchema,
} from '../../../../main/src/schemas/supplier/supplier.schema';
import { exportExcel } from '../../utils/export-excel/export';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useRequestHelper } from '../use-request-helper';
interface SupplierFilters extends Record<string, FilterValue> {
  q?: string;
}

export function useSupplier() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierInfo, setSupplierInfo] = useState<Supplier | null>(null);

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
  const updateSupplierForm = useForm<UpdateSupplierInput>({
    resolver: zodResolver(UpdateSupplierSchema),
  });
  const getSuppliers = useCallback(async () => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/supplier/${currentStore?.id}?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setSuppliers(res?.data?.data as Supplier[]);
      setPagination(res?.data.pagination);
    }
  }, [currentStore?.id, buildParams, requestWrapper, setPagination]);

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

  const deleteSupplier = async (supplierId: string) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.delete<ApiResponse>(`/supplier/${currentStore?.id}/delete/${supplierId}`)
    );
    if (res?.data.success) {
      showSuccessToast(res.data.message as string);
      getSuppliers();
    }
  };

  const updateSupplier = async (data: UpdateSupplierInput, supplierId: string) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.patch<ApiResponse>(`/supplier/${currentStore?.id}/update/${supplierId}`, data)
    );
    if (res?.data.success) {
      updateSupplierForm.reset();
      showSuccessToast(res.data.message as string);
      getSuppliers();
      return true;
    }
    return false;
  };

  const getSupplier = async (supplierId: string) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/supplier/${currentStore?.id}/detail/${supplierId}`)
    );
    if (res?.data.success) {
      const supplier = res.data.data as Supplier;
      setSupplierInfo(supplier);
      return supplier;
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

  const downloadSupplierTemplate = useCallback(async () => {
    await requestWrapper(async () => {
      const res = await api.get('/supplier/excel/example', {
        responseType: 'blob',
      });

      exportExcel(
        res,
        `mau_nhap_danh_sach_nha_cung_cap_${new Date().toLocaleDateString()}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });
  }, [requestWrapper]);

  const importSuppliersExcel = useCallback(
    async (storeId: string, file: File) => {
      const formData = new FormData();
      formData.append('excel_supplier', file); // MUST match docs

      const res = await requestWrapper(() =>
        api.post(`/supplier/excel/import/${storeId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );

      if (res?.data.success) {
        showSuccessToast('Nhập danh sách thành công!' as string);
        getSuppliers();
      }
    },
    [requestWrapper, getSuppliers, showSuccessToast]
  );

  const exportSuppliersExcel = useCallback(
    async (storeId: string) => {
      await requestWrapper(async () => {
        const res = await api.get(`/supplier/excel/export/${storeId}`, {
          responseType: 'blob',
        });

        exportExcel(
          res,
          `danh_sach_nha_cung_cap_${new Date().toLocaleDateString()}.xlsx`,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
      });
    },
    [requestWrapper]
  );

  return {
    loading,
    suppliers,
    paginationParams,
    filters,
    pagination,
    currentStore,
    supplierForm,
    supplierInfoByTaxCode,
    updateSupplierForm,
    supplierInfo,
    getSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierByTaxCode,
    createSupplier,
    setPaginationParams,
    getSuppliers,
    setFilters,
    setPagination,
    buildParams,
    setSortBy,
    setSort,
    downloadSupplierTemplate,
    importSuppliersExcel,
    exportSuppliersExcel,
  };
}
