'use client';
import { useEffect, useState } from 'react';
import { useRequestHelper } from '../use-request-helper';
import api from '../../../../main/src/libs/axios';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
export interface Notification {
  title: string;
  time: string;
}
export type TypeTime = {
  day: 'day';
  week: 'week';
  month: 'month';
};

interface CacheItem {
  key: string;
  type: string;
  data?: any;
}

export default function useStatistics() {
  const typeTimeValue: TypeTime = { day: 'day', week: 'week', month: 'month' };
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cache, setCache] = useState<CacheItem[]>([
    {
      key: 'revenue',
      type: typeTimeValue.day,
    },
    {
      key: 'summary-revenue',
      type: typeTimeValue.day,
    },
    {
      key: 'revenue-by-category',
      type: typeTimeValue.day,
    },
  ]);
  const currentStore = useAtomValue(currentStoreAtom);
  const { loading, requestWrapper } = useRequestHelper();
  const getNotifications = async () => {
    if (!currentStore?.id) return;
    const res = await requestWrapper(() =>
      api.get(`/stores/${currentStore?.id}/statistics/notifications`)
    );
    if (res?.data.success) {
      console.log('res', res.data.data);
      setNotifications(res?.data?.data?.notifications);
    }
  };
  const fetchStatisticByKey = async (key: string, type: string) => {
    if (!currentStore?.id) return;
    let url = '';
    switch (key) {
      case 'revenue':
        url = `/stores/${currentStore?.id}/statistics/revenue?type=${type}`;
        break;
      case 'summary-revenue':
        url = `/stores/${currentStore?.id}/statistics/summary-revenue?type=${type}`;
        break;
      case 'revenue-by-category':
        url = `/stores/${currentStore?.id}/statistics/revenue-by-category?type=${type}`;
        break;
      default:
        return null;
    }
    const res = await requestWrapper(() => api.get(url));
    if (res?.data.success) {
      return res?.data?.data;
    }
  };
  const fetchStatistic = async () => {
    const updated = await Promise.all(
      cache.map(async (item) => {
        const data = await fetchStatisticByKey(item.key, item.type);
        return {
          ...item,
          data,
        };
      })
    );
    setCache(updated);
  };

  const handleChangeTimeType = async (key: string, type: 'day' | 'week' | 'month') => {
    const newData = await fetchStatisticByKey(key, type);
    setCache((prev) =>
      prev.map((item) => (item.key === key ? { ...item, type, data: newData } : item))
    );
  };

  useEffect(() => {
    if (currentStore?.id) {
      fetchStatistic();
      getNotifications();
    }
  }, [currentStore?.id]);

  return {
    loading,
    notifications,
    cache,
    fetchStatistic,
    getNotifications,
    setCache,
    handleChangeTimeType,
  };
}
