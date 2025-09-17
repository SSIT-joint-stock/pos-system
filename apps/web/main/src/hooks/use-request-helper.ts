import { useState, useCallback } from 'react';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';

export function useRequestHelper() {
  const [loading, setLoading] = useState(false);
  const { showErrorToast, showSuccessToast } = useToast();

  const requestWrapper = useCallback(
    async <T>(fn: () => Promise<T>, successMessage?: string): Promise<T | null> => {
      setLoading(true);
      try {
        const res = await fn();
        if (successMessage) showSuccessToast(successMessage);
        return res;
      } catch (err: any) {
        const message =
          err.response?.data?.error?.message || 'Có lỗi hệ thống, vui lòng thử lại sau';
        showErrorToast(message);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showErrorToast, showSuccessToast]
  );

  return { requestWrapper, loading, setLoading };
}
