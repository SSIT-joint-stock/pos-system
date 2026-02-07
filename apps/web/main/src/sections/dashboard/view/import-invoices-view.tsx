'use client';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  PAYMENT_STATUS_MAP,
  paymentStatusOptions,
  PURCHASE_STATUS_MAP,
  purchaseStatusOptions,
} from '../../../constants/status';
import { usePurchase } from '../../../hooks/purchase/use-purchase';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { formatCurrency, formatDate } from '../../../utils';
import { ActionButtons } from '../components/action-buttons';
import { DataActionBar } from '../components/data-action-bar';
import { DisplayField } from '../components/display-field';

const tableHeaders = [
  'Mã đơn nhập',
  'Ngày tạo',
  'Nhà cung cấp / Khách hàng',
  'Trạng thái',
  'Trạng thái thanh toán',
  'Nhân viên tạo',
  'Số lượng nhập',
  'Giá trị đơn',
  'Thao tác',
];

export function ImportInvoicesView() {
  const {
    purchaseOrders,
    loading,
    paginationParams,
    pagination,
    totalPurchase,
    filters,
    getPurchaseOrders,
    setFilters,
    setPaginationParams,
    exportPurchaseOrdersExcel,
    downloadPurchaseOrderTemplate,
  } = usePurchase();
  const router = useRouter();

  useEffect(() => {
    getPurchaseOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, filters]);

  return (
    <>
      <DashboardViewLayout>
        {/* Header */}

        <DisplayField
          label="Quản lý xuất nhập kho"
          value={
            <div className="flex items-center text-base gap-4 font-medium text-gray-500 ">
              <p className="">
                Nhập kho:{' '}
                <span className="text-pos-blue-500 font-semibold text-lg">
                  {formatCurrency(totalPurchase || 0) || '0'}
                </span>
              </p>
            </div>
          }
        >
          <div className="flex items-center gap-3">
            <Button
              title="Tạo phiếu nhập hàng"
              onClick={() => router.push('purchase-orders')}
              icon={<Plus size={16} />}
              size="sm"
              radius="sm"
            />
          </div>
        </DisplayField>
        <DataActionBar
          placeholderSearch="Tìm kiếm mã phiếu nhập, tên hoặc mã nhà cung cấp"
          statusOptions={[
            {
              width: '200px',
              key: 'status',
              label: 'Trạng thái phiếu nhập',
              options: purchaseStatusOptions,
            },
            {
              width: '200px',
              key: 'payment_status',
              label: 'Trạng thái thanh toán',
              options: paymentStatusOptions,
            },
          ]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              status: newFilters.status,
              payment_status: newFilters.payment_status,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          isHaveUpload={false}
          onExport={exportPurchaseOrdersExcel}
          onDownloadTemplate={downloadPurchaseOrderTemplate}
        />
        <Table
          hasMarginTop={false}
          tableHeaders={tableHeaders}
          data={purchaseOrders}
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
          renderRow={(data) => (
            <>
              <td
                onClick={() => {
                  router.push(`import-invoices/detail/${data?.id}`);
                }}
                className="px-4 py-3 text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {data?.order_number || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(data.createdAt) || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-pos-blue-500">
                {data?.supplier?.name || 'N/A'}
              </td>
              <td className={`px-4 py-3 text-sm   `}>
                <span
                  className={`${PURCHASE_STATUS_MAP[data?.status].color} ${PURCHASE_STATUS_MAP[data?.status].bgColor} py-2 px-3 rounded-md text-nowrap`}
                >
                  {PURCHASE_STATUS_MAP[data?.status].label || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-pos-blue-500 font-medium">
                <span
                  className={`${PAYMENT_STATUS_MAP[data?.payment_status].color} ${PAYMENT_STATUS_MAP[data?.payment_status].bgColor} py-2 px-3 rounded-md text-nowrap`}
                >
                  {PAYMENT_STATUS_MAP[data?.payment_status].label || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                {data?.creator?.email || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{data?.items.length || 0}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatCurrency(data?.total || 0)}
              </td>
              <td>
                <ActionButtons
                  onView={() => {
                    router.push(`import-invoices/detail/${data?.id}`);
                  }}
                />
              </td>
            </>
          )}
        />
      </DashboardViewLayout>
    </>
  );
}
