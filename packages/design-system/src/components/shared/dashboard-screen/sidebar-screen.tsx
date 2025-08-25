"use client";
import {
  BadgeDollarSign,
  LayoutDashboard,
  ArrowLeft,
  ArrowRight,
  Settings,
  LogOut,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/Image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pageItems = [
  {
    title: "Tổng quan",
    path: "/dashboard",
    icon: <LayoutDashboard className="shrink-0" />,
  },
  {
    title: "Quản lý sản phẩm",
    path: "/manage",
    icon: <BadgeDollarSign className="shrink-0" />,
  },
  {
    title: "Bán hàng",
    path: "/sales",
    icon: <ShoppingCart className="shrink-0" />,
  },
];

export function SideBar({ isExpand, setIsExpand }: { isExpand: boolean; setIsExpand: (isExpand: boolean) => void }) {
  const pathName = usePathname();
  const [isOpnen, setIsOpen] = useState(false);

  return (
    <div
      className={`h-screen relative  flex flex-col bg-white overflow-x-none shadow-[4px_0_6px_rgba(0,0,0,0.1)] transition-all duration-500 ${isExpand ? "w-56" : "w-20"} }`}
    >
      {/* Toggle button */}
      <div className="w-fit absolute top-1/2 -translate-y-1/2  -right-3.5 flex justify-end">
        <button
          className="p-2 rounded-xl bg-pos-blue-50  hover:bg-pos-blue-500 group cursor-pointer duration-500  transition-all"
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
      <div className=" h-full flex flex-col gap-5 p-4">
        {/* Should be to component */}
        <div className={`flex  h-fit items-center overflow-hidden gap-4 `}>
          <Image
            width={38}
            height={38}
            src={"/logo.jpg"}
            alt="logo"
            className={`shrink-0 w-fit object-cover ${isExpand === false && "flex items-center justify-center"}`}
          />
          <p className={` ${isExpand === false && "hidden"} text-xl font-medium text-gray-800 `}>EraPOS8</p>
        </div>

        {/* User account management */}

        <div
          className={`flex items-center justify-center ${isExpand ? "w-full" : "w-[40px] "} ${isExpand ? "gap-5" : "gap-0"} w-full transition-all duration-500 `}
        >
          <Image
            src={"/avatar.png"}
            width={40}
            height={40}
            alt="avatar"
            className="w-10 h-10 rounded-full shrink-0 overflow-hidden object-cover "
          />
          <div
            className={`flex ${isExpand ? "max-w-full opacity-100" : "max-w-0 opacity-0"} gap-5 overflow-hidden transition-all duration-500 items-center `}
          >
            <div
              className={`flex flex-col gap-1 transition-all duration-500 overflow-hidden ${
                isExpand ? "max-w-full opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              <h2 className="text-sm font-medium text-gray-800 truncate">Tran Huu Thanh</h2>
              <p className="text-xs text-gray-500 truncate">Quản trị viên</p>
            </div>
            <ChevronDown
              onClick={() => setIsOpen(!isOpnen)}
              size={18}
              className={` transition-transform duration-500  text-gray-500 ${isExpand ? "rotate-0" : "-rotate-90"}`}
            />
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 flex flex-col items-center gap-4 overflow-x-hidden  overflow-y-auto scrollbar-fixed">
          {pageItems.map((item, idx) => (
            <Link
              key={idx}
              title={item.title}
              href={item.path}
              className={`flex items-center font-medium group  ${isExpand ? "gap-5" : "gap-0"} p-2 rounded-lg transition-all duration-500 ${
                pathName === item.path
                  ? " bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white"
                  : "text-gray-500 hover:bg-pos-blue-50 hover:text-pos-blue-400"
              } ${isExpand ? "w-full" : "w-[40px] "}`}
            >
              <span>{item.icon}</span>
              <div
                className={`${isExpand ? "max-w-full opacity-100 " : "max-w-0 opacity-0"} overflow-hidden transition-all duration-500`}
              >
                <p className=" shrink-0 truncate">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Settings */}
        <div className={`flex flex-col  gap-4 font-medium  items-center `}>
          <div
            className={`flex items-center font-medium group  ${isExpand ? "gap-5" : "gap-0"} ${isExpand ? "w-full" : "w-[40px] "} hover:bg-pos-blue-50 hover:text-pos-blue-400 p-2 rounded-lg transition-all duration-500`}
          >
            <Settings className="shrink-0" />
            <div
              className={`${isExpand ? "max-w-full opacity-100 " : "max-w-0 opacity-0"} overflow-hidden transition-all duration-500`}
            >
              <p className=" shrink-0 truncate">Cài đặt</p>
            </div>
          </div>
          <div
            className={`flex items-center font-medium group  ${isExpand ? "gap-5" : "gap-0"} ${isExpand ? "w-full" : "w-[40px] "} p-2 rounded-lg transition-all duration-500 cursor-pointer hover:bg-red-500 hover:text-white rounded-lg bg-red-50 text-red-500`}
          >
            <LogOut className="shrink-0" />
            <div
              className={`${isExpand ? "max-w-full opacity-100 " : "max-w-0 opacity-0"} overflow-hidden transition-all duration-500 `}
            >
              <p className=" shrink-0 truncate">Đăng xuất</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
