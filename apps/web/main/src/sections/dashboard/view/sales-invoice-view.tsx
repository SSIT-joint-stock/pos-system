'use client';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { Order } from '@repo/design-system/types';
import { BadgeAlert, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatPaymentMethod, payment_method } from '../../../constants/method';
import { ORDER_STATUS_MAP } from '../../../constants/status';
import { useOrders } from '../../../hooks/orders/use-orders';
import { usePrint } from '../../../hooks/use-print';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import InvoicePrintContent from '../../../sections/print/invoice-print-context';
import { formatCurrency, formatDate } from '../../../utils/index';
import { ActionButtons } from '../components/action-buttons';
import { DataActionBar } from '../components/data-action-bar';
import { DisplayField } from '../components/display-field';

const tableHeaders = [
  'Mã Đơn Hàng',
  'Số lượng',
  'Khách Hàng',
  'Giá bán',
  'Đã thanh toán',
  'Công nợ',
  'Phương Thức TT',
  'Trạng Thái Đơn Hàng',
  'Ngày Tạo',
  'Thao Tác',
];
const tableHeadersSelected = [
  'Mã sản phẩm',
  'Tên sản phẩm',
  'Số lượng',
  'Đơn giá',
  'Tiền thuế',
  'Thành tiền',
];

export function SalesInvoicesView() {
  const router = useRouter();
  const {
    orders,
    loading,
    pagination,
    paginationParams,
    downloadExcelTemplate,
    exportExcelOrders,
    setPaginationParams,
    setFilters,
    deleteOrder,
  } = useOrders();
  // Local state for modals
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { handlePrint, printing, printRef } = usePrint({
    title: `hoa_don_ban_${selectedOrder?.code}`,
  });
  // Handle delete order
  const handleDeleteOrder = async () => {
    if (!selectedOrder?.id) return;

    try {
      setDeleteLoading(true);
      const success = await deleteOrder(selectedOrder.id);
      if (success) {
        setDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle update order

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenViewModal(true);
  };

  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Quản lý danh sách đơn hàng bán">
          <Button
            title="Tạo phiếu trả hàng bán"
            onClick={() => router.push('returned-orders')}
            icon={<Plus size={16} />}
            size="sm"
            radius="sm"
          />
        </DisplayField>

        {/* ACTION */}

        <DataActionBar
          // dataComplete={[...new Set(orders?.map((p) => p.code) || [] )]}
          statusOptions={[
            {
              key: 'payment_method',
              label: 'Hình thức thanh toán',
              options: [
                { value: 'CASH', label: 'Tiền mặt' },
                { value: 'CREDIT_CARD', label: 'Thẻ ghi nợ' },
                { value: 'DEBIT_CARD', label: 'Thẻ tín dụng' },
                { value: 'BANK_TRANSFER', label: 'Chuyển khoản' },
                { value: 'DIGITAL_WALLET', label: 'Ví điện tử' },
              ],
            },
            {
              key: 'status',
              label: 'Trạng Thái Đơn Hàng',
              options: [
                { value: 'OVERAGE', label: 'Trả thừa' },
                { value: 'RETURNED', label: 'Đã trả hàng' },
                { value: 'PENDING', label: 'Chờ thanh toán' },
                { value: 'CANCELLED', label: 'Đã hủy' },
                { value: 'COMPLETED', label: 'Hoàn thành' },
                { value: 'PROCESSING', label: 'Đang xử lý' },
              ],
            },
          ]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              payment_method: newFilters.payment_method,
              status: newFilters.status,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          loading={loading}
          isHaveUpload={false}
          onDownloadTemplate={downloadExcelTemplate}
          onExport={exportExcelOrders}
          placeholderSearch="Nhập mã hóa đơn, tên khách hàng"
        />
        {/* TABLE AND PAGINATION */}
        <Table
          total={pagination?.total}
          page={pagination?.page}
          hasMarginTop={false}
          limit={pagination?.limit}
          totalPages={pagination?.totalPages}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageChange={(page) => setPaginationParams((prev) => ({ ...prev, page }))}
          onPageSizeChange={(size) =>
            setPaginationParams((prev) => ({
              ...prev,
              limit: size,
            }))
          }
          tableHeaders={tableHeaders}
          data={orders}
          isLoading={loading}
          renderRow={(order) => (
            <>
              <td
                onClick={() => router.push(`sales-invoices/detail/${order.id}`)}
                className="px-4 py-3 text-sm text-pos-blue-600 font-semibold truncate hover:underline cursor-pointer"
              >
                {order.code || (
                  <span className="italic text-gray-500 font-medium">Chưa cập nhật</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 font-semibold truncate">
                {order?.order_item?.length || (
                  <span className="italic text-gray-500 font-medium">Chưa cập nhật</span>
                )}
              </td>
              <td className="px-4 py-3 font-medium italic text-gray-500 text-sm">
                {order.customer_name || 'Khách lẻ'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                {formatCurrency(order.total_amount)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                {formatCurrency(order.customer_pay_amount)}
              </td>
              {order.change_amount > 0 && (
                <td className="px-4 py-3 text-sm  font-medium text-pos-blue-500">
                  Nợ KH: {formatCurrency(order.change_amount)}
                </td>
              )}
              {order.change_amount < 0 && (
                <td className="px-4 py-3 text-sm text-red-500 font-medium">
                  KH nợ: {formatCurrency(Math.abs(order.change_amount))}
                </td>
              )}
              {order.change_amount === 0 && (
                <td className="px-4 py-3 text-sm text-green-500 font-medium">Trả đủ</td>
              )}
              <td className="px-4 py-3 text-sm font-semibold text-gray-500">
                {formatPaymentMethod(order.payment_method as payment_method)}
              </td>
              <td className="px-4 py-3">
                {order.status && (
                  <span
                    className={`text-sm font-medium rounded-sm p-2  ${ORDER_STATUS_MAP[order.status].color} ${ORDER_STATUS_MAP[order.status].bgColor}`}
                  >
                    {ORDER_STATUS_MAP[order.status].label || order.status}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td>
                <ActionButtons
                  onView={() => {
                    handleViewOrder(order);
                  }}
                  // onEdit={() => {
                  //   showInfoToast('Tính năng đang được cập nhật');
                  // }}
                  onDelete={() => {
                    setDeleteModal(true);
                    setSelectedOrder(order);
                  }}
                />
              </td>
            </>
          )}
        />
      </DashboardViewLayout>

      {/* VIEW */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Chi tiết đơn hàng - {selectedOrder?.code}
            </span>
            {selectedOrder && selectedOrder.status && (
              <span
                className={`text-sm font-medium rounded-xl p-2  ${ORDER_STATUS_MAP[selectedOrder?.status ?? ''].color} ${ORDER_STATUS_MAP[selectedOrder?.status ?? ''].bgColor}`}
              >
                {ORDER_STATUS_MAP[selectedOrder?.status ?? ''].label || selectedOrder?.status}
              </span>
            )}
          </div>
        }
        opened={openViewModal}
        size="70%"
        onClose={() => setOpenViewModal(false)}
      >
        <div className="flex flex-col gap-8">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="flex divide-x divide-gray-200 text-sm">
              {/* Mã đơn hàng */}
              <div className="flex-1 p-2">
                <div className="text-gray-500">Mã đơn hàng</div>
                <div className="text-pos-blue-500 font-semibold truncate">
                  {selectedOrder?.code}
                </div>
              </div>

              {/* Thông tin KH */}
              <div className="flex-1 p-2">
                <div className="text-gray-500">Thông tin KH</div>
                <div className="text-gray-900 font-medium">
                  {selectedOrder?.customer_name || 'Khách lẻ'}
                </div>
              </div>
              <div className="flex-1 p-2">
                <div className="text-gray-500">Nhân viên tạo đơn</div>
                <div className="text-gray-900 font-medium">
                  {selectedOrder?.cashier?.email || selectedOrder?.cashier?.username || 'Nhân viên'}
                </div>
              </div>

              {/* Hình thức TT */}
              <div className="flex-1 p-2">
                <div className="text-gray-500">Hình thức TT</div>
                <div className="text-gray-900 font-medium">
                  {formatPaymentMethod(selectedOrder?.payment_method as payment_method)}
                </div>
              </div>

              {/* Ngày tạo */}
              <div className="flex-1 p-2">
                <div className="text-gray-500">Ngày đặt hàng</div>
                <div className="text-gray-900 font-medium">
                  {formatDate(selectedOrder?.createdAt ?? '', { showTime: true })}
                </div>
              </div>
            </div>
          </div>
          <Table
            hasPagination={false}
            hasPadding={false}
            tableHeaders={tableHeadersSelected}
            data={selectedOrder?.order_item || []}
            renderRow={(item) => (
              <>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {item.variant?.sku || 'N/A'}
                </td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {item.variant?.name || 'Tên sản phẩm'}
                </td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">{item?.quantity}</td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {formatCurrency(item?.price || 0)}
                </td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {formatCurrency((item?.tax_rate / 100) * item.price || 0)}
                </td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {formatCurrency(
                    item?.quantity * item.price + (item?.tax_rate / 100) * item.price
                  )}
                </td>
              </>
            )}
          />

          <div className="bg-gray-50/90 p-4 rounded-md flex flex-col">
            <div className="flex items-center justify-between border-y border-y-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Tạm tính</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(selectedOrder?.subtotal_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Tổng VAT</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(selectedOrder?.tax_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Tổng tiền (sau VAT)</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(
                  (selectedOrder?.tax_amount || 0) + (selectedOrder?.subtotal_amount || 0)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Giảm giá</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(selectedOrder?.discount_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Số tiền phải trả</span>
              <span className="text-base font-semibold text-pos-blue-500">
                {formatCurrency(selectedOrder?.total_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Khách trả</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(selectedOrder?.customer_pay_amount || 0)}
              </span>
            </div>
            {selectedOrder && (
              <div className="flex items-center justify-between py-3 border-b border-b-gray-200">
                <span className="text-sm font-semibold text-gray-900">
                  {selectedOrder?.change_amount < 0 ? 'Tiền nợ' : 'Tiền thừa'}
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(Math.abs(selectedOrder?.change_amount || 0))}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button
              size="sm"
              radius="sm"
              title="Hủy"
              onClick={() => setOpenViewModal(false)}
              variant="outline"
            />
            <div className="hidden">
              <InvoicePrintContent ref={printRef} order={selectedOrder as Order} />
            </div>
            <Button
              size="sm"
              radius="sm"
              loading={printing}
              onClick={() => handlePrint()}
              title="In hóa đơn"
            />
          </div>
        </div>
      </Modal>
      {/* DELETE MODAL */}
      <Modal opened={deleteModal} size="md" onClose={() => setDeleteModal(false)}>
        <div className="space-y-3 flex flex-col items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
              <BadgeAlert size={38} />
            </div>
            <div className="text-lg font-bold text-center">Bạn Có Chắc Chắn Muốn Xóa?</div>
            <div className="text-sm text-gray-500 text-center">
              Hành động này không thể hoàn tác. Đơn hàng {selectedOrder?.code || selectedOrder?.id}{' '}
              sẽ bị xóa vĩnh viễn. Và sản phẩm sẽ được cộng lại vào trong tồn kho
            </div>
          </div>
          <button
            className="bg-red-500 rounded-md text-white w-full py-2 cursor-pointer font-bold disabled:opacity-50"
            onClick={handleDeleteOrder}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Đang xóa...' : 'Xác Nhận Xóa'}
          </button>
          <button
            className="cursor-pointer"
            onClick={() => setDeleteModal(false)}
            disabled={deleteLoading}
          >
            Hủy
          </button>
        </div>
      </Modal>
    </>
  );
}
