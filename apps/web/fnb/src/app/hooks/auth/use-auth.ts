'use client';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import {
  accessTokenAtom,
  currentStoreAtom,
  currentUserAtom,
} from '@repo/design-system/stores/auth';
import { ApiResponse } from '@repo/types/response';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '../../../../../main/src/libs/axios';

const AUTH_ENDPOINTS = {
  LOGOUT: '/auth/logout',
};

export default function useAuth() {
  const { showSuccessToast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const setAccessToken = useSetAtom(accessTokenAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setCurrentStore = useSetAtom(currentStoreAtom);

  const logout = async (redirectUrl?: string) => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>(AUTH_ENDPOINTS.LOGOUT);
      if (res?.data.success) {
        showSuccessToast(res?.data?.message as string);
        setAccessToken('');
        setCurrentUser(null);
        setCurrentStore(null);
        router.push(redirectUrl || `${process.env.NEXT_PUBLIC_MAIN_URL}/auth/login`);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
  };
}
