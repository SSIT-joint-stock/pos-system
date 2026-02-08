'use client';
import { Table } from '@repo/design-system/components/ui';
import { useEffect } from 'react';
import { useReportExport } from '../../../../hooks/report-export/use-report-export';
import { useReport } from '../../../../hooks/report/use-report';
import DashboardViewLayout from '../../../../layouts/dashboard-view-layout';
import { DataActionBar } from '../../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../../sections/dashboard/components/display-field';
import { formatCurrency, formatDate } from '../../../../utils';

const tableHeaders = [
  'Mã đơn hàng',
  'Khách hàng',
  'Sản phẩm gốc',
  'Sản phẩm mua',
  'Số lượng',
  'Đơn vị mua',
  'Đơn giá trị',
  'Tổng giá trị',
  'Ngày mua hàng',
  // 'Còn nợ',
  // 'Thao tác',
];

export function ReportOrdersView() {
  const {
    loading,
    reportOrders,
    pagination,
    filters,
    paginationParams,
    getReportOrders,
    setFilters,
    setPaginationParams,
  } = useReport();
  console.log(reportOrders);

  const { exportReportOrders } = useReportExport();

  useEffect(() => {
    getReportOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, filters]);

  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Báo cáo bán hàng" />

        <DataActionBar
          dataComplete={[...new Set(reportOrders?.map((p) => p.order_code) || [])]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          onExport={exportReportOrders}
          isHaveUpload={false}
          placeholderSearch="Nhập mã đơn hàng, tên khách hàng..."
        />

        {/* TABLE AND PAGINATION */}

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
          data={reportOrders}
          renderRow={(report) => (
            <>
              <td className="px-4 py-3 text-sm font-semibold text-pos-blue-500">
                {report.order_code}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {report.customer_name || <span className="italic">Khách lẻ</span>}
              </td>
              <td className="px-4 py-3 text-sm">
                {report.product_name || <span className="italic">Không có dữ kiệu</span>}
              </td>
              <td className="px-4 py-3 text-sm  ">
                {report?.variant_name || <span className="italic">Không có dữ kiệu</span>}
              </td>

              <td className="px-4 py-3 text-sm font-semibold text-gray-700">{report?.quantity}</td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">{report.base_unit}</td>
              <td className="px-4 py-3 text-sm font-semibold ">{formatCurrency(report.price)}</td>
              <td className="px-4 py-3 text-sm font-semibold ">
                {formatCurrency(report.line_total)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold ">
                {formatDate(report.order_created_at)}
              </td>
            </>
          )}
        />
      </DashboardViewLayout>
    </>
  );
}
