'use client';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  ORDER_RETURN_STATUS_MAP,
  ORDER_RETURN_TYPE_MAP,
  orderReturnStatusOptions,
} from '../../../constants/reason-return';
import { useOrderReturn } from '../../../hooks/orders/use-order-return';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { formatDate } from '../../../utils';
import { DataActionBar } from '../components/data-action-bar';
import { DisplayField } from '../components/display-field';

export const tableHeaders = [
  'Mã phiếu trả',
  'Mã phiếu bán',
  'Khách hàng',
  'Số sản phẩm',
  'Trạng thái hoàn trả',
  'Trạng thái nhận hàng',
  'Ngày trả',
];

export function ReturnedInvoicesView() {
  const router = useRouter();
  const {
    filters,
    orderReturns,
    loading,
    pagination,
    paginationParams,
    getAllReturnOrder,
    setFilters,
    setPaginationParams,
  } = useOrderReturn();
  useEffect(() => {
    getAllReturnOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, paginationParams]);
  return (
    <>
      <DashboardViewLayout>
        {/* Header */}

        <DisplayField label="Quản lý danh sách đơn trả hàng">
          <Button
            onClick={() => router.push('returned-orders')}
            title="Tạo phiếu trả hàng bán"
            icon={<Plus size={16} />}
            size="sm"
            radius="sm"
          />
        </DisplayField>
        <DataActionBar
          placeholderSearch="Tìm kiếm theo tên khách hàng, số điện thoại khách hàng, mã trả, mã bán"
          statusOptions={[
            {
              width: '280px',
              key: 'return_status',
              label: 'Trạng thái hoàn trả',
              options: orderReturnStatusOptions,
            },
          ]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              return_status: newFilters.return_status,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          isHaveUpload={false}
        />
        <Table
          hasMarginTop={false}
          tableHeaders={tableHeaders}
          isLoading={loading}
          total={pagination?.total}
          totalPages={pagination?.totalPages}
          page={pagination?.page}
          limit={pagination?.limit || 0}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageChange={(page) =>
            setPaginationParams((prev) => ({
              ...prev,
              page: page,
            }))
          }
          onPageSizeChange={(size) =>
            setPaginationParams((prev) => ({
              ...prev,
              limit: size,
            }))
          }
          data={orderReturns}
          renderRow={(row) => (
            <>
              <td
                onClick={() => {
                  router.push(`returned-invoices/detail/${row?.id}`);
                }}
                className="px-4 py-3 text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {row.order_return_number || 'N/A'}
              </td>
              <td
                onClick={() => {
                  router.push(`sales-invoices/detail/${row?.order_id}`);
                }}
                className="px-4 py-3 text-sm text-pos-blue-500 font-semibold cursor-pointer hover:underline"
              >
                {row.order_number}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.customer_name || 'N/A'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.items_length} sản phẩm</td>
              <td className={`px-4 py-3 text-sm`}>
                <span
                  className={`p-2  ${ORDER_RETURN_STATUS_MAP[row.return_status].color} ${ORDER_RETURN_STATUS_MAP[row.return_status].bgColor} rounded-sm`}
                >
                  {ORDER_RETURN_STATUS_MAP[row.return_status].label}
                </span>
              </td>
              <td className={`px-4 py-3 text-sm `}>
                <span
                  className={` ${ORDER_RETURN_TYPE_MAP[row.return_type]?.color} ${ORDER_RETURN_TYPE_MAP[row.return_type]?.bgColor} p-2 rounded-sm`}
                >
                  {ORDER_RETURN_TYPE_MAP[row.return_type].label}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(row.createdAt)}</td>
            </>
          )}
        />
      </DashboardViewLayout>
    </>
  );
}
