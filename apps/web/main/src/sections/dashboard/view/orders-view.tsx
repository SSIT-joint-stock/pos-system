'use client';
import { Input, Modal, Select, Table } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import { BadgeAlert, Check, Download, Edit, Eye, ShoppingCart, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '../../../../../main/src/libs/axios';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { formatCurrency, formatDate } from '../../../../../main/src/utils/index';

const tableHeaders = [
  'Mã Đơn Hàng',
  'Khách Hàng',
  'Giá',
  'Trạng Thái Đơn Hàng',
  'Ngày Tạo',
  'Thao Tác',
];

const statusColors: Record<string, string> = {
  PROCESSING: 'text-blue-500',
  RETURNED: 'text-red-900',
  PENDING: 'text-orange-500',
  CANCELLED: 'text-red-600',
  COMPLETED: 'text-green-700',
  PAID: 'text-green-700',
  REFUNDED: 'text-red-900',
};

const statusLabels: Record<string, string> = {
  PROCESSING: 'Đang xử lý',
  RETURNED: 'Đã trả hàng',
  PENDING: 'Chờ thanh toán',
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn thành',
  PAID: 'Đã thanh toán',
  REFUNDED: 'Đã hoàn tiền',
};

const paymentMethodLabels: Record<string, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  MOMO: 'Momo',
  ZALO_PAY: 'Zalo Pay',
  CREDIT_CARD: 'Thẻ tín dụng',
};

