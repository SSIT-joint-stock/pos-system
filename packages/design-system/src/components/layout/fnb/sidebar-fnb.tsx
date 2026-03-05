'use client';

import Image from 'next/image';
import { useState } from 'react';
import MenuSidebarFnb from './menu-sidebar-fnb';
import SettingsSidebarFnb from './settings-sidebar-fnb';

export default function SidebarFnb({
  isExpand,
  setIsExpand,
}: {
  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;
}) {
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  return (
    <div
      className={`h-screen relative flex flex-col bg-white overflow-x-none shadow-md shadow-gray-100 transition-all duration-300 ${isExpand ? 'w-56' : 'w-20'}`}
    >
      <div className="h-full flex flex-col gap-2 p-3">
        <div
          className={`flex items-center gap-4 mb-4 ${isExpand ? 'justify-start' : 'justify-center'}`}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={38}
              height={38}
              className="object-cover w-14 h-14"
              unoptimized
            />
          </div>
          <p
            className={`text-2xl font-semibold tracking-tight text-pos-blue-500 ${isExpand ? 'truncate max-w-full' : 'hidden'}`}
          >
            EraPOS
          </p>
        </div>

        <MenuSidebarFnb
          isExpand={isExpand}
          setIsExpand={setIsExpand}
          openSubmenu={openSubmenu}
          setOpenSubmenu={setOpenSubmenu}
        />

        <SettingsSidebarFnb
          setOpenSubmenu={setOpenSubmenu}
          setIsExpand={setIsExpand}
          isExpand={isExpand}
        />
      </div>
    </div>
  );
}
