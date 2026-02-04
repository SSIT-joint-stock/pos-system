/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Store, StoreMember } from '@repo/design-system/types/store';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../libs/axios';
import {
  CreateStoreInput,
  UpdateStoreInput,
  updateStoreSchema,
} from '../../schemas/store/store.schema';
import { useRequestHelper } from '../use-request-helper';

const STORE_ENDPOINTS = {
  STORES: 'stores',
  STORES_MEMBERS: 'stores/members',
  ADD_MEMBER_TO_STORE: 'stores/add-member',
  DELETE_MEMBER_FROM_STORE: 'stores/delete-member',
};

export default function useStore() {
  // VARIABLE
  const currentStore = useAtomValue(currentStoreAtom);
  const setCurrentStore = useAtom(currentStoreAtom)[1];
  const [stores, setStores] = useState<Store[]>([]);
  const [store, setStore] = useState<Store>();
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
  const [members, setMembers] = useState<StoreMember[]>([]);
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

  const getStoreDetail = useCallback(async () => {
    if (!currentStore?.id) return;
    // Fetch store info
    const storeRes = await requestWrapper(() => api.get(`stores/${currentStore?.id}`));
    const storeData = storeRes?.data?.data;
    setStore(storeData);

    // Use actual data from API response
    // setStats({
    //   totalProducts: storeData._count?.products || 0,
    //   totalCategories: storeData._count?.categories || 0,
    //   totalCustomers: storeData._count?.customer || 0,
    //   totalMembers: storeData._count?.members || 0,
    //   // These would come from additional API calls when available
    //   todaySales: 0, // Will be 0 until you have an endpoint for this
    //   monthlyRevenue: 0, // Will be 0 until you have an endpoint for this
    //   averageRating: 0, // Will be 0 until you have an endpoint for this
    //   totalOrders: 0, // Will be 0 until you have an endpoint for this
    // });
  }, [currentStore?.id, requestWrapper]);

  const updateStore = async (data: UpdateStoreInput) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() => api.patch(`stores/${currentStore?.id}`, data));
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getStoreDetail();
      setCurrentStore(res.data.data);
      return res.data.data;
    }
  };
  const createStore = async (data: CreateStoreInput) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() => api.post(STORE_ENDPOINTS.STORES, data));
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getStores();
      return res.data.data;
    }
  };
  const getMembersInStore = async () => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.get(`${STORE_ENDPOINTS.STORES_MEMBERS}/${currentStore?.id}`)
    );
    if (res?.data.success) {
      return setMembers(res.data.data);
    }
  };
  const addMemberToStore = async (emailUser: string) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.post(`${STORE_ENDPOINTS.ADD_MEMBER_TO_STORE}/${currentStore?.id}`, { emailUser })
    );
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getMembersInStore();
    }
  };
  const deleteMemberFromStore = async (memberUserId: string) => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.delete(`${STORE_ENDPOINTS.DELETE_MEMBER_FROM_STORE}/${currentStore?.id}/`, {
        data: { memberUserId },
      })
    );
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getMembersInStore();
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
    members,
    loading,
    // ACTION
    updateStore,
    createStore,
    getStores,
    getStoreDetail,
    getMembersInStore,
    addMemberToStore,
    deleteMemberFromStore,
  };
}