export function OrdersView() {
  const currentStore = useAtomValue(currentStoreAtom);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch orders
  useEffect(() => {
    if (!currentStore?.id) return;
    const getOrders = async () => {
      try {
        const res = await api.get(`store/${currentStore?.id}/orders`);
        console.log(res.data);
        setOrders(res.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    getOrders();
  }, [currentStore?.id]);

  // Fetch order details when modal opens
  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`store/${currentStore?.id}/orders/${orderId}`);
      setOrderDetails(res.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async () => {
    if (!selectedOrder?.product_id) return;

    try {
      setDeleteLoading(true);
      await api.delete(`store/${currentStore?.id}/orders/`, {
        data: { orderId: selectedOrder.id },
      });

      // Remove from local state
      setOrders(orders.filter((order: any) => order.id !== selectedOrder.id));

      // Close modal and reset
      setDeleteModal(false);
      setSelectedOrder(null);

      // You can show a success toast here
      console.log('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      // You can show an error toast here
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle update order
  const handleUpdateOrder = async (updatedData: any) => {
    if (!selectedOrder?.id) return;

    try {
      setLoading(true);
      const res = await api.put(
        `store/${currentStore?.id}/orders/${selectedOrder.id}`,
        updatedData
      );

      // Update local state
      setOrders(
        orders.map((order: any) =>
          order.id === selectedOrder.id ? { ...order, ...res.data.data } : order
        )
      );

      // Close modal and reset
      setOpenEditModal(false);
      setSelectedOrder(null);
      setOrderDetails(null);

      console.log('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOpenViewModal(true);
    fetchOrderDetails(order.id);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setOpenEditModal(true);
    fetchOrderDetails(order.id);
  };

  const closeModals = () => {
    setOpenEditModal(false);
    setOpenViewModal(false);
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  return (
    <>
      <Modal opened={openViewModal || openEditModal} size="lg" onClose={closeModals}>
        <div className="flex items-center border-b border-b-gray-200 pb-2.5 mb-4 gap-2.5">
          <ShoppingCart size={18} className="" />
          <div className="flex items-center">
            <h3 className="text-gray-700s">Mã Đơn Hàng: </h3>
            <h3 className="text-pos-blue-400">#{selectedOrder?.code || selectedOrder?.id}</h3>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <h3>Thông Tin Sản Phẩm</h3>

            {/* Order Items */}
            {orderDetails?.order_items?.map((item: any, index: number) => (
              <div key={index} className="border-b border-b-gray-200 pb-2.5 space-y-1">
                <div className="flex items-center gap-4">
                  <Image
                    width={1000}
                    height={1000}
                    src={
                      item.product?.image_url ||
                      'https://upload.wikimedia.org/wikipedia/commons/0/09/DoMixi1989.jpg'
                    }
                    alt="product"
                    className="rounded-full w-20 h-20 object-cover"
                  />
                  <div className="grid grid-cols-3 gap-8 items-center py-3 flex-1">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {item.product?.name || 'Tên sản phẩm'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Danh mục: {item.product?.category?.name || 'N/A'}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <span className="text-sm text-gray-700">Số lượng: {item.quantity}</span>
                    </div>

                    <div className="flex justify-end">
                      <span className="text-sm font-semibold text-green-600">
                        Đơn giá: {formatCurrency(item.unit_price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product tags */}
                <div className="flex items-center gap-3 justify-end">
                  <div className="rounded-xl bg-pos-blue-50 text-pos-blue-500 flex items-center gap-2 p-2 text-xs">
                    <Check
                      size={12}
                      className="shrink-0 bg-pos-blue-500 text-pos-blue-50 rounded-full font-medium"
                    />
                    <span className="leading-none">Được kiểm định</span>
                  </div>
                  {item.product?.tags?.map((tag: string, tagIndex: number) => (
                    <div
                      key={tagIndex}
                      className="rounded-xl bg-pos-blue-50 text-pos-blue-500 flex items-center gap-2 p-2 text-xs"
                    >
                      <span className="leading-none">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )) || <div className="text-center text-gray-500 py-4">Không có sản phẩm</div>}

            {/* Order Information */}
            <div className="grid grid-cols-2 p-2.5 text-sm border-b border-b-gray-200">
              <div className="text-gray-500 text-left space-y-2">
                <p>Ngày tạo đơn:</p>
                <p>Phương thức thanh toán:</p>
                <p>Trạng thái:</p>
              </div>

              <div className="text-gray-800 font-medium space-y-2">
                <p>{formatDate(selectedOrder?.createdAt)}</p>
                {openEditModal ? (
                  <Select
                    placeholder="Phương thức thanh toán"
                    size="sm"
                    data={[
                      { value: 'CASH', label: 'Tiền mặt' },
                      { value: 'BANK_TRANSFER', label: 'Chuyển khoản' },
                      { value: 'MOMO', label: 'Momo' },
                      { value: 'ZALO_PAY', label: 'Zalo Pay' },
                    ]}
                    className="text-sm font-medium"
                    defaultValue={selectedOrder?.payment_method}
                  />
                ) : (
                  <p className="text-blue-600">
                    {paymentMethodLabels[selectedOrder?.payment_method] ||
                      selectedOrder?.payment_method ||
                      'N/A'}
                  </p>
                )}

                <p className={`font-semibold ${statusColors[selectedOrder?.status]}`}>
                  {statusLabels[selectedOrder?.status] || selectedOrder?.status}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-2 p-2.5 text-sm border-b border-b-gray-200">
              <div
                className={`${openEditModal ? 'space-y-7' : 'space-y-2'} text-gray-500 text-left`}
              >
                <p>Tên khách hàng:</p>
                <p>Email:</p>
                <p>Số điện thoại:</p>
                <p>Địa chỉ:</p>
              </div>

              <div className="text-gray-800 font-medium flex flex-col gap-2.5">
                {openEditModal ? (
                  <Input
                    size="sm"
                    radius="md"
                    placeholder={selectedOrder?.customer_name || 'Khách lẻ'}
                    className="outline-0"
                    defaultValue={selectedOrder?.customer_name}
                  />
                ) : (
                  <p>{selectedOrder?.customer_name || 'Khách lẻ'}</p>
                )}

                {openEditModal ? (
                  <Input
                    size="sm"
                    radius="md"
                    placeholder={selectedOrder?.customer_email || 'N/A'}
                    className="outline-0"
                    defaultValue={selectedOrder?.customer_email}
                  />
                ) : (
                  <p className="text-pos-blue-500">{selectedOrder?.customer_email || 'N/A'}</p>
                )}

                {openEditModal ? (
                  <Input
                    size="sm"
                    radius="md"
                    placeholder={selectedOrder?.customer_phone || 'N/A'}
                    className="outline-0"
                    defaultValue={selectedOrder?.customer_phone}
                  />
                ) : (
                  <p className="font-semibold">{selectedOrder?.customer_phone || 'N/A'}</p>
                )}

                {openEditModal ? (
                  <Input
                    size="sm"
                    radius="md"
                    placeholder={selectedOrder?.customer_address || 'N/A'}
                    className="outline-0"
                    defaultValue={selectedOrder?.customer_address}
                  />
                ) : (
                  <p>{selectedOrder?.customer_address || 'N/A'}</p>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className={`${openEditModal ? 'border-b border-b-gray-200' : ''}`}>
              <h3 className="text-gray-700 px-2 mb-2.5">Thanh toán</h3>
              <div className="grid grid-cols-2 p-2.5 text-sm">
                <div className="text-gray-500 text-left space-y-2">
                  <p>Tạm tính:</p>
                  <p>Giảm giá:</p>
                  <p>Thuế:</p>
                  <p>Tổng tiền:</p>
                </div>

                <div className="text-gray-800 font-medium space-y-2">
                  <p>{formatCurrency(selectedOrder?.subtotal_amount)}</p>
                  <p>{formatCurrency(selectedOrder?.discount_amount)}</p>
                  <p>{formatCurrency(selectedOrder?.tax_amount)}</p>
                  <p className="font-bold text-green-600">
                    {formatCurrency(selectedOrder?.total_amount)}
                  </p>
                </div>
              </div>
            </div>

            {openEditModal && (
              <div className="flex items-center justify-end gap-3">
                <button
                  className="text-center text-red-600 font-bold px-3 py-1.5 cursor-pointer"
                  onClick={closeModals}
                >
                  Hủy
                </button>
                <button
                  className="rounded-md bg-pos-blue-400 px-3 py-1.5 text-white font-bold text-center cursor-pointer"
                  onClick={() => handleUpdateOrder({})} // You need to collect form data here
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            )}
          </div>
        )}
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
          actions={
            <>
              <button className="bg-pos-blue-400 border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Download size={16} className="text-white" />
                <span className="text-white font-medium text-xs">Xuất dữ liệu</span>
              </button>
            </>
          }
        />

        {/* TABLE AND PAGINATION */}
        <Table
          totalPages={20}
          tableHeaders={tableHeaders}
          data={orders}
          renderRow={(order, idx) => (
            <tr
              key={idx}
              className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300"
            >
              <td className="px-4 py-2 font-medium text-xs text-gray-500 truncate">
                {order.code || `#${order.id}`}
              </td>
              <td className="px-4 py-2 font-medium">{order.customer_name || 'Khách lẻ'}</td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {formatCurrency(order.total_amount)}
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
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                    onClick={() => handleEditOrder(order)}
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
            </tr>
          )}
        />
      </div>
    </>
  );
}
