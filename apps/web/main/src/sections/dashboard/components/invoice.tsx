"use client";
import React from "react";

interface InvoiceProps {
  store: {
    name: string;
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
  const format = (n: number) => n.toLocaleString("vi-VN");

  return (
    <div
      id="invoice"
      className="mx-auto bg-white text-black"
      style={{
        width: "80mm",
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: "1.5",
        padding: "6px 8px",
        border: "1px solid #000", // ✅ viền ngoài ôm sát
        borderRadius: "4px",
        boxShadow: "0 0 4px rgba(0,0,0,0.15)", // đổ bóng nhẹ để nhìn giống tờ giấy
      }}
    >
      {/* ===== Header ===== */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <strong style={{ fontSize: "15px", display: "block" }}>
          {store.name.toUpperCase()}
        </strong>
        {store.address && (
          <div style={{ fontSize: "11px", whiteSpace: "pre-wrap" }}>
            {store.address}
          </div>
        )}
      </div>

      <hr style={{ border: "1px dashed #999" }} />

      {/* ===== Order Info ===== */}
      <div style={{ margin: "6px 0" }}>
        <div>
          <strong>Mã HĐ:</strong> {order.id}
        </div>
        <div>
          <strong>Ngày:</strong> {new Date(order.date).toLocaleString()}
        </div>
        <div>
          <strong>Khách hàng:</strong> {order.customerName || "Khách lẻ"}
        </div>
        <div>
          <strong>Thanh toán:</strong> {order.paymentMethod || "Chưa chọn"}
        </div>
      </div>

      <hr style={{ border: "1px dashed #999" }} />

      {/* ===== Items Table ===== */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "4px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #000" }}>
            <th style={{ textAlign: "left", paddingBottom: "2px" }}>
              Sản phẩm
            </th>
            <th
              style={{ textAlign: "right", width: "15%", paddingBottom: "2px" }}
            >
              SL
            </th>
            <th
              style={{ textAlign: "right", width: "25%", paddingBottom: "2px" }}
            >
              Đ.Giá
            </th>
            <th
              style={{ textAlign: "right", width: "25%", paddingBottom: "2px" }}
            >
              T.Tiền
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td
                style={{
                  padding: "3px 2px",
                  wordWrap: "break-word",
                  maxWidth: "40mm",
                }}
              >
                {item.name}
              </td>
              <td style={{ textAlign: "right", padding: "3px 2px" }}>
                {item.quantity}
              </td>
              <td style={{ textAlign: "right", padding: "3px 2px" }}>
                {format(item.price)}
              </td>
              <td style={{ textAlign: "right", padding: "3px 2px" }}>
                {format(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ border: "1px dashed #999" }} />

      {/* ===== Totals ===== */}
      <div style={{ textAlign: "right", marginTop: "4px" }}>
        <div>
          <strong>Tổng cộng:</strong>{" "}
          <span style={{ fontWeight: "bold", fontSize: "13px" }}>
            {format(order.total)} ₫
          </span>
        </div>
      </div>

      <hr style={{ border: "1px dashed #999" }} />

      {/* ===== Footer ===== */}
      <div
        style={{
          textAlign: "center",
          marginTop: "8px",
          fontSize: "11px",
          lineHeight: "1.4",
        }}
      >
        <div>Xin cảm ơn quý khách!</div>
        <div>Hẹn gặp lại!</div>
        <div style={{ marginTop: "4px" }}>-------------------------------</div>
        <div>Ngày in: {new Date().toLocaleString()}</div>
      </div>
    </div>
  );
}
