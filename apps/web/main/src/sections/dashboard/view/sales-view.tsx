"use client";
import useToast from "@repo/design-system/hooks/client/use-toast-notification";
import Image from "next/image";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOrders } from "../../../../../main/src/hooks/orders/use-orders";
import { useProduct } from "../../../../../main/src/hooks/product/use-product";
import { formatCurrency, truncateText } from "../../../utils/";
import {
  Button,
  Input,
  Modal,
  Select,
  Table,
} from "@repo/design-system/components/ui";
import {
  Filter,
  Keyboard,
  LogOut,
  Minus,
  Plus,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";
import { OrderStatusEnum } from "../../../../../main/src/schemas/order/order.schema";
import { Customer, Product, ProductStatus } from "@repo/design-system/types";
import { payment_method } from "@repo/design-system/types/inventory";
import { currentStoreAtom } from "@repo/design-system/stores/auth";
import { useAtomValue, useStore } from "jotai";
import FormCreateCustomer from "../components/form-create-customer";
import Logo from "../../../../../main/src/components/common/Logo";
import { Burger } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useClickOutside } from "@repo/design-system/hooks/client";
import { useCustomer } from "../../../../../main/src/hooks/customers/use-customer";
import html2pdf from "html2pdf.js";
import Invoice from "../components/invoice";

type SelectedProduct = Product & { selectedQuantity: number };
type Invoice = SelectedProduct[];

const paymentMethods = [
  {
    label: "Tiền mặt",
    value: payment_method.CASH,
  },
  {
    label: "Thẻ tín dụng",
    value: payment_method.CREDIT_CARD,
  },
  {
    label: "Chuyển khoản",
    value: payment_method.DEBIT_CARD,
  },
];

