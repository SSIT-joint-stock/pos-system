'use client';
import { NumberInput, Textarea, Tooltip } from '@mantine/core';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { Variant } from '@repo/design-system/types';
import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PAYMENT_STATUS_MAP } from '../../../constants/status';
import { usePurchase } from '../../../hooks/purchase/use-purchase';
import { DataActionBar } from '../../../sections/dashboard/components/data-action-bar';
import Header from '../../../sections/dashboard/components/purchase-order/header';
import { paymentStatusOptions } from '../../../sections/dashboard/view/import-invoices-view';
import { formatCurrency, formatDate, truncateText } from '../../../utils';
import { Sidebar } from '../components';
const tableHeaders = ['Tên sản phẩm', 'Đơn vị', 'Số lượng', 'Đơn giá trả', 'Lý do', 'Thành tiền'];
const tableHeadersPurchaseOrder = [
  'Mã đơn nhập',
  'Ngày tạo',
  'Nhà cung cấp',
  'Trạng thái thanh toán',
  'Số lượng',
  'Tổng tiền',
  'Thao tác',
];

export function OutboundOrders() {
  const searchParams = useSearchParams();

  const search = searchParams?.get('purchase_order_id');
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([] as Variant[]);
  const [isOpenModalSelectPurchase, setIsOpenModalSelectPurchase] = useState<boolean>(false);

  const { getPurchaseOrderByNumberCode, loading, purchaseOrder } = usePurchase();

  useEffect(() => {
    if (!search) return;
    getPurchaseOrderByNumberCode(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <div className="flex h-full overflow-hidden gap-6 ">
        {/* Main Content - Left Side */}
        <div className="flex-1 flex flex-col  overflow-hidden">
          {/* Header */}
          <Header
            setSelectedVariants={setSelectedVariants}
            selectedVariants={selectedVariants}
            setIsOpenModalSelectPurchase={setIsOpenModalSelectPurchase}
            purchaseOrder={purchaseOrder}
          />
          {/* Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow   h-full p-2">
            {!purchaseOrder ? (
              <div className="flex flex-col items-center justify-center gap-1.5 h-full">
                <h2 className="text-xl font-semibold text-gray-500 text-center ">
                  Bạn chưa thêm sản phẩm nào
                </h2>
                <Button radius="sm" title="Tạo đơn trả hàng nhập" size="sm" />
              </div>
            ) : (
              <Table
                hasPadding={false}
                isLoading={loading}
                tableHeaders={tableHeaders}
                data={purchaseOrder?.items || []}
                hasPagination={false}
                hasMarginTop={false}
                renderRow={(data) => (
                  <>
                    <Tooltip label={data?.item_name} position="bottom">
                      <td className="px-4 py-2.5 text-sm font-semibold text-blue-600 ">
                        {truncateText(data?.item_name, 30) || 'N/A'}
                      </td>
                    </Tooltip>
                    <td className="px-4 py-2.5 text-sm font-semibold ">{data?.unit || 'N/A'}</td>
                    <td className="px-4 py-2.5  ">
                      <div className="flex items-center gap-2">
                        <NumberInput
                          size="sm"
                          radius="sm"
                          min={0}
                          max={Number(data?.quantity)}
                          placeholder="Số lượng"
                          className="w-32"
                        />
                        <p className="text-sm ">
                          0/{data?.quantity} {data.unit}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold  hover:bg-gray-200 transition-colors duration-200 cursor-pointer rounded-md relative group">
                      <span className="flex items-center gap-2">
                        {formatCurrency(data?.total) || 'N/A'}
                        <ChevronDown size={16} />
                      </span>
                      <div className="absolute top-full mt-1 left-0 w-sm  h-fit bg-white z-10 shadow rounded-md p-4 space-y-3 hidden group-hover:block ">
                        <div className="flex items-center justify-between">
                          <span>Đơn giá nhập gốc </span>
                          <span className="text-pos-blue-500">
                            {formatCurrency(data?.unit_cost)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Đơn giá thuế </span>
                          <span>{formatCurrency(data?.tax_amount)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Đơn giá chiết khấu </span>
                          <span>{formatCurrency(data?.discount_amount)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold  ">
                      <Textarea
                        placeholder="Lý do trả sản phẩm ..."
                        className="text-sm text-gray-500 placeholder:text-sm placeholder:font-medium font-medium"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold  ">
                      {formatCurrency(data?.total) || 'N/A'}
                    </td>
                    {/* <td className="px-4 py-2.5   ">
                      <button
                        disabled
                        className="disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        <X size={18} />
                      </button>
                    </td> */}
                  </>
                )}
              />
            )}
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <Sidebar purchaseOrder={purchaseOrder} />
      </div>
      <Modal
        title={<p className="text-xl font-semibold">Chọn đơn nhập hàng để trả</p>}
        size="70%"
        opened={isOpenModalSelectPurchase}
        onClose={() => setIsOpenModalSelectPurchase(false)}
      >
        <ManagePurchaseOrderComplete
          isOpenModalSelectPurchase={isOpenModalSelectPurchase}
          setIsOpenModalSelectPurchase={setIsOpenModalSelectPurchase}
        />
      </Modal>
    </>
  );
}

