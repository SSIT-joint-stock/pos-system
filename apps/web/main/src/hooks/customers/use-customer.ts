import { Customer } from '@repo/design-system/types';
import { useState } from 'react';
import { useRequestHelper } from '../use-request-helper';
import api from '../../../../main/src/libs/axios';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import {
  CreateCustomerInput,
  CreateCustomerSchema,
  UpdateCustomerInput,
  UpdateCustomerSchema,
} from '../../../../main/src/schemas/customer/customer.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { FilterValue, useQueryParams } from '../query/use-query-params';
interface CustomerFilters extends Record<string, FilterValue> {
  q?: string;
}

export function useCustomer() {
  const currentStore = useAtomValue(currentStoreAtom);
  const [customers, setCustomers] = useState<Customer[]>([]);
  // HOOK
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
  } = useQueryParams<CustomerFilters>({
    q: 'q',
  });

  //   FORM
  const createCustomerForm = useForm<CreateCustomerInput>({
    resolver: zodResolver(CreateCustomerSchema),
  });
  const updateCustomerForm = useForm<UpdateCustomerInput>({
    resolver: zodResolver(UpdateCustomerSchema),
  });
  const getCustomers = async () => {
    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore?.id}/customers?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setCustomers(res?.data?.data);
      setPagination(res?.data?.pagination);
    }
  };
  const createCustomer = async (data: CreateCustomerInput) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() => api.post(`/stores/${currentStore?.id}/customers`, data));
    if (res?.data.success) {
      getCustomers();
      showSuccessToast(res.data.message);
    }
  };
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

    createCustomerForm,
    updateCustomerForm,
    customers,
    loading,
    pagination,
    paginationParams,
    filters,
  };
}
