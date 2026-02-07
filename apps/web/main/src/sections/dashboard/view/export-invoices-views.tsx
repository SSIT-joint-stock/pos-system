'use client';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_MAP,
  PURCHASE_RETURN_STATUS,
  PURCHASE_RETURN_STATUS_MAP,
} from '../../../constants/status';
import { usePurchaseReturn } from '../../../hooks/purchase-return/use-purchase-return';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { formatCurrency, formatDate } from '../../../utils';
import { DataActionBar } from '../components/data-action-bar';
import { DisplayField } from '../components/display-field';

const tableHeaders = [
  'Mã đơn',
  'Mã đơn nhập',
  'Ngày tạo',
  'Nhà cung cấp',
  'Trạng thái',
  'Trạng thái thanh toán',
  'Nhân viên tạo',
  'Số lượng trả',
  'Giá trị đơn',
];
export const purchaseReturnStatusOptions = Object.entries(PURCHASE_RETURN_STATUS).map(
  ([key, item]) => ({
    label: item.label,
    value: item.value,
    color: item.color,
    key, // optional
  })
);
export const paymentStatusOptions = Object.entries(PAYMENT_STATUS).map(([key, item]) => ({
  label: item.label,
  value: item.value,
  color: item.color,
  key, // optional
}));

export function ExportInvoicesViews() {
  const {
    purchaseReturns,
    loading,
    paginationParams,
    pagination,
    filters,

    getPurchaseReturns,
    setFilters,
    setPaginationParams,
  } = usePurchaseReturn();
  const router = useRouter();

  useEffect(() => {
    getPurchaseReturns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, filters]);

  return (
    <>
      <DashboardViewLayout>
        {/* Header */}

        <DisplayField label="Quản lý xuất nhập kho">
          <div className="flex items-center gap-3">
            <Button
              title="Tạo phiếu trả hàng nhập"
              onClick={() => router.push('outbound-orders')}
              icon={<Plus size={16} />}
              size="sm"
              radius="sm"
            />
          </div>
        </DisplayField>
        <DataActionBar
          placeholderSearch="Tìm kiếm mã phiếu trả, tên hoặc mã nhà cung cấp"
          statusOptions={[
            {
              width: '200px',
              key: 'status',
              label: 'Trạng thái phiếu nhập',
              options: purchaseReturnStatusOptions,
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

          // onExport={exportPurchaseOrdersExcel}
          // onDownloadTemplate={downloadPurchaseOrderTemplate}
        />
        <Table
          hasMarginTop={false}
          tableHeaders={tableHeaders}
          data={purchaseReturns}
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
                  router.push(`export-invoices/detail/${data?.id}`);
                }}
                className="px-4 py-3 text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {data?.return_number || 'N/A'}
              </td>
              <td
                onClick={
                  data?.purchase_order
                    ? () => {
                        router.push(`import-invoices/detail/${data?.purchase_order?.id}`);
                      }
                    : () => {}
                }
                className="px-4 py-3 text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {data?.purchase_order?.order_number}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(data.createdAt) || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-pos-blue-500">
                {data?.supplier?.name || 'N/A'}
              </td>
              <td className={`px-4 py-3 text-sm   `}>
                <span
                  className={`${PURCHASE_RETURN_STATUS_MAP[data?.status].color} ${PURCHASE_RETURN_STATUS_MAP[data?.status].bgColor} py-2 px-3 rounded-md text-nowrap`}
                >
                  {PURCHASE_RETURN_STATUS_MAP[data?.status].label || 'N/A'}
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
            </>
          )}
        />
      </DashboardViewLayout>
    </>
  );
}
