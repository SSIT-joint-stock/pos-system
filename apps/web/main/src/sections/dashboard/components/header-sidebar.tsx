'use client';
import React from 'react';
import { Bell, MessageCircle, MessageCircleQuestion } from 'lucide-react';
import { currentUserAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
export default function HeaderSidebar() {
  const currentUser = useAtomValue(currentUserAtom);

  return (
    <header className="bg-white shadow-md shadow-gray-100 px-8 flex items-stretch justify-between h-16 ">
      <span className="text-lg font-semibold text-gray-800 self-center">
        {currentUser?.username}
      </span>
      <div className="flex items-stretch ">
        <button className="flex items-center gap-4.5 text-sm justify-center px-3 hover:bg-pos-blue-50 hover:text-pos-blue-500 transition-colors cursor-pointer">
          <MessageCircleQuestion size={20} />
          <span>Trợ giúp</span>
        </button>
        <button className="flex items-center gap-4.5 text-sm justify-center px-3 hover:bg-pos-blue-50 hover:text-pos-blue-500 transition-colors cursor-pointer">
          <MessageCircle size={20} />
          <span>Góp ý</span>
        </button>
        <button className="flex items-center gap-4.5 text-sm justify-center px-3 hover:bg-pos-blue-50 hover:text-pos-blue-500 transition-colors cursor-pointer">
          <Bell size={20} />
          <span>Thông báo</span>
        </button>
        <button className="flex items-center gap-3 text-sm justify-center px-3 hover:bg-pos-blue-50 hover:text-pos-blue-500 transition-colors cursor-pointer">
          <Image
            src={'/avatar.png'}
            width={40}
            height={40}
            alt="avatar"
            className="w-10 h-10 rounded-full shrink-0 overflow-hidden object-cover "
            unoptimized
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium  truncate text-left">{currentUser?.username}</h2>
            <p className="text-xs  ">{currentUser?.email}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