function ManagePurchaseOrderComplete({
  isOpenModalSelectPurchase,
  setIsOpenModalSelectPurchase,
}: {
  isOpenModalSelectPurchase: boolean;
  setIsOpenModalSelectPurchase: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const {
    getPurchaseOrders,
    setFilters,
    setPaginationParams,
    purchaseOrders,
    loading,
    filters,
    pagination,
    paginationParams,
  } = usePurchase();

  useEffect(() => {
    if (!isOpenModalSelectPurchase) return;

    setFilters((prev) => ({
      ...prev,
      status: 'RECEIVED',
    }));
  }, [isOpenModalSelectPurchase, setFilters]);

  useEffect(() => {
    if (!isOpenModalSelectPurchase) return;
    if (!filters.status) return;
    getPurchaseOrders();
  }, [filters, paginationParams, isOpenModalSelectPurchase]);
  return (
    <div className="space-y-4 mt-4">
      <DataActionBar
        hasBg={false}
        setWidth="100%"
        placeholderSearch="Tìm kiếm mã phiếu nhập, tên hoặc mã nhà cung cấp / khách hàng"
        statusOptions={[
          {
            width: '200px',
            key: 'payment_status',
            label: 'Trạng thái thanh toán',
            options: paymentStatusOptions,
          },
        ]}
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({
            ...prev,
            ...newFilters,
            status: newFilters.status,
            payment_status: newFilters.payment_status,
          }));
        }}
        onSearch={(value) => {
          setFilters((prev) => ({ ...prev, q: value }));
        }}
        isHaveUpload={false}
        isHaveExport={false}
      />
      <Table
        hasMarginTop={false}
        hasPadding={false}
        tableHeaders={tableHeadersPurchaseOrder}
        data={purchaseOrders}
        isLoading={loading}
        total={pagination?.total}
        totalPages={pagination?.totalPages}
        page={pagination?.page}
        limit={pagination?.limit || 0}
        pageSize={pagination?.limit ?? paginationParams.limit}
        onPageChange={(page) =>
          setPaginationParams((prev) => ({
            ...prev,
            page: page,
          }))
        }
        onPageSizeChange={(size) =>
          setPaginationParams((prev) => ({
            ...prev,
            limit: size,
          }))
        }
        renderRow={(data) => (
          <>
            <td className="px-4 py-2.5 text-sm font-semibold text-blue-600 ">
              {data?.order_number || 'N/A'}
            </td>
            <td className="px-4 py-2.5 text-sm text-gray-600">
              {formatDate(data.createdAt) || 'N/A'}
            </td>
            <td className="px-4 py-2.5 text-sm text-pos-blue-500">
              {data?.supplier?.name || 'N/A'}
            </td>
            <td className="px-4 py-2.5 text-sm text-pos-blue-500 font-medium">
              <span
                className={`${PAYMENT_STATUS_MAP[data?.payment_status].color} ${PAYMENT_STATUS_MAP[data?.payment_status].bgColor} py-2 px-3 rounded-md text-nowrap`}
              >
                {PAYMENT_STATUS_MAP[data?.payment_status].label || 'N/A'}
              </span>
            </td>
            <td className="px-4 py-2.5 text-sm text-gray-600">{data?.items.length || 0}</td>
            <td className="px-4 py-2.5 text-sm text-gray-600">
              {formatCurrency(data?.total || 0)}
            </td>
            <td
              onClick={() => {
                router.push(`?purchase_order_id=${data.order_number}`);
                setIsOpenModalSelectPurchase(false);
              }}
              className="px-4 py-2.5 text-sm text-pos-blue-500 hover:underline font-semibold cursor-pointer"
            >
              <span className="">Trả hàng</span>
            </td>
          </>
        )}
      />
    </div>
  );
}
