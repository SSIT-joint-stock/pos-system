'use client';
import React, { useEffect, useState } from 'react';
import { SideBar } from '../shared/dashboard-screen';
import { useAtom, useSetAtom } from 'jotai';
import {
  accessTokenAtom,
  currentStoreAtom,
  currentUserAtom,
} from '@repo/design-system/stores/auth';
import api from '../../../../../apps/web/main/src/libs/axios';
import useAuth from '../../../../../apps/web/main/src/hooks/auth/useAuth';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isExpand, setIsExpand] = useState(false);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const { profile } = useAuth();
  const [currentUser] = useAtom(currentUserAtom);
  const [currentStore] = useAtom(currentStoreAtom);
  console.log('currentStore', currentStore);
  console.log('currentUser', currentUser);
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.post('/auth/refresh-token');
        const { access_token } = res.data.data;
        setAccessToken(access_token);
        await profile();
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [setAccessToken]);
  return (
    <div className=" flex w-screen h-screen ">
      <aside className="flex-shrink-0">
        <SideBar isExpand={isExpand} setIsExpand={setIsExpand} />
      </aside>
      <main className="flex-1 p-4 overflow-auto bg-gray-50 scrollbar-fixed">{children}</main>
    </div>
  );
}
