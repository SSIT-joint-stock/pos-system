import { Tooltip } from '@mantine/core';
import {
  accessTokenAtom,
  currentStoreAtom,
  currentUserAtom,
} from '@repo/design-system/stores/auth';
import { getDefaultStore } from 'jotai';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Loading } from '../../../../../../../packages/design-system/src/components/ui';
import useAuth from '../../../hooks/auth/use-auth';
export default function SettingsSidebar({
  isExpand,
  setIsExpand,
  setOpenSubmenu,
}: {
  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;
  setOpenSubmenu: (index: number | null) => void;
}) {
  const { logout, loading } = useAuth();
  const store = getDefaultStore();
  return (
    <div className={`flex flex-col  gap-4 font-medium  items-center `}>
      {/* Cài đặt */}
      {/* <Tooltip
        color="rgba(125, 124, 124, 1)"
        withArrow
        transitionProps={{ transition: 'fade-right', duration: 300 }}
        label="Cài đặt"
        position="right"
        disabled={isExpand}
      >
        <div
          className={`flex items-center text-gray-600 font-medium group  hover:cursor-pointer ${isExpand ? 'gap-5' : 'gap-0'} ${isExpand ? 'w-full' : 'w-[40px] '} hover:bg-pos-blue-50 hover:text-pos-blue-400 p-2 rounded-lg transition-all duration-300`}
        >
          <Settings className="shrink-0" />
          <div
            className={`${isExpand ? 'max-w-full opacity-100 ' : 'max-w-0 opacity-0'} overflow-hidden transition-all duration-300`}
          >
            <p className=" shrink-0 truncate ">Cài đặt</p>
          </div>
        </div>
      </Tooltip> */}
      {/* Đăng xuất */}
      <Tooltip
        color="rgba(125, 124, 124, 1)"
        withArrow
        transitionProps={{ transition: 'fade-right', duration: 300 }}
        label="Đăng xuất"
        position="right"
        disabled={isExpand}
      >
        <div
          onClick={async () => {
            const success = await logout();
            if (success) {
              store.set(accessTokenAtom, '');
              store.set(currentUserAtom, null);
              store.set(currentStoreAtom, null);
            }
          }}
          className={`flex items-center font-medium group  ${isExpand ? 'gap-5' : 'gap-0'} ${isExpand ? 'w-full' : 'w-[40px] '} p-2  transition-all duration-300 cursor-pointer hover:bg-red-500 hover:text-white rounded-lg bg-red-50 text-red-500`}
        >
          <LogOut className="shrink-0" />
          <div
            className={`${isExpand ? 'max-w-full opacity-100 ' : 'max-w-0 opacity-0'} overflow-hidden transition-all duration-300 `}
          >
            <p className=" shrink-0 truncate">{loading ? <Loading /> : 'Đăng xuất'}</p>
          </div>
        </div>
      </Tooltip>
      <hr className="border-t border-t-gray-300 w-full" />
      {/* Thu gọn / Mở rộng sidebar */}
      <Tooltip
        color="rgba(125, 124, 124, 1)"
        withArrow
        transitionProps={{ transition: 'fade-right', duration: 300 }}
        label={'Mở rộng'}
        position="right"
        disabled={isExpand}
      >
        <div
          onClick={() => {
            setIsExpand(!isExpand);
            setOpenSubmenu(null);
          }}
          className={`flex text-sm text-gray-600  hover:cursor-pointer items-center font-medium group  ${isExpand ? 'gap-5' : 'gap-0'} ${isExpand ? 'w-full justify-between ' : ' w-[40px] justify-center '} hover:bg-pos-blue-50 hover:text-pos-blue-400 p-2 rounded-md transition-all duration-300`}
        >
          <div
            className={`${isExpand ? 'max-w-full opacity-100 ' : 'max-w-0 opacity-0'} overflow-hidden transition-all duration-300`}
          >
            <p className=" shrink-0 truncate">Thu gọn</p>
          </div>
          {isExpand ? <ChevronLeft size={16} /> : <ChevronRight size={16} className="shrink-0" />}
        </div>
      </Tooltip>
    </div>
  );
}
