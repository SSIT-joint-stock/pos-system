'use client';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Drawer } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { payment_method } from '@repo/design-system/types/inventory';
import { useOrders } from '../../../../../main/src/hooks/orders/use-orders';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import InvoicePrintContent from './invoice-print-context';

import { SelectedProduct } from '../view';
import { formatCurrency } from '../../../../../main/src/utils';

import React, { useEffect, useState } from 'react';
import { QrCode as QrCodeIc } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import QrCode from './qr-code';
import { Order } from '@repo/design-system/types';
import { Store } from '@repo/design-system/types/store';

dayjs.extend(utc);
dayjs.extend(timezone);
interface InvoiceProps {
  openModalInvoice: boolean;
  newOrderId: string;
  priceCustomerPay: string;
  setOpenModalInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProducts: React.Dispatch<React.SetStateAction<SelectedProduct[]>>;
}
const formatPaymentMethod = (method: payment_method) => {
  const translations: Record<payment_method, string> = {
    [payment_method.CASH]: 'Tiền mặt',
    [payment_method.DEBIT_CARD]: 'Chuyển khoản',
    [payment_method.CREDIT_CARD]: 'Thẻ tìn dụng',
  };

  return method ? translations[method] || 'Không xác định' : 'Chưa cập nhật';
};

export default function Invoice({
  openModalInvoice,
  newOrderId,
  setOpenModalInvoice,
  setSelectedProducts,
}: InvoiceProps) {
  const currentStore = useAtomValue(currentStoreAtom);
  const { order, getOrderById } = useOrders();
  const [isOpenModalQrCode, setIsOpenModalQrCode] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `invoice_${order?.code || 'order'}`,
  });
  useEffect(() => {
    if (openModalInvoice && newOrderId) {
      getOrderById(newOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModalInvoice, newOrderId]);
  return (
    <>
      <Drawer
        title={
          <div className="flex items-center gap-4 text-lg font-medium text-gray-800">
            Chi tiết hóa đơn
            <button
              onClick={() => setIsOpenModalQrCode(true)}
              className="cursor-pointer border border-gray-300 rounded-md p-1.5 hover:border-gray-800 transition-colors duration-300"
            >
              <QrCodeIc size={20} />
            </button>
          </div>
        }
        opened={openModalInvoice}
        styles={{
          body: {
            height: '92%',
            paddingBottom: 0,
            // padding: '16px',
          },
        }}
        size="lg"
        position="right"
        onClose={() => setOpenModalInvoice(false)}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <div>
          <div>
            <h2 className="text-lg font-medium text-center">
              {currentStore?.name || 'Store name'}
            </h2>
            <p className="text-center text-sm">
              Hotline: {currentStore?.phone_number || <span className="italic">Chưa cập nhật</span>}
            </p>
            <p className="text-center text-sm">
              Địa chỉ: {currentStore?.address || <span className="italic">Chưa cập nhật</span>}
            </p>
            <h1 className="text-xl text-center font-semibold uppercase">HÓA ĐƠN BÁN HÀNG</h1>
            <p className="text-sm text-center">
              {' '}
              Thời gian mua hàng:{' '}
              {dayjs(order?.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
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
          <table style={{ width: '100%' }} className="mt-3.5">
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <tbody style={{ width: '100%' }}>
              <tr className={'border-b border-b-gray-600'}>
                <th className="text-left">
                  <span>Sản phẩm</span>
                </th>
                <th className="text-left">
                  <span>Đơn giá</span>
                </th>
                <th className="text-center">
                  <span>Số lượng</span>
                </th>
                <th className="text-right">
                  <span>Thành tiền</span>
                </th>
              </tr>
              {order?.order_item.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${order.order_item.length - 1 === index ? '' : 'border-b border-b-gray-600'}`}
                >
                  <td className="text-left ">
                    <span>{item.product?.name}</span>
                  </td>
                  <td className="text-left">
                    <span>{formatCurrency(item.price)}</span>
                  </td>
                  <td className="text-center">
                    <span>{item.quantity}</span>
                  </td>
                  <td className="text-right">
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr
            className="border-t border-t-white border-b border-b-gray-600 my-3.5
        "
          />
          <table style={{ width: '100%' }} className="">
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
          <div className="text-center mt-4 flex flex-col gap-0.5">
            <span className="text-lg font-semibold">Xin cảm ơn quý khách!</span>
            <span className="text-sm">Hẹn gặp lại!</span>
          </div>
          <div className="flex items-center justify-center mt-3">
            <Image
              placeholder="blur"
              priority
              blurDataURL={currentStore?.bank_qr_image_url || ''}
              src={
                `${currentStore?.bank_qr_image_url}&amount=${order?.customer_pay_amount}&addInfo=${currentStore?.name}` ||
                ''
              }
              className="object-cover"
              alt="qr_code"
              width={240}
              height={240}
            />
          </div>
        </div>
        <div className="flex items-center justify-end pb-4 mt-4 gap-3">
          <button
            onClick={() => {
              setOpenModalInvoice(false);
              setSelectedProducts([]);
            }}
            className="py-2 px-6 rounded-md bg-green-50 text-green-500 hover:text-green-50 hover:bg-green-500 group cursor-pointer duration-300  transition-all text-sm"
          >
            Hủy bỏ
          </button>
          <div className="hidden">
            <InvoicePrintContent
              ref={printRef}
              order={order as Order}
              currentStore={currentStore as Store}
            />
          </div>
          <button
            onClick={() => handlePrint()}
            className="p-2 px-6 rounded-md bg-pos-blue-50 text-pos-blue-500 hover:text-pos-blue-50 hover:bg-pos-blue-500 group cursor-pointer duration-300  transition-all text-sm"
          >
            In hoá đơn
          </button>
        </div>
      </Drawer>
      <QrCode
        customer_pay_amount={order?.customer_pay_amount}
        isOpenModalQrCode={isOpenModalQrCode}
        setIsOpenQrCode={setIsOpenModalQrCode}
      />
    </>
  );
}
