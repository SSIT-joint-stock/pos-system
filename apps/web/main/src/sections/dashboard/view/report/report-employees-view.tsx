/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Tooltip } from '@mantine/core';
import { Modal, Table } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { ReportStoreMembers } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPaymentMethod, payment_method } from '../../../../constants/method';
import { getOrderStatusLabel, ORDER_STATUS_MAP } from '../../../../constants/status';
import { useReportExport } from '../../../../hooks/report-export/use-report-export';
import { useReport } from '../../../../hooks/report/use-report';
import DashboardViewLayout from '../../../../layouts/dashboard-view-layout';
import { ActionButtons } from '../../../../sections/dashboard/components/action-buttons';
import { DataActionBar } from '../../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../../sections/dashboard/components/display-field';
import { formatCurrency, formatDate } from '../../../../utils';

const tableHeaders = [
  'Tên nhân viên',
  'Email',
  'Ngày tạo',
  'Tổng đơn hàng',
  'Đơn hàng hoàn thành',
  'Tổng tiền thanh toán',
  'Tổng tiền hàng',
  'Thao tác',
];
const tableHeadersSelected = [
  'Mã đơn hàng',
  'Trạng thái',
  'Phương thức TT',
  'Khách trả',
  'Tổng giá trị',
  'Ngày mua hàng',
];
export function ReportEmployeesView() {
  const router = useRouter();
  const currentStore = useAtomValue(currentStoreAtom);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ReportStoreMembers | null>(null);
  const {
    loading,
    reportStoreMembers,
    pagination,
    filters,
    paginationParams,
    reportStoreMember,
    getReportStoreMembers,
    getReportStoreMember,
    setFilters,
    setPaginationParams,
  } = useReport();

  const { exportReportStoreMembers } = useReportExport();

  useEffect(() => {
    getReportStoreMembers();
  }, [paginationParams, filters]);

  useEffect(() => {
    if (!isOpenModal || !selectedCustomer) return;
    getReportStoreMember(selectedCustomer?.member_id);
  }, [isOpenModal, selectedCustomer]);

  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Báo cáo nhân viên" />

        <DataActionBar
          // dataComplete={[...new Set(reportStoreMembers?.map((p) => p.customer_name) || [])]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          onExport={exportReportStoreMembers}
          isHaveUpload={false}
          placeholderSearch="Nhập tên, email của nhân viên..."
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
          data={reportStoreMembers}
          renderRow={(report) => (
            <>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                {report.member_name}
              </td>
              <td className="px-4 py-3 text-sm ">{report.member_email}</td>
              <td className="px-4 py-3 text-sm">{formatDate(report.created_at)}</td>
              <td className="px-4 py-3 text-sm  ">{report?.total_orders}</td>

              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {report?.total_order_success}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {formatCurrency(report.total_price_amount)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-green-500">
                {formatCurrency(report.total_order_price)}
              </td>

              <td>
                <ActionButtons
                  onView={() => {
                    setIsOpenModal(true);
                    setSelectedCustomer(report);
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
        size="80%"
        title={<p className="text-base font-semibold text-gray-800">Lịch sử tạo đơn mua </p>}
      >
        <Table
          className="mt-2"
          hasMarginTop={false}
          hasPadding={false}
          tableHeaders={tableHeadersSelected}
          data={reportStoreMember?.user.orders_cashier || []}
          isLoading={loading}
          renderRow={(selected) => (
            <>
              <Tooltip label={`Xem chi tiết ${selected.code}`}>
                <td
                  onClick={() =>
                    router.push(
                      `/dashboard/store/${currentStore?.id}/sales-invoices/detail/${selected.id}`
                    )
                  }
                  className="px-4 py-3 text-sm font-semibold text-pos-blue-500 hover:underline cursor-pointer"
                >
                  {selected.code}
                </td>
              </Tooltip>
              <td className={`px-4 py-3  `}>
                <span
                  className={`text-sm font-semibold ${ORDER_STATUS_MAP[selected.status].color} ${ORDER_STATUS_MAP[selected.status].bgColor}  p-2 rounded-sm  `}
                >
                  {getOrderStatusLabel(selected?.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-semibold ">
                {formatPaymentMethod(selected?.payment_method as payment_method)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold ">
                {formatCurrency(selected.customer_pay_amount)}
              </td>{' '}
              <td className="px-4 py-3 text-sm font-semibold ">
                {formatCurrency(selected.total_amount)}
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
