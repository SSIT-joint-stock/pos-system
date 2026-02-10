/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Burger, Tooltip } from '@mantine/core';
import {
  Button,
  Input,
  Loading,
  Modal,
  NumberInput,
  Select,
  Table,
} from '@repo/design-system/components/ui';
import { useClickOutside } from '@repo/design-system/hooks/client';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Customer, Variant } from '@repo/design-system/types';
import { useAtomValue } from 'jotai';
import {
  Keyboard,
  LogOut,
  Minus,
  Percent,
  Plus,
  ScanSearch,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import Logo from '../../../components/common/Logo';
import { payment_method } from '../../../constants/method';
import { useBarcodeScanner, useCatalog } from '../../../hooks/catalog/use-catalog';
import { useCustomer } from '../../../hooks/customers/use-customer';
import { useOrders } from '../../../hooks/orders/use-orders';
import { useVariant } from '../../../hooks/variant/use-variant';
import { formatCurrency, truncateText } from '../../../utils/';
import BillOrder from '../components/bill-order';
import FiltersProducts from '../components/filter-products';
import FormCreateCustomer from '../components/form-create-customer';
import Invoice from '../components/invoice';

export type selectedVariant = Variant & { selectedQuantity: number; tax_rate?: number };
type InvoiceSelected = selectedVariant[];

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
    pagination,
    filters,
    variants,
    sort,
    sortBy,
    loading: loadingVariants,
  } = useVariant();
  const { createOrder, loading } = useOrders();
  const { scanBarcode, setIsScanMode, isScanMode } = useCatalog();
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
  const [, setInvoiceData] = useState<selectedVariant[]>([]);
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
  const debounced = useDebounceCallback(setSearch, 500);
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
    const updated = selectedVariants.map((p) => {
      if (p.id === id) {
        const newQty = Math.min((p.selectedQuantity || 1) + 1, p.onHand);
        return { ...p, selectedQuantity: newQty };
      }
      return p;
    });

    updateCurrentInvoice(updated);
  };

  const handleDecreaseQuantity = (id: string) => {
    const updated = selectedVariants.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          selectedQuantity: Math.max(1, (p.selectedQuantity || 1) - 1),
        };
      }
      return p;
    });

    updateCurrentInvoice(updated);
  };

  const handleChangQuantity = (id: string, value: number) => {
    if (Number.isNaN(value)) return;

    const updated = selectedVariants.map((p) => {
      if (p.id === id) {
        const safeValue = Math.min(Math.max(1, value), p.onHand);
        return { ...p, selectedQuantity: safeValue };
      }
      return p;
    });

    updateCurrentInvoice(updated);
  };

  const handleRemoveSelectedProduct = (id: string) => {
    setSelectedVariants((prev) => prev.filter((p) => p.id !== id));
  };

  useBarcodeScanner({
    onScan: async (barcode) => {
      const result = await scanBarcode(barcode);
      if (result) {
        handleSelectProduct(result);
      }
    },
    enabled:
      !openModalOrder && !openModalInvoice && !openModalCreateCustomer && !openModalChangePrice,
  });

  const handleAddInvoices = () => {
    // Lưu hóa đơn hiện tại
    setInvoices((prev) => {
      const newInvoices = [...prev];
      newInvoices[currentInvoice] = selectedVariants;
      return [...newInvoices, []];
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
        newCurrent = currentInvoice - 1;
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
  const handleUpdateVariantTaxRate = (variantId: string, rate: number) => {
    const updated = selectedVariants.map((p) =>
      p.id === variantId ? { ...p, tax_rate: rate } : p
    );

    setSelectedVariants(updated);
    setInvoices((prev) => prev.map((inv, idx) => (idx === currentInvoice ? updated : inv)));
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
      tax_rate: p.tax_rate,
    }));
    const newOrder = await createOrder({
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
  const summary = useMemo(() => {
    return selectedVariants.reduce(
      (acc, p) => {
        const subTotal = p.price * (p.selectedQuantity || 1);
        const taxAmount = ((p.tax_rate || 0) / 100) * subTotal;

        acc.subTotal += subTotal;
        acc.taxAmount += taxAmount;
        acc.total += subTotal + taxAmount;

        return acc;
      },
      {
        subTotal: 0,
        taxAmount: 0,
        total: 0,
      }
    );
  }, [selectedVariants]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
    }));
    setPaginationParams((prev) => ({
      ...prev,
      limit: 20,
    }));

    setFilters((prev) => ({
      ...prev,
      q: search,
    }));
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
      setPriceCustomerPay(String(summary.total));
    }
  }, [isCustomerPayFull]);

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
                    'Đơn vị',
                    'Số lượng',
                    'Đơn giá',
                    'VAT',
                    'Giảm giá',
                    'Thành tiền',
                    'Hành động',
                  ]}
                  hasMarginTop={false}
                  data={selectedVariants}
                  renderRow={(variant) => (
                    <>
                      <td className="px-4 py-2 text-gray-900 flex flex-col gap-1">
                        <Tooltip
                          position="bottom"
                          color="rgba(125, 124, 124, 1)"
                          label={variant.name}
                        >
                          <span title={variant.name} className="text-base font-semibold truncate">
                            {truncateText(variant.name, 28)}
                          </span>
                        </Tooltip>
                        <span className="text-xs font-medium">Tồn kho: {variant.onHand}</span>
                      </td>
                      <td className="px-4 py-2 text-sm font-semibold text-gray-500">
                        {variant?.product?.baseUnit || ''}
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

                      <td className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2">
                        <NumberInput
                          size="sm"
                          radius="sm"
                          value={variant.tax_rate ?? 0}
                          onChange={(value) => {
                            handleUpdateVariantTaxRate(variant.id, Number(value));
                          }}
                          min={0}
                          className="w-28"
                          rightSection={<Percent size={14} />}
                        />
                        <span className="text-sm text-gray-500">
                          (
                          {formatCurrency(
                            ((variant?.tax_rate ?? 0) / 100) *
                              variant.price *
                              variant.selectedQuantity
                          )}
                          )
                        </span>
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
                    {formatCurrency(summary.total)}
                  </span>
                </div>

                <div className="flex-1">
                  <Button
                    radius="sm"
                    disabled={!selectedVariants.length}
                    title="Thanh toán"
                    style={{ width: '100%' }}
                    onClick={() => {
                      setOpenModalOrder(true);
                      setPriceCustomerPay(summary.total.toString());
                    }}
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
                  rightSection={
                    <button
                      onClick={() => {
                        setIsScanMode(!isScanMode);
                        if (isScanMode) {
                          showSuccessToast('Tắt chế độ tìm kiếm mã vạch');
                        } else {
                          showSuccessToast('Bật chế độ tìm kiếm mã vạch');
                        }
                      }}
                      type="button"
                      className={`text-gray-500 hover:text-pos-blue-500 transition-colors duration-200 cursor-pointer ${isScanMode ? 'text-pos-blue-500' : 'text-gray-500'}`}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <ScanSearch size={22} />
                    </button>
                  }
                  leftSection={<Search size={20} />}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => debounced(e.target.value)}
                  type="text"
                  placeholder="Tìm kiếm tên, mã vạch hoặc mã (SKU) của sản phẩm..."
                  className="flex-1"
                />

                <button
                  onClick={() => setIsOpenFilterProducts(true)}
                  className="text-gray-500 hover:text-pos-blue-500 transition-colors duration-200 cursor-pointer"
                >
                  <SlidersHorizontal size={22} />
                </button>
              </div>

              {variants.length === 0 && !loadingVariants && (
                <div className="flex flex-col gap-2.5 items-center justify-center flex-1 h-full w-full">
                  <span className="text-xl font-semibold text-pos-blue-500">
                    Không tìm thấy sản phẩm
                  </span>
                  <Button
                    onClick={() => router.push('manage-products/create')}
                    size="sm"
                    radius="sm"
                    variant="outline"
                    title="Thêm sản phẩm"
                  />
                </div>
              )}
              {loadingVariants && variants.length === 0 ? (
                <div className="flex  items-center justify-center flex-1">
                  <Loading size="md" color="#3b82f6" />
                </div>
              ) : (
                <>
                  {variants.length && (
                    <div className="flex-1 min-h-0 overflow-y-auto pb-4">
                      <div className="grid grid-cols-3 gap-4">
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
                              <div className="flex items-center justify-between">
                                <Tooltip position="top" label={variant.name} withArrow>
                                  <h2 className="text-sm font-semibold text-gray-800 truncate group-hover:text-pos-blue-500 line-clamp-1">
                                    {truncateText(variant.name, 22)}
                                  </h2>
                                </Tooltip>
                                <span className="text-xs text-gray-500 font-semibold">
                                  {variant?.product?.baseUnit}
                                </span>
                              </div>
                              <div className="flex items-center justify-between ">
                                {variant.onHand > 0 ? (
                                  <span className="text-sm font-medium text-gray-500">
                                    Số lượng: {variant.onHand}
                                  </span>
                                ) : (
                                  <span className="text-sm text-red-500">Hết hàng</span>
                                )}
                                {/* <span className="text-sm font-semibold text-gray-600">
                                  {variant.sku}
                                </span> */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {pagination?.hasNext && (
                        <div className="flex items-center justify-center mt-4">
                          <Button
                            size="sm"
                            loading={loadingVariants}
                            radius="sm"
                            onClick={handleLoadMore}
                            title="Tải thêm"
                            style={{ width: '54%' }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* CHANGE PRICE BEFORE SALE PRODUCTS */}
        <Modal
          opened={openModalChangePrice}
          onClose={() => setOpenModalChangePrice(false)}
          size="md"
          title={<p className="text-base font-semibold">Thay đổi giá</p>}
        >
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleApplyChangePrice();
            }}
          >
            <NumberInput
              name="price"
              value={newPrice}
              onChange={(value) => setNewPrice(Number(value))}
              size="sm"
              radius="sm"
              placeholder="Giá"
            />
            <Button
              radius="sm"
              size="sm"
              title="Thay đổi"
              style={{ width: '100%' }}
              type="submit"
            />
          </form>
        </Modal>
        {/* MODAL FOR ORDER */}
        <BillOrder
          selectedPaymentMethod={changPaymentMethods}
          setChangePaymentMethods={setChangePaymentMethods}
          setOpenModalOrder={setOpenModalOrder}
          setPriceCustomerPay={setPriceCustomerPay}
          setIsCustomerPayFull={setIsCustomerPayFull}
          handleCreateOrder={handleCreateOrder}
          setSelectedVariants={setSelectedVariants}
          setIsFocusedInputPriceCustomerPay={setIsFocusedInputPriceCustomerPay}
          setOpenModalInvoice={setOpenModalInvoice}
          openModalOrder={openModalOrder}
          priceCustomerPay={priceCustomerPay}
          isCustomerPayFull={isCustomerPayFull}
          summary={summary}
          loading={loading}
        />
        {/* MODAL FOR ADD CUSTOMER */}
        <Modal
          title={<p className="text-base font-semibold text-gray-900">Thêm khách hàng mới</p>}
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
