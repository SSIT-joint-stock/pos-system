'use client';
import { Button, Loading, Table } from '@repo/design-system/components/ui';
import { Order } from '@repo/design-system/types';
import { ChevronRight, MoveLeft, Package, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ORDER_RETURN_STATUS_MAP, ORDER_RETURN_TYPE_MAP } from '../../../constants/reason-return';
import { ORDER_STATUS, ORDER_STATUS_MAP } from '../../../constants/status';
import { useOrders } from '../../../hooks/orders/use-orders';
import { usePrint } from '../../../hooks/use-print';
import DetailLayout from '../../../layouts/detail-layout';
import InvoicePrintContent from '../../../sections/print/invoice-print-context';
import { formatCurrency, formatDate } from '../../../utils';

export function OrderDetailView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { getOrderById, order, loading } = useOrders();
  const [currentIdx, setCurrentIdx] = useState<number | null>();

  const { handlePrint, printing, printRef } = usePrint({
    title: `hoa_don_ban_${order?.code || ''}`,
  });
  useEffect(() => {
    getOrderById(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const status = ORDER_STATUS_MAP[order?.status ?? ''];
  console.log(order);

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
                onClick={() =>
                  router.push(
                    `/dashboard/store/${order?.store_id}/returned-orders?order_number=${order?.code}`
                  )
                }
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
            <h1 className="text-lg font-semibold mb-5">Danh sách sản phẩm</h1>

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

          {/* History order return */}
          <div className="bg-white p-4 rounded-md h-fit">
            <h2 className="text-lg font-semibold flex items-center justify-between">
              Lịch sử trả hàng
            </h2>
            {order?.order_return.length === 0 && (
              <p className="text-sm text-gray-500 font-semibold text-center mt-5">
                Không có lịch sử trả hàng
              </p>
            )}
            {order &&
              order?.order_return.length > 0 &&
              order?.order_return.map((data, index) => (
                <div
                  key={data.id}
                  className={` space-y-3 mt-5 pl-3 ${order?.order_return?.length - 1 !== index && 'border-b border-b-gray-200 pb-3'} `}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 bg-pos-blue-500 p-1 border border-pos-blue-100 rounded-full"></div>
                    <span
                      onClick={() =>
                        router.push(
                          `/dashboard/store/${order?.store_id}/returned-invoices/detail/${data?.id}`
                        )
                      }
                      className="text-sm text-pos-blue-500 font-semibold hover:underline cursor-pointer"
                    >
                      {data.order_return_number}
                    </span>
                    <div
                      className="flex items-center gap-4 cursor-pointer group"
                      onClick={() => {
                        setCurrentIdx((prev) => (prev === index ? null : index));
                      }}
                    >
                      <span className="text-sm text-gray-500">
                        {formatDate(data.createdAt, {
                          showTime: true,
                        }) || 'N/A'}
                      </span>
                      <ChevronRight
                        size={16}
                        className={`
    text-gray-500 group-hover:text-gray-900 transition-transform duration-300
    ${index === currentIdx ? 'rotate-90' : ''}
  `}
                      />
                    </div>
                  </div>
                  <div
                    className={`
    space-y-2.5 w-[60%]
    overflow-hidden
    transition-all duration-300 ease-in-out  ${
      index === currentIdx
        ? 'max-h-[500px] opacity-100 translate-y-0'
        : 'max-h-0 opacity-0 -translate-y-2'
    }
   
  `}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 ">Trạng thái hoàn trả: </span>
                      <span
                        className={`${ORDER_RETURN_STATUS_MAP[data.return_status]?.color} text-sm  `}
                      >
                        {ORDER_RETURN_STATUS_MAP[data.return_status]?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 ">Trạng thái nhận hàng: </span>
                      <span
                        className={`${ORDER_RETURN_TYPE_MAP[data.return_type]?.color} text-sm  `}
                      >
                        {ORDER_RETURN_TYPE_MAP[data.return_type]?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 ">Khách hàng: </span>
                      <span className={`text-sm  `}>{data.customer_name || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-white px-3 py-5 rounded-md flex flex-col">
            <div className="flex items-center justify-between w-full   mb-5">
              <h1 className="text-lg font-semibold">Tổng quan thanh toán</h1>
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
