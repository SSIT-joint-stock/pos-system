'use client';
import { Drawer } from '@mantine/core';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { useOrders } from '../../../hooks/orders/use-orders';
import InvoicePrintContent from '../../print/invoice-print-context';

import { formatCurrency } from '../../../utils';

import { Button } from '@repo/design-system/components/ui';
import { Order } from '@repo/design-system/types';
import { Store } from '@repo/design-system/types/store';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { QrCode as QrCodeIc } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { formatPaymentMethod, payment_method } from '../../../constants/method';
import useStore from '../../../hooks/store/use-store';
import { usePrint } from '../../../hooks/use-print';
import { selectedVariant } from '../view';
import QrCode from './qr-code';

dayjs.extend(utc);
dayjs.extend(timezone);
interface InvoiceProps {
  openModalInvoice: boolean;
  newOrderId: string;
  priceCustomerPay: string;
  setOpenModalInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedVariants: React.Dispatch<React.SetStateAction<selectedVariant[]>>;
}

export default function Invoice({
  openModalInvoice,
  newOrderId,
  setOpenModalInvoice,
  setSelectedVariants,
}: InvoiceProps) {
  const currentStore = useAtomValue(currentStoreAtom);

  const { order, getOrderById } = useOrders();
  const { getStoreDetail, store } = useStore();
  const { printRef, printing, handlePrint } = usePrint({
    title: `hoa_don_ban_${order?.code}`,
  });
  const [isOpenModalQrCode, setIsOpenModalQrCode] = useState<boolean>(false);
  useEffect(() => {
    if (openModalInvoice && newOrderId) {
      getStoreDetail();
      getOrderById(newOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModalInvoice, newOrderId, currentStore?.id]);
  return (
    <>
      <Drawer
        title={
          <div className="flex items-center gap-4 text-lg font-medium text-gray-800">
            Chi tiết hóa đơn
            <button
              disabled={!currentStore?.qrPayment}
              onClick={() => setIsOpenModalQrCode(true)}
              className="cursor-pointer border border-gray-300 rounded-md p-1.5 hover:border-gray-800 transition-colors duration-300 disabled:cursor-text disabled:border-gray-300 disabled:hover:border-gray-300"
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
        size="xl"
        position="right"
        onClose={() => setOpenModalInvoice(false)}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <div className="flex justify-between flex-col h-full">
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
            <table style={{ width: '100%' }} className="mt-3.5 ">
              <colgroup>
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <tbody style={{ width: '100%' }} className="h-[50px] overflow-y-scroll">
                <tr className={'border-b border-b-gray-600 text-sm'}>
                  <th className="text-left">
                    <span>Sản phẩm</span>
                  </th>
                  <th className="text-left">
                    <span>Đơn giá</span>
                  </th>
                  <th className="text-left">
                    <span>Tổng thuế (VAT)</span>
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
                    <td className="text-left text-xs">
                      <span>{item.variant?.name}</span>
                    </td>
                    <td className="text-left text-xs">
                      <span>{formatCurrency(item.price)}</span>
                    </td>
                    <td className="text-left text-xs">
                      <span>
                        {formatCurrency(item.price * item.quantity * (item?.tax_rate / 100))}
                      </span>
                    </td>
                    <td className="text-center text-xs">
                      <span>{item.quantity}</span>
                    </td>
                    <td className="text-right text-xs font-semibold">
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
              className="border-t border-t-white border-b border-b-gray-600 my-3.5
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
          </div>
          <div className="flex items-center justify-end pb-4 mt-4 gap-3">
            <Button
              onClick={() => {
                setOpenModalInvoice(false);
                setSelectedVariants([]);
              }}
              radius="sm"
              size="sm"
              title="Hủy bỏ"
              variant="outline"
            />

            <div className="hidden">
              <InvoicePrintContent ref={printRef} order={order as Order} store={store as Store} />
            </div>
            <Button
              radius="sm"
              size="sm"
              loading={printing}
              onClick={() => handlePrint()}
              title="In hóa đơn"
            />
          </div>
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
