"use client";
import { BadgeDollarSign, LayoutDashboard, ArrowLeft, ArrowRight, Settings, LogOut, WalletMinimal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pageItems = [
  { title: "Tổng quan", path: "/dashboard", icon: <LayoutDashboard className="shrink-0" /> },
  { title: "Quản lý sản phẩm", path: "/manage", icon: <BadgeDollarSign className="shrink-0" /> },
  { title: "Bán hàng", path: "/manage", icon: <WalletMinimal className="shrink-0" /> },
  { title: "Cài đặt", path: "/manage", icon: <Settings className="shrink-0" /> },
  { title: "Đăng xuất", path: "/manage", icon: <LogOut className="shrink-0" /> },
  { title: "Đăng xuất", path: "/manage", icon: <LogOut className="shrink-0" /> },
  { title: "Đăng xuất", path: "/manage", icon: <LogOut className="shrink-0" /> },
  { title: "Đăng xuất", path: "/manage", icon: <LogOut className="shrink-0" /> },
];

export function SideBar({ isExpand, setIsExpand }: { isExpand: boolean; setIsExpand: (isExpand: boolean) => void }) {
  const pathName = usePathname();
  console.log(isExpand);
  return (
    <div
      className={`h-full relative  flex flex-col bg-white overflow-x-none shadow-[4px_0_6px_rgba(0,0,0,0.1)] transition-all duration-200 ${isExpand ? "max-w-[268px]" : "w-[88px]"} }`}
    >
      {/* Logo + toggle */}

      <div className="w-full absolute top-1/2 -translate-y-1/2  -right-4 flex justify-end">
        <button
          className="p-2 rounded-xl bg-pos-blue-50  group cursor-pointer duration-200  transition-all"
          onClick={() => setIsExpand(!isExpand)}
        >
          {isExpand ? (
            <ArrowLeft size={18} className="text-pos-blue-400 " />
          ) : (
            <ArrowRight size={18} className="  text-pos-blue-400" />
          )}
        </button>
      </div>

      {/* Menu items */}
      <div className=" h-full flex flex-col  p-4">
        <div className="flex-1 flex flex-col items-center gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-50 scrollbar-track-transparent ">
          {pageItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.path}
              className={`flex items-center font-medium group text-base gap-5 p-2 rounded-lg transition-all duration-200 ${
                pathName === item.path
                  ? "bg-pos-blue-50 text-pos-blue-400"
                  : "text-gray-500 hover:bg-pos-blue-50 hover:text-pos-blue-400"
              } ${isExpand ? "w-full" : "w-[40px] justify-center"}`}
            >
              <span>{item.icon}</span>
              {isExpand && <p className="shrink-0">{item.title}</p>}
            </Link>
          ))}
        </div>
        <hr className="border border-gray-100" />
        <div className={`flex flex-col gap-4 mt-4 font-medium text-base ${isExpand === false && "items-center"} `}>
          <button className="flex items-center font-medium cursor-pointer group text-base text-gray-500 gap-5 p-2 rounded-lg hover:bg-pos-blue-50 hover:text-pos-blue-400 transition-colors duration-200  ">
            <Settings />
            {isExpand && <span className="shrink-0">Cài đặt</span>}
          </button>
          <button className="flex items-center font-medium cursor-pointer group text-base gap-5 p-2 rounded-lg bg-red-50 text-red-500  ">
            <LogOut />
            {isExpand && <span className="shrink-0">Đăng xuất</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
