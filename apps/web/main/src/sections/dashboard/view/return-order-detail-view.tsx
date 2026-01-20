'use client';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { order_return_status } from '@repo/design-system/types';
import { MoveLeft, PackageX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getOrderItemReturnReasonLabel,
  ORDER_RETURN_STATUS_MAP,
  ORDER_RETURN_TYPE_MAP,
  OrderItemReturnReason,
} from '../../../constants/reason-return';
import { useOrderReturn } from '../../../hooks/orders/use-order-return';
import DetailLayout from '../../../layouts/detail-layout';
import { formatCurrency, formatDate } from '../../../utils';

const tableHeaders = ['Mã SP', 'Tên SP', 'Số lượng', 'Đơn giá', 'Thành tiền', 'Lý do'];
export function ReturnOrderDetailView({ returnId }: { returnId?: string }) {
  const [isCancelReturnOrder, setIsCancelReturnOrder] = useState<boolean>(false);
  const router = useRouter();
  const { orderReturn, getReturnOrder, cancelOrderReturn } = useOrderReturn();
  useEffect(() => {
    if (!returnId) return;
    getReturnOrder(returnId);
  }, [returnId]);

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
                  {orderReturn?.order_number}
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
            {orderReturn?.return_status !== order_return_status.CANCELLED && (
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
          ``
        </div>
      </DetailLayout>
      <Modal
        size="lg"
        title={<p className="text-base font-semibold">Huỷ đơn trả hàng</p>}
        opened={isCancelReturnOrder}
        onClose={() => setIsCancelReturnOrder(false)}
      >
        <p className="text-center font-medium">
          Bạn có chắc chắn muốn hủy đơn trả hàng{' '}
          <span className="font-semibold">{orderReturn?.order_number}</span> không?
        </p>
        <p className="text-center font-medium mt-2 ">
          Sau khi hủy, yêu cầu trả hàng này sẽ không còn hiệu lực và không thể khôi phục lại. Vui
          lòng kiểm tra kỹ thông tin trước khi tiếp tục.
        </p>
        <div className="flex items-center gap-4 justify-end mt-5">
          <Button
            variant="default"
            onClick={() => setIsCancelReturnOrder(false)}
            size="sm"
            radius="sm"
            title="Hủy yêu cầu"
          />
          <Button
            onClick={async () => {
              if (!orderReturn) return;
              const success = await cancelOrderReturn(orderReturn?.id);
              if (success) {
                setIsCancelReturnOrder(false);
                getReturnOrder(orderReturn?.id);
              }
            }}
            color="#fb2c36"
            size="sm"
            radius="sm"
            title="Xác nhận hủy đơn hàng"
          />
        </div>
      </Modal>
    </>
  );
}
