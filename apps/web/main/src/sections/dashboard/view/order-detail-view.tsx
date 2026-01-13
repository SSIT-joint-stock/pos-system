'use client';
import { Button, Loading, Table } from '@repo/design-system/components/ui';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Order } from '@repo/design-system/types';
import { MoveLeft, Package, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { formatPaymentMethod, payment_method } from '../../../constants/method';
import { ORDER_STATUS, ORDER_STATUS_MAP } from '../../../constants/status';
import { useOrders } from '../../../hooks/orders/use-orders';
import { usePrint } from '../../../hooks/use-print';
import DetailLayout from '../../../layouts/detail-layout';
import InvoicePrintContent from '../../../sections/print/invoice-print-context';
import { formatCurrency, formatDate } from '../../../utils';

export function OrderDetailView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { showInfoToast } = useToast();
  const { getOrderById, order, loading } = useOrders();
  const { handlePrint, printing, printRef } = usePrint({
    title: `hoa_don_ban_${order?.code || ''}`,
  });
  useEffect(() => {
    getOrderById(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const status = ORDER_STATUS_MAP[order?.status ?? ''];

  return (
    <DetailLayout>
      {loading ? (
        <div className="flex items-center justify-center h-full ">
          <Loading color="#3b82f6" size="md" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 flex items-center hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 cursor-pointer justify-center border border-gray-200 bg-white text-gray-500 rounded-md"
              >
                <MoveLeft size={18} />
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">{order?.code}</h1>
                <span className="text-sm text-gray-500">
                  {formatDate(order?.createdAt || '', { showTime: true })}
                </span>

                {order && order.status && status && (
                  <>
                    <span
                      className={`text-sm font-semibold ${status.color} ${status.bgColor}  py-2 px-4 rounded-md font-semibold`}
                    >
                      {status.label}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                title="Trả hàng"
                icon={<Package size={18} />}
                variant="outline"
                onClick={() => {
                  showInfoToast('Chức năng đang được cập nhật. Xin lỗi vì sự bất tiện này!');
                }}
                size="sm"
                radius="sm"
              />
              <div className="hidden">
                <InvoicePrintContent ref={printRef} order={order as Order} />
              </div>
              <Button
                loading={printing}
                title="In đơn"
                icon={<Printer size={18} />}
                variant="outline"
                onClick={() => {
                  handlePrint();
                }}
                size="sm"
                radius="sm"
              />
            </div>
          </div>

          <div className="bg-white px-3 py-5 rounded-md">
            <h1 className="text-xl font-semibold mb-5">Thông tin tổng quan </h1>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="flex divide-x divide-gray-200 text-sm">
                {/* Mã đơn hàng */}
                <div className="flex-1 p-2">
                  <div className="text-gray-500">Mã đơn hàng</div>
                  <div className="text-pos-blue-500 font-semibold truncate">{order?.code}</div>
                </div>

                {/* Thông tin KH */}
                <div className="flex-1 p-2">
                  <div className="text-gray-500">Thông tin KH</div>
                  <div className="text-gray-900 font-medium">
                    {order?.customer_name || 'Khách lẻ'}
                  </div>
                </div>
                <div className="flex-1 p-2">
                  <div className="text-gray-500">Nhân viên tạo đơn</div>
                  <div className="text-gray-900 font-medium">
                    {order?.cashier?.email || order?.cashier?.username || 'Nhân viên'}
                  </div>
                </div>

                {/* Hình thức TT */}
                <div className="flex-1 p-2">
                  <div className="text-gray-500">Hình thức TT</div>
                  <div className="text-gray-900 font-medium">
                    {formatPaymentMethod(order?.payment_method as payment_method)}
                  </div>
                </div>

                {/* Ngày tạo */}
                <div className="flex-1 p-2">
                  <div className="text-gray-500">Ngày đặt hàng</div>
                  <div className="text-gray-900 font-medium">
                    {formatDate(order?.createdAt ?? '', { showTime: true })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white px-3 py-5 rounded-md">
            <h1 className="text-xl font-semibold mb-5">Danh sách sản phẩm</h1>

            <Table
              hasPagination={false}
              hasPadding={false}
              tableHeaders={[
                'Mã sản phẩm',
                'Tên sản phẩm',
                'Số lượng mua',
                'Đơn giá',
                'VAT (VND)',
                'Tổng tiền',
              ]}
              data={order?.order_item || []}
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
          </div>
          <div className="bg-white px-3 py-5 rounded-md flex flex-col">
            <div className="flex items-center justify-between w-full   mb-5">
              <h1 className="text-xl font-semibold">Tổng quan thanh toán</h1>
              {order && order.change_amount && (
                <p>
                  {order.change_amount > 0 && (
                    <td className="text-sm  font-semibold text-pos-blue-500">
                      Nợ KH: {formatCurrency(order.change_amount)}
                    </td>
                  )}
                  {order.change_amount < 0 && (
                    <td className="text-sm text-red-500 font-semibold">
                      KH nợ: {formatCurrency(Math.abs(order.change_amount))}
                    </td>
                  )}
                  {order.change_amount === 0 && (
                    <td className="text-sm text-green-500 font-semibold">Trả đủ</td>
                  )}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between border-y border-y-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Tạm tính</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(order?.subtotal_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Tổng VAT</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(order?.tax_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Tổng tiền (sau VAT)</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency((order?.tax_amount || 0) + (order?.subtotal_amount || 0))}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Giảm giá</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(order?.discount_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Số tiền phải trả</span>
              <span className="text-base font-semibold text-pos-blue-500">
                {formatCurrency(order?.total_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-b-gray-200 py-3">
              <span className="text-sm font-semibold text-gray-900">Khách trả</span>
              <span className="text-base font-semibold text-gray-900">
                {formatCurrency(order?.customer_pay_amount || 0)}
              </span>
            </div>
            {order && (
              <div className="flex items-center justify-between py-3 border-b border-b-gray-200">
                <span className="text-sm font-semibold text-gray-900">
                  {order?.change_amount < 0 ? 'Tiền nợ' : 'Tiền thừa'}
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(Math.abs(order?.change_amount || 0))}
                </span>
              </div>
            )}
            <div className="flex justify-end mt-6">
              {order?.status === ORDER_STATUS.pending.value && (
                <Button title="Nhận tiền" size="sm" radius="sm" />
              )}
            </div>
          </div>
        </div>
      )}
    </DetailLayout>
  );
}
