import { currentStoreAtom } from "@repo/design-system/stores/auth";
import { useAtom } from "jotai";
import {
  BadgeDollarSign,
  ChevronRight,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { title } from "process";
export default function MenuSidebar({
  isExpand,
  setIsExpand,
  openSubmenu,
  setOpenSubmenu,
}: {
  isExpand: boolean;
  setIsExpand: (isExpand: boolean) => void;
  openSubmenu: number | null;
  setOpenSubmenu: (openSubmenu: number | null) => void;
}) {
  const pathName = usePathname();

  const [currentStore] = useAtom(currentStoreAtom);

  const pageItems = [
    {
      title: "Tổng quan",
      path: `/dashboard/store/${currentStore?.id}/overview`,
      icon: <LayoutDashboard className="shrink-0" />,
    },
    {
      title: "Quản lý kho",
      icon: <BadgeDollarSign className="shrink-0" />,
      children: [
        {
          title: "Sản phẩm",
          path: `/dashboard/store/${currentStore?.id}/manage-products`,
        },
        {
          title: "Hàng tồn kho",
          path: `/dashboard/store/${currentStore?.id}/manage-inventory`,
        },
        {
          title: "Danh mục",
          path: `/dashboard/store/${currentStore?.id}/manage-categories`,
        },
        {
          title: "Biến động kho",
          path: `/dashboard/store/${currentStore?.id}/manage-stock`,
        },
      ],
    },
    {
      title: "Bán hàng",
      path: `/dashboard/store/${currentStore?.id}/sales`,
      icon: <ShoppingCart className="shrink-0" />,
    },
    {
      title: "Đơn hàng",
      path: `/dashboard/store/${currentStore?.id}/orders`,
      icon: <PackageSearch className="shrink-0" />,
    },
    {
      title: "Cửa hàng",
      icon: <Store className="shrink-0" />,
      children: [
        {
          title: "Thông tin cửa hàng",
          path: `/dashboard/store/${currentStore?.id}/store-info`,
        },
        {
          title: "Quản lý cửa hàng",
          path: `/dashboard/store/${currentStore?.id}/manage-stores`,
        },
      ],
    },
    {
      title: "Quản lý nhân viên",
      path: `/dashboard/store/${currentStore?.id}/employees`,
      icon: <Users className="shrink-0" />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-start gap-4 overflow-x-hidden overflow-y-auto  w-full">
      {pageItems.map((item, idx) => {
        if (item.children) {
          return (
            // Submenu item has children
            <div key={idx} className="flex flex-col w-full">
              <button
                onClick={() => {
                  setIsExpand(true);
                  setOpenSubmenu(openSubmenu === idx ? null : idx);
                }}
                className={`flex cursor-pointer items-center gap-5 p-2 rounded-lg transition-all duration-300 w-full font-medium
    ${isExpand === false ? "flex items-center justify-center" : ""}
    ${
      item.children.some((child) => child.path === pathName)
        ? "bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white"
        : "text-gray-500 hover:bg-pos-blue-50 hover:text-pos-blue-400"
    }`}
              >
                <span className="font-medium">{item.icon}</span>
                {isExpand && <p className="truncate font-medium">{item.title}</p>}
                {isExpand && (
                  <ChevronRight
                    size={16}
                    className={`ml-auto transition-transform duration-300 ${openSubmenu === idx ? "rotate-90" : ""}`}
                  />
                )}
              </button>
              {/* Submenu dropdown */}
              <div
                className={`flex flex-col pl-4 gap-1 transition-all duration-300 border-l border-l-gray-400 ${isExpand && openSubmenu === idx ? "max-h-40 opacity-100 visible mt-2 " : "max-h-0 opacity-0 p-0 invisible mt-0"}`}
              >
                {item.children.map((child, cIdx) => (
                  <Link
                    key={cIdx}
                    href={child.path}
                    className={`text-sm font-medium rounded-md p-2  ${child.path === pathName ? "bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white" : "text-gray-500 hover:bg-pos-blue-50 hover:text-pos-blue-400"}`}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        }
        // Submenu item has no children
        return (
          <Link
            key={idx}
            href={item.path}
            className={`flex items-center gap-5 p-2 rounded-lg  transition-all duration-300 w-full font-medium ${isExpand === false && "flex items-center justify-center"}   ${item.path === pathName ? "bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white" : "text-gray-500 hover:bg-pos-blue-50 hover:text-pos-blue-400"}`}
          >
            <span>{item.icon}</span>
            {isExpand && <p className="truncate">{item.title}</p>}
          </Link>
        );
      })}
    </div>
  );
}
