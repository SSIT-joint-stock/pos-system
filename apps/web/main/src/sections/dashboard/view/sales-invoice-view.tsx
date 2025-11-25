'use client';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import { BadgeAlert, Download, Edit, Eye, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../../utils/index';
import { useOrders } from '../../../hooks/orders/use-orders';
import { Order } from '@repo/design-system/types';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
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

const paymentMethodLabels: Record<string, string> = {
  CASH: 'Tiền mặt',
  DEBIT_CARD: 'Chuyển khoản',
  CREDIT_CARD: 'Thẻ tín dụng',
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle fetch order details when modal opens

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
      {/* VIEW */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Chi tiết đơn hàng - ${selectedOrder?.id}
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
                <div className="text-gray-900 font-medium truncate">{selectedOrder?.id}</div>
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
                  {paymentMethodLabels[selectedOrder?.payment_method ?? 'CASH']}
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

      <div className="flex flex-col h-full gap-5">
        {/* ACTION */}
        <FilterBar
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
          }}
          actions={
            <>
              <button className="bg-pos-blue-400 border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Download size={16} className="text-white" />
                <span className="text-white font-medium text-xs">
                  {loading ? 'Đang xuất...' : 'Xuất dữ liệu'}
                </span>
              </button>
            </>
          }
        />

        {/* TABLE AND PAGINATION */}
        <Table
          total={pagination?.total}
          page={pagination?.page}
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
              <td className="px-4 py-2 font-semibold text-xs text-pos-blue-500 truncate">
                {order.code || (
                  <span className="italic text-gray-500 font-medium">Chưa cập nhật</span>
                )}
              </td>
              <td className="px-4 py-2 font-medium">{order.customer_name || 'Khách lẻ'}</td>
              <td className="px-4 py-2 text-sm text-gray-500 font-medium">
                {formatCurrency(order.total_amount)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-500 font-medium">
                {formatCurrency(order.customer_pay_amount)}
              </td>
              {order.change_amount > 0 && (
                <td className="px-4 py-2 text-sm  font-medium text-pos-blue-500">
                  Nợ KH: {formatCurrency(order.change_amount)}
                </td>
              )}
              {order.change_amount < 0 && (
                <td className="px-4 py-2 text-sm text-red-500 font-medium">
                  KH nợ: {formatCurrency(Math.abs(order.change_amount))}
                </td>
              )}
              {order.change_amount === 0 && (
                <td className="px-4 py-2 text-sm text-green-500 font-medium">Trả đủ</td>
              )}
              <td className="px-4 py-2 text-sm text-gray-500">
                {paymentMethodLabels[order.payment_method]}
              </td>
              <td className="px-4 py-2">
                <span className={`text-sm font-medium rounded-xl ${statusColors[order.status]}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </td>
              <td className="px-4 py-2 font-medium text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td>
                <div className="flex items-center gap-5 pl-4">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-gray-700 hover:text-white opacity-70 transition-opacity duration-200"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => showInfoToast('Tính năng đang được cập nhật')}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-red-50 text-red-500 rounded-md hover:opacity-100 hover:bg-red-500 hover:text-white opacity-70 transition-opacity duration-200 ml-auto"
                    onClick={() => {
                      setDeleteModal(true);
                      setSelectedOrder(order);
                    }}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </div>
    </>
  );
}
