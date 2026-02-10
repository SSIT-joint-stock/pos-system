'use client';
import { Table } from '@repo/design-system/components/ui';
import { useEffect } from 'react';
import { formatPaymentMethod, payment_method } from '../../../../constants/method';
import {
  getPurchasePaymentStatusLabel,
  getPurchaseReturnStatusLabel,
  getPurchaseStatusLabel,
} from '../../../../constants/status';
import { useReportExport } from '../../../../hooks/report-export/use-report-export';
import { useReport } from '../../../../hooks/report/use-report';
import DashboardViewLayout from '../../../../layouts/dashboard-view-layout';
import { DataActionBar } from '../../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../../sections/dashboard/components/display-field';
import { formatCurrency, formatDate } from '../../../../utils';

const tableHeaders = [
  'Ngày',
  'Loại',
  'Mã chứng từ',
  'Tên NCC',
  'Mã NCC',
  'Trạng thái',
  'Thanh toán',
  'Phương thức',
  'Tổng tiền',
  'Ghi chú',
];

export function ReportPurchaseInvoicesView() {
  const {
    loading,
    reportPurchaseInvoices,
    pagination,
    getReportPurchaseInvoices,
    setFilters,
    setPaginationParams,
    paginationParams,
    filters,
  } = useReport();

  const { exportReportPurchaseInvoices } = useReportExport();

  useEffect(() => {
    getReportPurchaseInvoices();
  }, [paginationParams, filters]);

  return (
    <DashboardViewLayout>
      <DisplayField label="Báo cáo sổ kho" />

      <DataActionBar
        dataComplete={[...new Set(reportPurchaseInvoices?.map((p) => p.invoice_code) || [])]}
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({
            ...prev,
            ...newFilters,
          }));
        }}
        onSearch={(value) => {
          setFilters((prev) => ({ ...prev, q: value }));
        }}
        onExport={exportReportPurchaseInvoices}
        isHaveUpload={false}
        placeholderSearch="Nhập mã chứng từ, tên NCC, mã NCC..."
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
        data={reportPurchaseInvoices}
        renderRow={(report) => (
          <>
            <td className="px-4 py-3 text-sm">{formatDate(report.date)}</td>
            <td className="px-4 py-3 text-sm font-semibold text-gray-700">{report.invoice_type}</td>
            <td className="px-4 py-3 text-sm font-semibold text-pos-blue-500">
              {report.invoice_code}
            </td>
            <td className="px-4 py-3 text-sm">{report.supplier_name}</td>
            <td className="px-4 py-3 text-sm">{report.supplier_code}</td>
            <td className="px-4 py-3 text-sm">
              {report.invoice_type === 'PURCHASE_ORDER'
                ? getPurchaseStatusLabel(report.status)
                : getPurchaseReturnStatusLabel(report.status)}
            </td>
            <td className="px-4 py-3 text-sm">
              {getPurchasePaymentStatusLabel(report.payment_status)}
            </td>
            <td className="px-4 py-3 text-sm">
              {formatPaymentMethod(report.payment_method as payment_method)}
            </td>
            <td className="px-4 py-3 text-sm font-semibold">
              {formatCurrency(report.total_amount)}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">{report.note}</td>
          </>
        )}
      />
    </DashboardViewLayout>
  );
}
