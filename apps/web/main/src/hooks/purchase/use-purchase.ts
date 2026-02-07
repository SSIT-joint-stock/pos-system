import { zodResolver } from '@hookform/resolvers/zod';
import { useToastNotification } from '@repo/design-system/hooks/client';
import { ApiResponse } from '@repo/design-system/types';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../libs/axios';
import {
  AcceptPaymentImport,
  AcceptPaymentImportSChema,
  CreatePurchaseOrder,
  CreatePurchaseOrderSchema,
  ImportExcelPurchase,
} from '../../schemas/purchase/purchase.schema';
import { exportExcel } from '../../utils/export-excel/export';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useRequestHelper } from '../use-request-helper';
import {
  PurchaseOrder,
  ValidationPurchaseOrderRes,
} from './../../../../../../packages/design-system/src/types/purchase';
export interface PurchaseOrderFilters extends Record<string, FilterValue> {
  q?: string;
  payment_status?: string;
  status?: string;
}
export function usePurchase() {
  const { requestWrapper, loading } = useRequestHelper();

  const { showSuccessToast } = useToastNotification();
  const {
    paginationParams,
    sort,
    sortBy,
    filters,
    pagination,

    setPaginationParams,
    setFilters,
    setPagination,
    buildParams,
    setSortBy,
    setSort,
  } = useQueryParams<PurchaseOrderFilters>({
    q: 'q',
    payment_status: 'payment_status',
    status: 'status',
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [validationPOs, setValidationPOs] = useState<ValidationPurchaseOrderRes>({
    itemLength: 0,
    itemErrorLength: 0,
    itemValidLength: 0,
    result: [],
  });
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [totalPurchase, setTotalPurchase] = useState<string>('');
  const formPurchase = useForm<CreatePurchaseOrder>({
    resolver: zodResolver(CreatePurchaseOrderSchema),
    defaultValues: {
      items: [],
    },
  });
  const formAcceptPayment = useForm<AcceptPaymentImport>({
    resolver: zodResolver(AcceptPaymentImportSChema),
  });

  const createPurchaseOrder = useCallback(
    async (data: CreatePurchaseOrder) => {
      const res = await requestWrapper(() => api.post<ApiResponse>('/purchase-order', data));
      if (res?.data.success) {
        showSuccessToast(res?.data?.message as string);
        return {
          success: true,
          data: res?.data?.data as PurchaseOrder,
        };
      }
      return {
        success: false,
        data: null,
      };
    },
    [requestWrapper, showSuccessToast]
  );
  const getPurchaseOrders = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get<ApiResponse>(`/purchase-order?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setPurchaseOrders(res?.data?.data as PurchaseOrder[]);
      setPagination(res?.data?.pagination);
      setTotalPurchase(
        (res?.data?.summary as { totalPurchaseAmount: string })?.totalPurchaseAmount as string
      );
    }
  }, [requestWrapper, buildParams, setPagination]);
  const getPurchaseOrder = useCallback(
    async (id: string) => {
      const res = await requestWrapper(() => api.get<ApiResponse>(`/purchase-order/${id}`));
      if (res?.data.success) {
        setPurchaseOrder(res?.data?.data as PurchaseOrder);
      }
    },
    [setPurchaseOrder, requestWrapper]
  );
  const acceptImportPurchase = useCallback(
    async (id: string) => {
      const res = await requestWrapper(() =>
        api.post<ApiResponse>(`/purchase-order/accept-import/${id}`)
      );
      if (res?.data.success) {
        showSuccessToast(res?.data?.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );
  const acceptPaymentPurchase = useCallback(
    async (id: string, data: AcceptPaymentImport) => {
      const res = await requestWrapper(() =>
        api.post<ApiResponse>(`/purchase-order/accept-payment/${id}`, data)
      );
      if (res?.data?.success) {
        showSuccessToast(res?.data?.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );
  const getPurchasesBySupplier = useCallback(
    async (supplierId: string) => {
      const res = await requestWrapper(() =>
        api.get<ApiResponse>(`/purchase-order/supplier/${supplierId}?${buildParams().toString()}`)
      );
      if (res?.data.success) {
        setPurchaseOrders(res?.data?.data as PurchaseOrder[]);
        setPagination(res?.data?.pagination);
      }
    },
    [requestWrapper, buildParams, setPagination]
  );

  const getPurchaseOrderByNumberCode = useCallback(
    async (numberCode: string) => {
      const res = await requestWrapper(() =>
        api.get<ApiResponse>(`/purchase-order/order-number/${numberCode}`)
      );
      if (res?.data.success) {
        setPurchaseOrder(res?.data?.data as PurchaseOrder);
      }
    },
    [requestWrapper, setPurchaseOrder]
  );
  // EXCEL
  const exportPurchaseOrdersExcel = useCallback(async () => {
    await requestWrapper(async () => {
      const res = await api.get('/purchase-order/excel/export', {
        responseType: 'blob',
      });

      exportExcel(
        res,
        `du_lieu_phieu_nhap_${new Date().toLocaleDateString()}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });
  }, [requestWrapper]);

  const downloadPurchaseOrderTemplate = useCallback(async () => {
    await requestWrapper(async () => {
      const res = await api.get('/purchase-order/excel/template', {
        responseType: 'blob',
      });

      exportExcel(
        res,
        `mau_phieu_nhap_${new Date().toLocaleDateString()}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });
  }, [requestWrapper]);

  const validationImportPO = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('po_validation', file);
      const res = await requestWrapper(() =>
        api.post<ApiResponse>(`/purchase-order/excel/import/validation`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
      console.log(res);
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        setValidationPOs(res.data.data as ValidationPurchaseOrderRes);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );

  const importPurchaseOrders = useCallback(
    async (data: ImportExcelPurchase) => {
      const res = await requestWrapper(() =>
        api.post<ApiResponse>('/purchase-order/excel/import/save', data)
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );

  return {
    loading,
    formPurchase,
    purchaseOrders,
    pagination,
    paginationParams,
    sort,
    sortBy,
    filters,
    totalPurchase,
    purchaseOrder,
    formAcceptPayment,
    validationPOs,

    acceptPaymentPurchase,
    acceptImportPurchase,
    setPaginationParams,
    setFilters,
    setSortBy,

    setPagination,
    setSort,
    setPurchaseOrder,
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrder,
    getPurchasesBySupplier,
    getPurchaseOrderByNumberCode,
    //export, template
    exportPurchaseOrdersExcel,
    downloadPurchaseOrderTemplate,
    validationImportPO,
    importPurchaseOrders,
  };
}
