"use client";
import React from "react";

interface InvoiceProps {
  store: {
    name: string;
    // phone: string;
    address?: string;
  };
  order: {
    id: string;
    date: string;
    customerName?: string;
    paymentMethod?: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
  };
}

export default function Invoice({ store, order }: InvoiceProps) {
  return (
    <div
      id="invoice"
      className="bg-white text-black mx-auto"
      style={{
        width: "80mm",
        fontSize: "12px",
        fontFamily: "monospace",
        lineHeight: "1.4",
        padding: "4px 0",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <strong style={{ fontSize: "14px" }}>{store.name}</strong>
        {/* <div>{store.phone}</div> */}
        {store.address && <div>{store.address}</div>}
      </div>

      <hr />

      {/* Order Info */}
      <div>
        <div>Mã HĐ: {order.id}</div>
        <div>Ngày: {new Date(order.date).toLocaleString()}</div>
        <div>KH: {order.customerName || "Khách lẻ"}</div>
        <div>TT: {order.paymentMethod || "Chưa chọn"}</div>
      </div>

      <hr />

      {/* Items */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>SP</th>
            <th style={{ textAlign: "right" }}>SL</th>
            <th style={{ textAlign: "right" }}>TT</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td style={{ textAlign: "right" }}>{item.quantity}</td>
              <td style={{ textAlign: "right" }}>
                {(item.price * item.quantity).toLocaleString()}₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* Total */}
      <div style={{ textAlign: "right", fontWeight: "bold" }}>
        Tổng cộng: {order.total.toLocaleString()}₫
      </div>

      <hr />

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "8px" }}>
        Cảm ơn quý khách và hẹn gặp lại!
      </div>
    </div>
  );
}
