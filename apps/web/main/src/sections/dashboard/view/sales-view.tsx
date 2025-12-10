/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import Invoice from '../components/invoice';
import FormCreateCustomer from '../components/form-create-customer';
import Logo from '../../../components/common/Logo';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useOrders } from '../../../hooks/orders/use-orders';
import { formatCurrency, truncateText } from '../../../utils/';
import { Button, Input, Modal, Select, Table } from '@repo/design-system/components/ui';
import {
  Keyboard,
  LogOut,
  Minus,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { Customer, ProductStatus, Variant } from '@repo/design-system/types';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { Burger, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useClickOutside } from '@repo/design-system/hooks/client';
import { useCustomer } from '../../../hooks/customers/use-customer';
import FiltersProducts from '../components/filter-products';
import BillOrder from '../components/bill-order';
import { useVariant } from '../../../hooks/variant/use-variant';
import { payment_method } from '../../../constants/method';

export type selectedVariant = Variant & { selectedQuantity: number };
type InvoiceSelected = selectedVariant[];

export const paymentMethods = [
  {
    label: 'Tiền mặt',
    value: payment_method.CASH,
  },
  {
    label: 'Thẻ tín dụng',
    value: payment_method.CREDIT_CARD,
  },
  {
    label: 'Thẻ ghi nợ',
    value: payment_method.DEBIT_CARD,
  },
  {
    label: 'Chuyển khoản',
    value: payment_method.BANK_TRANSFER,
  },
  {
    label: 'Ví điện tử',
    value: payment_method.DIGITAL_WALLET,
  },
];

export function SalesView() {
  // HOOK(
  const { showSuccessToast, showInfoToast } = useToast();
  const {
    getVariantsInStore,
    setFilters,
    setPaginationParams,
    setSort,
    setSortBy,
    paginationParams,
    filters,
    variants,
    sort,
    sortBy,
  } = useVariant();
  const { createOrder, loading } = useOrders();
  const {
    customers,
    filters: customersFilters,
    setFilters: setCustomersFilters,
    createCustomerForm,
    getCustomers,
    createCustomer,
  } = useCustomer();
  const currentStore = useAtomValue(currentStoreAtom);
  const router = useRouter();
  const openMenuSettingsRef = useRef<HTMLDivElement>(null);

  // STATE
  const [openModalInvoice, setOpenModalInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<selectedVariant[]>([]);
  const [openModalChangePrice, setOpenModalChangePrice] = useState(false);
  const [openModalOrder, setOpenModalOrder] = useState(false);
  const [openModalCreateCustomer, setOpenModalCreateCustomer] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<selectedVariant[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<number>(0);
  const [invoices, setInvoices] = useState<InvoiceSelected[]>([[]]);
  const [newPrice, setNewPrice] = useState(0);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [changPaymentMethods, setChangePaymentMethods] = useState<payment_method | null>(
    payment_method.CASH
  );
  const [search, setSearch] = useState<string>('');
  const [isOpenMenuSettings, setIsOpenMenuSettings] = useState<boolean>(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerPayFull, setIsCustomerPayFull] = useState<boolean>(true);
  const [priceCustomerPay, setPriceCustomerPay] = useState<string>('');
  const [isFocusedInputPriceCustomerPay, setIsFocusedInputPriceCustomerPay] =
    useState<boolean>(false);
  const [isOpenFilterProducts, setIsOpenFilterProducts] = useState<boolean>(false);
  const [newOrderId, setNewOrderId] = useState<string>('');
  const updateCurrentInvoice = (newProducts: selectedVariant[]) => {
    setSelectedVariants(newProducts);
    setInvoices((prev) => prev.map((inv, idx) => (idx === currentInvoice ? newProducts : inv)));
  };
  const handleSelectProduct = (product: Variant) => {
    const exists = selectedVariants.find((p) => p.id === product.id);
    if (exists) {
      updateCurrentInvoice(
        selectedVariants.map((p) =>
          p.id === product.id ? { ...p, selectedQuantity: (p.selectedQuantity || 1) + 1 } : p
        )
      );
    } else {
      updateCurrentInvoice([...selectedVariants, { ...product, selectedQuantity: 1 }]);
    }
  };

  const handleIncreaseQuantity = (id: string) => {
    setSelectedVariants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQuantity = (p.selectedQuantity || 1) + 1;
          return {
            ...p,
            selectedQuantity: newQuantity > p.onHand ? p.onHand : newQuantity,
          };
        }
        return p;
      })
    );
  };

  const handleDecreaseQuantity = (id: string) => {
    setSelectedVariants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selectedQuantity: (p.selectedQuantity || 1) - 1 } : p))
    );
  };

  const handleChangQuantity = (id: string, value: number) => {
    setSelectedVariants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          let safeValue = value;
          if (value > p.onHand) {
            safeValue = p.onHand;
          }
          return { ...p, selectedQuantity: safeValue };
        }
        return p;
      })
    );
  };

  const handleRemoveSelectedProduct = (id: string) => {
    setSelectedVariants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddInvoices = () => {
    // Lưu hóa đơn hiện tại
    setInvoices((prev) => {
      const newInvoices = [...prev];
      newInvoices[currentInvoice] = selectedVariants;
      return [...newInvoices, []]; // Thêm hóa đơn mới rỗng
    });

    // Chuyển sang hóa đơn mới
    setCurrentInvoice(invoices.length);
    setSelectedVariants([]);
  };
  const handleSwitchInvoice = (idx: number) => {
    setCurrentInvoice(idx);
    setSelectedVariants(invoices[idx] || []);
  };
  const handleRemoveInvoice = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setInvoices((prev) => {
      const newInvoices = prev.filter((_, i) => i !== idx);

      // Tính toán lại index hóa đơn đang chọn
      let newCurrent = currentInvoice;
      if (idx < currentInvoice) {
        newCurrent = currentInvoice - 1; // vì list bị dịch sang trái
      } else if (idx === currentInvoice) {
        newCurrent = Math.max(0, currentInvoice - 1);
      }

      setCurrentInvoice(newCurrent);
      setSelectedVariants(newInvoices[newCurrent] || []);
      return newInvoices;
    });
  };

  // Mở modal và set giá hiện tại
  const handleOpenChangePrice = (productId: string, currentPrice: number) => {
    setEditingProductId(productId);
    setNewPrice(currentPrice);
    setOpenModalChangePrice(true);
  };

  // Áp dụng thay đổi
  const handleApplyChangePrice = () => {
    if (!editingProductId) return;

    const updated = selectedVariants.map((p) =>
      p.id === editingProductId ? { ...p, price: newPrice } : p
    );

    setSelectedVariants(updated);
    updateCurrentInvoice(updated);

    showSuccessToast('Thay đổi đơn giá thành công!');
    setOpenModalChangePrice(false);
  };
  const handleCreateOrder = async () => {
    const orderItems = invoices[currentInvoice].map((p) => ({
      product_id: p.product_id,
      variant_id: p.id,
      quantity: p.selectedQuantity,
      price: p.price,
    }));
    const newOrder = await createOrder({
      subtotal_amount: totalPrice,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: totalPrice,
      customer_pay_amount: Number(priceCustomerPay),
      payment_method: changPaymentMethods || payment_method.CASH,
      order_items: orderItems,
      customer_id: selectedCustomer?.id,
      customer_name: selectedCustomer?.name || '',
    });
    if (newOrder) {
      setNewOrderId(newOrder.orderId);
      setInvoiceData(invoices[currentInvoice]);
      setOpenModalOrder(false);
      setOpenModalInvoice(true);
      getVariantsInStore();
      setSelectedVariants([]);
    }
  };
  const totalPrice = useMemo(() => {
    return selectedVariants.reduce((sum, p) => sum + p.selectedQuantity * p.price, 0);
  }, [selectedVariants]);
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      product_status: ProductStatus.ACTIVE,
    }));
    setPaginationParams((prev) => ({
      ...prev,
      limit: 22,
    }));

    const timeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        product_status: ProductStatus.ACTIVE,
        q: search,
      }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);
  useEffect(() => {
    if (!currentStore?.id) return;
    if (isOpenFilterProducts === false) {
      getVariantsInStore();
    }
  }, [currentStore?.id, paginationParams, filters, sort, sortBy]);
  useEffect(() => {
    if (!currentStore?.id) return;
    getCustomers();
  }, [currentStore?.id, customersFilters]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCustomersFilters((prev) => ({
        ...prev,
        q: customerSearch,
      }));
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [customerSearch]);
  useEffect(() => {
    if (isCustomerPayFull && !isFocusedInputPriceCustomerPay) {
      setPriceCustomerPay(String(totalPrice));
    }
  }, [isCustomerPayFull, totalPrice]);

  const handleLoadMore = () => {
    setPaginationParams((prev) => ({
      ...prev,
      limit: prev.limit + 22,
    }));
  };
  useClickOutside(openMenuSettingsRef, () => setIsOpenMenuSettings(false));
  return (
    <>
      <div className="h-screen flex flex-col gap-2 overflow-hidden p-4">
        <header className="bg-white w-full py-2 px-3 flex-shrink-0 flex items-center justify-between ">
          <div className="flex items-center gap-8">
            <Logo link={`/dashboard/store/${currentStore?.id}/overview`} />
            <div className="flex items-center text-nowrap gap-4   ">
              <div className="max-w-[600px] overflow-y-scroll flex items-center gap-4">
                {invoices.map((invoice, idx) => (
                  <div
                    onClick={() => handleSwitchInvoice(idx)}
                    key={idx}
                    className={`flex items-center gap-3 text-base font-medium px-4 cursor-pointer py-2  rounded-md transition-all duration-200 ${
                      currentInvoice === idx
                        ? 'text-pos-blue-500 bg-pos-blue-50'
                        : 'text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <span>Đơn hàng {idx + 1}</span>
                    {idx === invoices.length - 1 && invoices.length > 1 && (
                      <button
                        onClick={(e) => handleRemoveInvoice(idx, e)}
                        className="cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddInvoices}
                className="hover:cursor-pointer hover:text-pos-blue-500 hover:bg-pos-blue-50 transition-all duration-300 p-2 rounded-full text-gray-500 bg-gray-100"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="text-gray-500 font-medium text-sm bg-gray-50 p-2 rounded-md">
              {currentStore?.name}
            </span>
            <div className="relative">
              <Burger
                className="cursor-pointer p-2"
                opened={isOpenMenuSettings}
                onClick={() => setIsOpenMenuSettings(!isOpenMenuSettings)}
                size={22}
                aria-label="Toggle navigation"
              />
              <div
                ref={openMenuSettingsRef}
                className={`absolute top-full right-0 w-52 h-fit py-3 px-2 bg-white mt-3 z-50 shadow-md shadow-pos-blue-100 rounded-md text-sm text-gray-500 transition-all duration-200 ease-in-out ${isOpenMenuSettings ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              >
                <button
                  onClick={() => showInfoToast('Tính năng đang được phát triển')}
                  className="flex items-center gap-5 hover:bg-gray-50 rounded-md p-2 cursor-pointer w-full"
                >
                  <Settings size={18} />
                  Thiết lập
                </button>
                <button
                  onClick={() => showInfoToast('Tính năng đang được phát triển')}
                  className="flex items-center gap-5 hover:bg-gray-50 rounded-md p-2 cursor-pointer w-full"
                >
                  <Keyboard size={18} /> Phím tắt
                </button>
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-5 hover:bg-gray-50 rounded-md p-2 cursor-pointer w-full"
                >
                  <LogOut size={18} /> Thoát bán hàng
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-[1fr_0.6fr] gap-3 h-full overflow-hidden">
            {/* LEFT */}
            <div className="flex flex-col gap-2  h-full overflow-hidden">
              <div className="bg-white flex items-center justify-between p-2 rounded-md flex-shrink-0">
                <Select
                  rightSection={<User size={16} />}
                  clearable
                  searchable
                  onSearchChange={setCustomerSearch}
                  searchValue={customerSearch}
                  value={selectedCustomer?.id}
                  onChange={(value) => {
                    const found = customers.find((c) => c.id === value);
                    setSelectedCustomer(found || null);
                  }}
                  data={customers.map((customer) => ({
                    value: customer.id,
                    label: customer.name,
                  }))}
                  placeholder="Tìm kiếm khách hàng"
                  position="bottom"
                  size="sm"
                  radius="sm"
                  style={{ minWidth: 400 }}
                />
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 py-2 px-4 bg-pos-blue-50 text-pos-blue-500 rounded-md  font-medium ">
                    <User size={16} />
                    <span>{selectedCustomer?.name ?? 'Khách lẻ'}</span>
                  </div>
                  <Button
                    size="sm"
                    radius="sm"
                    title="Thêm khách hàng"
                    variant="outline"
                    icon={<UserPlus size={16} />}
                    onClick={() => setOpenModalCreateCustomer(true)}
                  />
                </div>
              </div>

              {/* TABLE */}
              <div className="flex-1 min-h-0 overflow-y-scroll">
                <Table
                  className="h-full"
                  hasPagination={false}
                  tableHeaders={[
                    'Tên sản phẩm',
                    'Số lượng',
                    'Đơn giá',
                    'Tiền thuế',
                    'Thành tiền',
                    'Hành động',
                  ]}
                  hasMarginTop={false}
                  data={selectedVariants}
                  renderRow={(variant) => (
                    <>
                      <td className="px-4 py-2 text-gray-900 flex flex-col gap-1">
                        <span title={variant.name} className="text-base font-semibold truncate">
                          {truncateText(variant.name, 28)}
                        </span>
                        <span className="text-xs font-medium">Tồn kho: {variant.onHand}</span>
                      </td>

                      <td className="px-4 py-2 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <button
                            className="cursor-pointer disabled:cursor-not-allowed"
                            disabled={variant.selectedQuantity === 1}
                            onClick={() => handleDecreaseQuantity(variant.id)}
                          >
                            <Minus size={14} />
                          </button>

                          <input
                            type="text"
                            value={String(variant?.selectedQuantity)}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              handleChangQuantity(variant.id, Number(e.target.value));
                            }}
                            className="w-[34px] text-center outline-none text-xs font-medium text-gray-600"
                          />
                          <button
                            className="cursor-pointer disabled:cursor-not-allowed"
                            onClick={() => handleIncreaseQuantity(variant.id)}
                            disabled={variant.selectedQuantity === variant.onHand}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td
                        onClick={() => handleOpenChangePrice(variant.id, variant.price)}
                        className="px-4 py-2 text-base text-gray-500 underline hover:cursor-pointer hover:text-pos-blue-500"
                      >
                        {formatCurrency(variant.price || 0)}
                      </td>

                      <td className="px-4 py-2 text-sm text-gray-500">0%</td>
                      <td className="px-4 py-2 text-base font-semibold text-gray-900 truncate">
                        {formatCurrency(variant.price * (variant.selectedQuantity || 1))}
                      </td>
                      <td className="">
                        <button
                          onClick={() => handleRemoveSelectedProduct(variant.id)}
                          className="cursor-pointer w-[36px] h-[36px] flex items-center justify-center bg-red-50 text-red-500 rounded-md hover:opacity-100 hover:bg-red-500 hover:text-white opacity-70 transition-opacity duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </>
                  )}
                />
              </div>

              <div className="flex-shrink-0 space-y-2 w-full">
                <div className="bg-white flex items-center justify-between p-2 rounded-md">
                  <span className="text-base font-medium text-gray-800">Ngày tạo</span>
                  <span className="text-lg text-pos-blue-500 font-semibold">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-white flex items-center justify-between p-2 rounded-md">
                  <span className="text-base font-medium text-gray-800">
                    Tổng tiền hàng ({selectedVariants.length})
                  </span>
                  <span className="text-lg text-pos-blue-500 font-semibold">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <div className="flex-1">
                  <Button
                    disabled={!selectedVariants.length}
                    title="Thanh toán"
                    style={{ width: '100%' }}
                    onClick={() => setOpenModalOrder(true)}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full bg-white px-3 rounded-md flex flex-col h-full overflow-hidden">
              <div className="flex flex-shrink-0  sticky top-0 bg-white z-10 pt-4 pb-2 items-center gap-4">
                <Input
                  size="sm"
                  radius="sm"
                  leftSection={<Search size={20} />}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Tìm kiếm tên, mã vạch hoặc SKU của sản phẩm..."
                  className="flex-1"
                />

                <button
                  onClick={() => setIsOpenFilterProducts(true)}
                  className="text-gray-500 hover:text-pos-blue-500 transition-colors duration-200 cursor-pointer"
                >
                  <SlidersHorizontal size={22} />
                </button>
              </div>

              {variants.length === 0 ? (
                <div className="flex items-center justify-center flex-1">
                  <span className="text-xl font-semibold text-pos-blue-500">
                    Không tìm thấy sản phẩm
                  </span>
                </div>
              ) : (
                <div className="flex-1 min-h-0 overflow-y-auto pb-4">
                  <div className="grid grid-cols-3 gap-2">
                    {variants?.map((variant) => (
                      <div
                        key={variant?.id}
                        onClick={() => {
                          const existing = selectedVariants.find((p) => p.id === variant.id);
                          if (!existing) {
                            if (variant.onHand > 0) handleSelectProduct(variant);
                          } else {
                            if (existing.selectedQuantity < variant.onHand)
                              handleSelectProduct(variant);
                          }
                        }}
                        className="bg-white p-3 rounded-xl border border-gray-100 hover:border-pos-blue-400 cursor-pointer duration-300 transition-all hover:shadow-md group hover:shadow-pos-blue-100"
                      >
                        <div className="relative w-full h-fit">
                          <Image
                            src={'/placeholder.jpg'}
                            alt="sản phẩm"
                            width={500}
                            height={500}
                            className="rounded-xl object-cover h-32 w-full"
                            unoptimized
                          />
                          <div className="absolute bottom-2 left-2 py-1 px-2 bg-pos-blue-50 text-pos-blue-500 rounded-md">
                            <div className="text-base  font-medium">
                              {formatCurrency(variant.price)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                          <Tooltip position="top" label={variant.name} withArrow>
                            <h2 className="text-sm font-semibold text-gray-800 truncate group-hover:text-pos-blue-500">
                              {variant.name}
                            </h2>
                          </Tooltip>
                          <div className="flex items-center justify-between ">
                            {variant.onHand > 0 ? (
                              <span className="text-sm font-medium text-gray-500">
                                Số lượng: {variant.onHand}
                              </span>
                            ) : (
                              <span className="text-sm text-red-500">Hết hàng</span>
                            )}
                            <span className="text-sm font-semibold text-gray-600">
                              {variant.sku}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {variants.length >= paginationParams.limit && (
                    <div className="flex items-center justify-center mt-4">
                      <Button onClick={handleLoadMore} title="Tải thêm" style={{ width: '54%' }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CHANGE PRICE BEFORE SALE PRODUCTS */}
        <Modal
          opened={openModalChangePrice}
          onClose={() => setOpenModalChangePrice(false)}
          size="md"
          title="Thay đổi giá"
        >
          <form
            className="flex flex-col gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              handleApplyChangePrice();
            }}
          >
            <Input
              name="price"
              value={String(newPrice)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPrice(Number(e.target.value))}
              size="sm"
              type="number"
              placeholder="Giá"
            />
            <Button size="sm" title="Thay đổi" style={{ width: '100%' }} type="submit" />
          </form>
        </Modal>
        {/* MODAL FOR ORDER */}
        <BillOrder
          setChangePaymentMethods={setChangePaymentMethods}
          setOpenModalOrder={setOpenModalOrder}
          setPriceCustomerPay={setPriceCustomerPay}
          setIsCustomerPayFull={setIsCustomerPayFull}
          handleCreateOrder={handleCreateOrder}
          setSelectedVariants={setSelectedVariants}
          setIsFocusedInputPriceCustomerPay={setIsFocusedInputPriceCustomerPay}
          setOpenModalInvoice={setOpenModalInvoice}
          openModalOrder={openModalOrder}
          paymentMethods={paymentMethods}
          priceCustomerPay={priceCustomerPay}
          isCustomerPayFull={isCustomerPayFull}
          totalPrice={totalPrice}
          loading={loading}
        />
        {/* MODAL FOR ADD CUSTOMER */}
        <Modal
          title={'Thêm khách hàng mới'}
          opened={openModalCreateCustomer}
          size="xl"
          onClose={() => setOpenModalCreateCustomer(false)}
        >
          <FormCreateCustomer
            setOpenAddModal={setOpenModalCreateCustomer}
            createCustomer={createCustomer}
            createCustomerForm={createCustomerForm}
            onSuccess={() => {
              getCustomers();
            }}
          />
        </Modal>
        {/* ✅ MODAL HÓA ĐƠN */}

        <Invoice
          openModalInvoice={openModalInvoice}
          newOrderId={newOrderId}
          priceCustomerPay={priceCustomerPay}
          setOpenModalInvoice={setOpenModalInvoice}
          setSelectedVariants={setSelectedVariants}
        />
      </div>
      <FiltersProducts
        isOpenFilterProducts={isOpenFilterProducts}
        setIsOpenFilterProducts={setIsOpenFilterProducts}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </>
  );
}
