'use client';
import { Tooltip } from '@mantine/core';
import { Button, Table } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
import { Store } from '@repo/design-system/types/store';
import { useAtomValue } from 'jotai';
import { Archive, ChevronRight, MoveLeft, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_MAP,
  PURCHASE_STATUS,
  PURCHASE_STATUS_MAP,
} from '../../../constants/status';
import { usePurchase } from '../../../hooks/purchase/use-purchase';
import { usePrint } from '../../../hooks/use-print';
import DetailLayout from '../../../layouts/detail-layout';
import { formatCurrency, formatDate, truncateText } from '../../../utils';
import InvoicePurchaseOrderPrintContent from '../../print/purchase-order-print-context';
import FormAccpetImportPayment from '../components/purchase-order/form-accpet-import-payment';
const tableHeaders = [
  'Tên sản phẩm',
  'Số lượng',
  'Đơn vị nhập',
  'Hệ số quy đổi',
  'Tổng hệ số quy đổi',
  'Giá niêm yết ',
  'Chiết khấu (VND | %)',
  'VAT (VND | %)',
  'Thành tiền',
];
export function PurchaseOrdersDetailView({ purchaseId }: { purchaseId: string }) {
  const router = useRouter();
  const currentStore = useAtomValue(currentStoreAtom);
  // HOOK

  const [isOpenModalAcceptPayment, setIsOpenModalAcceptPayment] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number | null>();
  // CUSTOM HOOKS
  const { getPurchaseOrder, acceptImportPurchase, loading, purchaseOrder } = usePurchase();
  const { handlePrint, printing, printRef } = usePrint({
    title: `hoa_don_nhap_${purchaseOrder?.order_number || ''}`,
  });
  const status = purchaseOrder?.status ? PURCHASE_STATUS_MAP[purchaseOrder.status] : null;
  const paymentStatus = purchaseOrder?.payment_status
    ? PAYMENT_STATUS_MAP[purchaseOrder.payment_status]
    : null;

  // EFFECT
  useEffect(() => {
    getPurchaseOrder(purchaseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseId]);
  return (
    <>
      <DetailLayout>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 cursor-pointer justify-center border border-gray-200 bg-white text-gray-500 rounded-md"
            >
              <MoveLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {purchaseOrder?.order_number}
              </h1>
              <span className="text-sm text-gray-500">
                {formatDate(purchaseOrder?.order_date || '', { showTime: true })}
              </span>
              <span
                className={`text-sm font-semibold ${status?.bgColor} ${status?.color} py-2 px-4 rounded-md font-semibold`}
              >
                {status?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              title="Hoàn trả"
              icon={<Archive size={18} />}
              variant="outline"
              onClick={() => {
                router.push(
                  `/dashboard/store/${currentStore?.id}/outbound-orders?purchase_order_id=${purchaseOrder?.order_number}`
                );
              }}
              size="sm"
              radius="sm"
            />
            {/* <Button
              title="Sửa đơn"
              icon={<PencilLine size={18} />}
              variant="outline"
              onClick={() => {
                showInfoToast('Chức năng đang được cập nhật. Xin lỗi vì sự bất tiện này!');
              }}
              size="sm"
              radius="sm"
            /> */}
            <div className="hidden">
              <InvoicePurchaseOrderPrintContent
                ref={printRef}
                purchaseOrder={purchaseOrder as PurchaseOrder}
                store={currentStore as Store}
              />
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
        {/* Table */}
        <div className="bg-white p-4 rounded-md space-y-6">
          <h2 className="text-lg font-semibold flex items-center justify-between">
            Danh sách đơn nhập
            <span
              className={`${status?.bgColor} ${status?.color} py-2 px-4 rounded-md text-sm font-semibold`}
            >
              {status?.label}
            </span>{' '}
          </h2>
          <Table
            hasPadding={false}
            hasPagination={false}
            tableHeaders={tableHeaders}
            data={purchaseOrder?.items || []}
            renderRow={(data) => (
              <>
                <Tooltip label={data?.item_name || ''} position="bottom" withArrow>
                  <td
                    onClick={() =>
                      router.push(
                        `/dashboard/store/${purchaseOrder?.store_id}/manage-products/detail/${data?.product_id}`
                      )
                    }
                    className="px-4 py-3 text-sm font-semibold text-blue-600 hover:underline cursor-pointer text-nowrap"
                  >
                    {truncateText(data?.item_name || '', 30) || 'N/A'}
                  </td>
                </Tooltip>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data?.quantity || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data?.unit || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data?.applied_factor || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data?.total_base_qty || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {formatCurrency(Number(data?.unit_cost) * Number(data?.total_base_qty)) || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  <div className="flex items-center ">
                    <span className="border-r border-r-gray-400 pr-2">
                      {formatCurrency(data?.discount_amount) || 'N/A'}
                    </span>
                    <span className="pl-2">{data?.discount_rate || 'N/A'}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  <div className="flex items-center ">
                    <span className="border-r border-r-gray-400 pr-2">
                      {formatCurrency(data?.tax_amount) || 'N/A'}
                    </span>
                    <span className="pl-2">{data?.tax_rate || 'N/A'}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {formatCurrency(Number(data?.total)) || 'N/A'}
                </td>
              </>
            )}
          />
          {purchaseOrder?.status === PURCHASE_STATUS.pending.value && (
            <div className="flex justify-end">
              <Button
                loading={loading}
                title="Nhập kho"
                onClick={async () => {
                  const success = await acceptImportPurchase(purchaseId);
                  if (success) getPurchaseOrder(purchaseId);
                }}
                size="sm"
                radius="sm"
              />
            </div>
          )}
        </div>
        {/* History purchase return */}
        <div className="bg-white p-4 rounded-md h-fit">
          <h2 className="text-lg font-semibold flex items-center justify-between">
            Lịch sử trả hàng
          </h2>
          {purchaseOrder?.purchase_returns.length === 0 && (
            <p className="text-sm text-gray-500 font-semibold text-center mt-5">
              Không có lịch sử trả hàng
            </p>
          )}
          {purchaseOrder &&
            purchaseOrder?.purchase_returns.length > 0 &&
            purchaseOrder?.purchase_returns.map((data, index) => (
              <div
                key={data.id}
                className={` space-y-3 mt-5 pl-3 ${purchaseOrder?.purchase_returns?.length - 1 !== index && 'border-b border-b-gray-200 pb-3'} `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-3.5 h-3.5 bg-pos-blue-500 p-1 border border-pos-blue-100 rounded-full"></div>
                  <span
                    onClick={() =>
                      router.push(
                        `/dashboard/store/${purchaseOrder?.store_id}/export-invoices/detail/${data?.id}`
                      )
                    }
                    className="text-sm text-pos-blue-500 font-semibold hover:underline cursor-pointer"
                  >
                    {data.return_number}
                  </span>
                  <div
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => {
                      setCurrentIdx((prev) => (prev === index ? null : index));
                    }}
                  >
                    <span className="text-sm text-gray-500">
                      {formatDate(data.return_date, {
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
    transition-all duration-300 ease-in-out
    ${
      index === currentIdx
        ? 'max-h-[500px] opacity-100 translate-y-0'
        : 'max-h-0 opacity-0 -translate-y-2'
    }
  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 ">Trạng thái hoàn trả: </span>
                    <span className={`${PAYMENT_STATUS_MAP[data.payment_status]?.color} text-sm  `}>
                      {PAYMENT_STATUS_MAP[data.payment_status]?.label}
                    </span>{' '}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 ">Người tạo đơn: </span>
                    <span className="text-sm text-gray-900 ">{data?.creator?.email} </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 ">Nhà cung cấp: </span>
                    <span className="text-sm text-gray-900 ">{data.supplier_name} </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 ">Tổng giá trị: </span>
                    <span className="text-sm text-gray-900 ">{formatCurrency(data?.total)} </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 ">Ghi chú: </span>
                    <span className="text-sm text-gray-900 ">{data.notes || 'N/A'} </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 ">Lý do: </span>
                    <span className="text-sm text-gray-900 ">{data.reason || 'N/A'} </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* THONG TIN  */}
        <div className="bg-white p-4 rounded-md space-y-6">
          {/* THONG TIN CHI TIET */}
          <div className="space-y-2 border-b border-b-gray-300 pb-4">
            <h2 className="text-lg font-semibold flex items-center justify-between">
              Chi tiết hóa đơn
            </h2>
            <div className="flex items-center justify-between ">
              <span className="text-sm">Mã phiếu nhập</span>
              <span className="text-sm font-semibold">{purchaseOrder?.order_number || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm"> Ngày nhập</span>
              <span className="text-sm font-semibold">
                {formatDate(purchaseOrder?.order_date || '') || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ngày dự kiện nhận</span>
              <span className="text-sm font-semibold">
                {!purchaseOrder?.expected_date ? 'N/A' : formatDate(purchaseOrder?.expected_date)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ngày nhận hàng</span>
              <span className="text-sm font-semibold">
                {!purchaseOrder?.received_date ? 'N/A' : formatDate(purchaseOrder?.received_date)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Người tạo</span>
              <span className="text-sm font-semibold">{purchaseOrder?.creator.email || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Nhà cung cấp</span>
              <span className="text-sm font-semibold">{purchaseOrder?.supplier.name || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ghi chú</span>
              <span className="text-sm font-semibold">{purchaseOrder?.notes || 'N/A'}</span>
            </div>
          </div>

          {/* THONG TIN THANH TOAN */}
          <div className="space-y-2 ">
            <h2 className="text-lg font-semibold flex items-center justify-between">
              Thông tin thanh toán
              <span
                className={`${paymentStatus?.color} ${paymentStatus?.bgColor} text-sm  py-2 px-4  rounded-md font-semibold`}
              >
                {paymentStatus?.label || 'N/A'}
              </span>{' '}
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Tổng giá niêm yết</span>
              <span className="text-base font-semibold">
                {formatCurrency(purchaseOrder?.subtotal || 0) || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Tổng chiết khấu</span>
              <span className="text-base font-semibold">
                {formatCurrency(purchaseOrder?.discount_amount || 0) || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Tổng thuế (VAT)</span>
              <span className="text-base font-semibold">
                {formatCurrency(purchaseOrder?.tax_amount || 0) || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Tổng tiền phải trả nhà cung cấp{' '}
              </span>
              <span className="text-base font-semibold text-pos-blue-500">
                {formatCurrency(purchaseOrder?.total || 0) || 'N/A'}
              </span>
            </div>
          </div>
          {purchaseOrder?.payments.length !== 0 &&
            purchaseOrder?.payments.map((payment) => (
              <div
                key={payment.id}
                className="py-4 px-2 bg-pos-blue-50 flex items-center justify-between font-semibold"
              >
                <p className="text-sm text-pos-blue-500 ">
                  Tiền cần trả nhà cung cấp: {formatCurrency(purchaseOrder?.total || 0)}
                </p>
                <p className="text-sm text-pos-blue-500 ">
                  Đã trả: {formatCurrency(payment?.unit_cost || 0)}
                </p>
                <p className="text-sm text-pos-blue-500 ">
                  Còn phải trả:{' '}
                  {formatCurrency(Number(purchaseOrder?.total) - Number(payment?.unit_cost) || 0)}
                </p>
              </div>
            ))}
          {purchaseOrder?.payment_status !== PAYMENT_STATUS.paid.value && (
            <div className="flex justify-end">
              <Button
                title="Thanh toán"
                onClick={() => {
                  setIsOpenModalAcceptPayment(true);
                }}
                size="sm"
                radius="sm"
              />
            </div>
          )}
        </div>
        {/* HISTORY */}
      </DetailLayout>
      <FormAccpetImportPayment
        isOpenModalAcceptPayment={isOpenModalAcceptPayment}
        setIsOpenModalAcceptPayment={setIsOpenModalAcceptPayment}
        purchaseOrder={purchaseOrder as PurchaseOrder}
        getPurchaseOrder={getPurchaseOrder}
      />
    </>
  );
}
