import { Order } from '@repo/design-system/types';
import { Store } from '@repo/design-system/types/store';
import dayjs from 'dayjs';
import Image from 'next/image';
import { forwardRef } from 'react';
import { formatPaymentMethod, payment_method } from '../../constants/method';
import { formatCurrency } from '../../utils';

interface InvoicePrintContentProps {
  order: Order;
  store?: Store;
}

// forwardRef để react-to-print truy cập DOM node
const InvoicePrintContent = forwardRef<HTMLDivElement, InvoicePrintContentProps>(
  ({ order, store }, ref) => {
    if (!order) return null;

    return (
      <div ref={ref} className="flex justify-between flex-col h-full pt-4">
        <div className="px-4">
          <h2 className="text-lg font-medium text-center">{store?.name || 'Store name'}</h2>
          <p className="text-center text-sm">
            Hotline: {store?.phone_number || <span className="italic">Chưa cập nhật</span>}
          </p>
          <p className="text-center text-sm">
            Địa chỉ: {store?.address || <span className="italic">Chưa cập nhật</span>}
          </p>
          <h1 className="text-xl text-center font-semibold uppercase">HÓA ĐƠN BÁN HÀNG</h1>
          <p className="text-sm text-center">
            {' '}
            Thời gian mua hàng:{' '}
            {dayjs(order?.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}
          </p>

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
                  <p>
                    {order?.customer?.name || order?.customer_name || (
                      <span className="italic">Khách lẻ</span>
                    )}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          {/* <div className="max-h-[240px] overflow-y-scroll"> */}
          <table style={{ width: '100%' }} className="mt-8 ">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <tbody style={{ width: '100%' }} className="h-[50px] overflow-y-scroll">
              <tr className={'border border-gray-900 text-sm p-2'}>
                <th className="text-left pl-2">
                  <span>Sản phẩm</span>
                </th>
                <th className="text-left pl-2">
                  <span>Đơn giá</span>
                </th>
                <th className="text-left pl-2">
                  <span>Tổng thuế (VAT)</span>
                </th>
                <th className="text-center">
                  <span>Số lượng</span>
                </th>
                <th className="text-right pr-2">
                  <span>Thành tiền</span>
                </th>
              </tr>
              {order?.order_item.map((item) => (
                <tr key={item.id} className={'border border-gray-900  p-2'}>
                  <td className="text-left text-xs border border-gray-800 p-2">
                    <span>{item.variant?.name}</span>
                  </td>
                  <td className="text-left text-xs  border border-gray-800 p-2">
                    <span>{formatCurrency(item.price)}</span>
                  </td>
                  <td className="text-left text-xs  border border-gray-800 p-2">
                    <span>
                      {formatCurrency(item.price * item.quantity * (item?.tax_rate / 100))}
                    </span>
                  </td>
                  <td className="text-center text-xs  border border-gray-800 p-2">
                    <span>{item.quantity}</span>
                  </td>
                  <td className="text-right text-xs  border border-gray-800 p-2">
                    <span>
                      {formatCurrency(
                        item.price * item.quantity + (item.tax_rate / 100) * item.price
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* </div> */}
          <hr
            className="border-t border-t-white border-b border-b-gray-800 my-4
             "
          />
          <table style={{ width: '100%' }} className="">
            <colgroup>
              <col style={{ width: '50%' }} />
              <col style={{ width: '50%' }} />
            </colgroup>
            <tbody className="font-semibold">
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
                  <p>Tổng thuế (VAT)</p>
                </td>
                <td className="text-right">
                  <p>{formatCurrency(order?.tax_amount)}</p>
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
          <div className="text-center mt-4 flex flex-col gap-0.5">
            <span className="text-lg font-semibold">Xin cảm ơn quý khách!</span>
            <span className="text-sm">Hẹn gặp lại!</span>
          </div>
          {store && (
            <div className="flex items-center justify-center mt-3">
              {store && store.store_payment[0] && store.store_payment[0].bank_qr_image_url && (
                <Image
                  placeholder="blur"
                  priority
                  blurDataURL={
                    store.store_payment[0].bank_qr_image_url || '/qr_code_placholder.svg'
                  }
                  src={
                    `${store.store_payment[0].bank_qr_image_url}&amount=${order?.customer_pay_amount}` ||
                    ''
                  }
                  className="object-cover"
                  alt="qr_code"
                  width={240}
                  height={240}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

InvoicePrintContent.displayName = 'InvoicePrintContent';
export default InvoicePrintContent;
