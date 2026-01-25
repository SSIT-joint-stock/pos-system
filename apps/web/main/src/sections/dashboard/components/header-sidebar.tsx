'use client';
import { Notification } from '@repo/design-system/components/shared/item';
import { Loading } from '@repo/design-system/components/ui';
import { useClickOutside } from '@repo/design-system/hooks/client';
import { currentStoreAtom, currentUserAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { Bell, HandCoins, MessageCircle, MessageCircleQuestion, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { GoSignOut } from 'react-icons/go';
import useAuth from '../../../hooks/auth/use-auth';
import useStatistics from '../../../hooks/statistics/use-statistics';
export default function HeaderSidebar() {
  const [isShowNotification, setIsShowNotifications] = useState<boolean>(false);
  const [isShowUserManagement, setIsShowUserManagement] = useState(false);
  const currentUser = useAtomValue(currentUserAtom);
  const currentStore = useAtomValue(currentStoreAtom);
  const outSideRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    loadingNoti,
    typeNotification,
    getNotifications,
    handleChangeTypeNotification,
  } = useStatistics();
  const { logout, loading } = useAuth();
  useClickOutside(outSideRef, () => {
    setIsShowNotifications(false);
    setIsShowUserManagement(false);
  });
  useEffect(() => {
    if (!currentStore?.id) return;
    if (isShowNotification === true) {
      getNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id, isShowNotification, typeNotification]);
  return (
    <header className="bg-white shadow-md shadow-gray-100 px-8 flex items-stretch justify-between h-16 ">
      <span className="text-lg font-semibold text-gray-800 self-center">
        Xin chào, {currentUser?.username || 'Admin'}
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

        {/* Nút thông báo */}
        <div ref={outSideRef} className="relative flex">
          <button
            onClick={() => {
              setIsShowNotifications((prev) => !prev);
              setIsShowUserManagement(false);
            }}
            title="Thông báo"
            className={`flex items-center gap-2 text-sm justify-center px-3 hover:bg-pos-blue-50 hover:text-pos-blue-500 transition-colors cursor-pointer ${isShowNotification && 'bg-pos-blue-50 text-pos-blue-500'}`}
          >
            <Bell size={20} />
            <span>Thông báo</span>
          </button>

          {/* Dropdown thông báo */}
          <div
            className={`absolute top-full left-1/2 h-fit w-md -translate-x-1/2 mt-2  bg-white rounded-xl shadow-lg border border-gray-100 z-50 p-4 transition-all duration-300 ease-in-out ${isShowNotification ? 'opacity-100 visible ' : 'invisible opacity-0'}`}
          >
            <Notification
              notifications={notifications}
              loadingNoti={loadingNoti}
              handleChangeTypeNotification={handleChangeTypeNotification}
            />
          </div>
        </div>

        <div ref={outSideRef} className="relative flex">
          <button
            onClick={() => {
              setIsShowUserManagement((prev) => !prev);
              setIsShowNotifications(false);
            }}
            className={`flex items-center gap-3 text-sm justify-center px-3 hover:bg-pos-blue-50 hover:text-pos-blue-500 transition-colors cursor-pointer ${isShowUserManagement && 'bg-pos-blue-50 text-pos-blue-500'}`}
          >
            <Image
              src={'/avatar.png'}
              width={40}
              height={40}
              alt="avatar"
              className="w-10 h-10 rounded-full shrink-0 overflow-hidden object-cover "
              unoptimized
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-medium  truncate text-left">
                {currentUser?.username || 'Admin'}
              </h2>
              <p className="text-xs  ">{currentUser?.email || 'admin@gmail.com'}</p>
            </div>
          </button>
          <div
            className={`absolute top-full right-0 h-fit w-full  mt-2  bg-white rounded-sm  border border-gray-100 z-50 py-2 px-3 transition-all duration-300 ease-in-out ${isShowUserManagement ? 'opacity-100 visible ' : 'invisible opacity-0'}`}
          >
            <div className="py-2 px-1 hover:bg-gray-50 rounded-sm text-sm  text-gray-800 cursor-pointer flex items-center gap-3">
              <User size={20} className="text-gray-700" />
              Thông tin tài khoản
            </div>
            <div className="py-2 px-1 hover:bg-gray-50 rounded-sm text-sm   text-gray-800 cursor-pointer flex items-center gap-3">
              <HandCoins size={20} className="text-gray-700" />
              Gói dịch vụ
            </div>
            <div
              onClick={() => logout()}
              className="py-2 px-1 hover:bg-gray-50 rounded-sm text-sm   text-gray-800 cursor-pointer "
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loading size={'sm'} color="#3b82f6" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <GoSignOut size={20} className="text-gray-700" />
                  Đăng xuất
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
