import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Customer } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../../main/src/libs/axios';
import {
  CreateCustomerInput,
  CreateCustomerSchema,
  UpdateCustomerInput,
  UpdateCustomerSchema,
} from '../../../../main/src/schemas/customer/customer.schema';
import { exportExcel } from '../../utils/export-excel/export';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useRequestHelper } from '../use-request-helper';

interface CustomerFilters extends Record<string, FilterValue> {
  q?: string;
}

export function useCustomer() {
  const currentStore = useAtomValue(currentStoreAtom);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // HOOKS
  const { loading, requestWrapper } = useRequestHelper();
  const { showSuccessToast, showErrorToast } = useToast();
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
  } = useQueryParams<CustomerFilters>({
    q: 'q',
  });

  // FORMS
  const createCustomerForm = useForm<CreateCustomerInput>({
    resolver: zodResolver(CreateCustomerSchema),
  });
  const updateCustomerForm = useForm<UpdateCustomerInput>({
    resolver: zodResolver(UpdateCustomerSchema),
  });

  // GET CUSTOMERS
  const getCustomers = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore?.id}/customers?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setCustomers(res?.data?.data);
      setPagination(res?.data?.pagination);
    }
  }, [buildParams, currentStore?.id, requestWrapper, setPagination]);

  // ✅ CREATE CUSTOMER (with duplicate phone check)
  const createCustomer = async (data: CreateCustomerInput) => {
    if (!currentStore?.id) return;

    // Check for duplicate phone number before sending API request
    const trimmedPhone = data.phone?.trim();
    if (trimmedPhone) {
      const duplicate = customers.some(
        (c) => c.phone?.trim().replace(/\s+/g, '') === trimmedPhone.replace(/\s+/g, '')
      );
      if (duplicate) {
        showErrorToast('⚠️ Số điện thoại này đã tồn tại. Vui lòng nhập số khác.');
        return; // Stop — don't call API
      }
    }

    const res = await requestWrapper(() => api.post(`/stores/${currentStore.id}/customers`, data));
    if (res?.data.success) {
      getCustomers();
      showSuccessToast(res.data.message);
    }
  };

  // DELETE CUSTOMER
  const deleteCustomer = async (customerId: string) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.delete(`/stores/${currentStore?.id}/customers/${customerId}`)
    );
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getCustomers();
    }
  };

  // UPDATE CUSTOMER
  const updateCustomer = async (customerId: string, data: UpdateCustomerInput) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.patch(`/stores/${currentStore?.id}/customers/${customerId}`, data)
    );
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getCustomers();
    }
  };

  // excel template api call
  const downloadCustomerTemplate = useCallback(
    async (storeId: string) => {
      await requestWrapper(async () => {
        const res = await api.get(`/stores/${storeId}/customers/excel/example`, {
          responseType: 'blob',
        });

        exportExcel(
          res,
          `mau_danh_sach_khach_hang${new Date().toLocaleDateString()}.xlsx`,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
      });
    },
    [requestWrapper]
  );

  //export customer excel
  const exportCustomersExcel = useCallback(
    async (storeId: string) => {
      await requestWrapper(async () => {
        const res = await api.get(`/stores/${storeId}/customers/excel/export`, {
          responseType: 'blob',
        });

        exportExcel(
          res,
          `danh_sach_khach_hang${new Date().toLocaleDateString()}.xlsx`,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
      });
    },
    [requestWrapper]
  );

  const importCustomersExcel = useCallback(
    async (storeId: string, file: File) => {
      const formData = new FormData();
      formData.append('excel_customer', file);

      const res = await requestWrapper(() =>
        api.post(`/stores/${storeId}/customers/excel/import`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );

      if (res?.data.success) {
        showSuccessToast('Nhập danh sách thành công!' as string);
        getCustomers();
      }
    },
    [requestWrapper, getCustomers, showSuccessToast]
  );

  return {
    getCustomers,
    createCustomer,
    deleteCustomer,
    updateCustomer,
    setFilters,
    setPaginationParams,
    setSortBy,
    setSort,
    setPagination,
    downloadCustomerTemplate,
    exportCustomersExcel,
    importCustomersExcel,
    createCustomerForm,
    updateCustomerForm,
    customers,
    loading,
    pagination,
    paginationParams,
    filters,
  };
}
