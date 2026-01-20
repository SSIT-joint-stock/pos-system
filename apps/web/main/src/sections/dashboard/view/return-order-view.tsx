/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Divider, NumberInput, Textarea, Tooltip } from '@mantine/core';
import { Button, Input, Modal, Select, Table } from '@repo/design-system/components/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { formatPaymentMethod, payment_method } from '../../../constants/method';
import { ORDER_ITEM_RETURN_REASON_OPTIONS } from '../../../constants/reason-return';
import { ORDER_STATUS_MAP } from '../../../constants/status';
import { useOrderReturn } from '../../../hooks/orders/use-order-return';
import { useOrders } from '../../../hooks/orders/use-orders';
import ReturnProductLayout from '../../../layouts/return-product-layout';
import Header from '../../../sections/dashboard/components/purchase-order/header';
import { formatCurrency, formatDate, truncateText } from '../../../utils';
const tableHeaders = [
  'Mã Đơn Hàng',
  'Số lượng',
  'Khách Hàng',
  'Giá bán',
  'Đã thanh toán',
  'Phương Thức TT',
  'Trạng Thái Đơn Hàng',
  'Ngày Tạo',
  'Thao tác',
];

const tableHeadersSelected = [
  'Sản phẩm',
  '	Số lượng gốc',
  'Số lượng đã trả',
  'Số lượng trả',
  'Đơn giá',
  'Lý do trả',
  'Thành tiền',
];
export default function ReturnOrderView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.get('order_number');

  const [isOpenModalOrders, setIsOpenModalOrders] = useState<boolean>(false);

  const {
    getOrders,
    getOrderByCode,
    setOrder,
    setPaginationParams,
    orders,
    order,
    loading,
    pagination,
    paginationParams,
  } = useOrders();
  const {
    createReturnOrder,
    orderReturnForm: { control, reset, watch, handleSubmit, register },
    loading: loadingReturnOrder,
  } = useOrderReturn();
  const { fields, append } = useFieldArray({
    control,
    name: 'items',
  });
  const watchedItems = watch('items');

  useEffect(() => {
    if (!search) return;
    getOrderByCode(search);
  }, [search]);

  useEffect(() => {
    if (!isOpenModalOrders) return;
    getOrders();
  }, [isOpenModalOrders]);

  useEffect(() => {
    if (!order) return;
    reset({
      items: [],
    });
    order.order_item.forEach((item) => {
      append({
        order_item_id: item.id,
        quantity: 0,
      });
    });
  }, [append, reset, order]);
  return (
    <>
      <ReturnProductLayout
        sidebar={
          <form
            onSubmit={handleSubmit(async (data) => {
              const success = await createReturnOrder(order?.id || '', data);
              if (success) {
                setOrder(null);
                reset({
                  items: [],
                  order_return_number: '',
                  reason: '',
                });
                router?.replace(pathname || '/');
              }
            })}
            className="flex flex-col justify-between p-4 h-full"
          >
            <div className="space-y-5 h-full">
              <h2 className="text-base font-semibold">Chi tiết đơn trả hàng bán {order?.code}</h2>
              <Input
                {...register('order_return_number')}
                size="sm"
                radius="sm"
                label="Mã đơn trả hàng"
                placeholder="Nhập mã đơn trả hàng"
              />
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <Textarea
                    onChange={(value) => field.onChange(value)}
                    label={<p className="text-sm text-gray-500">Lý do trả hàng</p>}
                    size="sm"
                    radius={'sm'}
                    placeholder="Nhập lý do hoàn trả hàng"
                  />
                )}
              />

              <Divider />
              <h3 className="text-base font-semibold">Than toán đơn trả</h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-900">Tổng hoàn sản phẩm</p>
                  <span className="text-xs text-gray-500 font-medium">
                    {fields.length} sản phẩm
                  </span>
                </div>
                <span className="text-gray-900 text-sm font-medium">
                  {formatCurrency(order?.total_amount || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-gray-900">Tổng hoàn trả</p>
                <span className="text-gray-900 text-sm font-semibold">
                  {formatCurrency(order?.total_amount || 0)}
                </span>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-gray-900">Gợi ý hoàn tiền</p>
                <span className="text-pos-blue-500 text-base font-semibold">
                  {formatCurrency(order?.customer_pay_amount || 0)}
                </span>
              </div>
              <Divider />
            </div>
            <Button
              loading={loadingReturnOrder}
              disabled={fields.length === 0}
              title="Tạo đơn trả hàng"
              type="submit"
              className="w-full h-full"
              size="sm"
              radius="sm"
            />
          </form>
        }
      >
        <Header
          title={`Tạo đơn trả hàng bán ${order?.code || ''}`}
          haveSearch={false}
          setOrder={setOrder}
        />
        <div className="flex-1 bg-white rounded-md shadow   h-full p-2">
          {fields.length === 0 || !order ? (
            <div className="flex flex-col items-center justify-center gap-1.5 h-full">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center ">
                Bạn chưa thêm đơn hàng bán nào
              </h2>
              <Button
                type="button"
                size="sm"
                radius="sm"
                title="Tạo đơn trả hàng bán"
                onClick={() => setIsOpenModalOrders(true)}
              />
            </div>
          ) : (
            <>
              <Table
                hasMarginTop={false}
                hasPadding={false}
                hasPagination={false}
                tableHeaders={tableHeadersSelected}
                data={fields}
                renderRow={(data, index) => {
                  const orderItem = order?.order_item[index];
                  const maxQuantityOrder =
                    (orderItem?.quantity || 0) - (orderItem?.quantity_return || 0);
                  // const item = watchedItems[index];

                  return (
                    <>
                      {orderItem && (
                        <>
                          <Tooltip label={orderItem?.variant?.name} position="bottom">
                            <td className="px-4 py-2.5 text-sm font-semibold text-blue-600 ">
                              {truncateText(orderItem?.variant?.name || '', 30)}
                            </td>
                          </Tooltip>
                          <td className="px-4 py-2.5 text-sm font-semibold text-gray-600 ">
                            {orderItem?.quantity}
                          </td>
                          <td className="px-4 py-2.5 text-sm font-semibold text-gray-600">
                            {orderItem?.quantity_return}
                          </td>

                          <td className="px-4 py-2.5">
                            <Controller
                              name={`items.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <div className="space-y-1">
                                  <NumberInput
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(val) => {
                                      if (val === '' || val === null) {
                                        field.onChange(0);
                                        return;
                                      }
                                      const num = Number(val);
                                      if (num > maxQuantityOrder) {
                                        field.onChange(maxQuantityOrder);
                                        return;
                                      }
                                      field.onChange(num);
                                    }}
                                    min={0}
                                    max={maxQuantityOrder}
                                    clampBehavior="strict"
                                    allowDecimal={false}
                                    hideControls
                                    placeholder="0"
                                    size="sm"
                                    radius="sm"
                                    className="w-32"
                                  />
                                  <p className="text-xs text-gray-500">
                                    Có thể trả: {orderItem?.quantity - orderItem?.quantity_return}
                                  </p>
                                </div>
                              )}
                            />
                          </td>
                          <td className="px-4 py-2.5 text-sm font-semibold text-gray-600">
                            {formatCurrency(orderItem?.price || '')}
                          </td>
                          <td className="px-4 py-2.5 text-sm font-semibold text-gray-600">
                            <Controller
                              control={control}
                              name={`items.${index}.reason_status`}
                              render={({ field }) => (
                                <Select
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  placeholder="Lý do trả"
                                  size="sm"
                                  className="text-sm font-medium"
                                  disabled={watchedItems[index].quantity === 0}
                                  radius="sm"
                                  data={ORDER_ITEM_RETURN_REASON_OPTIONS}
                                  position="bottom"
                                />
                              )}
                            />
                          </td>
                          <td className="px-4 py-2.5 text-sm font-semibold text-blue-600 ">
                            {formatCurrency(orderItem?.price || '')}
                          </td>
                        </>
                      )}
                    </>
                  );
                }}
              />
            </>
          )}
        </div>
      </ReturnProductLayout>
      <Modal
        opened={isOpenModalOrders}
        onClose={() => setIsOpenModalOrders(false)}
        size="80%"
        title={<p className="text-base font-semibold">Danh sách các đơn hàng</p>}
      >
        {/* TABLE AND PAGINATION */}
        <Table
          total={pagination?.total}
          page={pagination?.page}
          hasPadding={false}
          hasMarginTop={false}
          limit={pagination?.limit}
          totalPages={pagination?.totalPages}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageChange={(page) => setPaginationParams((prev) => ({ ...prev, page }))}
          onPageSizeChange={(size) =>
            setPaginationParams((prev) => ({
              ...prev,
              limit: size,
            }))
          }
          tableHeaders={tableHeaders}
          data={orders}
          isLoading={loading}
          renderRow={(order) => (
            <>
              <td
                onClick={() => router.push(`sales-invoices/detail/${order.id}`)}
                className="px-4 py-3 text-sm text-pos-blue-600 font-semibold truncate hover:underline cursor-pointer"
              >
                {order.code || (
                  <span className="italic text-gray-500 font-medium">Chưa cập nhật</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 font-semibold truncate">
                {order?.order_item?.length || (
                  <span className="italic text-gray-500 font-medium">Chưa cập nhật</span>
                )}
              </td>
              <td className="px-4 py-3 font-medium italic text-gray-500 text-sm">
                {truncateText(order?.customer_name || 'Khách lẻ', 16)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                {formatCurrency(order.total_amount)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                {formatCurrency(order.customer_pay_amount)}
              </td>

              <td className="px-4 py-3 text-sm font-semibold text-gray-500">
                {formatPaymentMethod(order.payment_method as payment_method)}
              </td>
              <td className="px-4 py-3">
                {order.status && (
                  <span
                    className={`text-sm font-medium rounded-sm p-2  ${ORDER_STATUS_MAP[order.status].color} ${ORDER_STATUS_MAP[order.status].bgColor}`}
                  >
                    {ORDER_STATUS_MAP[order.status].label || order.status}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td
                onClick={() => {
                  setIsOpenModalOrders(false);
                  router.push(`?order_number=${order.code}`);
                }}
                className="px-4 py-3  text-sm text-pos-blue-500 font-semibold cursor-pointer hover:underline"
              >
                Trả hàng
              </td>
            </>
          )}
        />
      </Modal>
    </>
  );
}
