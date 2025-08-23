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

export function SideBar({
  isExpand,
  setIsExpand,
}: {
  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;
}) {
  const pathName = usePathname();

  return (
    <div
      className={`h-full relative  flex flex-col bg-white overflow-x-none shadow-[4px_0_6px_rgba(0,0,0,0.1)] transition-all duration-200 ${isExpand ? "w-56" : "w-20"} }`}>
      {/* Toggle button */}
      <div className="w-fit absolute top-1/2 -translate-y-1/2  -right-3.5 flex justify-end">
        <button
          className="p-2 rounded-xl bg-pos-blue-50  group cursor-pointer duration-200  transition-all"
          onClick={() => setIsExpand(!isExpand)}>
          {isExpand ? (
            <ArrowLeft size={18} className="text-pos-blue-400 " />
          ) : (
            <ArrowRight size={18} className="  text-pos-blue-400" />
          )}
        </button>
      </div>

      {/* Menu items */}
      <div className=" h-full flex flex-col  p-4">
        {/* Should be to component */}
        <div className={`flex h-fit items-center overflow-hidden gap-4 `}>
          <Image
            width={38}
            height={38}
            src={"/logo.jpg"}
            alt="logo"
            className={`shrink-0 w-fit object-cover ${isExpand === false && "flex items-center justify-center"}`}
          />
          <p
            className={` ${isExpand === false && "hidden"} text-xl font-medium text-gray-800 `}>
            EraPOS8
          </p>
        </div>

        {/* User account management */}
        <div
          className={`py-3 border-y border-y-gray-100 mt-2 mb-4 flex items-center gap-4   ${isExpand === true ? "hover:bg-gray-50" : ""} transition-colors duration-200 cursor-pointer`}>
          <Image
            src={"/avatar.png"}
            width={40}
            height={40}
            alt="avatar"
            className="w-10 h-10 rounded-full shrink-0"
          />
          <div
            className={`flex flex-col gap-1 transition-all duration-300 overflow-hidden ${
              isExpand ? "max-w-[156px] opacity-100" : "max-w-0 opacity-0"
            }`}>
            <h2 className="text-sm font-medium text-gray-800 truncate">
              Tran Huu Thanh
            </h2>
            <p className="text-xs text-gray-500 truncate">Quản trị viên</p>
          </div>
          <ChevronDown
            size={18}
            className={`transition-transform duration-300  text-gray-500 ${
              isExpand ? "rotate-0" : "-rotate-90"
            }`}
          />
        </div>

        {/* Menu */}
        <div className="flex-1 flex flex-col items-center gap-4 overflow-x-hidden  overflow-y-auto scrollbar-fixed">
          {pageItems.map((item, idx) => (
            <Link
              key={idx}
              title={item.title}
              href={item.path}
              className={`flex items-center font-medium group text-base gap-5 p-2 rounded-lg transition-all duration-200 ${
                pathName === item.path
                  ? "bg-pos-blue-50 text-pos-blue-400"
                  : "text-gray-500 hover:bg-pos-blue-50 hover:text-pos-blue-400"
              } ${isExpand && "w-full"}`}>
              <span>{item.icon}</span>
              {isExpand && <p className="shrink-0">{item.title}</p>}
            </Link>
          ))}
        </div>

        {/* Settings */}
        <hr className="border border-gray-100" />
        <div
          className={`flex flex-col gap-4 mt-4 font-medium text-base ${isExpand === false && "items-center"} `}>
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
