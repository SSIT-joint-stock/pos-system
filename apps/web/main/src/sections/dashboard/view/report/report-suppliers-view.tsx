/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Tooltip } from '@mantine/core';
import { Modal, Table } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { PurchaseType } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getPurchasePaymentStatusLabel,
  getPurchaseReturnStatusLabel,
  getPurchaseStatusLabel,
} from '../../../../constants/status';
import { useReportExport } from '../../../../hooks/report-export/use-report-export';
import { useReport } from '../../../../hooks/report/use-report';
import DashboardViewLayout from '../../../../layouts/dashboard-view-layout';
import { ActionButtons } from '../../../../sections/dashboard/components/action-buttons';
import { DataActionBar } from '../../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../../sections/dashboard/components/display-field';
import { formatCurrency, formatDate } from '../../../../utils';

const tableHeaders = [
  'Nhà cung cấp',
  'Mã NCC',
  'Đơn hàng trả',
  'Đơn hàng nhập',
  'Tổng giá trị nhập',
  'Đã thanh toán',
  'Còn nợ',
  'Thao tác',
];
const tableHeadersSelected = [
  'Mã nhập/xuất',
  'Loại',
  'Trạng thái',
  'Thanh toán',
  'Giá trị',
  'Ngày tạo',
];
export function ReportSuppliersView() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const currentStore = useAtomValue(currentStoreAtom);
  const router = useRouter();
  const {
    loading,
    reportSuppliers,
    reportSupplier,
    pagination,
    filters,
    paginationParams,
    getReportSuppliers,
    getReportSupplier,
    setFilters,
    setPaginationParams,
  } = useReport();

  const { exportReportSuppliers } = useReportExport();

  useEffect(() => {
    getReportSuppliers();
  }, [paginationParams, filters]);
  useEffect(() => {
    if (!selectedSupplier) return;
    getReportSupplier(selectedSupplier);
  }, [selectedSupplier]);
  console.log(reportSupplier);
  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Báo cáo nhà cung cấp" />

        <DataActionBar
          dataComplete={[...new Set(reportSuppliers?.map((p) => p.supplier_name) || [])]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          onExport={exportReportSuppliers}
          isHaveUpload={false}
          placeholderSearch="Nhập tên, mã, mã số thuế, email, số điện thoại của nhà cung cấp..."
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
          data={reportSuppliers}
          renderRow={(report) => (
            <>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                {report.supplier_name}
              </td>
              <td className="px-4 py-3 text-sm  font-semibold text-pos-blue-600 hover:underline cursor-pointer">
                {report.supplier_code}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {report?.total_purchase_returns} đơn
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {report?.total_purchase_orders} đơn
              </td>

              <td className="px-4 py-3 text-sm font-semibold text-green-500">
                {formatCurrency(report.total_purchase_paid)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {formatCurrency(report.total_paid)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {formatCurrency(report.total_unpaid_amount)}
              </td>
              <td>
                <ActionButtons
                  onView={() => {
                    setIsOpenModal(true);
                    setSelectedSupplier(report.supplier_id);
                  }}
                />
              </td>
            </>
          )}
        />
      </DashboardViewLayout>

      <Modal
        opened={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        size="70%"
        title={<p className="text-base font-semibold text-gray-800">Lịch sử nhập/trả hàng </p>}
      >
        <Table
          className="mt-6"
          hasPagination={false}
          hasMarginTop={false}
          hasPadding={false}
          tableHeaders={tableHeadersSelected}
          data={reportSupplier?.data || []}
          renderRow={(selected) => (
            <>
              <Tooltip label={`Xem chi tiết ${selected.code}`}>
                <td
                  onClick={() =>
                    router.push(
                      `/dashboard/store/${currentStore?.id}/${
                        selected?.purchase_type === PurchaseType.PURCHASE_ORDER
                          ? 'import-invoices/detail'
                          : '/export-invoices/detail'
                      }/${selected?.id}`
                    )
                  }
                  className="px-4 py-3 text-sm font-semibold text-pos-blue-500 hover:underline cursor-pointer"
                >
                  {selected.code}
                </td>
              </Tooltip>
              <td className="px-4 py-3 text-sm font-semibold">
                {selected?.purchase_type === PurchaseType.PURCHASE_ORDER ? 'Đơn nhập' : 'Đơn trả'}
              </td>

              <td className="px-4 py-3 text-sm font-semibold ">
                {selected?.purchase_type === PurchaseType.PURCHASE_ORDER
                  ? getPurchaseStatusLabel(selected?.status)
                  : getPurchaseReturnStatusLabel(selected?.status)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold ">
                {getPurchasePaymentStatusLabel(selected?.payment_status)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold ">
                {formatCurrency(selected.amount)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold ">
                {formatDate(selected?.createdAt, { showTime: true })}
              </td>
            </>
          )}
        />
      </Modal>
    </>
  );
}
