/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Menu } from '@mantine/core';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { Variant } from '@repo/design-system/types';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { PAYMENT_STATUS_MAP } from '../../../constants/status';
import { usePurchaseReturn } from '../../../hooks/purchase-return/use-purchase-return';
import { usePurchase } from '../../../hooks/purchase/use-purchase';
import ReturnProductLayout from '../../../layouts/return-product-layout';
import { DataActionBar } from '../../../sections/dashboard/components/data-action-bar';
import Header from '../../../sections/dashboard/components/purchase-order/header';
import TableWithPo from '../../../sections/dashboard/components/purchase-return/table-with-po';
import TableWithoutPO from '../../../sections/dashboard/components/purchase-return/table-without-po';
import { paymentStatusOptions } from '../../../sections/dashboard/view/import-invoices-view';
import { formatCurrency, formatDate } from '../../../utils';
import { Sidebar } from '../components';

export function OutboundOrders() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const search = searchParams?.get('purchase_order_id');
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([] as Variant[]);
  const [isOpenModalSelectPurchase, setIsOpenModalSelectPurchase] = useState<boolean>(false);
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);

  const { getPurchaseOrderByNumberCode, setPurchaseOrder, loading, purchaseOrder } = usePurchase();
  const {
    createPurchaseReturnWithPO,
    createPurchaseReturnWithoutPO,
    formPurchaseWithPO: { control, watch, register, reset, handleSubmit },
    formPurchaseWithoutPO: {
      control: controlWithoutPO,
      watch: watchWithoutPO,
      reset: resetWithoutPO,
      handleSubmit: handleSubmitWithoutPO,
      formState: { errors: errorsWithoutPO },
      setValue: setValueWithoutPO,
    },
    loading: loadingCreate,
  } = usePurchaseReturn();
  const { fields, append } = useFieldArray({
    control,
    name: 'items',
  });

  const {
    fields: fieldsWithoutPO,
    append: appendWithoutPO,
    remove: removeWithoutPO,
    update: updateWithoutPO,
  } = useFieldArray({
    control: controlWithoutPO,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedItemsWithoutPO = watchWithoutPO('items');
  const itemsLength = watchedItems.length;
  const itemsLengthWithoutPO = watchedItemsWithoutPO.length;

  useEffect(() => {
    if (!search) return;
    getPurchaseOrderByNumberCode(search);
  }, [search]);

  useEffect(() => {
    if (!purchaseOrder) return;
    reset({
      items: [],
    });
    purchaseOrder.items.forEach((item) => {
      append({
        purchase_order_item_id: item.id,
        quantity: 0,
        unit_cost: Number(item.unit_cost),
        reason: null,
      });
    });
    // purchaseOrder.items
    //   .filter((item) => Number(item.quantity) - Number(item.quantity_returned) > 0)
    //   .forEach((item) => {
    //     append({
    //       purchase_order_item_id: item.id,
    //       quantity: 0,
    //       unit_cost: Number(item.unit_cost),
    //       reason: null,
    //     });
    //   });
  }, [purchaseOrder]);

  const total = watchedItems.reduce(
    (prev, current) => prev + current.quantity * current.unit_cost,
    0
  );
  const totalWithoutPO = watchedItemsWithoutPO.reduce(
    (prev, current) => prev + current.quantity * current.unit_cost,
    0
  );
  const handleSuccess = () => {
    if (purchaseOrder) {
      setPurchaseOrder(null);
      reset({
        items: [],
        notes: '',
        reason: '',
      });
      router?.replace(pathname || '/');
    } else {
      resetWithoutPO({
        items: [],
        notes: '',
        reason: '',
        supplier_id: null,
      });
      setValueWithoutPO('supplier_id', null);
      setSelectedVariants([] as Variant[]);
    }
  };

  return (
    <>
      {/* <div className="flex h-full overflow-hidden gap-6 "> */}
      <ReturnProductLayout
        sidebar={
          <Sidebar
            purchaseOrder={purchaseOrder}
            loadingCreate={loadingCreate}
            control={control}
            controlWithoutPO={controlWithoutPO}
            total={total}
            itemsLength={itemsLength}
            errorsWithoutPO={errorsWithoutPO}
            itemsLengthWithoutPO={itemsLengthWithoutPO}
            totalWithoutPO={totalWithoutPO}
            handleSuccess={handleSuccess}
            createPurchaseReturnWithPO={createPurchaseReturnWithPO}
            createPurchaseReturnWithoutPO={createPurchaseReturnWithoutPO}
            register={register}
            handleSubmitWithPO={handleSubmit}
            handleSubmitWithoutPO={handleSubmitWithoutPO}
          />
        }
      >
        {/* Header */}
        <Header
          isOpenSearch={isOpenSearch}
          selectedVariants={selectedVariants}
          purchaseOrder={purchaseOrder || null}
          setPurchaseOrder={setPurchaseOrder}
          setIsOpenSearch={setIsOpenSearch}
          setSelectedVariants={setSelectedVariants}
          setIsOpenModalSelectPurchase={setIsOpenModalSelectPurchase}
          fieldsWithoutPO={fieldsWithoutPO}
          appendPurchaseReturnWithoutPO={appendWithoutPO}
        />
        {/* Content Area */}
        <div className="flex-1 bg-white rounded-md shadow   h-full p-2">
          {!purchaseOrder && fieldsWithoutPO.length === 0 && selectedVariants.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1.5 h-full">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center ">
                Bạn chưa thêm sản phẩm nào
              </h2>
              <Menu shadow="lg" width={300} withinPortal={false} position="bottom" offset={5}>
                <Menu.Target>
                  <div>
                    <Button
                      radius="sm"
                      title="Tạo đơn trả hàng nhập"
                      size="md"
                      rightSection={<ChevronDown size={16} />}
                    />
                  </div>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => setIsOpenModalSelectPurchase(true)}
                    className="hover:bg-gray-50 rounded-md p-2 text-sm font-medium text-gray-900  cursor-pointer"
                  >
                    Trả hàng theo đơn nhập
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setIsOpenSearch(true)}
                    className="hover:bg-gray-50 rounded-md p-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Trả hàng không theo đơn nhập
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          ) : (
            <>
              {purchaseOrder && (
                <TableWithPo
                  loading={loading}
                  fields={fields}
                  purchaseOrder={purchaseOrder}
                  control={control}
                  watchedItems={watchedItems}
                />
              )}
              {selectedVariants.length > 0 && fieldsWithoutPO.length > 0 && (
                <TableWithoutPO
                  removeWithoutPO={removeWithoutPO}
                  updateWithoutPO={updateWithoutPO}
                  setSelectedVariants={setSelectedVariants}
                  selectedVariants={selectedVariants}
                  fieldsWithoutPO={fieldsWithoutPO}
                  control={controlWithoutPO}
                  loading={loadingCreate}
                  watchWithoutPO={watchedItemsWithoutPO}
                />
              )}
            </>
          )}
        </div>
      </ReturnProductLayout>
      {/* </div> */}
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
  const tableHeadersPurchaseOrder = [
    'Mã đơn nhập',
    'Ngày tạo',
    'Nhà cung cấp',
    'Trạng thái thanh toán',
    'Số lượng',
    'Tổng tiền',
    'Thao tác',
  ];
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
        placeholderSearch="Tìm kiếm mã phiếu nhập, tên hoặc mã nhà cung cấp"
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
