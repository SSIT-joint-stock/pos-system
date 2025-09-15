'use client';
import React, { useEffect, useState } from 'react';
import { SideBar } from '../shared/dashboard-screen';
import { getDefaultStore, useAtomValue } from 'jotai';
import {
  accessTokenAtom,
  currentStoreAtom,
  currentUserAtom,
} from '@repo/design-system/stores/auth';
import api from '../../../../../apps/web/main/src/libs/axios';
import { Loading } from '../ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isExpand, setIsExpand] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const store = getDefaultStore();
  const accessToken = useAtomValue(accessTokenAtom);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (accessToken) return;
    const init = async () => {
      try {
        const res = await api.post('/auth/refresh-token');
        const { access_token, user, store: currentStore } = res.data.data;

        store.set(accessTokenAtom, access_token);
        store.set(currentUserAtom, user);
        store.set(currentStoreAtom, currentStore);
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, [hydrated, store, accessToken]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen ">
      <aside className="flex-shrink-0">
        <SideBar isExpand={isExpand} setIsExpand={setIsExpand} />
      </aside>
      <main className="flex-1 p-4 overflow-auto bg-gray-50 scrollbar-fixed">{children}</main>
    </div>
  );
}
