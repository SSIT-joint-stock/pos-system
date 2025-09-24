"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  CupSoda,
  Ellipsis,
  HandCoins,
  MinusIcon,
  Pencil,
  Plus,
  PlusIcon,
  ShoppingBasket,
  ShoppingCart,
  Trash,
  Utensils,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";
import { Select } from "@repo/design-system/components/ui";
import useInventory from "../../../../../main/src/hooks/inventory/use-inventory";
import { formatCurrency, formatDate } from "../../../../../main/src/utils/index";
import api from "../../../../../main/src/libs/axios";
import { useAtomValue } from "jotai";
import { currentStoreAtom } from "@repo/design-system/stores/auth";
import useToast from "@repo/design-system/hooks/client/use-toast-notification";
import FilterBar from "../components/filter-bar";

// Define proper TypeScript interfaces
interface Product {
  product_id: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
}

interface Invoice {
  id: number;
  name: string;
  products: Product[];
  discountCode: string;
  paymentMethod: string;
}
enum order_status {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  DELIVERING = "DELIVERING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

const catagories = [
  {
    title: "Tất cả",
    icon: <ShoppingBasket size={20} />,
  },
  {
    title: "Đồ ăn",
    icon: <Utensils size={20} />,
  },
  {
    title: "Đồ uống",
    icon: <CupSoda size={20} />,
  },
  {
    title: "Đồ dùng",
    icon: <Wrench size={20} />,
  },
  {
    title: "khác",
    icon: <Ellipsis size={20} />,
  },
];

export function SalesView() {
  const { inventories, getInventories, setFilters } = useInventory();
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      name: "Hóa đơn ",
      products: [],
      discountCode: "",
      paymentMethod: "",
    },
  ]);
  const [activeInvoice, setActiveInvoice] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  // Thêm tab mới
  const addInvoice = () => {
    const newId = Date.now();
    const newInvoice: Invoice = {
      id: newId,
      name: `Hóa đơn `,
      products: [],
      discountCode: "",
      paymentMethod: "",
    };
    setInvoices([...invoices, newInvoice]);
    setActiveInvoice(newId);
  };

  // Xóa tab
  const removeInvoice = (id: number) => {
    if (invoices.length > 1) {
      const filtered = invoices.filter((inv) => inv.id !== id);
      setInvoices(filtered);
      setActiveInvoice(filtered[0].id);
    } else {
      return;
    }
  };

  // Bắt đầu đổi tên
  const startEditName = (id: number, currentName: string) => {
    setEditingId(id);
    setNewName(currentName);
  };

  // Lưu tên mới
  const saveName = (id: number) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, name: newName.trim() || inv.name } : inv)));
    setEditingId(null);
    setNewName("");
  };

  // Thêm sản phẩm vào hóa đơn hiện tại
  const addToCart = (product: any) => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === activeInvoice) {
          // Kiểm tra xem sản phẩm đã có trong hóa đơn chưa
          const existingProductIndex = inv.products.findIndex((p) => p.product_id === product.id);

          if (existingProductIndex >= 0) {
            // Nếu đã có, tăng số lượng
            const updatedProducts = [...inv.products];
            updatedProducts[existingProductIndex] = {
              ...updatedProducts[existingProductIndex],
              quantity: updatedProducts[existingProductIndex].quantity + 1,
              totalPrice:
                updatedProducts[existingProductIndex].product.price *
                (updatedProducts[existingProductIndex].quantity + 1),
            };
            return { ...inv, products: updatedProducts };
          } else {
            // Nếu chưa có, thêm mới với số lượng là 1
            return {
              ...inv,
              products: [
                ...inv.products,
                {
                  ...product,
                  quantity: 1,
                  totalPrice: product.product.price,
                },
              ],
            };
          }
        }
        return inv;
      })
    );
    setOpen(true);
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setInvoices(
      invoices.map((inv) => {
        if (inv.id === activeInvoice) {
          return {
            ...inv,
            products: inv.products.map((p) =>
              p.product_id === productId
                ? {
                    ...p,
                    quantity: newQuantity,
                    totalPrice: p.product.price * newQuantity,
                  }
                : p
            ),
          };
        }
        return inv;
      })
    );
  };

  // Xóa sản phẩm khỏi hóa đơn
  const removeProduct = (productId: string) => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === activeInvoice) {
          return {
            ...inv,
            products: inv.products.filter((p) => p.product_id !== productId),
          };
        }
        return inv;
      })
    );
  };

  // Xóa tất cả sản phẩm khỏi hóa đơn hiện tại
  const clearAllProducts = () => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === activeInvoice) {
          return { ...inv, products: [] };
        }
        return inv;
      })
    );
  };

  // Cập nhật mã giảm giá
  const applyDiscountCode = () => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === activeInvoice) {
          return { ...inv, discountCode };
        }
        return inv;
      })
    );
    setDiscountCode("");
  };

  // Cập nhật phương thức thanh toán
  const updatePaymentMethod = (method: string) => {
    if (!method) return;
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === activeInvoice) {
          return { ...inv, paymentMethod: method };
        }
        return inv;
      })
    );
  };

  // Tính tổng tiền cho hóa đơn hiện tại
  const getCurrentInvoice = () => {
    return invoices.find((inv) => inv.id === activeInvoice) || invoices[0];
  };

  const currentInvoice = getCurrentInvoice();
  const selectedProducts = currentInvoice?.products || [];
  const productsCount = selectedProducts.length;

  // Tính tổng tiền
  const subtotal = selectedProducts.reduce((sum, product) => sum + product.product.price * product.quantity, 0);
  const discount = currentInvoice.discountCode ? subtotal * 0.1 : 0; // Giả sử giảm giá 10%
  const tax = subtotal * 0.05; // Giả sử thuế 5%
  const total = subtotal - discount + tax;
  const currentStore = useAtomValue(currentStoreAtom);
  const { showSuccessToast, showWarningToast, showErrorToast } = useToast();
  const createOrder = async () => {
    if (!currentStore?.id) return;
    const currentInvoice = getCurrentInvoice();
    try {
      const body = {
        subtotal_amount: subtotal, // tổng tiền sản phẩm
        discount_amount: discount, // nếu có mã giảm giá
        tax_amount: Math.ceil(tax),
        total_amount: Math.ceil(total),
        payment_method: currentInvoice.paymentMethod === "Chuyen khoan" ? "CREDIT_CARD" : "CASH",
        status: order_status.COMPLETED,
        order_items: currentInvoice.products.map((item) => ({
          product_id: item.product_id, // hoặc item.product.id nếu BE mong product_id
          quantity: item.quantity,
          price: item.product.price,
        })),
      };
      const res = await api.post(`stores/${currentStore?.id}/orders`, body);
      if (res?.data.success) {
        // setOpen(false);
        getInventories();
        clearAllProducts();

        showSuccessToast("Tạo đơn hàng thành công");
      }
    } catch {
      showErrorToast("Tạo đơn hàng thất bại, vui lòng thử lại");
    }
  };
  return (
    <div className="w-full bg-white px-3.5 rounded-xl shadow overflow-auto h-full pb-3.5">
      <div
        className={`flex items-center justify-between  border-b-2 border-b-gray-300 py-6  ${open ? " w-[62%]" : " w-full"}`}
      >
        <h1 className="text-xl font-semibold text-pos-blue-500 w-fit">Danh Sách Sản Phẩm</h1>
        <div className="flex-1 ml-8 mr-4">
          <FilterBar
            setWidth="60%"
            hasBg={false}
            statusOptions={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "INACTIVE", label: "INACTIVE" },
              { value: "SOLD", label: "SOLD" },
            ]}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
            }}
            onSearch={(value) => {
              setFilters((prev) => ({ ...prev, productName: value }));
            }}
          />
        </div>

        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="cursor-pointer flex items-center justify-center px-3.5 py-3 border border-gray-400 hover:border-pos-blue-400 rounded-md text-nowrap hover:bg-pos-blue-400 transition-all duration-300 group outline-none"
        >
          <ShoppingCart size={16} className="text-gray-500 group-hover:text-white transition-all duration-300" />
        </button>
      </div>
      <div className={`mt-7 ${open ? " w-[62%]" : " w-full"}`}>
        <div className="flex items-center gap-5 ">
          {catagories.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded-md hover:text-white hover:bg-pos-blue-400 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center text-sm">{item.icon}</div>
              <p className="text-sm font-medium ">{item.title}</p>
            </button>
          ))}
        </div>
      </div>

      <>
        {inventories.length === 0 ? (
          <div className={`${open ? " w-[62%]" : " w-full"} text-center text-lg italic text-gray-600 py-10`}>
            Chưa có sản phẩm
          </div>
        ) : (
          <>
            <div
              className={`grid ${open ? "grid-cols-4 w-[62%]" : "grid-cols-5 w-full"}  items-center justify-center gap-5 mt-12 space-y-3.5`}
            >
              {inventories.map((product) => (
                <div
                  onClick={() => {
                    if (product.quantity > 0) {
                      addToCart(product);
                      showSuccessToast("Thêm vào giỏ hàng thành công");
                    } else {
                      showWarningToast("Sản phẩm hiện đã hết hàng");
                    }
                  }}
                  key={product.id}
                  className="border border-gray-200 rounded-xl p-4 shadow scale-100 hover:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={"/placeholder.jpg"}
                    alt="sản phẩm"
                    width={500}
                    height={500}
                    className="rounded-xl object-cover"
                    unoptimized
                  />
                  <div className="flex flex-col gap-2 mt-3 ">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold truncate text-gray-500">{product.product.name}</h2>
                      <span className="text-xs text-gray-500 font-medium">{formatDate(product.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">Số Lượng:</p>
                      <p className=" font-semibold text-gray-600">{product.quantity}</p>
                    </div>

                    <div className="flex items-center justify-between  ">
                      <div className="flex items-center justify-center  gap-1.5">
                        <p className="text-sm text-gray-500">Giá: </p>
                        <p className="text-lg font-semibold text-gray-600">{formatCurrency(product.product.price)}</p>
                      </div>
                      <button
                        disabled={product.quantity <= 0}
                        onClick={() => {
                          if (product.quantity > 0) {
                            addToCart(product);
                            // showSuccessToast('Thêm vào giỏ hàng thành công');
                          } else {
                            showWarningToast("Sản phẩm hiện đã hết hàng");
                          }
                        }}
                        className={`flex items-center justify-center rounded-md border px-3 py-2 transition-all group duration-300 ${product.quantity <= 0 ? "border-gray-100 bg-gray-100 cursor-not-allowed" : "border-gray-200 hover:border-pos-blue-400 hover:bg-pos-blue-400 cursor-pointer "}`}
                      >
                        <ShoppingCart
                          size={18}
                          className={`transition-all duration-300 ${product.quantity <= 0 ? "text-gray-300" : "text-gray-500 group-hover:text-white"}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </>

      {/*sidebar order */}

      <div
        className={`fixed top-0 right-0  h-screen overflow-auto bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0 transition-all duration-300" : "translate-x-full transition-all duration-300"
        } w-[32%] border border-gray-200 rounded-md shadow px-5 py-2}`}
      >
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="border border-gray-200 shadow px-2 py-1.5 rounded-md mt-2 hover:bg-pos-blue-400 group transition-all duration-300"
        >
          <ChevronRight className="text-gray-400 group-hover:text-white cursor-pointer" />
        </button>
        {/* Tabs hóa đơn */}
        <div className="flex items-center gap-3 overflow-x-auto mt-3 pb-2 border-b border-gray-200">
          {invoices.map((inv, index) => (
            <div
              key={inv.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer whitespace-nowrap transition-all ${
                activeInvoice === inv.id
                  ? "bg-pos-blue-400 text-white font-semibold"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {/* Nếu đang edit thì hiện input */}
              {editingId === inv.id ? (
                <input
                  value={newName}
                  autoFocus
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => saveName(inv.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveName(inv.id)}
                  className="px-1 rounded bg-white  outline-none w-36 text-xs font-medium text-gray-500"
                />
              ) : (
                <span onClick={() => setActiveInvoice(inv.id)} onDoubleClick={() => startEditName(inv.id, inv.name)}>
                  {`${inv.name} ${index + 1}`}
                </span>
              )}

              {/* Nút đổi tên */}
              <Pencil
                size={14}
                className="cursor-pointer opacity-70 hover:opacity-100"
                onClick={() => startEditName(inv.id, inv.name)}
              />
              {/* Nút xóa */}
              <X
                size={14}
                className="cursor-pointer opacity-70 hover:text-red-500"
                onClick={() => removeInvoice(inv.id)}
              />
            </div>
          ))}

          {/* Nút thêm hóa đơn */}
          <button
            onClick={addInvoice}
            className="px-3 py-2 cursor-pointer border border-gray-300 rounded-md flex items-center gap-1 hover:bg-pos-blue-400 hover:text-white transition"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-3.5 ">
          <div className="flex items-center justify-between mt-3.5">
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-600 font-semibold">Hiện có</p>
              <p className="text-red-400 font-semibold">{productsCount}</p>
              <p className="text-gray-600 font-semibold">sản phẩm đã được chọn</p>
            </div>
            {productsCount > 0 && (
              <p
                onClick={clearAllProducts}
                className="text-red-500 font-semibold cursor-pointer hover:bg-red-50 hover:text-red-500 hover:rounded-md hover:px-2.5 transition-all duration-300"
              >
                Xóa tất cả
              </p>
            )}
          </div>

          {productsCount === 0 ? (
            <div className="text-center text-lg italic text-gray-600 py-10">Chưa có sản phẩm</div>
          ) : (
            <>
              <div className="h-[380px] overflow-y-scroll ">
                {selectedProducts.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3.5 border-b-2 border-b-gray-200 py-3.5">
                    <div className="">
                      <Image
                        src={"/placeholder.jpg"}
                        alt="san pham"
                        width={80}
                        height={100}
                        className="rounded-xl object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <h1 className="font-semibold">{item.product.name}</h1>
                        <button
                          className="cursor-pointer scale-100 hover:scale-150 hover:-translate-x-2.5 transition-all duration-300 hover:bg-red-50 hover:px-2 hover:py-1 hover:text-red-500 hover:rounded-md text-red-500"
                          onClick={() => removeProduct(item.product_id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                      {/* <div className="flex items-center gap-3.5 text-sm text-gray-500">
                          <p>Loai san pham: </p>
                          <p>Quan ao</p>
                        </div> */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center justify-center">
                          <button
                            disabled={item.quantity === 1}
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="border border-gray-200 rounded-md text-center flex items-center justify-center w-8 h-8 disabled:bg-gray-50 disabled:border-0 disabled:cursor-not-allowed"
                          >
                            <span>
                              <MinusIcon size={14} />
                            </span>
                          </button>
                          <input
                            value={item.quantity}
                            min={1}
                            max={(() => {
                              const inventoryProduct = inventories.find((p) => p.id === item.product_id);
                              return inventoryProduct ? inventoryProduct.quantity : 1;
                            })()}
                            onChange={(e) => {
                              updateQuantity(item.product_id, parseInt(e.target.value) || 1);
                            }}
                            className="w-8 h-8 text-center outline-0 border border-gray-200 mx-1 rounded-md"
                          />
                          <button
                            disabled={(() => {
                              const inventoryProduct = inventories.find((p) => p.id === item.product_id);
                              return inventoryProduct ? item.quantity >= inventoryProduct.quantity : false;
                            })()}
                            onClick={() => {
                              updateQuantity(item.product_id, item.quantity + 1);
                            }}
                            className="border border-gray-200 rounded-md text-center flex items-center justify-center w-8 h-8 disabled:bg-gray-50 disabled:border-0 disabled:cursor-not-allowed"
                          >
                            <PlusIcon size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-semibold">{formatCurrency(item.totalPrice)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hiển thị tổng tiền chỉ khi có sản phẩm */}
              <div className="bg-gray-100 rounded-md px-2.5 py-1.5 mt-4">
                <div className="space-y-1 border-b-2 border-b-gray-200 py-2.5">
                  <div className="flex items-center justify-between">
                    <p>Tổng tiền sản phẩm:</p>
                    <p>{formatCurrency(subtotal)}</p>
                  </div>
                  {currentInvoice.discountCode && (
                    <div className="flex items-center justify-between">
                      <p>Giảm giá: </p>
                      <p className="text-red-500">-{formatCurrency(discount)}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p>Thuế giá trị sản phẩm: </p>
                    <p>+{formatCurrency(tax)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <p className="text-gray-700 font-bold">Tổng thanh toán: </p>
                  <p className="text-lg text-gray-700 font-bold">{formatCurrency(total)}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3.5 mt-4">
                <input
                  placeholder="Mã giảm giá"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="outline-0 border border-gray-200 w-full rounded-md h-9 px-3"
                />
                <button
                  onClick={applyDiscountCode}
                  className="px-2.5 py-1.5 bg-gray-100 rounded-md text-gray-500 font-semibold text-nowrap"
                >
                  Xác nhận
                </button>
              </div>

              <Select
                data={["Chuyển khoản", "Tiền mặt"]}
                className="mt-2"
                placeholder="Chọn phương thức thanh toán"
                onChange={updatePaymentMethod as any}
              />
              <button
                onClick={createOrder}
                className="bg-pos-blue-400 text-white rounded-md px-3.5 py-2 flex items-center justify-center gap-3 my-5 w-full hover:bg-pos-blue-300 transition-all duration-300 cursor-pointer"
              >
                <HandCoins size={20} className="text-white" />
                <p>Thanh toán ngay</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
