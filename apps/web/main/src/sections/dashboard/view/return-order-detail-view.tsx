'use client';
import { Divider } from '@mantine/core';
import { Button, Table } from '@repo/design-system/components/ui';
import { IOrderReturn, order_return_status, order_return_type } from '@repo/design-system/types';
import { MoveLeft, PackageX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getOrderItemReturnReasonLabel,
  ORDER_RETURN_STATUS_MAP,
  ORDER_RETURN_TYPE_MAP,
  OrderItemReturnReason,
} from '../../../constants/reason-return';
import { getPaymentMethodLabel } from '../../../constants/status';
import { useOrderReturn } from '../../../hooks/orders/use-order-return';
import DetailLayout from '../../../layouts/detail-layout';
import {
  FormAcceptPayment,
  FormAcceptStock,
  FormCancelReturn,
} from '../../../sections/dashboard/components/return-order';
import { formatCurrency, formatDate } from '../../../utils';

const tableHeaders = ['Mã SP', 'Tên SP', 'Yêu cầu trả', 'Đã trả', 'Đơn giá', 'Thành tiền', 'Lý do'];
export function ReturnOrderDetailView({ returnId }: { returnId?: string }) {
  const [isCancelReturnOrder, setIsCancelReturnOrder] = useState<boolean>(false);
  const [isAcceptReturnOrder, setIsAcceptReturnOrder] = useState<boolean>(false);
  const [isAcceptPayment, setIsAcceptPayment] = useState<boolean>(false);
  const router = useRouter();
  const {
    orderReturn,
    acceptQuantityForm,
    acceptPaymentForm,
    getReturnOrder,
    cancelOrderReturn,
    acceptStockQuantity,
    acceptPaymentReturn,
  } = useOrderReturn();
  useEffect(() => {
    if (!returnId) return;
    getReturnOrder(returnId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnId]);
  const canCancel = orderReturn && orderReturn.return_status !== order_return_status.REFUNDED;

  const canAcceptPayment =
    orderReturn &&
    ![order_return_status.CANCELLED, order_return_status.REFUNDED].includes(
      orderReturn.return_status
    );

  const canAcceptStock =
    (orderReturn && orderReturn.return_type !== order_return_type.FULL) ||
    orderReturn?.return_status === order_return_status.REQUESTED;

  console.log(orderReturn);
  return (
    <>
      <DetailLayout>
        <div className="flex items-center justify-between">
          <div className="flex  gap-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 cursor-pointer justify-center border border-gray-200 bg-white text-gray-500 rounded-md"
            >
              <MoveLeft size={18} />
            </button>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {orderReturn?.order_return_number}
                </h1>
                <span className="text-sm text-gray-500">
                  {formatDate(orderReturn?.createdAt || '', { showTime: true })}
                </span>
              </div>
              {orderReturn && (
                <div className="flex gap-3 h-fit">
                  <span
                    className={`text-sm font-semibold ${ORDER_RETURN_STATUS_MAP[orderReturn?.return_status]?.color} ${ORDER_RETURN_STATUS_MAP[orderReturn?.return_status]?.bgColor}  py-2 px-4 rounded-md font-semibold`}
                  >
                    {ORDER_RETURN_STATUS_MAP[orderReturn?.return_status]?.label}
                  </span>{' '}
                  <span
                    className={`text-sm font-semibold ${ORDER_RETURN_TYPE_MAP[orderReturn?.return_type]?.color} ${ORDER_RETURN_TYPE_MAP[orderReturn?.return_type]?.bgColor} py-2 px-4 rounded-md font-semibold`}
                  >
                    {ORDER_RETURN_TYPE_MAP[orderReturn?.return_type]?.label}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canCancel && (
              <Button
                onClick={() => setIsCancelReturnOrder(true)}
                title="Hủy đơn trả hàng"
                icon={<PackageX size={18} />}
                variant="outline"
                size="sm"
                radius="sm"
              />
            )}
          </div>
        </div>
        {/* Table */}
        <div className="bg-white p-4 rounded-md space-y-6">
          <h2 className="text-lg font-semibold ">Danh sách đơn trả hàng</h2>
          <Table
            hasPadding={false}
            hasPagination={false}
            tableHeaders={tableHeaders}
            data={orderReturn?.items || []}
            renderRow={(data) => (
              <>
                <td className="px-4 py-3 text-sm  text-pos-blue-500 font-semibold cursor-pointer hover:underline">
                  {data?.variant.sku || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data?.item_name || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data?.quantity || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data.quantity_refunded}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {formatCurrency(data?.total) || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {formatCurrency(data?.total) || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {getOrderItemReturnReasonLabel(data?.reason_status as OrderItemReturnReason)}
                </td>
              </>
            )}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Tổng tiền hàng</span>
              <span className="text-base font-semibold">
                {formatCurrency(orderReturn?.total || 0)}
              </span>
            </div>
            <Divider />
            {orderReturn?.return_status !== order_return_status.REFUNDED && (
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Gợi ý hoàn tiền</span>
                <span className="text-pos-blue-500 font-semibold text-base">
                  {formatCurrency(orderReturn?.suggest_total || 0)}
                </span>
              </div>
            )}
            {orderReturn?.return_status === order_return_status.REFUNDED && (
              <>
                {orderReturn?.payment.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">Tổng đã hoàn tiền</span>
                      <span className="text-green-500 font-semibold text-base">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <Divider />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">Phương thức hoàn tiền</span>
                      <span className=" font-semibold text-base">
                        {getPaymentMethodLabel(item.payment_method)}
                      </span>
                    </div>
                    <Divider />

                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">Ngày hoàn tiền</span>
                      <span className=" font-semibold text-base">
                        {formatDate(item.createdAt, { showTime: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            {canAcceptPayment && (
              <Button
                onClick={() => setIsAcceptPayment(true)}
                variant="outline"
                size="sm"
                radius="sm"
                title={'Xác nhận hoàn tiền'}
              />
            )}
            {canAcceptStock && (
              <Button
                onClick={() => setIsAcceptReturnOrder(true)}
                size="sm"
                radius="sm"
                title={'Nhận hàng'}
              />
            )}
          </div>
        </div>
        {/* Information  */}
        <div className="bg-white p-4 rounded-md space-y-4">
          <h2 className="text-lg font-semibold ">
            Thông tin phiếu trả {orderReturn?.order_number}
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Hóa đơn bán</span>
            <span className="text-sm font-semibold text-pos-blue-500">
              {orderReturn?.order_number || 'Hóa đơn bán'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Khách hàng</span>
            <span className="text-sm font-semibold">
              {orderReturn?.customer_name || 'Khách lẻ'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Ngày tạo</span>
            <span className="text-sm font-semibold">
              {formatDate(orderReturn?.createdAt || new Date(), { showTime: true })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Lý do</span>
            <span className="text-sm font-semibold">{orderReturn?.reason || 'N/A'}</span>
          </div>
        </div>
      </DetailLayout>
      {orderReturn && (
        <FormCancelReturn
          cancelOrderReturn={cancelOrderReturn}
          getReturnOrder={getReturnOrder}
          isCancelReturnOrder={isCancelReturnOrder}
          setIsCancelReturnOrder={setIsCancelReturnOrder}
          orderReturn={orderReturn as IOrderReturn}
        />
      )}
      {orderReturn && (
        <FormAcceptStock
          isOpen={isAcceptReturnOrder}
          acceptQuantityForm={acceptQuantityForm}
          orderReturn={orderReturn as IOrderReturn}
          onClose={() => setIsAcceptReturnOrder(false)}
          acceptStockQuantity={acceptStockQuantity}
          getReturnOrder={getReturnOrder}
        />
      )}
      <FormAcceptPayment
        acceptPaymentForm={acceptPaymentForm}
        isOpenModalAcceptPayment={isAcceptPayment}
        orderReturn={orderReturn as IOrderReturn}
        acceptPaymentReturn={acceptPaymentReturn}
        setIsOpenModalAcceptPayment={setIsAcceptPayment}
        getReturnOrder={getReturnOrder}
      />
    </>
  );
}
