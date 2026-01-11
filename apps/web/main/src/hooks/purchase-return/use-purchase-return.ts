import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { ApiResponse } from '@repo/design-system/types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRequestHelper } from '../../hooks/use-request-helper';
import api from '../../libs/axios';
import {
  PurchaseReturnWithPurchaseOrder,
  PurchaseReturnWithPurchaseOrderSchema,
} from '../../schemas/purchase-return/purchase-return.schema';

export function usePurchaseReturn() {
  const { showSuccessToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();
  // Form
  const formPurchase = useForm<PurchaseReturnWithPurchaseOrder>({
    resolver: zodResolver(PurchaseReturnWithPurchaseOrderSchema),
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

  return {
    formPurchase,
    loading,
    createPurchaseReturnWithPO,
  };
}
