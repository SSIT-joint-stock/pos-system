'use client';
import {
  BadgeDollarSign,
  LayoutDashboard,
  ArrowLeft,
  ArrowRight,
  Settings,
  LogOut,
  ShoppingCart,
  PackageSearch,
  Store,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import useAuth from '../../../../../../apps/web/main/src/hooks/auth/useAuth';
import { Loading } from '../../ui';
import { AccountManagement } from './account-management';
export function SideBar({
  isExpand,
  setIsExpand,
}: {
  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;
}) {
  const [currentStore] = useAtom(currentStoreAtom);
  const { logout, loading } = useAuth();
  const pathName = usePathname();

  const pageItems = [
    {
      title: 'Tổng quan',
      path: `/dashboard/store/${currentStore?.id}/overview`,
      icon: <LayoutDashboard className="shrink-0" />,
    },
    {
      title: 'Quản lý sản phẩm',
      path: `/dashboard/store/${currentStore?.id}/manage-products`,
      icon: <BadgeDollarSign className="shrink-0" />,
    },
    {
      title: 'Bán hàng',
      path: `/dashboard/store/${currentStore?.id}/sales`,
      icon: <ShoppingCart className="shrink-0" />,
    },
    {
      title: 'Đơn hàng',
      path: `/dashboard/store/${currentStore?.id}/orders`,
      icon: <PackageSearch className="shrink-0" />,
    },
    {
      title: 'Cài đặt cửa hàng',
      path: `/dashboard/store/${currentStore?.id}/store-setting`,
      icon: <Store className="shrink-0" />,
    },
    {
      title: 'Quản lý nhân viên',
      path: `/dashboard/store/${currentStore?.id}/employees`,
      icon: <Users className="shrink-0" />,
    },
  ];

  return (
    <div
      className={`h-screen relative  flex flex-col bg-white overflow-x-none shadow-[4px_0_6px_rgba(0,0,0,0.1)] transition-all duration-300 ${isExpand ? 'w-56' : 'w-20'} }`}
    >
      {/* Toggle button */}
      <div className="w-fit absolute top-1/2 -translate-y-1/2  -right-4 flex justify-end">
        <button
          className="p-2 rounded-xl bg-pos-blue-50  hover:bg-pos-blue-500 group cursor-pointer duration-300  transition-all"
          onClick={() => setIsExpand(!isExpand)}
        >
          {isExpand ? (
            <ArrowLeft size={18} className="text-pos-blue-400 group-hover:text-white " />
          ) : (
            <ArrowRight size={18} className="  text-pos-blue-400 group-hover:text-white" />
          )}
        </button>
      </div>

      {/* Menu items */}
      <div className=" h-full flex flex-col gap-2 p-4 ">
        {/* Should be to component */}
        <div className="flex items-center gap-4 mb-4">
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
            className={`text-2xl font-semibold tracking-tight text-pos-blue-500 ${isExpand === false && 'hidden'}`}
          >
            EraPOS8
          </p>
        </div>

        {/* User account management */}

        <AccountManagement isExpand={isExpand} />

        {/* Menu */}
        <div className="flex-1 flex flex-col items-center gap-4 overflow-x-hidden  overflow-y-auto scrollbar-fixed">
          {pageItems.map((item, idx) => (
            <Link
              key={idx}
              title={item.title}
              href={item.path}
              className={`flex items-center font-medium group  ${isExpand ? 'gap-5' : 'gap-0'} p-2 rounded-lg transition-all duration-300 ${
                pathName === item.path
                  ? ' bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white'
                  : 'text-gray-500 hover:bg-pos-blue-50 hover:text-pos-blue-400'
              } ${isExpand ? 'w-full' : 'w-[40px] '}`}
            >
              <span>{item.icon}</span>
              <div
                className={`${isExpand ? 'max-w-full opacity-100 ' : 'max-w-0 opacity-0'} overflow-hidden transition-all duration-300`}
              >
                <p className=" shrink-0 truncate">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Settings */}
        <div className={`flex flex-col  gap-4 font-medium  items-center `}>
          <div
            className={`flex items-center font-medium group  ${isExpand ? 'gap-5' : 'gap-0'} ${isExpand ? 'w-full' : 'w-[40px] '} hover:bg-pos-blue-50 hover:text-pos-blue-400 p-2 rounded-lg transition-all duration-300`}
          >
            <Settings className="shrink-0" />
            <div
              className={`${isExpand ? 'max-w-full opacity-100 ' : 'max-w-0 opacity-0'} overflow-hidden transition-all duration-300`}
            >
              <p className=" shrink-0 truncate">Cài đặt</p>
            </div>
          </div>
          <div
            onClick={logout}
            className={`flex items-center font-medium group  ${isExpand ? 'gap-5' : 'gap-0'} ${isExpand ? 'w-full' : 'w-[40px] '} p-2 rounded-lg transition-all duration-300 cursor-pointer hover:bg-red-500 hover:text-white rounded-lg bg-red-50 text-red-500`}
          >
            <LogOut className="shrink-0" />
            <div
              className={`${isExpand ? 'max-w-full opacity-100 ' : 'max-w-0 opacity-0'} overflow-hidden transition-all duration-300 `}
            >
              <p className=" shrink-0 truncate">{loading ? <Loading /> : 'Đăng xuất'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
