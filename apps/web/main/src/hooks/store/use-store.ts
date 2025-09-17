'use client';

import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { useRequestHelper } from '../use-request-helper';
import api from '../../libs/axios';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import {
  CreateStoreInput,
  UpdateStoreInput,
  updateStoreSchema,
} from '../../schemas/store/store.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@repo/design-system/types/store';
interface StoreDetails {
  id: string;
  name: string;
  description: string;
  address: string;
  business_hour: string;
  phone_number: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    username: string;
    email: string;
  };
}
const STORE_ENDPOINTS = {
  STORES: 'stores',
};

export default function useStore() {
  // VARIABLE
  const [stores, setStores] = useState<Store[]>([]);
  const currentStore = useAtomValue(currentStoreAtom);
  const [store, setStore] = useState<StoreDetails>({
    id: '',
    name: '',
    address: '',
    business_hour: '',
    phone_number: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    owner: {
      username: '',
      email: '',
    },
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalCustomers: 0,
    totalMembers: 0,
    todaySales: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    totalOrders: 0,
  });
  const { showSuccessToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();

  // FORMS
  const updateStoreForm = useForm<UpdateStoreInput>({
    resolver: zodResolver(updateStoreSchema),
  });
  const createStoreForm = useForm<CreateStoreInput>({
    resolver: zodResolver(updateStoreSchema),
  });
  // ACTION FUNCTION

  const getStores = async () => {
    const res = await requestWrapper(() => api.get(STORE_ENDPOINTS.STORES));
    if (res?.data.success) {
      setStores(res.data.data);
      return res.data.data;
    }
  };

  const getStoreDetail = async () => {
    // Fetch store info
    const storeRes = await requestWrapper(() => api.get(`stores/${currentStore?.id}`));
    const storeData = storeRes?.data?.data;
    setStore(storeData);

    // Use actual data from API response
    setStats({
      totalProducts: storeData._count?.products || 0,
      totalCategories: storeData._count?.categories || 0,
      totalCustomers: storeData._count?.customer || 0,
      totalMembers: storeData._count?.members || 0,
      // These would come from additional API calls when available
      todaySales: 0, // Will be 0 until you have an endpoint for this
      monthlyRevenue: 0, // Will be 0 until you have an endpoint for this
      averageRating: 0, // Will be 0 until you have an endpoint for this
      totalOrders: 0, // Will be 0 until you have an endpoint for this
    });
  };

  const updateStore = async (data: UpdateStoreInput) => {
    const res = await requestWrapper(() => api.patch(`stores/${currentStore?.id}`, data));
    if (res?.data.success) {
      showSuccessToast('Cập nhật thành công');
      getStoreDetail();
      return res.data.data;
    }
  };
  const createStore = async (data: CreateStoreInput) => {
    const res = await requestWrapper(() => api.post(STORE_ENDPOINTS.STORES, data));
    if (res?.data.success) {
      showSuccessToast('Tạo cửa hàng thành công');
      getStores();
      return res.data.data;
    }
  };

  return {
    // FORM
    updateStoreForm,
    createStoreForm,
    // STATE
    stores,
    currentStore,
    store,
    stats,
    loading,
    // ACTION
    updateStore,
    createStore,
    getStores,
    getStoreDetail,
  };
}
