import { Tooltip } from '@mantine/core';
import { currentStoreAtom, currentUserAtom } from '@repo/design-system/stores/auth';
import { useAtom } from 'jotai';
import {
  BookUser,
  ChartSpline,
  ChevronRight,
  HandCoins,
  LayoutDashboard,
  Package,
  PackageSearch,
  PiggyBank,
  ShoppingCart,
  Store,
  Truck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

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
  const [currentUser] = useAtom(currentUserAtom);
  const isOwner = currentUser?.id === currentStore?.owner_id;
  console.log(currentUser);

  // Định nghĩa cấu trúc Group
  const menuGroups = [
    {
      groupLabel: 'Hoạt động',
      items: [
        {
          title: 'Tổng quan',
          path: `/dashboard/store/${currentStore?.id}/overview`,
          icon: <LayoutDashboard size={20} className="shrink-0" />,
        },
        {
          title: 'Bán hàng',
          path: `/dashboard/store/${currentStore?.id}/sales`,
          icon: <ShoppingCart size={20} className="shrink-0" />,
        },
      ],
    },
    {
      groupLabel: 'Hàng hóa & Kho',
      items: [
        {
          title: 'Quản lý kho',
          icon: <Package size={20} className="shrink-0" />,
          id: 1, // Dùng ID để handle openSubmenu chính xác hơn index mảng
          children: [
            {
              title: 'Hàng tồn kho',
              path: `/dashboard/store/${currentStore?.id}/manage-inventory`,
            },
            {
              title: 'Sản phẩm',
              path: `/dashboard/store/${currentStore?.id}/manage-products`,
            },
            {
              title: 'Nhóm sản phẩm',
              path: `/dashboard/store/${currentStore?.id}/manage-product-combos`,
            },
            {
              title: 'Danh mục',
              path: `/dashboard/store/${currentStore?.id}/manage-categories`,
            },
          ],
        },
        {
          title: 'Phiếu kho',
          icon: <Truck size={20} className="shrink-0" />,
          id: 2,
          children: [
            {
              title: 'Phiếu nhập hàng',
              path: `/dashboard/store/${currentStore?.id}/purchase-orders`,
            },
            {
              title: 'Phiếu trả hàng nhập',
              path: `/dashboard/store/${currentStore?.id}/outbound-orders`,
            },
            {
              title: 'Phiếu trả hàng bán',
              path: `/dashboard/store/${currentStore?.id}/returned-orders`,
            },
          ],
        },
        {
          title: 'Biến động kho',
          path: `/dashboard/store/${currentStore?.id}/manage-stock`,
          icon: <PackageSearch size={20} className="shrink-0" />,
        },
      ],
    },
    {
      groupLabel: 'Tài chính & Đối tác',
      items: [
        {
          title: 'Hóa đơn',
          icon: <HandCoins size={20} className="shrink-0" />,
          id: 3,
          children: [
            {
              title: 'Hóa đơn bán',
              path: `/dashboard/store/${currentStore?.id}/sales-invoices`,
            },
            {
              title: 'Hóa đơn nhập',
              path: `/dashboard/store/${currentStore?.id}/import-invoices`,
            },
            {
              title: 'Hóa đơn trả (NCC)',
              path: `/dashboard/store/${currentStore?.id}/export-invoices`,
            },
            {
              title: 'Hóa đơn trả (KH)',
              path: `/dashboard/store/${currentStore?.id}/returned-invoices`,
            },
          ],
        },
        {
          title: 'Sổ quỹ',
          path: `/dashboard/store/${currentStore?.id}/cash-book`,
          icon: <PiggyBank size={20} className="shrink-0" />,
        },
        {
          title: 'Danh bạ',
          icon: <BookUser size={20} className="shrink-0" />,
          id: 4,
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
        {
          isOwnerLook: true,
          title: 'Nhân viên',
          path: `/dashboard/store/${currentStore?.id}/employees`,
          icon: <Users size={20} className="shrink-0" />,
        },
      ],
    },
    {
      groupLabel: 'Báo cáo',
      items: [
        {
          title: 'Báo cáo',
          icon: <ChartSpline size={20} className="shrink-0" />,
          id: 5,
          children: [
            {
              title: 'Tổng quan báo cáo',
              path: `/dashboard/store/${currentStore?.id}/report-overview`,
            },
            {
              title: 'Danh sách báo cáo',
              path: `/dashboard/store/${currentStore?.id}/report-list`,
            },
          ],
        },
        {
          title: 'Cửa hàng',
          icon: <Store size={20} className="shrink-0" />,
          id: 6,
          children: [
            {
              title: 'Thông tin cửa hàng',
              path: `/dashboard/store/${currentStore?.id}/store-info`,
            },
            {
              title: 'Quản lý chuỗi',
              path: `/dashboard/store/${currentStore?.id}/manage-stores`,
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Kế toán và thuế',
      items: [],
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-start gap-2 overflow-x-hidden overflow-y-scroll scrollbar-none w-full py-2">
      {menuGroups
        // .filter((group) => {
        //   if (!isOwner) return false;
        //   return true;
        // })
        .map((group, groupIdx) => (
          <React.Fragment key={groupIdx}>
            {/* Group Title - Chỉ hiện khi mở rộng sidebar */}
            {isExpand && (
              <div className={`px-4 mt-4 mb-2 first:mt-0 w-full`}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-nowrap">
                  {group.groupLabel}
                </p>
              </div>
            )}

            {/* Group Divider - Hiện khi thu nhỏ sidebar để ngăn cách các nhóm icon */}
            {!isExpand && groupIdx !== 0 && (
              <div className="w-8 h-[1px] bg-gray-200 mx-auto my-1 rounded-full" />
            )}

            {/* Render Items trong Group */}
            {group.items
              .filter((item) => !item.isOwnerLook || isOwner)
              .map((item, idx) => {
                // Unique key cho map, kết hợp index nhóm và index item
                const uniqueKey = `${groupIdx}-${idx}`;
                // Sử dụng item.id nếu có cho submenu, nếu không thì dùng index tạm (lưu ý logic id)
                const itemId = item.id || -1;

                if (item.children) {
                  return (
                    <div key={uniqueKey} className="flex flex-col w-full">
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
                            setOpenSubmenu(openSubmenu === itemId ? null : itemId);
                          }}
                          className={`flex cursor-pointer items-center gap-5 p-2 rounded-sm transition-all duration-300 w-full font-medium
                        ${!isExpand ? 'justify-center' : ''}
                        ${
                          item.children.some((child) => pathName?.startsWith(child.path))
                            ? 'bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white shadow-sm'
                            : 'text-gray-800 hover:bg-pos-blue-50 hover:text-pos-blue-600'
                        }`}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          {isExpand && (
                            <>
                              <p className="truncate font-medium text-sm flex-1 text-left">
                                {item.title}
                              </p>
                              <ChevronRight
                                size={16}
                                className={`transition-transform duration-300 ${
                                  openSubmenu === itemId ? 'rotate-90' : ''
                                }`}
                              />
                            </>
                          )}
                        </button>
                      </Tooltip>

                      {/* Submenu Dropdown */}
                      <div
                        className={`flex flex-col gap-1 transition-all duration-300 overflow-hidden
                      ${
                        isExpand && openSubmenu === itemId
                          ? 'max-h-[500px] opacity-100 mt-1 border-l border-gray-300 pl-2'
                          : 'max-h-0 opacity-0'
                      }`}
                      >
                        {item.children.map((child, cIdx) => (
                          <Link
                            key={cIdx}
                            href={child.path}
                            className={`text-sm font-medium rounded-sm py-2 px-3 block transition-colors
                          ${
                            child.path === pathName || pathName?.startsWith(child.path)
                              ? 'text-pos-blue-600 bg-pos-blue-50'
                              : 'text-gray-800 hover:text-pos-blue-500 hover:bg-gray-50'
                          }`}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Item không có con (Single Item)
                return (
                  <Tooltip
                    withArrow
                    color="rgba(125, 124, 124, 1)"
                    transitionProps={{ transition: 'fade-right', duration: 300 }}
                    label={item.title}
                    position="right"
                    disabled={isExpand}
                    key={uniqueKey}
                  >
                    <Link
                      href={item.path!}
                      className={`flex items-center gap-5 p-2 rounded-sm transition-all duration-300 w-full font-medium
                    ${!isExpand ? 'justify-center' : ''}
                    ${
                      item.path === pathName
                        ? 'bg-gradient-to-r from-pos-blue-500 to-pos-blue-700 text-white shadow-sm'
                        : 'text-gray-800 hover:bg-pos-blue-50 hover:text-pos-blue-600'
                    }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {isExpand && <p className="truncate text-sm">{item.title}</p>}
                    </Link>
                  </Tooltip>
                );
              })}
          </React.Fragment>
        ))}
    </div>
  );
}
