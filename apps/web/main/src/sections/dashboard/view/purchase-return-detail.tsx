'use client';

import { Tooltip } from '@mantine/core';
import { Button, Table } from '@repo/design-system/components/ui';
import { PurchaseReturn } from '@repo/design-system/types';
import { MoveLeft, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_MAP,
  PURCHASE_RETURN_STATUS_MAP,
} from '../../../constants/status';
import { usePurchaseReturn } from '../../../hooks/purchase-return/use-purchase-return';
import DetailLayout from '../../../layouts/detail-layout';
import FormAcceptExportPayment from '../../../sections/dashboard/components/purchase-return/form-accept-export-payment';
import { formatCurrency, formatDate, truncateText } from '../../../utils';

const tableHeaders = ['Mã SP', 'Tên sản phẩm', 'Số lượng', 'Đơn giá', 'Thành tiền'];

export function PurchaseReturnDetail({ purchaseReturnId }: { purchaseReturnId?: string }) {
  const router = useRouter();
  const { getPurchaseReturn, purchaseReturn } = usePurchaseReturn();
  const [isOpenModalAcceptPayment, setIsOpenModalAcceptPayment] = useState<boolean>(false);

  useEffect(() => {
    if (!purchaseReturnId) return;
    getPurchaseReturn(purchaseReturnId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseReturnId]);

  const status = purchaseReturn?.status ? PURCHASE_RETURN_STATUS_MAP[purchaseReturn.status] : null;
  const paymentStatus = purchaseReturn?.payment_status
    ? PAYMENT_STATUS_MAP[purchaseReturn.payment_status]
    : null;

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
                {purchaseReturn?.return_number}
              </h1>
              <span className="text-sm text-gray-500">
                {formatDate(purchaseReturn?.return_date || '', { showTime: true })}
              </span>
              <span
                className={`text-sm font-semibold ${status?.bgColor} ${status?.color} py-2 px-4 rounded-md font-semibold`}
              >
                {status?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <div className="hidden">
              <InvoicePurchaseOrderPrintContent
                ref={printRef}
                purchaseOrder={purchaseOrder as PurchaseOrder}
                store={currentStore as Store}
              />
            </div> */}
            <Button
              //   loading={printing}
              title="In đơn"
              icon={<Printer size={18} />}
              variant="outline"
              onClick={() => {
                // handlePrint();
              }}
              size="sm"
              radius="sm"
            />
          </div>
        </div>
        {/* Table */}
        <div className="bg-white p-4 rounded-md space-y-6">
          <h2 className="text-lg font-semibold flex items-center justify-between">
            Danh sách đơn trả hàng
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
            data={purchaseReturn?.items || []}
            renderRow={(data) => (
              <>
                <Tooltip label={data?.item_name || ''} position="bottom" withArrow>
                  <td
                    onClick={() =>
                      router.push(
                        `/dashboard/store/${purchaseReturn?.store_id}/manage-products/detail/${data?.product_id}`
                      )
                    }
                    className="px-4 py-3 text-sm font-semibold text-blue-600 hover:underline cursor-pointer text-nowrap"
                  >
                    {truncateText(data?.variant?.sku || '', 30) || 'N/A'}
                  </td>
                </Tooltip>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data?.item_name || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {data?.quantity || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {formatCurrency(data?.unit_cost) || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-500 ">
                  {formatCurrency(Number(data?.total)) || 'N/A'}
                </td>
              </>
            )}
          />
        </div>
        {/* THONG TIN  */}

        <div className="bg-white p-4 rounded-md space-y-4 flex-1">
          {/* THONG TIN THANH TOAN */}
          <div className="space-y-2 ">
            <h2 className="text-lg font-semibold flex items-center justify-between ">
              Thông tin thanh toán
              <span
                className={`${paymentStatus?.color} ${paymentStatus?.bgColor} text-sm  py-2 px-4  rounded-md font-semibold`}
              >
                {paymentStatus?.label || 'N/A'}
              </span>{' '}
            </h2>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-gray-700">Tổng giá trị trả </span>
              <span className="text-base font-semibold">
                {formatCurrency(purchaseReturn?.total || 0) || 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Tổng tiền phải trả nhà cung cấp{' '}
              </span>
              <span className="text-base font-semibold text-pos-blue-500">
                {formatCurrency(purchaseReturn?.total || 0) || 'N/A'}
              </span>
            </div>
          </div>
          {purchaseReturn?.payments.length !== 0 &&
            purchaseReturn?.payments.map((payment) => (
              <div
                key={payment.id}
                className="py-4 px-2 bg-pos-blue-50 flex items-center justify-between font-semibold"
              >
                <p className="text-sm text-pos-blue-500 ">
                  Tiền cần trả nhà cung cấp: {formatCurrency(purchaseReturn?.total || 0)}
                </p>
                <p className="text-sm text-pos-blue-500 ">
                  Đã trả: {formatCurrency(payment?.amount || 0)}
                </p>
                <p className="text-sm text-pos-blue-500 ">
                  Còn phải trả:{' '}
                  {formatCurrency(Number(purchaseReturn?.total) - Number(payment?.amount) || 0)}
                </p>
              </div>
            ))}
          {purchaseReturn?.payment_status !== PAYMENT_STATUS.paid.value && (
            <div className="flex justify-end">
              <Button
                title="Xác nhận hoàn tiền"
                onClick={() => {
                  setIsOpenModalAcceptPayment(true);
                }}
                size="sm"
                radius="sm"
              />
            </div>
          )}

          {/* THONG TIN NCC*/}
          <div className="space-y-2 ">
            <h2 className="text-lg font-semibold flex items-center justify-between ">
              Thông tin nhà cung cấp
            </h2>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-gray-700">Tên nhà cung cấp</span>
              <span className="text-base font-semibold">
                {purchaseReturn?.supplier?.name || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-gray-700">Mã NCC</span>
              <span className="text-base font-semibold">
                {purchaseReturn?.supplier?.code || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-gray-700">Mã thuế</span>
              <span className="text-base font-semibold">
                {purchaseReturn?.supplier?.tax_code || 'N/A'}
              </span>
            </div>
          </div>

          {/* THONG TIN boor sung*/}
          <div className="space-y-2 ">
            <h2 className="text-lg font-semibold flex items-center justify-between ">
              Thông tin bổ sung
            </h2>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-gray-700">Ghi chú</span>
              <span className="text-base font-semibold">{purchaseReturn?.notes || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-gray-700">Lý do</span>
              <span className="text-base font-semibold">{purchaseReturn?.reason || 'N/A'}</span>
            </div>
          </div>
        </div>
      </DetailLayout>
      <FormAcceptExportPayment
        isOpenModalAcceptPayment={isOpenModalAcceptPayment}
        setIsOpenModalAcceptPayment={setIsOpenModalAcceptPayment}
        purchaseReturn={purchaseReturn as PurchaseReturn}
        getPurchaseReturn={getPurchaseReturn}
      />
    </>
  );
}
