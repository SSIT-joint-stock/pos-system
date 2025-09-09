"use client";
import { Input, Modal, Select, Table } from "@repo/design-system/components/ui";
import FilterBar from "../components/filter-bar";
import { BadgeAlert, CalendarDays, Check, Download, Edit, Eye, ShoppingCart, Trash } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

const products = [
  {
    orderId: "DH001",
    customer: "Nguyễn Văn A",
    address: "123 Lê Lợi, Hà Nội",
    price: 250000,
    status: "Processing",
    date: "12 August, 2025 at 10:00 AM from Web",
    catagory: "Sunglass",
  },
  {
    orderId: "DH002",
    customer: "Trần Thị B",
    address: "45 Nguyễn Huệ, TP. HCM",
    price: 120000,
    status: "Delivered",
    date: "15 August, 2025 at 02:30 PM from Mobile",
    catagory: "Sunglass",
  },
  {
    orderId: "DH003",
    customer: "Lê Văn C",
    address: "78 Hai Bà Trưng, Đà Nẵng",
    price: 500000,
    status: "Unpaid",
    date: "20 August, 2025 at 09:15 AM from Web",
    catagory: "Sunglass",
  },
  {
    orderId: "DH004",
    customer: "Phạm Thị D",
    address: "90 Trần Phú, Hải Phòng",
    price: 300000,
    status: "Canceled",
    date: "25 August, 2025 at 05:45 PM from Mobile",
    catagory: "Sunglass",
  },
  {
    orderId: "DH005",
    customer: "Hoàng Văn E",
    address: "12 Lý Thường Kiệt, Cần Thơ",
    price: 450000,
    status: "Completed",
    date: "30 August, 2025 at 11:20 AM from Web",
    catagory: "Sunglass",
  },
];
const tableHeaders = ["Mã Đơn Hàng", "Khách Hàng", "Địa Chỉ", "Giá", "Trạng Thái Đơn Hàng", "Thao Tác"];
const statusColors: Record<string, string> = {
  Processing: "text-blue-500",
  Delivered: "text-green-500",
  Unpaid: "text-orange-500",
  Canceled: "text-red-600",
  Completed: "text-green-700",
};

