import { Tooltip } from '@mantine/core';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtom } from 'jotai';
import {
  BookUser,
  ChevronRight,
  LayoutDashboard,
  Package,
  PackageSearch,
  ShoppingCart,
  Store,
  Users,
  Truck,
  Receipt,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  console.log(pathName);

  const [currentStore] = useAtom(currentStoreAtom);

  const pageItems = [
    {
      title: 'Tổng quan',
      path: `/dashboard/store/${currentStore?.id}/overview`,
      icon: <LayoutDashboard size={20} className="shrink-0" />,
    },
    {
      title: 'Quản lý kho',
      icon: <Package size={20} className="shrink-0" />,
      children: [
        {
          title: 'Sản phẩm',
          path: `/dashboard/store/${currentStore?.id}/manage-products`,
        },
        // {
        //   title: 'Đơn vị tính',
        //   path: `/dashboard/store/${currentStore?.id}/manage-product-units`,
        // },
        {
          title: 'Nhóm sản phẩm',
          path: `/dashboard/store/${currentStore?.id}/manage-product-combos`,
        },
        {
          title: 'Danh mục',
          path: `/dashboard/store/${currentStore?.id}/manage-categories`,
        },
        // {
        //   title: 'Hàng tồn kho',
        //   path: `/dashboard/store/${currentStore?.id}/manage-inventory`,
        // },
      ],
    },

    {
      title: 'Phiếu kho',
      icon: <Truck size={20} className="shrink-0" />,
      children: [
        {
          title: 'Phiếu nhập hàng',
          path: `/dashboard/store/${currentStore?.id}/purchase-orders`,
        },
        {
          title: 'Phiếu xuất hàng',
          path: `/dashboard/store/${currentStore?.id}/outbound-orders`,
        },
      ],
    },
    {
      title: 'Giao dịch',
      icon: <Receipt size={20} className="shrink-0" />,
      children: [
        {
          title: 'Hóa đơn bán hàng',
          path: `/dashboard/store/${currentStore?.id}/sales-invoices`,
        },
        {
          title: 'Hóa đơn phiếu',
          path: `/dashboard/store/${currentStore?.id}/received-invoices`,
        },
        {
          title: 'Hóa đơn trả hàng',
          path: `/dashboard/store/${currentStore?.id}/returned-invoices`,
        },
      ],
    },

    {
      title: 'Bán hàng',
      path: `/dashboard/store/${currentStore?.id}/sales`,
      icon: <ShoppingCart size={20} className="shrink-0" />,
    },
    {
      title: 'Cửa hàng',
      icon: <Store size={20} className="shrink-0" />,
      children: [
        {
          title: 'Thông tin cửa hàng',
          path: `/dashboard/store/${currentStore?.id}/store-info`,
        },
        {
          title: 'Quản lý cửa hàng',
          path: `/dashboard/store/${currentStore?.id}/manage-stores`,
        },
      ],
    },

    {
      title: 'Biến động kho',
      path: `/dashboard/store/${currentStore?.id}/manage-stock`,
      icon: <PackageSearch size={20} className="shrink-0" />,
    },

    {
      title: 'Nhân viên',
      path: `/dashboard/store/${currentStore?.id}/employees`,
      icon: <Users size={20} className="shrink-0" />,
    },

    {
      title: 'Danh bạ',
      icon: <BookUser size={20} className="shrink-0" />,
      children: [
        {
          title: 'Khách hàng',
          path: `/dashboard/store/${currentStore?.id}/manage-customers`,
        },
        {
          title: 'Nhà cung cấp',
          path: `/dashboard/store/${currentStore?.id}/manage-suppliers`,
        },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-start gap-4 overflow-x-hidden overflow-y-scroll scrollbar-none  w-full ">
      {pageItems.map((item, idx) => {
        if (item.children) {
          return (
            // Submenu item has children
            <div key={idx} className="flex flex-col w-full">
              <Tooltip
                color="rgba(125, 124, 124, 1)"
                withArrow
                transitionProps={{ transition: 'fade-right', duration: 300 }}
                label={item.title}
                position="right"
                disabled={isExpand}
              >
                <button
                  onClick={() => {
                    setIsExpand(true);
                    setOpenSubmenu(openSubmenu === idx ? null : idx);
                  }}
                  className={`flex cursor-pointer items-center gap-5 p-2 rounded-sm transition-all duration-300 w-full font-medium
    ${isExpand === false ? 'flex items-center justify-center' : ''}
    ${
      item.children.some((child) => pathName?.startsWith(child.path))
        ? 'bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white'
        : 'text-gray-700 hover:bg-pos-blue-50 hover:text-pos-blue-400'
    }`}
                >
                  <span className="font-medium">{item.icon}</span>
                  {isExpand && <p className="truncate font-medium text-base">{item.title}</p>}
                  {isExpand && (
                    <ChevronRight
                      size={16}
                      className={`ml-auto transition-transform duration-300 ${openSubmenu === idx ? 'rotate-90' : ''}`}
                    />
                  )}
                </button>
              </Tooltip>
              {/* Submenu dropdown */}
              <div
                className={`flex flex-col pl-4 gap-1 transition-all duration-300 border-l border-l-gray-400 ${isExpand && openSubmenu === idx ? 'max-h-40 opacity-100 visible mt-2 ' : 'max-h-0 opacity-0 p-0 invisible mt-0'}`}
              >
                {item.children.map((child, cIdx) => (
                  <Link
                    key={cIdx}
                    href={child.path}
                    className={`text-sm font-medium rounded-md p-2  ${child.path === pathName || pathName?.startsWith(child.path) ? 'bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white' : 'text-gray-700 hover:bg-pos-blue-50 hover:text-pos-blue-400'}`}
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
          <Tooltip
            withArrow
            color="rgba(125, 124, 124, 1)"
            transitionProps={{ transition: 'fade-right', duration: 300 }}
            label={item.title}
            position="right"
            disabled={isExpand}
            key={idx}
          >
            <Link
              key={idx}
              href={item.path}
              className={`flex items-center gap-5 p-2 rounded-sm  transition-all duration-300 w-full font-medium ${isExpand === false && 'flex items-center justify-center'}   ${item.path === pathName ? 'bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white' : 'text-gray-700 hover:bg-pos-blue-50 hover:text-pos-blue-400'}`}
            >
              <span>{item.icon}</span>
              {isExpand && <p className="truncate text-base">{item.title}</p>}
            </Link>
          </Tooltip>
        );
      })}
    </div>
  );
}
