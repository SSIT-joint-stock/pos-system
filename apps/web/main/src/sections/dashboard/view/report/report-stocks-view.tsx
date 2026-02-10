'use client';
import { Table } from '@repo/design-system/components/ui';
import { useEffect } from 'react';
import { useReportExport } from '../../../../hooks/report-export/use-report-export';
import { useReport } from '../../../../hooks/report/use-report';
import DashboardViewLayout from '../../../../layouts/dashboard-view-layout';
import { DataActionBar } from '../../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../../sections/dashboard/components/display-field';
import { formatCurrency } from '../../../../utils';

const tableHeaders = [
  'Biến thể',
  'Sản phẩm gốc',
  'SKU',
  'Đơn vị',
  'Tồn thực tế',
  'Giữ chỗ',
  'Hư hỏng',
  'Giá bán',
  'Giá vốn',
  'Giá trị tồn',
];

export function ReportStocksView() {
  const {
    loading,
    reportStocks,
    pagination,
    getReportStocks,
    setFilters,
    setPaginationParams,
    paginationParams,
    filters,
  } = useReport();

  const { exportReportStocks } = useReportExport();

  useEffect(() => {
    getReportStocks();
  }, [paginationParams, filters]);

  return (
    <DashboardViewLayout>
      <DisplayField label="Báo cáo tồn kho" />

      <DataActionBar
        dataComplete={[...new Set(reportStocks?.map((p) => p.sku) || [])]}
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({
            ...prev,
            ...newFilters,
          }));
        }}
        onSearch={(value) => {
          setFilters((prev) => ({ ...prev, q: value }));
        }}
        onExport={exportReportStocks}
        isHaveUpload={false}
        placeholderSearch="Nhập tên sản phẩm, SKU..."
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
        data={reportStocks}
        renderRow={(report) => (
          <>
            <td className="px-4 py-3 text-sm font-semibold text-pos-blue-500">
              {report.variant_name}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">{report.product_name}</td>
            <td className="px-4 py-3 text-sm">{report.sku}</td>
            <td className="px-4 py-3 text-sm">{report.base_unit}</td>
            <td className="px-4 py-3 text-sm font-semibold">{report.on_hand}</td>
            <td className="px-4 py-3 text-sm">{report.reserved}</td>
            <td className="px-4 py-3 text-sm">{report.damaged}</td>
            <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(report.price)}</td>
            <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(report.cost)}</td>
            <td className="px-4 py-3 text-sm font-semibold">
              {formatCurrency(report.stock_value)}
            </td>
          </>
        )}
      />
    </DashboardViewLayout>
  );
}
