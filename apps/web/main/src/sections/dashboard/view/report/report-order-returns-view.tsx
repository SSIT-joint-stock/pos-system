'use client';
import { Table } from '@repo/design-system/components/ui';
import { useEffect } from 'react';
import {
  getOrderItemReturnReasonLabel,
  getOrderReturnStatusLabel,
  OrderItemReturnReason,
} from '../../../../constants/reason-return';
import { useReportExport } from '../../../../hooks/report-export/use-report-export';
import { useReport } from '../../../../hooks/report/use-report';
import DashboardViewLayout from '../../../../layouts/dashboard-view-layout';
import { DataActionBar } from '../../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../../sections/dashboard/components/display-field';
import { formatCurrency, formatDate } from '../../../../utils';

const tableHeaders = [
  'Ngày trả',
  'Mã trả hàng',
  'Mã hóa đơn',
  'Khách hàng',
  'Trạng thái',
  'Tổng tiền trả',
  'Sản phẩm ',
  'Số lượng',
  'Thành tiền',
  'Lý do',
];

export function ReportOrderReturnsView() {
  const {
    loading,
    reportOrderReturns,
    pagination,
    getReportOrderReturns,
    setFilters,
    setPaginationParams,
    paginationParams,
    filters,
  } = useReport();

  const { exportReportOrderReturn } = useReportExport();

  useEffect(() => {
    getReportOrderReturns();
  }, [paginationParams, filters]);

  return (
    <DashboardViewLayout>
      <DisplayField label="Báo cáo trả hàng" />

      <DataActionBar
        dataComplete={[...new Set(reportOrderReturns?.map((p) => p.return_number) || [])]}
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({
            ...prev,
            ...newFilters,
          }));
        }}
        onSearch={(value) => {
          setFilters((prev) => ({ ...prev, q: value }));
        }}
        onExport={exportReportOrderReturn}
        isHaveUpload={false}
        placeholderSearch="Nhập mã trả hàng, mã hóa đơn, tên KH..."
      />

      <Table
        hasMarginTop={false}
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
        isLoading={loading}
        data={reportOrderReturns}
        renderRow={(report) => (
          <>
            <td className="px-4 py-3 text-sm">{formatDate(report.return_date)}</td>
            <td className="px-4 py-3 text-sm font-semibold text-pos-blue-500">
              {report.return_number}
            </td>
            <td className="px-4 py-3 text-sm font-semibold text-gray-700">{report.order_number}</td>
            <td className="px-4 py-3 text-sm">{report.customer_name || 'Khách lẻ'}</td>
            <td className="px-4 py-3 text-sm">{getOrderReturnStatusLabel(report.return_status)}</td>
            <td className="px-4 py-3 text-sm font-semibold">
              {formatCurrency(report.total_return)}
            </td>
            <td className="px-4 py-3 text-sm">{report.variant_name}</td>
            <td className="px-4 py-3 text-sm font-semibold">{report.quantity}</td>
            <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(report.line_total)}</td>
            <td className="px-4 py-3 text-sm">
              {getOrderItemReturnReasonLabel(report.reason_status as OrderItemReturnReason)}
            </td>
          </>
        )}
      />
    </DashboardViewLayout>
  );
}
