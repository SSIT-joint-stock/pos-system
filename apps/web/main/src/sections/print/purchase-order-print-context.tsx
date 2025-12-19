import React, { forwardRef } from 'react';
import { formatCurrency, formatDate } from '../../utils';
import { Store } from '@repo/design-system/types/store';
import { formatPaymentMethod, payment_method } from '../../constants/method';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import HeaderInvoicePrint from './header-invoice-print';

interface InvoicePPurchaseOrderPrintContentProps {
  purchaseOrder: PurchaseOrder;
  store: Store;
}

const InvoicePurchaseOrderPrintContent = forwardRef<
  HTMLDivElement,
  InvoicePPurchaseOrderPrintContentProps
>(({ purchaseOrder }, ref) => {
  if (!purchaseOrder) return null;

  return (
    <div ref={ref} className="flex justify-between flex-col h-full pt-4">
      <div className="px-4">
        <HeaderInvoicePrint title="Hóa đơn nhập hàng" />
        {/* <p className="text-sm text-center">
            {' '}
            Thời gian mua hàng:{' '}
            {dayjs(order?.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm')}
          </p> */}

        <table style={{ width: '100%' }} className="mt-3.5">
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '50%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="text-center text-sm">
                <p>Mã đơn hàng</p>
              </td>
              <td className="text-center text-sm">
                <strong>
                  {purchaseOrder?.order_number || (
                    <span className="italic text-sm">Chưa cập nhật</span>
                  )}
                </strong>
              </td>
            </tr>

            <tr>
              <td className="text-center text-sm">
                <p>Phương thức thanh toán</p>
              </td>
              <td className="text-center text-sm">
                <p>
                  {formatPaymentMethod(purchaseOrder?.payment_method as payment_method) || (
                    <span className="italic">Chưa cập nhật</span>
                  )}
                </p>
              </td>
            </tr>
            <tr>
              <td className="text-center text-sm">
                <p>Nhà cung cấp / khách hàng</p>
              </td>
              <td className="text-center text-sm">
                <p>{purchaseOrder?.supplier?.name || <span className="italic">Khách lẻ</span>}</p>
              </td>
            </tr>
            <tr>
              <td className="text-center text-sm">
                <p>Ngày tạo đơn</p>
              </td>
              <td className="text-center text-sm">
                <p>
                  {formatDate(purchaseOrder?.order_date, { showTime: true }) || (
                    <span className="italic">Chưa cập nhật</span>
                  )}
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #000',
          }}
          className="mt-8"
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '8px' }}>STT</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Tên sản phẩm</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Số lượng</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Đơn vị</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>VAT (VND)</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Chiết khấu (VND)</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrder?.items?.map((item, index) => (
              <tr key={item.item_name}>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{index + 1}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{item.item_name}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{item.quantity}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{item.unit}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  {formatCurrency(item.tax_amount)}
                </td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  {formatCurrency(item.discount_amount)}
                </td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 w-full justify-between mt-5">
          <div className="w-full h-full"></div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tồng tiền niêm yết </span>
              <span className="text-sm">{formatCurrency(purchaseOrder?.total || 0) || ''}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tồng tiền niêm yết </span>
              <span className="text-sm">{formatCurrency(purchaseOrder?.total || 0) || ''}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Thuế (VAT) </span>
              <span className="text-sm">
                {formatCurrency(purchaseOrder?.tax_amount || 0) || ''}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm ">Chiết khấu </span>
              <span className="text-sm">
                {formatCurrency(purchaseOrder?.discount_amount || 0) || ''}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Tổng tiền</span>
              <span className="text-sm  font-semibold">
                {formatCurrency(purchaseOrder?.total || 0) || ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoicePurchaseOrderPrintContent.displayName = 'InvoicePurchaseOrderPrintContent';
export default InvoicePurchaseOrderPrintContent;
