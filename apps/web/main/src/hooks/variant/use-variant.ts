import api from '../../libs/axios';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRequestHelper } from '../use-request-helper';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  CreateVariantInput,
  CreateVariantSchema,
  UpdateVariantInput,
} from '../../schemas/variant/variant.schema';
import { useCallback, useState } from 'react';
import { ApiResponse } from '@repo/types/response';
import { Variant } from '@repo/design-system/types';

export function useVariant() {
  //     HOOKS
  const [variant, setVariant] = useState<Variant | null>(null);
  const { showSuccessToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();

  //   FORM
  const formVariant = useForm<CreateVariantInput>({
    resolver: zodResolver(CreateVariantSchema),
    defaultValues: {
      conversions: [],
    },
  });

  const conversionsFiledArray = useFieldArray({
    control: formVariant.control,
    name: 'conversions',
  });

  //   FUNC
  const createVariant = useCallback(
    async (data: CreateVariantInput, productId: string) => {
      const res = await requestWrapper(() =>
        api.post<ApiResponse>(`/variant/${productId}/create`, data)
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );
  const getVariant = useCallback(
    async (id: string, productId: string) => {
      const res = await requestWrapper(() =>
        api.get<ApiResponse>(`/variant/${id}/product/${productId}`)
      );
      if (res?.data.success) {
        setVariant(res.data.data);
      }
    },
    [requestWrapper]
  );
  const updateVariant = useCallback(
    async (id: string, productId: string, data: UpdateVariantInput) => {
      const res = await requestWrapper(() =>
        api.patch<ApiResponse>(`/variant/${id}/update/${productId}`, data)
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
    formVariant,
    loading,
    conversionsFiledArray,
    variant,

    createVariant,
    getVariant,
    updateVariant,
  };
}
