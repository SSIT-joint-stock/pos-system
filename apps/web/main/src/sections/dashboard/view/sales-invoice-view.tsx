'use client';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { BadgeAlert, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../../utils/index';
import { useOrders } from '../../../hooks/orders/use-orders';
import { Order } from '@repo/design-system/types';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { DisplayField } from '../components/display-field';
import { DataActionBar } from '../components/data-action-bar';
import { ActionButtons } from '../components/action-buttons';
import { formatPaymentMethod, payment_method } from '../../../constants/method';
const tableHeaders = [
  'Mã Đơn Hàng',
  'Khách Hàng',
  'Giá bán',
  'Đã thanh toán',
  'Công nợ',
  'Phương Thức TT',
  'Trạng Thái Đơn Hàng',
  'Ngày Tạo',
  'Thao Tác',
];
const tableHeadersSelected = ['Mã sản phẩm', 'Tên sản phẩm', 'Số lượng', 'Đơn giá', 'Thành tiền'];

const statusColors: Record<string, string> = {
  OVERAGE: 'text-blue-500 bg-blue-50 py-1.5 px-2.5 rounded-xs',
  RETURNED: 'text-red-900 bg-red-50  py-1.5 px-2.5 rounded-xs',
  PENDING: 'text-orange-500 bg-orange-50  py-1.5 px-2.5 rounded-xs',
  CANCELLED: 'text-red-600 bg-red-50  py-1.5 px-2.5 rounded-xs',
  COMPLETED: 'text-green-500 bg-green-50  py-1.5 px-2.5 rounded-xs',
  PAID: 'text-green-700 bg-green-50  py-1.5 px-2.5 rounded-xs',
  REFUNDED: 'text-red-900 bg-red-50  py-1.5 px-2.5 rounded-xs',
};

const statusLabels: Record<string, string> = {
  OVERAGE: 'Trả thừa',
  RETURNED: 'Đã trả hàng',
  PENDING: 'Chờ thanh toán',
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn thành',
  PAID: 'Đã thanh toán',
  REFUNDED: 'Đã hoàn tiền',
};

export function SalesInvoicesView() {
  const { showInfoToast } = useToast();
  const {
    orders,
    loading,
    pagination,
    paginationParams,
    setPaginationParams,
    setFilters,
    deleteOrder,
  } = useOrders();
  // Local state for modals
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  // const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

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
          <Button title="Tạo phiếu trả hàng bán" icon={<Plus size={16} />} size="sm" radius="sm" />
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
                { value: 'PAID', label: 'Đã thanh toán' },
                { value: 'REFUNDED', label: 'Đã hoàn tiền' },
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
              <td className="px-4 py-3 text-sm text-pos-blue-600 font-semibold truncate">
                {order.code || (
                  <span className="italic text-gray-500 font-medium">Chưa cập nhật</span>
                )}
              </td>
              <td className="px-4 py-3 font-medium italic text-gray-600">
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
                <span className={`text-sm font-medium rounded-xl ${statusColors[order.status]}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td>
                <ActionButtons
                  onView={() => {
                    handleViewOrder(order);
                  }}
                  onEdit={() => {
                    showInfoToast('Tính năng đang được cập nhật');
                  }}
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
            <span
              className={`text-sm font-medium rounded-xl ${statusColors[selectedOrder?.status ?? '']}`}
            >
              {statusLabels[selectedOrder?.status ?? ''] || selectedOrder?.status}
            </span>
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
                <div className="text-gray-900 font-medium truncate">{selectedOrder?.code}</div>
              </div>

              {/* Thông tin KH */}
              <div className="flex-1 p-2">
                <div className="text-gray-500">Thông tin KH</div>
                <div className="text-gray-900 font-medium">
                  {selectedOrder?.customer_name || 'Khách lẻ'}
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
                <div className="text-gray-500">Ngày tạo</div>
                <div className="text-gray-900 font-medium">
                  {formatDate(selectedOrder?.createdAt ?? '')}
                </div>
              </div>
            </div>
          </div>
          <Table
            hasMarginTop={false}
            hasPagination={false}
            tableHeaders={tableHeadersSelected}
            data={selectedOrder?.order_item || []}
            renderRow={(product) => (
              <>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {product.product?.sku || 'N/A'}
                </td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {product.product?.name || 'Tên sản phẩm'}
                </td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">{product.quantity}</td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {formatCurrency(product.product?.price || 0)}
                </td>
                <td className="px-4 py-2 font-medium text-sm text-gray-500">
                  {formatCurrency(product.price * product.quantity)}
                </td>
              </>
            )}
          />

          <div className="bg-gray-100 p-4 rounded-md flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Tạm tính</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(selectedOrder?.total_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Khách trả</span>
              <span className="text-base font-semibold text-pos-blue-500">
                {formatCurrency(selectedOrder?.customer_pay_amount || 0)}
              </span>
            </div>
            {selectedOrder && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
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
              onClick={() => showInfoToast('Tính năng đang được cập nhật')}
              title="In hóa đơn"
            />
            <Button title="Hủy" onClick={() => setOpenViewModal(false)} color="#ccc" />
          </div>
        </div>
      </Modal>
      {/* DELETE MODAL */}
      <Modal opened={deleteModal} size="sm" onClose={() => setDeleteModal(false)}>
        <div className="space-y-3 flex flex-col items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
              <BadgeAlert size={38} />
            </div>
            <div className="text-lg font-bold text-center">Bạn Có Chắc Chắn Muốn Xóa?</div>
            <div className="text-sm text-gray-500 text-center">
              Hành động này không thể hoàn tác. Đơn hàng #{selectedOrder?.code || selectedOrder?.id}{' '}
              sẽ bị xóa vĩnh viễn.
            </div>
          </div>
          <button
            className="bg-red-600 rounded-lg text-white w-full py-2 cursor-pointer font-bold disabled:opacity-50"
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
