import { PurchaseOrder } from "./../../../../../../packages/design-system/src/types/purchase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcceptPaymentImport,
  AcceptPaymentImportSChema,
  CreatePurchaseOrder,
  CreatePurchaseOrderSchema,
} from "../../schemas/purchase/purchase.schema";
import { useToastNotification } from "@repo/design-system/hooks/client";
import { useRequestHelper } from "../use-request-helper";
import { useForm } from "react-hook-form";
import api from "../../libs/axios";
import { FilterValue, useQueryParams } from "../query/use-query-params";
import { useCallback, useState } from "react";
import { ApiResponse } from "@repo/design-system/types";
import { exportExcel } from "../../utils/export-excel/export";
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
    q: "q",
    payment_status: "payment_status",
    status: "status",
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder>();
  const [totalPurchase, setTotalPurchase] = useState<string>("");
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
      const res = await requestWrapper(() =>
        api.post<ApiResponse>("/purchase-order", data)
      );
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
        (res?.data?.summary as { totalPurchaseAmount: string })
          ?.totalPurchaseAmount as string
      );
    }
  }, [requestWrapper, buildParams, setPagination]);
  const getPurchaseOrder = useCallback(
    async (id: string) => {
      const res = await requestWrapper(() =>
        api.get<ApiResponse>(`/purchase-order/${id}`)
      );
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
  const exportPurchaseOrdersExcel = useCallback(async () => {
    await requestWrapper(async () => {
      const res = await api.get("/purchase-order/excel/export", {
        responseType: "blob",
      });

      exportExcel(
        res.data,
        `du_lieu_phieu_nhap_${new Date().toLocaleDateString()}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });
  }, [requestWrapper]);

  const downloadPurchaseOrderTemplate = useCallback(async () => {
    await requestWrapper(async () => {
      const res = await api.get("/purchase-order/excel/template", {
        responseType: "blob",
      });

      exportExcel(
        res.data,
        `mau_phieu_nhap_${new Date().toLocaleDateString()}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });
  }, [requestWrapper]);

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
    acceptPaymentPurchase,
    acceptImportPurchase,
    setPaginationParams,
    setFilters,
    setSortBy,
    setPagination,
    setSort,
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrder,
    //export, template
    exportPurchaseOrdersExcel,
    downloadPurchaseOrderTemplate,
  };
}
