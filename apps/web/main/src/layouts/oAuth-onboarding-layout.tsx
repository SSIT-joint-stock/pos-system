'use client';

import useAuth from '@main/hooks/auth/use-auth';
import api from '@main/libs/axios';
import { FormBusinessInfo } from '@main/sections/auth/components/forms';
import FormSelectStore from '@main/sections/auth/components/forms/form-select-store';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { accessTokenAtom, currentUserAtom, storesAtom } from '@repo/design-system/stores/auth';
import { getDefaultStore, useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OauthOnboardingLayout() {
  const pathName = usePathname();
  // State
  const [hydrated, setHydrated] = useState(false);
  // Custom hooks
  const { showErrorToast } = useToast();
  // Jotai
  const store = getDefaultStore();
  const accessToken = useAtomValue(accessTokenAtom);
  const { selectStore, loading } = useAuth();
  // Effects
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const init = async () => {
      try {
        // Nếu chưa có token thì refresh
        const res = await api.post('/auth/refresh-token');

        const { access_token, user, stores } = res.data.data;
        store.set(accessTokenAtom, access_token);
        store.set(currentUserAtom, user);
        store.set(storesAtom, stores);
      } catch {
        showErrorToast('Vui lòng đăng nhâp lại!');
      }
    };

    init();
  }, [hydrated, store, accessToken, showErrorToast]);
  return (
    <>
      {pathName?.includes('oauth/create-store') && <FormBusinessInfo />}
      {pathName?.includes('oauth/select-store') && (
        <FormSelectStore
          stores={store.get(storesAtom)}
          loading={loading}
          handleStoreSubmit={selectStore}
        />
      )}
    </>
  );
}