export function SalesView() {
  // HOOK(

  const { showSuccessToast, showInfoToast } = useToast();
  const {
    products,
    getProducts,
    setFilters,
    setPaginationParams,
    paginationParams,
    filters,
  } = useProduct();
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
  const [openModalInvoice, setOpenModalInvoice] = useState(false); // ➕ THÊM DÒNG NÀY
  const [invoiceData, setInvoiceData] = useState<SelectedProduct[]>([]); // ➕ THÊM DÒNG NÀY
  const [openModalChangePrice, setOpenModalChangePrice] = useState(false);
  const [openModalOrder, setOpenModalOrder] = useState(false);
  const [openModalCreateCustomer, setOpenModalCreateCustomer] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [currentInvoice, setCurrentInvoice] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([[]]);
  const [newPrice, setNewPrice] = useState(0);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [changPaymentMethods, setChangePaymentMethods] =
    useState<payment_method | null>(payment_method.CASH);
  const [search, setSearch] = useState<string>("");
  const [isOpenMenuSettings, setIsOpenMenuSettings] = useState<boolean>(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const updateCurrentInvoice = (newProducts: SelectedProduct[]) => {
    setSelectedProducts(newProducts);
    setInvoices((prev) =>
      prev.map((inv, idx) => (idx === currentInvoice ? newProducts : inv))
    );
  };
  const handleSelectProduct = (product: Product) => {
    const exists = selectedProducts.find((p) => p.id === product.id);
    if (exists) {
      updateCurrentInvoice(
        selectedProducts.map((p) =>
          p.id === product.id
            ? { ...p, selectedQuantity: (p.selectedQuantity || 1) + 1 }
            : p
        )
      );
    } else {
      updateCurrentInvoice([
        ...selectedProducts,
        { ...product, selectedQuantity: 1 },
      ]);
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
              newQuantity > p.inventory.quantity
                ? p.inventory.quantity
                : newQuantity,
          };
        }
        return p;
      })
    );
  };

  const handleDecreaseQuantity = (id: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, selectedQuantity: (p.selectedQuantity || 1) - 1 }
          : p
      )
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
  const handleRemoveInvoice = (
    idx: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
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
      prev.map((p) =>
        p.id === editingProductId ? { ...p, price: newPrice } : p
      )
    );
    showSuccessToast("Thay đổi đơn giá thành công!");
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
      customer_id: selectedCustomer?.id,
      customer_name: selectedCustomer?.name || "",
    });
    setInvoiceData(invoices[currentInvoice]);
    setTimeout(() => setOpenModalInvoice(true), 0);
    setSelectedCustomer(null);
    getProducts();
  };
  const totalPrice = useMemo(() => {
    return selectedProducts.reduce(
      (sum, p) => sum + p.selectedQuantity * p.price,
      0
    );
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

  const handleLoadMore = () => {
    setPaginationParams((prev) => ({
      ...prev,
      limit: prev.limit + 22,
    }));
  };
  useClickOutside(openMenuSettingsRef, () => setIsOpenMenuSettings(false));
  return (
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
                      ? "text-pos-blue-500 bg-pos-blue-50"
                      : "text-gray-800 hover:bg-gray-100"
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
              className={`absolute top-full right-0 w-52 h-fit py-3 px-2 bg-white mt-3 z-50 shadow-md shadow-pos-blue-100 rounded-md text-sm text-gray-500 transition-all duration-200 ease-in-out ${isOpenMenuSettings ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              <button
                onClick={() => showInfoToast("Tính năng đang được phát triển")}
                className="flex items-center gap-5 hover:bg-gray-50 rounded-md p-2 cursor-pointer w-full"
              >
                <Settings size={18} />
                Thiết lập
              </button>
              <button
                onClick={() => showInfoToast("Tính năng đang được phát triển")}
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
                style={{ minWidth: 360 }}
              />
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 py-2 px-4 text-white bg-pos-blue-500 rounded-md  font-medium opacity-70">
                  <User size={16} />
                  <span>{selectedCustomer?.name ?? "Khách lẻ"}</span>
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
            <div className="flex-1 min-h-0 overflow-y-scroll">
              <Table
                className="h-full"
                hasPagination={false}
                tableHeaders={[
                  "Tên sản phẩm",
                  "Số lượng",
                  "Đơn giá",
                  "Tiền thuế",
                  "Thành tiền",
                  "Hành động",
                ]}
                hasMarginTop={false}
                data={selectedProducts}
                renderRow={(product) => (
                  <>
                    <td className="px-4 py-2 text-gray-900 flex flex-col gap-1">
                      <span
                        title={product.name}
                        className="text-base font-semibold truncate"
                      >
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
                            handleChangQuantity(
                              product.id,
                              Number(e.target.value)
                            )
                          }
                          className="w-[34px] text-center outline-none text-xs font-medium text-gray-600"
                        />
                        <button
                          className="cursor-pointer disabled:cursor-not-allowed"
                          onClick={() => handleIncreaseQuantity(product.id)}
                          disabled={
                            product.selectedQuantity ===
                            product.inventory.quantity
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td
                      onClick={() =>
                        handleOpenChangePrice(product.id, product.price)
                      }
                      className="px-4 py-2 text-base text-gray-500 underline hover:cursor-pointer hover:text-pos-blue-500"
                    >
                      {formatCurrency(product.price || 0)}
                    </td>

                    <td className="px-4 py-2 text-sm text-gray-500">0%</td>
                    <td className="px-4 py-2 text-base font-semibold text-gray-900 truncate">
                      {formatCurrency(
                        product.price * (product.selectedQuantity || 1)
                      )}
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
                <span className="text-base font-medium text-gray-800">
                  Ngày tạo
                </span>
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
                  style={{ width: "100%" }}
                  onClick={() => setOpenModalOrder(true)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full bg-white px-3 rounded-md flex flex-col h-full overflow-hidden">
            <div className="flex flex-shrink-0 items-center sticky top-0 bg-white z-10 pt-4 pb-2">
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
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
                        const existing = selectedProducts.find(
                          (p) => p.id === product.id
                        );
                        if (!existing) {
                          if (product.inventory.quantity > 0)
                            handleSelectProduct(product);
                        } else {
                          if (
                            existing.selectedQuantity <
                            product.inventory.quantity
                          )
                            handleSelectProduct(product);
                        }
                      }}
                      className="bg-white p-3 rounded-xl border border-gray-100 hover:border-pos-blue-400 cursor-pointer duration-300 transition-all hover:shadow-md hover:shadow-pos-blue-100"
                    >
                      <div className="relative w-full h-32">
                        <Image
                          src={"/placeholder.jpg"}
                          alt="sản phẩm"
                          width={500}
                          height={500}
                          className="rounded-xl object-cover"
                          unoptimized
                        />
                        <div className="absolute bottom-2 left-2 py-1 px-2 bg-pos-blue-400 text-white rounded-md">
                          <div className="text-xs font-medium">
                            {formatCurrency(product.price)}
                          </div>
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
                  <Button
                    onClick={handleLoadMore}
                    title="Tải thêm"
                    style={{ width: "54%" }}
                  />
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewPrice(Number(e.target.value))
            }
            size="sm"
            type="number"
            placeholder="Giá"
          />
          <Button
            size="sm"
            title="Thay đổi"
            style={{ width: "100%" }}
            type="submit"
          />
        </form>
      </Modal>
      <Modal
        title={"Xác nhận thanh toán"}
        opened={openModalOrder}
        size="xl"
        onClose={() => setOpenModalOrder(false)}
      >
        <div className="flex flex-col gap-4">
          <Select
            name="paymentMethod"
            onChange={(value) =>
              setChangePaymentMethods(value as payment_method)
            }
            position="bottom"
            label={"Phương thức thanh toán"}
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
            <span> Tổng tiền trước thuế </span>{" "}
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
            <span className="text-pos-blue-500 font-semibold text-lg">
              {" "}
              Tổng tiền thanh toán{" "}
            </span>
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
        title={"Thêm khách hàng mới"}
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
      {/* ✅ MODAL HÓA ĐƠN - THÊM Ở CUỐI TRƯỚC KHI ĐÓNG DIV */}
      <Modal
        title={"Hóa đơn thanh toán"}
        opened={openModalInvoice}
        size="xl"
        onClose={() => setOpenModalInvoice(false)}
      >
        {/* Component hiển thị hóa đơn */}
        <div id="invoice-print" className="bg-white p-4 rounded-md">
          <Invoice
            store={{
              name: currentStore?.name || "Tên cửa hàng",
              address: currentStore?.address || "Địa chỉ chưa cập nhật",
            }}
            order={{
              id: "HD0001",
              date: new Date().toLocaleString(),
              customerName: selectedCustomer?.name || "Khách lẻ",
              items: invoiceData.map((p) => ({
                name: p.name,
                quantity: p.selectedQuantity,
                price: p.price,
              })),
              total: invoiceData.reduce(
                (sum, p) => sum + p.selectedQuantity * p.price,
                0
              ),
            }}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button
            title="In hóa đơn"
            onClick={() => {
              const element = document.getElementById("invoice-print");
              if (element) html2pdf().from(element).save("invoice.pdf");
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
