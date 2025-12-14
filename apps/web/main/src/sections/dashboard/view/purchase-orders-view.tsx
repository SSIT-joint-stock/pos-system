'use client';
import { MoveLeft, PencilLine, Printer } from 'lucide-react';
import { usePurchase } from '../../../hooks/purchase/use-purchase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_MAP,
  PURCHASE_STATUS,
  PURCHASE_STATUS_MAP,
} from '../../../constants/status';
import { formatCurrency, formatDate, truncateText } from '../../../utils';
import { Button, Table } from '@repo/design-system/components/ui';
import { Tooltip } from '@mantine/core';
import FormAccpetImportPayment from '../components/purchase-order/form-accpet-import-payment';
import { PurchaseOrder } from '@repo/design-system/types/purchase';
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
export function PurchaseOrdersView({ purchaseId }: { purchaseId: string }) {
  const router = useRouter();

  // HOOK

  const [isOpenModalAcceptPayment, setIsOpenModalAcceptPayment] = useState<boolean>(false);
  // CUSTOM HOOKS
  const { getPurchaseOrder, acceptImportPurchase, loading, purchaseOrder } = usePurchase();
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
      <div className="bg-gray-50 w-full h-full mx-auto overflow-auto scrollbar-none pb-10 ">
        <div className="mx-auto  max-w-7xl h-full space-y-8 ">
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
                title="Sửa đơn"
                icon={<PencilLine size={18} />}
                variant="outline"
                onClick={() => {}}
                size="sm"
                radius="sm"
              />
              <Button
                title="In đơn"
                icon={<Printer size={18} />}
                variant="outline"
                onClick={() => {}}
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
                className={`${status?.bgColor} ${status?.color} py-2 px-4 rounded-md text-sm font-medium`}
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
                    {formatCurrency(Number(data?.unit_cost) * Number(data?.total_base_qty)) ||
                      'N/A'}
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
          {/* THONG TIN  */}
          <div className="bg-white p-4 rounded-md space-y-6">
            {/* THONG TIN CHI TIET */}
            <div className="space-y-2 border-b border-b-gray-300 pb-4">
              <h2 className="text-lg font-semibold flex items-center justify-between">
                Chi tiết hóa đơn
              </h2>
              <div className="flex items-center justify-between ">
                <span className="text-sm">Mã phiếu nhập</span>
                <span className="text-sm font-semibold">
                  {purchaseOrder?.order_number || 'N/A'}
                </span>
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
                <span className="text-sm font-semibold">
                  {purchaseOrder?.creator.email || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Nhà cung cấp</span>
                <span className="text-sm font-semibold">
                  {purchaseOrder?.supplier.name || 'N/A'}
                </span>
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
                  className="py-4 border-y border-y-gray-300 flex items-center justify-between"
                >
                  <p className="text-sm text-gray-900 ">
                    Tiền cần trả nhà cung cấp: {formatCurrency(purchaseOrder?.total || 0)}
                  </p>
                  <p className="text-sm text-gray-900 ">
                    Đã trả: {formatCurrency(payment?.unit_cost || 0)}
                  </p>
                  <p className="text-sm text-gray-900 ">
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
        </div>
      </div>
      <FormAccpetImportPayment
        isOpenModalAcceptPayment={isOpenModalAcceptPayment}
        setIsOpenModalAcceptPayment={setIsOpenModalAcceptPayment}
        purchaseOrder={purchaseOrder as PurchaseOrder}
        getPurchaseOrder={getPurchaseOrder}
      />
    </>
  );
}
