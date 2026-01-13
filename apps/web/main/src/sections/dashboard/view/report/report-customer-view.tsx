'use client';
import { Tooltip } from '@mantine/core';
import { Modal, Table } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPaymentMethod, payment_method } from '../../../../constants/method';
import { getOrderStatusLabel, ORDER_STATUS_MAP } from '../../../../constants/status';
import { useOrders } from '../../../../hooks/orders/use-orders';
import { useReportExport } from '../../../../hooks/report-export/use-report-export';
import { useReport } from '../../../../hooks/report/use-report';
import DashboardViewLayout from '../../../../layouts/dashboard-view-layout';
import { ActionButtons } from '../../../../sections/dashboard/components/action-buttons';
import { DataActionBar } from '../../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../../sections/dashboard/components/display-field';
import { formatCurrency, formatDate } from '../../../../utils';

const tableHeaders = [
  'Tên khách hàng',
  'Số điện thoại',
  'Email',
  'Số sản phẩm mua',
  'Số đơn hàng',
  'Tổng giá trị',
  'Đã thanh toán',
  'Còn nợ',
  'Thao tác',
];
const tableHeadersSelected = [
  'Mã đơn hàng',
  'Số lượng',
  'Trạng thái',
  'Thanh toán',
  'Phương thức TT',
  'Khách trả',
  'Tổng giá trị',
  'Ngày mua hàng',
];
export function ReportCustomerView() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const currentStore = useAtomValue(currentStoreAtom);
  const router = useRouter();
  const {
    loading,
    reportCustomers,
    pagination,
    filters,
    paginationParams,
    getReportCustomers,
    setFilters,
    setPaginationParams,
  } = useReport();

  const {
    orders,
    pagination: paginationOrders,
    getOrdersByCustomer,
    loading: loadingOrders,
    paginationParams: paginationParamsOrders,
    setPaginationParams: setPaginationParamsOrders,
  } = useOrders();

  const { exportReportCustomer } = useReportExport();

  useEffect(() => {
    getReportCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, filters]);

  useEffect(() => {
    if (selectedCustomer) {
      getOrdersByCustomer(selectedCustomer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer, paginationParamsOrders]);
  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Báo cáo khách hàng">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500"></span>
              <span className="text-sm font-semibold text-gray-800">Khách hàng nợ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-pos-blue-500"></span>
              <span className="text-sm font-semibold text-gray-800">Nợ khách hàng</span>
            </div>
          </div>
        </DisplayField>

        <DataActionBar
          dataComplete={[...new Set(reportCustomers?.map((p) => p.customer_name) || [])]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          onExport={exportReportCustomer}
          isHaveUpload={false}
          placeholderSearch="Nhập tên, email, số điện thoại của khách hàng..."
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
          data={reportCustomers}
          renderRow={(report) => (
            <>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                {report.customer_name}
              </td>
              <td className="px-4 py-3 text-sm">
                {report.customer_email || <span className="italic">Không có dữ kiệu</span>}
              </td>
              <td className="px-4 py-3 text-sm  ">
                {report?.customer_phone || <span className="italic">Không có dữ kiệu</span>}
              </td>

              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {report?.total_products_in_orders}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {report.total_orders}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-green-500">
                {formatCurrency(report.total_paid)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {formatCurrency(report.total_customer_paid)}
              </td>
              <td className={`px-4 py-3 text-sm font-semibold `}>
                <span
                  className={`${report.total_unpaid_amount < 0 && 'text-red-600'} ${report.total_unpaid_amount > 0 && 'text-pos-blue-500'}`}
                >
                  {formatCurrency(report.total_unpaid_amount).replace('-', '')}
                </span>
              </td>
              <td>
                <ActionButtons
                  onView={() => {
                    setIsOpenModal(true);
                    setSelectedCustomer(report.customer_id);
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
        title={<p className="text-base font-semibold text-gray-800">Lịch sử nhập/trả hàng </p>}
      >
        <Table
          className="mt-6"
          total={paginationOrders?.total}
          page={paginationOrders?.page}
          totalPages={paginationOrders?.totalPages}
          limit={paginationOrders?.limit}
          pageSize={paginationOrders?.limit ?? paginationParamsOrders.limit}
          onPageSizeChange={(size) =>
            setPaginationParamsOrders((prev) => ({
              ...prev,
              limit: size,
            }))
          }
          onPageChange={(page) =>
            setPaginationParamsOrders((prev) => ({
              ...prev,
              page,
            }))
          }
          hasMarginTop={false}
          hasPadding={false}
          tableHeaders={tableHeadersSelected}
          data={orders}
          isLoading={loadingOrders}
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
              {/* <td className="px-4 py-3 text-sm font-semibold text-green-400 ">{'Đơn nhập'}</td> */}
              <td className="px-4 py-3 text-sm font-semibold ">{selected?.order_item.length}</td>
              {selected.change_amount > 0 && (
                <td className="px-4 py-3 text-sm  font-semibold text-pos-blue-500">
                  Nợ KH: {formatCurrency(selected.change_amount)}
                </td>
              )}
              {selected.change_amount < 0 && (
                <td className="px-4 py-3 text-sm text-red-500 font-semibold">
                  KH nợ: {formatCurrency(Math.abs(selected.change_amount))}
                </td>
              )}
              {selected.change_amount === 0 && (
                <td className="px-4 py-3 text-sm text-green-500 font-semibold">Trả đủ</td>
              )}
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
