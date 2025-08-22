import { NumberInput } from "@mantine/core";
import React, { useState, useMemo } from "react";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discount: number; // %
}

export function CartDetails() {
  // Preset product data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Sản phẩm A", quantity: 2, price: 120000, discount: 0 },
    { id: 2, name: "Sản phẩm B", quantity: 1, price: 95000, discount: 0 },
    { id: 3, name: "Sản phẩm C", quantity: 3, price: 150000, discount: 0 },
    { id: 4, name: "Sản phẩm D", quantity: 1, price: 200000, discount: 0 },
  ]);

  // Calculate total price
  const totalPrice = useMemo(
    () => products.reduce((sum, p) => sum + p.quantity * p.price - p.discount, 0),
    [products]
  );

  const handleQuantityChange = (id: number, value: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: value } : p)));
  };

  const handleDiscountChange = (id: number, value: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, discount: value } : p)));
  };

  return (
    <div className="w-full h-full bg-white p-5 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Chi tiết giỏ hàng</h2>

      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 font-semibold border-b pb-2">
        <div>Tên SP</div>
        <div className="text-right">Số lượng</div>
        <div className="text-right">Giá</div>
        <div className="text-right">Giảm giá</div>
        <div className="text-right">Thành tiền</div>
      </div>

      {/* Table Rows */}
      {products.map((product) => {
        const total = product.quantity * product.price - product.discount;

        return (
          <div
            key={product.id}
            className="grid grid-cols-5 gap-4 py-2 border-b border-dashed last:border-none"
          >
            {/* Product Name */}
            <div>{product.name}</div>

            {/* Quantity Input */}
            <div className="flex justify-end">
              <NumberInput
                hideControls
                inputMode="numeric"
                className="w-[7ch]"
                onChange={(value: number) => {
                  handleQuantityChange(product.id, value);
                }}
              />
            </div>

            {/* Price */}
            <div className="text-right">{product.price.toLocaleString("vi-VN")}₫</div>

            {/* Discount */}
            <div className="flex justify-end">
              <NumberInput
                hideControls
                suffix="₫"
       
                onChange={(value: number) => {
                  handleDiscountChange(product.id, value);
                }}
              />
            </div>

            {/* Total for item */}
            <div className="text-right">{total.toLocaleString("vi-VN")}₫</div>
          </div>
        );
      })}

      {/* Tổng cộng */}
      <div className="grid grid-cols-5 gap-4 font-bold mt-4 pt-2 ">
        <div className="col-span-4 text-right">Tổng cộng:</div>
        <div className="text-right">{totalPrice.toLocaleString("vi-VN")}₫</div>
        
      </div>
    </div>
  );
}
