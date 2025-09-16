import { LogOut, Settings } from "lucide-react";
import { Loading } from "../../ui";
import useAuth from "../../../../../../apps/web/main/src/hooks/auth/useAuth";
export default function SettingsSidebar({ isExpand }: { isExpand: boolean }) {
  const { logout, loading } = useAuth();

  return (
    <div className={`flex flex-col  gap-4 font-medium  items-center `}>
      <div
        className={`flex items-center font-medium group  ${isExpand ? "gap-5" : "gap-0"} ${isExpand ? "w-full" : "w-[40px] "} hover:bg-pos-blue-50 hover:text-pos-blue-400 p-2 rounded-lg transition-all duration-300`}
      >
        <Settings className="shrink-0" />
        <div
          className={`${isExpand ? "max-w-full opacity-100 " : "max-w-0 opacity-0"} overflow-hidden transition-all duration-300`}
        >
          <p className=" shrink-0 truncate">Cài đặt</p>
        </div>
      </div>
      <div
        onClick={logout}
        className={`flex items-center font-medium group  ${isExpand ? "gap-5" : "gap-0"} ${isExpand ? "w-full" : "w-[40px] "} p-2 rounded-lg transition-all duration-300 cursor-pointer hover:bg-red-500 hover:text-white rounded-lg bg-red-50 text-red-500`}
      >
        <LogOut className="shrink-0" />
        <div
          className={`${isExpand ? "max-w-full opacity-100 " : "max-w-0 opacity-0"} overflow-hidden transition-all duration-300 `}
        >
          <p className=" shrink-0 truncate">{loading ? <Loading /> : "Đăng xuất"}</p>
        </div>
      </div>
    </div>
  );
}
