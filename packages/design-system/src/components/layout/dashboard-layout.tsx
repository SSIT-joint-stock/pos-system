'use client';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import {
  accessTokenAtom,
  currentStoreAtom,
  currentUserAtom,
} from '@repo/design-system/stores/auth';
import { getDefaultStore } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import api from '../../../../../apps/web/main/src/libs/axios';
import HeaderSidebar from '../../../../../apps/web/main/src/sections/dashboard/components/header-sidebar';
import Sidebar from '../../../../../apps/web/main/src/sections/dashboard/components/sidebar-screen';
import { Loading } from '../ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const router = useRouter();
  const isFetched = useRef(false);
  const { showErrorToast } = useToast();
  const isSalesPages = pathName.endsWith('/sales');
  const [isExpand, setIsExpand] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const store = getDefaultStore();
  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;

    if (isFetched.current) return;

    if (store.get(accessTokenAtom)) {
      isFetched.current = true;
      return;
    }
    const syncSession = async () => {
      try {
        const res = await api.post('/auth/refresh-token');
        const { access_token, user, store: defaultStore } = res.data.data;

        store.set(accessTokenAtom, access_token);
        store.set(currentUserAtom, user);
        store.set(currentStoreAtom, defaultStore);

        isFetched.current = true;
      } catch {
        showErrorToast('Phiên làm việc hết hạn, vui lòng đăng nhập lại!');
        router.push(`${process.env.NEXT_PUBLIC_MAIN_URL}/auth/login`);
      }
    };

    syncSession();
  }, [hydrated, store, router, showErrorToast]);

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
                <span className="text-pos-blue-500 text-sm font-semibold">
                  Đang lấy dữ liệu ...
                </span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