export function OrdersView() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  return (
    <>
      <Modal
        opened={openViewModal || openEditModal}
        size="lg"
        onClose={() => {
          setOpenEditModal(false);
          setOpenViewModal(false);
        }}
      >
        <div className="flex items-center border-b border-b-gray-200 pb-2.5 mb-4 gap-2.5">
          <ShoppingCart size={18} className="" />
          <div className="flex items-center">
            <h3 className="text-gray-700s">Ma Don Hang</h3>
            <h3 className="text-pos-blue-400">#{selectedProduct?.orderId}</h3>
          </div>
        </div>

        <div className="space-y-2.5">
          <h3>Thong Tin San Pham</h3>
          <div className=" border-b border-b-gray-200 pb-2.5 space-y-1">
            <div className="flex items-center gap-4 ">
              <Image
                width={1000}
                height={1000}
                src={"https://upload.wikimedia.org/wikipedia/commons/0/09/DoMixi1989.jpg"}
                alt="avatar"
                className="rounded-full w-20 h-20 object-cover"
              />
              <div className="grid grid-cols-3 gap-8 items-center  py-3">
                <div>
                  <h3 className="font-medium text-gray-800">Ultraboost Redbull</h3>
                  <p className="text-xs text-gray-500">Danh mục: {selectedProduct?.catagory}</p>
                </div>

                <div className="flex justify-center">
                  <span className="text-sm text-gray-700">Số lượng: 1</span>
                </div>

                <div className="flex justify-end">
                  <span className="text-sm font-semibold text-green-600">Đơn giá: {selectedProduct?.price} đ</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <div className="rounded-xl bg-pos-blue-50 text-pos-blue-500 flex items-center gap-2 p-2 text-xs">
                <Check size={12} className="shrink-0 bg-pos-blue-500 text-pos-blue-50 rounded-full font-medium " />
                <span className="leading-none">Được kiểm định</span>
              </div>
              <div className="rounded-xl bg-pos-blue-50 text-pos-blue-500 flex items-center gap-2 p-2 text-xs">
                <span className="leading-none">Nuoc tang luc</span>
              </div>
              <div className="rounded-xl bg-pos-blue-50 text-pos-blue-500 flex items-center gap-2 p-2 text-xs">
                <span className="leading-none">Giai Khat</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 p-2.5 text-sm border-b border-b-gray-200">
            <div className="text-gray-500 text-left space-y-2">
              <p>Ngày tạo đơn:</p>
              <p>Phương thức thanh toán:</p>
              <p>Trạng thái:</p>
            </div>

            <div className="text-gray-800 font-medium space-y-2">
              <p>{selectedProduct?.date}</p>
              {openEditModal ? (
                <Select
                  placeholder="Phuong thuc thanh toan"
                  size="sm"
                  data={["Tien mat", "Chuyen khoan", "Momo", " Zalo Pay"]}
                  className="text-sm font-medium"
                ></Select>
              ) : (
                <p className="text-blue-600">Chuyển khoản</p>
              )}

              <p className="font-semibold text-green-600">{selectedProduct?.status}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 p-2.5 text-sm border-b border-b-gray-200">
            <div className={`${openEditModal ? "space-y-7" : "space-y-2"} text-gray-500 text-left`}>
              <p>Tên khách hàng:</p>
              <p>Email:</p>
              <p>Số điện thoại:</p>
              <p>Địa chỉ:</p>
            </div>

            <div className="text-gray-800 font-medium flex flex-col gap-2.5">
              {openEditModal ? (
                <Input size="sm" radius="md" placeholder={selectedProduct?.customer} className="outline-0 " />
              ) : (
                <p>{selectedProduct?.customer}</p>
              )}
              {openEditModal ? (
                <Input size="sm" radius="md" placeholder={"dothanhcp503@gmail.com"} className="outline-0 " />
              ) : (
                <p className="text-pos-blue-500">dothanhcp503@gmail.com</p>
              )}
              {openEditModal ? (
                <Input size="sm" radius="md" placeholder={"0906027258"} className="outline-0 " />
              ) : (
                <p className="font-semibold ">0326562658</p>
              )}
              {openEditModal ? (
                <Input size="sm" radius="md" placeholder={selectedProduct?.address} className="outline-0 " />
              ) : (
                <p className="">{selectedProduct?.address}</p>
              )}
            </div>
          </div>
          <div className={`${openEditModal ? "border-b border-b-gray-200" : ""}`}>
            <h3 className="text-gray-700 px-2 mb-2.5">Thanh toán</h3>
            <div className="grid grid-cols-2 p-2.5 text-sm ">
              <div className="text-gray-500 text-left space-y-2">
                <p>Đơn giá:</p>
                <p>Số lượng:</p>
                <p>Tổng tiền:</p>
              </div>

              <div className="text-gray-800 font-medium space-y-2">
                <p>{selectedProduct?.price} đ</p>
                <p>5</p>
                <p>{selectedProduct?.price * 5} đ</p>
              </div>
            </div>
          </div>
          {openEditModal && (
            <div className="flex items-center justify-end gap-3">
              <button className=" text-center text-red-600 font-bold px-3 py-1.5 cursor-pointer">Hủy</button>
              <button className="rounded-md bg-pos-blue-400 px-3 py-1.5 text-white font-bold text-center cursor-pointer">
                Xác nhận
              </button>
            </div>
          )}
        </div>
      </Modal>
      {/* DELETE MODAL */}

      <Modal opened={deleteModal} size="sm" onClose={() => setDeleteModal(false)}>
        <div className="space-y-3 flex flex-col items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
              <BadgeAlert size={38} />
            </div>
            <div className="text-lg font-bold text-center">Bạn Có Chắc Chắn Muốn Xóa?</div>
            <div className="text-sm text-gray-500 text-center">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan của trường này sẽ biến mất.
            </div>
          </div>
          <button className="bg-red-600 rounded-lg text-white w-full py-2 cursor-pointer font-bold">
            Xác Nhận Xóa{" "}
          </button>
          <button className="cursor-pointer">Hủy</button>
        </div>
      </Modal>

      <div className="flex flex-col h-full gap-5">
        <div className="w-full bg-white grid grid-cols-6 rounded-xl p-4 text-gray-400 gap-6 shadow-sm">
          <div className="flex items-center  gap-2 text-lg font-semibold text-pos-blue-400 px-4 py-3 border-r border-r-gray-200">
            <CalendarDays className="text-pos-blue-400" />
            <span>Today</span>
          </div>
          <div className="border-r border-r-gray-200">
            <p>Total orders</p>
            <p className="font-semibold text-xl text-pos-blue-400">48</p>
          </div>
          <div className="border-r border-r-gray-200">
            <p>Ordered items over time</p>
            <p className="font-semibold text-xl text-pos-blue-400">493</p>
          </div>
          <div className="border-r border-r-gray-200">
            <p>Return</p>
            <p className="font-semibold text-xl text-pos-blue-400">6</p>
          </div>
          <div className="border-r border-r-gray-200">
            <p>Fullfiled orders over time</p>
            <p className="font-semibold text-xl text-pos-blue-400">359</p>
          </div>
          <div className="">
            <p>Delivered orders overtime</p>
            <p className="font-semibold text-xl text-pos-blue-400">353</p>
          </div>
        </div>
        {/* ACTION */}
        <FilterBar
          actions={
            <>
              <button className="bg-pos-blue-400 border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Download size={16} className="text-white" />
                <span className="text-white font-medium text-xs"> Xuất dữ liệu</span>
              </button>
            </>
          }
        />

        {/* TABLE AND PAGINATION */}
        <Table
          totalPages={10}
          tableHeaders={tableHeaders}
          data={products}
          renderRow={(product, idx) => (
            <>
              <tr key={idx} className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300">
                <td className="px-4 py-2 text-xs font-medium text-gray-900">{product.orderId}</td>
                <td className="px-4 py-2 text-xs text-gray-500 font-medium">{product.customer}</td>
                <td className="px-4 py-2 text-xs text-gray-500">{product.address}</td>
                <td className="px-4 py-2 text-xs text-gray-500">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(product.price))}
                </td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-medium rounded-xl ${statusColors[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="flex  items-center gap-5 pl-4">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpenEditModal(false);
                        setOpenViewModal(true);
                      }}
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 opacity-70 transition-opacity duration-200"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 opacity-70 transition-opacity duration-200"
                      onClick={() => {
                        setOpenEditModal(true);
                        setOpenViewModal(false);
                        setSelectedProduct(product);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-red-50 text-red-500 rounded-md hover:opacity-100 opacity-70 transition-opacity duration-200 ml-auto"
                      onClick={() => {
                        setDeleteModal(true);
                        setSelectedProduct(product);
                        setOpenEditModal(false);
                        setOpenViewModal(false);
                      }}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </>
          )}
        />
      </div>
    </>
  );
}
