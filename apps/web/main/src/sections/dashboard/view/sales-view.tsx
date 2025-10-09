'use client';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useOrders } from '../../../../../main/src/hooks/orders/use-orders';
import { useProduct } from '../../../../../main/src/hooks/product/use-product';
import { formatCurrency, truncateText } from '../../../utils/';
import { Button, Input, Modal, Select, Table } from '@repo/design-system/components/ui';
import { Filter, Minus, Plus, Trash2, User, X } from 'lucide-react';
import { OrderStatusEnum } from '../../../../../main/src/schemas/order/order.schema';
import { Product, ProductStatus } from '@repo/design-system/types';
import { payment_method } from '@repo/design-system/types/inventory';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';

type SelectedProduct = Product & { selectedQuantity: number };
type Invoice = SelectedProduct[];

const paymentMethods = [
  {
    label: 'Tiền mặt',
    value: payment_method.CASH,
  },
  {
    label: 'Thẻ tín dụng',
    value: payment_method.CREDIT_CARD,
  },
  {
    label: 'Chuyển khoản',
    value: payment_method.DEBIT_CARD,
  },
];

export function SalesView() {
  // HOOK(

  const { showSuccessToast } = useToast();
  const { products, getProducts, setFilters, setPaginationParams, paginationParams, filters } =
    useProduct();
  const { createOrder, loading } = useOrders();
  const currentStore = useAtomValue(currentStoreAtom);

  // STATE
  const [openModalChangePrice, setOpenModalChangePrice] = useState(false);
  const [openModalOrder, setOpenModalOrder] = useState(false);
  const [openModalCreateCustomer, setOpenModalCreateCustomer] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([[]]);
  const [newPrice, setNewPrice] = useState(0);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [changPaymentMethods, setChangePaymentMethods] = useState<payment_method | null>(
    payment_method.CASH
  );
  const [search, setSearch] = useState<string>('');

  const updateCurrentInvoice = (newProducts: SelectedProduct[]) => {
    setSelectedProducts(newProducts);
    setInvoices((prev) => prev.map((inv, idx) => (idx === currentInvoice ? newProducts : inv)));
  };
  const handleSelectProduct = (product: Product) => {
    const exists = selectedProducts.find((p) => p.id === product.id);
    if (exists) {
      updateCurrentInvoice(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, selectedQuantity: (p.selectedQuantity || 1) + 1 } : p
        )
      );
    } else {
      updateCurrentInvoice([...selectedProducts, { ...product, selectedQuantity: 1 }]);
    }
  };

  const handleIncreaseQuantity = (id: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQuantity = (p.selectedQuantity || 1) + 1;
          return {
            ...p,
            selectedQuantity:
              newQuantity > p.inventory.quantity ? p.inventory.quantity : newQuantity,
          };
        }
        return p;
      })
    );
  };

  const handleDecreaseQuantity = (id: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selectedQuantity: (p.selectedQuantity || 1) - 1 } : p))
    );
  };

  const handleChangQuantity = (id: string, value: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          let safeValue = value;
          if (value > p.inventory.quantity) {
            safeValue = p.inventory.quantity;
          }
          return { ...p, selectedQuantity: safeValue };
        }
        return p;
      })
    );
  };

  const handleRemoveSelectedProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddInvoices = () => {
    // Lưu hóa đơn hiện tại
    setInvoices((prev) => {
      const newInvoices = [...prev];
      newInvoices[currentInvoice] = selectedProducts;
      return [...newInvoices, []]; // Thêm hóa đơn mới rỗng
    });

    // Chuyển sang hóa đơn mới
    setCurrentInvoice(invoices.length);
    setSelectedProducts([]);
  };
  const handleSwitchInvoice = (idx: number) => {
    setCurrentInvoice(idx);
    setSelectedProducts(invoices[idx] || []);
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
      setSelectedProducts(newInvoices[newCurrent] || []);
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
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === editingProductId ? { ...p, price: newPrice } : p))
    );
    showSuccessToast('Thay đổi đơn giá thành công!');
    setOpenModalChangePrice(false);
  };
  const handleCreateOrder = async () => {
    const orderItems = invoices[currentInvoice].map((p) => ({
      product_id: p.id,
      quantity: p.selectedQuantity,
      price: p.price,
    }));

    await createOrder({
      subtotal_amount: totalPrice,
      discount_amount: 0,
      tax_amount: 0,
      total_amount: totalPrice,
      status: OrderStatusEnum.Enum.COMPLETED,
      payment_method: changPaymentMethods || payment_method.CASH,
      order_items: orderItems,
    });
    getProducts();
  };
  const totalPrice = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + p.selectedQuantity * p.price, 0);
  }, [selectedProducts]);
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
    getProducts();
  }, [currentStore?.id, paginationParams, filters]);
  const handleLoadMore = () => {
    setPaginationParams((prev) => ({
      ...prev,
      limit: prev.limit + 22,
    }));
  };
  return (
    <div className="h-screen flex flex-col gap-2 overflow-hidden p-4">
      <header className="bg-white w-full p-6 flex-shrink-0"></header>
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-[1fr_0.6fr] gap-3 h-full overflow-hidden">
          {/* LEFT */}
          <div className="flex flex-col gap-2  h-full overflow-hidden">
            <div className="bg-white flex items-center justify-between p-2 rounded-md flex-shrink-0">
              <div className="flex items-center text-nowrap gap-4   ">
                <div className="max-w-[580px] overflow-y-scroll flex items-center gap-4">
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

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 py-2.5 px-5 text-white bg-pos-blue-500 rounded-md text-sm font-medium opacity-70">
                  <User size={16} />
                  <span>Khách lẻ</span>
                </div>
                <button
                  onClick={() => setOpenModalCreateCustomer(true)}
                  className="bg-pos-blue-50 text-pos-blue-500 hover:bg-pos-blue-500 hover:text-white transition-all duration-300 py-2 px-4 rounded-md text-sm font-medium cursor-pointer border border-pos-blue-500"
                >
                  Thêm khách hàng
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="flex-1 min-h-0">
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
                data={selectedProducts}
                renderRow={(product) => (
                  <>
                    <td className="px-4 py-2 text-gray-900 flex flex-col gap-1">
                      <span title={product.name} className="text-base font-semibold truncate">
                        {truncateText(product.name, 28)}
                      </span>
                      <span className="text-xs font-medium">
                        Tồn kho: {product.inventory.quantity}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <button
                          className="cursor-pointer disabled:cursor-not-allowed"
                          disabled={product.selectedQuantity === 1}
                          onClick={() => handleDecreaseQuantity(product.id)}
                        >
                          <Minus size={14} />
                        </button>

                        <input
                          type="text"
                          value={String(product?.selectedQuantity)}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChangQuantity(product.id, Number(e.target.value))
                          }
                          className="w-[34px] text-center outline-none text-xs font-medium text-gray-600"
                        />
                        <button
                          className="cursor-pointer disabled:cursor-not-allowed"
                          onClick={() => handleIncreaseQuantity(product.id)}
                          disabled={product.selectedQuantity === product.inventory.quantity}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td
                      onClick={() => handleOpenChangePrice(product.id, product.price)}
                      className="px-4 py-2 text-base text-gray-500 underline hover:cursor-pointer hover:text-pos-blue-500"
                    >
                      {formatCurrency(product.price || 0)}
                    </td>

                    <td className="px-4 py-2 text-sm text-gray-500">0%</td>
                    <td className="px-4 py-2 text-base font-semibold text-gray-900 truncate">
                      {formatCurrency(product.price * (product.selectedQuantity || 1))}
                    </td>
                    <td className="">
                      <button
                        onClick={() => handleRemoveSelectedProduct(product.id)}
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
                  Tổng tiền hàng ({selectedProducts.length})
                </span>
                <span className="text-lg text-pos-blue-500 font-semibold">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <div className="flex-1">
                <Button
                  disabled={!selectedProducts.length}
                  title="Thanh toán"
                  style={{ width: '100%' }}
                  onClick={() => setOpenModalOrder(true)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full bg-white px-3 rounded-md flex flex-col h-full overflow-hidden">
            <div className="flex flex-shrink-0 items-center sticky top-0 bg-white z-10 pt-4 pb-2">
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                type="text"
                placeholder="Nhập tên sản phẩm"
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <button className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                  Tìm kiếm
                </button>
                <button>
                  <Filter />
                </button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="flex items-center justify-center flex-1">
                <span className="text-xl font-semibold text-pos-blue-500">
                  Không tìm thấy sản phẩm
                </span>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto pb-4">
                <div className="grid grid-cols-4 gap-2">
                  {products?.map((product) => (
                    <div
                      key={product?.id}
                      onClick={() => {
                        const existing = selectedProducts.find((p) => p.id === product.id);
                        if (!existing) {
                          if (product.inventory.quantity > 0) handleSelectProduct(product);
                        } else {
                          if (existing.selectedQuantity < product.inventory.quantity)
                            handleSelectProduct(product);
                        }
                      }}
                      className="bg-white p-3 rounded-xl border border-gray-100 hover:border-pos-blue-400 cursor-pointer duration-300 transition-all hover:shadow-md hover:shadow-pos-blue-100"
                    >
                      <div className="relative w-full h-32">
                        <Image
                          src={'/placeholder.jpg'}
                          alt="sản phẩm"
                          width={500}
                          height={500}
                          className="rounded-xl object-cover"
                          unoptimized
                        />
                        <div className="absolute bottom-2 left-2 py-1 px-2 bg-pos-blue-400 text-white rounded-md">
                          <div className="text-xs font-medium">{formatCurrency(product.price)}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-1">
                        <h2
                          title={product.name}
                          className="text-sm font-semibold text-gray-800 truncate"
                        >
                          {product.name}
                        </h2>
                        <span className="text-sm font-medium text-gray-500">
                          Số lượng: {product.inventory.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center mt-4">
                  <Button onClick={handleLoadMore} title="Tải thêm" style={{ width: '54%' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
      <Modal
        title={'Xác nhận thanh toán'}
        opened={openModalOrder}
        size="xl"
        onClose={() => setOpenModalOrder(false)}
      >
        <div className="flex flex-col gap-4">
          <Select
            name="paymentMethod"
            onChange={(value) => setChangePaymentMethods(value as payment_method)}
            position="bottom"
            label={'Phương thức thanh toán'}
            defaultValue={paymentMethods[0].value}
            data={paymentMethods}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm  text-gray-500"> Số tiền khách trả </span>
            <div className="flex items-center gap-2 ">
              <Input
                defaultValue={totalPrice}
                disabled
                placeholder="Số tiền khách trả"
                type="number"
                style={{ flex: 1 }}
              />
              <Button title="Trả đủ" />
            </div>
          </div>
          <hr className="border-b border-b-white border-t-gray-400 " />
          <div className="grid grid-cols-2 justify-between">
            <span> Tổng tiền trước thuế </span>{' '}
            <span className="text-right">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="grid grid-cols-2 justify-between">
            <span> Thuế đơn hàng </span>
            <span className="text-right">0 %</span>
          </div>
          <div className="grid grid-cols-2 justify-between">
            <span> Tổng tiền thuế </span>
            <span className="text-right">{formatCurrency(0)}</span>
          </div>
          <div className="grid grid-cols-2 justify-between">
            <span className="text-pos-blue-500 font-semibold text-lg"> Tổng tiền thanh toán </span>
            <span className="text-right text-pos-blue-500 font-semibold text-lg">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <div className="flex items-center ">
            <Button
              loading={loading}
              onClick={() => {
                handleCreateOrder();
                setOpenModalOrder(false);
                setSelectedProducts([]);
              }}
              title="Thanh toán"
              style={{ flex: 1 }}
            />
          </div>
        </div>
      </Modal>
      <Modal
        title={'Thêm khách hàng mới'}
        opened={openModalCreateCustomer}
        size="xl"
        onClose={() => setOpenModalCreateCustomer(false)}
      >
        <form className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Input
              withAsterisk
              label="Tên khách hàng"
              name="name"
              placeholder="Nhập tên khách hàng"
              className="flex-1"
            />
            <Input
              label="Số điện thoại"
              name="phone"
              placeholder="Nhập số điên thoại"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <Input
              label="Email"
              name="email"
              placeholder="Nhập email khách hàng"
              className="flex-1"
            />
            <Input
              label="Địa chỉ"
              name="address"
              placeholder="Nhập địa chỉ khách hàng"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <Input label="Thành phố" name="city" placeholder="Nhập thành phố" className="flex-1" />
            <Input label="Mã zip" name="zip" placeholder="Nhập mã zip" className="flex-1" />
          </div>

          <div className="flex items-center ">
            <Button loading={loading} title="Thanh toán" style={{ flex: 1 }} />
          </div>
        </form>
      </Modal>
    </div>
  );
}
