'use client';
import { currentUserAtom } from '@repo/design-system/stores/auth';
import { useAtom } from 'jotai';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function AccountManagement({ isExpand }: { isExpand: boolean }) {
  const [currentUser] = useAtom(currentUserAtom);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center ${isExpand ? 'w-full' : 'w-[44px] '} ${isExpand ? 'gap-2' : 'gap-0'} w-full transition-all duration-300 hover:bg-gray-100 cursor-pointer ${isExpand ? 'p-2' : 'p-0'} rounded-lg`}
      >
        <Image
          src={'/avatar.png'}
          width={40}
          height={40}
          alt="avatar"
          className="w-10 h-10 rounded-full shrink-0 overflow-hidden object-cover "
        />
        <div
          className={`flex ${isExpand ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'} gap-1.5 overflow-hidden transition-all duration-300 items-center `}
        >
          <div
            className={`flex flex-col gap-1 transition-all duration-300 overflow-hidden ${
              isExpand ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'
            }`}
          >
            <h2 className="text-sm font-medium text-gray-800 truncate">{currentUser?.username}</h2>
            <p className="text-xs text-gray-500 ">{currentUser?.email}</p>
          </div>
          <ChevronDown
            size={18}
            className={` transition-transform duration-300  text-gray-500 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className={`w-full bg-gray-500 overflow-hidden transition-all duration-300
      ${isOpen ? 'max-h-40 opacity-100 visible p-2' : 'max-h-0 opacity-0 p-0 invisible'}`}
      >
        {isOpen && (
          <div>
            <button className="w-full text-left px-2 py-1 hover:bg-gray-400 rounded">
              Profile
            </button>
            <button className="w-full text-left px-2 py-1 hover:bg-gray-400 rounded">
              Settings
            </button>
            <button className="w-full text-left px-2 py-1 hover:bg-gray-400 rounded text-red-500">
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
