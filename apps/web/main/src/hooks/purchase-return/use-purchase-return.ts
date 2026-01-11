import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { ApiResponse } from '@repo/design-system/types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRequestHelper } from '../../hooks/use-request-helper';
import api from '../../libs/axios';
import {
  PurchaseReturnWithoutPO,
  PurchaseReturnWithoutPOSchema,
  PurchaseReturnWithPurchaseOrder,
  PurchaseReturnWithPurchaseOrderSchema,
} from '../../schemas/purchase-return/purchase-return.schema';

export function usePurchaseReturn() {
  const { showSuccessToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();
  // Form
  const formPurchaseWithPO = useForm<PurchaseReturnWithPurchaseOrder>({
    resolver: zodResolver(PurchaseReturnWithPurchaseOrderSchema),
    defaultValues: {
      items: [],
    },
  });
  const formPurchaseWithoutPO = useForm<PurchaseReturnWithoutPO>({
    resolver: zodResolver(PurchaseReturnWithoutPOSchema),
    defaultValues: {
      items: [],
    },
  });

  const createPurchaseReturnWithPO = useCallback(
    async (purchaseReturnId: string, data: PurchaseReturnWithPurchaseOrder) => {
      const res = await requestWrapper(() =>
        api.post<ApiResponse>(`/purchase-return/order/${purchaseReturnId}`, data)
      );
      if (res?.data.success) {
        showSuccessToast(res?.data?.message as string);
        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    },
    [requestWrapper, showSuccessToast]
  );

  const createPurchaseReturnWithoutPO = useCallback(
    async (data: PurchaseReturnWithoutPO) => {
      const res = await requestWrapper(() => api.post<ApiResponse>(`/purchase-return/free`, data));
      if (res?.data.success) {
        showSuccessToast(res?.data?.message as string);
        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    },
    [requestWrapper, showSuccessToast]
  );

  return {
    formPurchaseWithPO,
    formPurchaseWithoutPO,
    loading,
    createPurchaseReturnWithoutPO,
    createPurchaseReturnWithPO,
  };
}
