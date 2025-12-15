'use client';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
import { Input, Modal, Table } from '@repo/design-system/components/ui';
import {
  Download,
  Package,
  ShoppingCart,
  DollarSignIcon,
  ArrowLeftCircle,
  ArrowRightCircle,
  Upload,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '../../../../../main/src/utils';
import { DisplayField } from '../components/display-field';
import { DataActionBar } from '../components/data-action-bar';
import { ActionButtons } from '../components/action-buttons';
import { useStockMovement } from '../../../../../main/src/hooks/stock-movement/use-stock-movement';
import { StockMovement } from '@repo/design-system/types/stock-movement';

const tableHeaders = [
  'Mã sản phẩm',
  'Sản phẩm',
  'Giá trị',
  'Trạng thái',
  // 'Số lượng',
  'Ngày tạo',
  'Thao tác',
];

// Màu sắc cho các loại phiếu kho
const typeColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  ADJUSTMENT: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: <Package size={14} />,
  },
  PURCHASE: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: <ShoppingCart size={14} />,
  },
  SALE: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: <DollarSignIcon size={14} />,
  },
  RETURN_PURCHASE: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: <ArrowLeftCircle size={14} />,
  },
  RETURN_SALE: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    icon: <ArrowRightCircle size={14} />,
  },
  TRANSFER_IMPORT: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    icon: <Download size={14} />,
  },
  TRANSFER_EXPORT: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    icon: <Upload size={14} />,
  },
};
const formatMovementType = (type: string) => {
  const translations: Record<string, string> = {
    ADJUSTMENT: 'Điều chỉnh kho',
    PURCHASE: 'Nhập hàng từ nhà cung cấp',
    SALE: 'Bán hàng cho khách hàng',
    RETURN_PURCHASE: 'Trả hàng cho nhà cung cấp',
    RETURN_SALE: 'Nhận hàng trả từ khách hàng',
    TRANSFER_IMPORT: 'Nhập hàng từ kho khác',
    TRANSFER_EXPORT: 'Xuất hàng sang kho khác',
  };
  return translations[type] || type;
};

export function ManageStockView() {
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement>({} as StockMovement);

  const {
    pagination,
    movements,
    loading,
    currentStore,
    paginationParams,
    filters,
    setFilters,
    handleGetStockMovement,
    setPaginationParams,
  } = useStockMovement();
  // Định dạng loại phiếu

  useEffect(() => {
    if (!currentStore?.id) return;
    handleGetStockMovement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id, paginationParams, filters]);
  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Quản lý biến động kho" />

        {/* THANH HÀNH ĐỘNG */}
        <DataActionBar
          placeholderSearch="Tìm kiếm mã lô hàng, tên khách hàng"
          statusOptions={[
            {
              width: '280px',
              key: 'type',
              label: 'Trạng thái kho hàng',
              options: [
                { value: 'ADJUSTMENT', label: 'Điều chỉnh kho ' },
                { value: 'PURCHASE', label: 'Nhập hàng từ nhà cung cấp' },
                { value: 'SALE', label: 'Bán hàng cho khách hàng' },
                { value: 'RETURN_PURCHASE', label: 'Trả hàng cho nhà cung cấp' },
                { value: 'RETURN_SALE', label: 'Nhận hàng trả từ khách hàng' },
                { value: 'TRANSFER_IMPORT', label: 'Nhập hàng từ kho khác' },
                { value: 'TRANSFER_EXPORT', label: 'Xuất hàng sang kho khác' },
              ],
            },
          ]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              type: newFilters.type,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
        />

        {/* BẢNG */}
        <Table
          total={pagination?.total}
          page={pagination?.page}
          totalPages={pagination?.totalPages}
          limit={pagination?.limit}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageSizeChange={(size) =>
            setPaginationParams((prev) => ({
              ...prev,
              limit: size,
            }))
          }
          onPageChange={(page) =>
            setPaginationParams((prev) => ({
              ...prev,
              page,
            }))
          }
          tableHeaders={tableHeaders}
          data={movements}
          isLoading={loading}
          renderRow={(movement) => (
            <>
              <td className="px-4 py-3 text-sm font-semibold text-blue-600 hover:underline cursor-pointer text-nowrap">
                {movement?.variants?.sku}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-600">
                {movement.variants?.name}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {formatCurrency(movement.variants?.price || 0)}
              </td>
              <td className="px-0.5 py-2">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 w-fit ${typeColors[movement.type]?.bg} ${typeColors[movement.type]?.text}`}
                >
                  {typeColors[movement.type]?.icon}
                  {formatMovementType(movement.type)}
                </span>
              </td>
              {/* <td className="px-4 py-3 text-sm font-bold">
                <span
                  className={`${STOCK_MOVEMENT_CONFIG[movement.type].usesAbsoluteValue ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}
                >
                  {STOCK_MOVEMENT_CONFIG[movement.type].isIncoming
                    ? movement.quantity
                    : -movement.quantity}
                </span>
              </td> */}
              <td className="px-4 py-3 text-sm text-gray-500">
                {formatDate(movement.createdAt, { showTime: true })}
              </td>
              <td>
                <ActionButtons
                  onView={() => {
                    setSelectedMovement(movement);
                    setOpenViewModal(true);
                  }}
                />
              </td>
            </>
          )}
        />
      </DashboardViewLayout>
      <Modal
        opened={openViewModal}
        size="lg"
        title={<h2 className="text-base font-semibold text-gray-900">Chi tiết biến động</h2>}
        onClose={() => setOpenViewModal(false)}
      >
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center ">
            <p className="text-base font-semibold flex-1">Sản phẩm</p>
            <Input readOnly className="flex-1" size="sm" value={selectedMovement?.variants?.name} />
          </div>
          <div className="flex items-center ">
            <p className="text-base font-semibold flex-1">Số tiền</p>
            <Input
              readOnly
              className="flex-1"
              size="sm"
              value={formatCurrency(selectedMovement?.variants?.price || 0)}
            />
          </div>
          <div className="flex items-center ">
            <p className="text-base font-semibold flex-1">Loại biến động</p>
            <Input
              readOnly
              className="flex-1"
              size="sm"
              value={formatMovementType(selectedMovement?.type)}
              rightSection={<ChevronDown size={16} />}
            />
          </div>
          <div className="flex items-center ">
            <p className="text-base font-semibold flex-1">Thời gian giao dịch</p>
            <Input
              readOnly
              className="flex-1"
              size="sm"
              value={formatDate(selectedMovement?.createdAt, { showTime: true })}
              rightSection={<Calendar size={16} />}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
