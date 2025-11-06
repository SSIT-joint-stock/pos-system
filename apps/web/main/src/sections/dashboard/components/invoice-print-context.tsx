import React, { forwardRef } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { formatCurrency } from '../../../../../main/src/utils';
import { payment_method } from '@repo/design-system/types/inventory';
import { Order } from '@repo/design-system/types';
import { Store } from '@repo/design-system/types/store';

interface InvoicePrintContentProps {
  order: Order;
  currentStore: Store;
}

const formatPaymentMethod = (method: payment_method) => {
  const translations: Record<payment_method, string> = {
    [payment_method.CASH]: 'Tiền mặt',
    [payment_method.DEBIT_CARD]: 'Chuyển khoản',
    [payment_method.CREDIT_CARD]: 'Thẻ tín dụng',
  };
  return method ? translations[method] || 'Không xác định' : 'Chưa cập nhật';
};

// forwardRef để react-to-print truy cập DOM node
const InvoicePrintContent = forwardRef<HTMLDivElement, InvoicePrintContentProps>(
  ({ order, currentStore }, ref) => {
    if (!order) return null;

    return (
      <div ref={ref} className="p-4 text-sm text-gray-800">
        <h2 className="text-lg font-medium text-center">{currentStore?.name}</h2>
        <p className="text-center text-xs">Hotline: {currentStore?.phone_number}</p>
        <p className="text-center text-xs">Địa chỉ: {currentStore?.address}</p>
        <h1 className="text-center text-lg font-semibold uppercase mt-2">HÓA ĐƠN BÁN HÀNG</h1>
        <p className="text-center text-xs">{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</p>
        <table style={{ width: '100%' }} className="mt-3.5">
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '50%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="text-center">
                <p>Mã đơn hàng</p>
              </td>
              <td className="text-center">
                <strong>
                  {order?.code || <span className="italic text-sm">Chưa cập nhật</span>}
                </strong>
              </td>
            </tr>

            <tr>
              <td className="text-center">
                <p>Phương thức thanh toán</p>
              </td>
              <td className="text-center">
                <p>
                  {formatPaymentMethod(order?.payment_method as payment_method) || (
                    <span className="italic">Chưa cập nhật</span>
                  )}
                </p>
              </td>
            </tr>
            <tr>
              <td className="text-center">
                <p>Khách hàng</p>
              </td>
              <td className="text-center">
                <p>{order?.customer?.name || <span className="italic">Khách lẻ</span>}</p>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="w-full mt-3 text-xs">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="text-left">Sản phẩm</th>
              <th className="text-center">Số lượng</th>
              <th className="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.order_item.map((item, index) => (
              <tr
                key={item.id}
                // className={`${order.order_item.length - 1 === index ? '' : 'border-b border-b-gray-600'}`}
              >
                <td>{item.product?.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr
          className="border-t border-t-white border-b border-b-gray-600 my-3.5
        "
        />
        <table style={{ width: '100%' }} className="text-xs">
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '50%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="text-left">
                <p>Tạm tính</p>
              </td>
              <td className="text-right">
                <p>{formatCurrency(order?.subtotal_amount)}</p>
              </td>
            </tr>
            <tr>
              <td className="text-left">
                <p>Giảm giá</p>
              </td>
              <td className="text-right">
                <p>{formatCurrency(order?.discount_amount)}</p>
              </td>
            </tr>
            <tr>
              <td className="text-left">
                <p>Tổng cộng</p>
              </td>
              <td className="text-right">
                <p>{formatCurrency(order?.total_amount)}</p>
              </td>
            </tr>
            <tr>
              <td className="text-left">
                <p>Khách phải trả</p>
              </td>
              <td className="text-right">
                <p>{formatCurrency(order?.total_amount)}</p>
              </td>
            </tr>
            <tr>
              <td className="text-left">
                <p>Khách trả</p>
              </td>
              <td className="text-right">
                <p>{formatCurrency(order?.customer_pay_amount)}</p>
              </td>
            </tr>
            {order && order.change_amount > 0 && (
              <tr>
                <td className="text-left">
                  <p>Tiền thừa trả khách</p>
                </td>
                <td className="text-right">
                  <p>{formatCurrency(order.change_amount)}</p>
                </td>
              </tr>
            )}
            {order && order.change_amount < 0 && (
              <tr>
                <td className="text-left">
                  <p>Khách còn thiếu</p>
                </td>
                <td className="text-right">
                  <p>{formatCurrency(Math.abs(order.change_amount))}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-center mt-5 flex flex-col gap-0.5">
          <span className="text-lg font-semibold">Xin cảm ơn quý khách!</span>
          <span className="text-sm">Hẹn gặp lại!</span>
        </div>

        <div className="flex justify-center mt-5">
          <Image
            src={`${currentStore?.bank_qr_image_url}&amount=${order.customer_pay_amount}&addInfo=${currentStore?.name}`}
            alt="qr_code"
            width={180}
            height={180}
            className="object-cover"
          />
        </div>
      </div>
    );
  }
);

InvoicePrintContent.displayName = 'InvoicePrintContent';
export default InvoicePrintContent;
