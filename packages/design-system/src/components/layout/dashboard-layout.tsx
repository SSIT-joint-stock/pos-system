'use client';
import React, { useEffect, useState } from 'react';
import { getDefaultStore, useAtomValue } from 'jotai';
import {
  accessTokenAtom,
  currentStoreAtom,
  currentUserAtom,
} from '@repo/design-system/stores/auth';
import api from '../../../../../apps/web/main/src/libs/axios';
import { Loading } from '../ui';
import Sidebar from '../../../../../apps/web/main/src/sections/dashboard/components/sidebar-screen';
import HeaderSidebar from '../../../../../apps/web/main/src/sections/dashboard/components/header-sidebar';
import { usePathname } from 'next/navigation';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const { showErrorToast } = useToast();
  const isSalesPages = pathName.endsWith('/sales');
  const [isExpand, setIsExpand] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const store = getDefaultStore();
  const accessToken = useAtomValue(accessTokenAtom);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const init = async () => {
      try {
        let token = accessToken;
        let currentStore = store.get(currentStoreAtom);

        // Nếu chưa có token thì refresh
        if (!token) {
          const res = await api.post('/auth/refresh-token');
          const { access_token, user, store: defaultStore } = res.data.data;

          token = access_token;
          currentStore = defaultStore;

          store.set(accessTokenAtom, token);
          store.set(currentUserAtom, user);
          store.set(currentStoreAtom, currentStore);
        }

        // Nếu chưa có currentStore (do localStorage xóa)
        if (!currentStore) {
          const res = await api.get('/auth/profile');
          const { store: defaultStore } = res.data.data;

          currentStore = defaultStore;
          store.set(currentStoreAtom, currentStore);
        }
      } catch {
        showErrorToast('Vui lòng đăng nhâp lại!');
      }
    };

    init();
  }, [hydrated, store, accessToken, showErrorToast]);

  return (
    <div className="flex w-screen h-screen ">
      {!isSalesPages && <Sidebar isExpand={isExpand} setIsExpand={setIsExpand} />}
      <div className="flex  flex-col w-full h-screen bg-gray-50 overflow-auto scrollbar-fixed">
        {!isSalesPages && <HeaderSidebar />}
        <main
          className={`${isSalesPages ? 'flex-1 p-0 overflow-auto  scrollbar-fixed' : 'flex-1 p-4 overflow-auto  scrollbar-fixed'}`}
        >
          {hydrated ? (
            children
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-white ">
              <div className="flex items-center gap-4">
                <Loading color="#3b82f6" size="md" />
                <span className="text-pos-blue-500 text-base ">Đang lấy dữ liệu ...</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
