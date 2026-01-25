'use client';
import { useState } from 'react';
import api from '../../../../main/src/libs/axios';
import { useRequestHelper } from '../use-request-helper';
export interface Notification {
  type: 'stock' | 'order';
  data: {
    quantity?: number;
    variantName?: string;
    stockType?: string;

    amount: number;
    code?: string;
    payment_method?: string;
  };
  createdAt: string;
}

export type TypeTime = {
  day: 'day';
  week: 'week';
  month: 'month';
};
export type TypeNotification = 'all' | 'order' | 'product';

interface CacheItem {
  key: string;
  type: string;
  data?: any;
}
interface ProductItem {
  id: string;
  name: string;
  image_url: string;
  inventory: {
    quantity: string;
  };
  price: number;
}
interface TopProduct {
  id: string;
  name: string;
  price: number;
  baseProductName: string;
  baseUnit: string;
  imageUrl: string;
  quantitySold: number;
}
interface LowStockProduct {
  product: ProductItem;
  totalSold30Days: number;
  daysRemaining: number;
  avgDailySales: number;
  status: string;
}
export interface SummaryRevenue {
  orderCount: number;
  totalRevenue: number;
  customerCount: number;
  totalProduct: number;
}

export default function useStatistics() {
  const typeTimeValue: TypeTime = { day: 'day', week: 'week', month: 'month' };
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [topsProducts, setTopsProducts] = useState<TopProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [typeNotification, setTypeNotification] = useState<TypeNotification>('all');

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
  const [loadingNoti, setLoadingNoti] = useState(false);
  const { loading, requestWrapper } = useRequestHelper();
  const getNotifications = async () => {
    try {
      setLoadingNoti(true);
      const res = await api.get(`/statistics/notifications?type=${typeNotification}`);

      if (res?.data.success) {
        setLoadingNoti(false);
        setNotifications(res?.data?.data);
      }
    } catch {
      setLoadingNoti(false);
    }
  };
  const fetchStatisticByKey = async (key: string, type: string) => {
    let url = '';
    switch (key) {
      case 'revenue':
        url = `/statistics/revenue?type=${type}`;
        break;
      case 'summary-revenue':
        url = `/statistics/summary-revenue?type=${type}`;
        break;
      case 'revenue-by-category':
        url = `/statistics/revenue-by-category?type=${type}`;
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
  const getTopProducts = async () => {
    const res = await requestWrapper(() => api.get(`/statistics/top-products`));
    if (res?.data.success) {
      setTopsProducts(res?.data?.data);
    }
  };
  const getLowStockProducts = async () => {
    const res = await requestWrapper(() => api.get(`/statistics/low-stock-product`));
    if (res?.data.success) {
      setLowStockProducts(res?.data?.data);
    }
  };

  const handleChangeTimeType = async (key: string, type: 'day' | 'week' | 'month') => {
    const newData = await fetchStatisticByKey(key, type);
    setCache((prev) =>
      prev.map((item) => (item.key === key ? { ...item, type, data: newData } : item))
    );
  };
  const handleChangeTypeNotification = async (value: TypeNotification) => {
    setTypeNotification(value);
  };

  return {
    loading,
    notifications,
    cache,
    topsProducts,
    lowStockProducts,
    loadingNoti,
    typeNotification,
    fetchStatistic,
    getNotifications,
    setCache,
    handleChangeTimeType,
    setTypeNotification,
    getTopProducts,
    getLowStockProducts,
    handleChangeTypeNotification,
  };
}
