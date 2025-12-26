'use client';
import useAuth from '@main/hooks/auth/use-auth';
import api from '@main/libs/axios';
import { FormBusinessInfo } from '@main/sections/auth/components/forms';
import FormSelectStore from '@main/sections/auth/components/forms/form-select-store';
import { Loading } from '@repo/design-system/components/ui';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { accessTokenAtom, currentUserAtom, storesAtom } from '@repo/design-system/stores/auth';
import { getDefaultStore } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function OauthOnboardingLayout() {
  const [hydrated, setHydrated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const initialized = useRef(false);

  const { selectStore, loading } = useAuth();
  const { showErrorToast } = useToast();
  const store = getDefaultStore();
  const pathName = usePathname();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || initialized.current) return;

    const initOAuth = async () => {
      initialized.current = true;

      try {
        const res = await api.post('/oauth/refresh-token');
        const { access_token, user, stores } = res.data.data;

        store.set(accessTokenAtom, access_token);
        store.set(currentUserAtom, user);
        store.set(storesAtom, stores);

        setIsInitializing(false);
      } catch (err) {
        console.error(err);
        initialized.current = false;
        setIsInitializing(false);
      }
    };

    initOAuth();
  }, [hydrated, store, showErrorToast]);

  if (!hydrated || isInitializing) {
    return (
      <div className="flex items-center gap-4 text-base font-semibold text-pos-blue-500">
        <Loading size="md" radius="sm" color="#3b82f6" />
        Đang đồng bộ tài khoản...
      </div>
    );
  }

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
