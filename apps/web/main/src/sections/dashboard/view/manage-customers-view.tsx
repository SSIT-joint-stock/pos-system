"use client";
import {
  Download,
  Edit,
  EllipsisVertical,
  IdCard,
  Mail,
  MapPinned,
  Phone,
  Plus,
  Table2,
  Tag,
  Trash,
  Upload,
} from "lucide-react";
import React from "react";
import FilterBar from "../components/filter-bar";
import Image from "next/image";
import { Modal, Table } from "@repo/design-system/components/ui";
import { formatDate } from "@repo/utils";

const tableHeaders = [
  "ID",
  "Tên Khách Hàng",
  "Số Điện Thoại",
  "Email",
  "Địa Chỉ",
  "Thành Phố",
  "Mã Bưu Điện",
  "Quốc Gia",
  "Ngày Tạo",
  "Cập Nhật Lần Cuối",
  "Thao Tác",
];

const customerInfor = [
  {
    id: "b3b9b9a2-31e5-4d0d-83b9-4cc1f1b9d1f0",
    store_id: "d5a4e1c0-5a9a-4d3b-8f22-10a8e7a2b1c3",
    name: "Nguyễn Văn An",
    phone: "0905123456",
    email: "an.nguyen@example.com",
    address: "123 Đường Trần Hưng Đạo",
    city: "Hà Nội",
    state: "Hoàn Kiếm",
    zip: "100000",
    country: "Việt Nam",
    createdAt: new Date("2025-01-05T09:00:00Z"),
    updatedAt: new Date("2025-01-05T09:00:00Z"),
  },
  {
    id: "4fba91b0-60a2-4e72-b317-21864d49df92",
    store_id: "d5a4e1c0-5a9a-4d3b-8f22-10a8e7a2b1c3",
    name: "Trần Thị Mai",
    phone: "0912987654",
    email: "mai.tran@example.com",
    address: "45 Nguyễn Văn Cừ",
    city: "Hải Phòng",
    state: "Ngô Quyền",
    zip: "180000",
    country: "Việt Nam",
    createdAt: new Date("2025-02-10T13:20:00Z"),
    updatedAt: new Date("2025-02-10T13:20:00Z"),
  },
  {
    id: "fcb9df8c-68ef-47de-9a2a-8f2927e9faaa",
    store_id: "d5a4e1c0-5a9a-4d3b-8f22-10a8e7a2b1c3",
    name: "Lê Hoàng Long",
    phone: "0987123987",
    email: "long.le@example.com",
    address: "78 Pasteur",
    city: "TP. Hồ Chí Minh",
    state: "Quận 3",
    zip: "700000",
    country: "Việt Nam",
    createdAt: new Date("2025-03-01T08:45:00Z"),
    updatedAt: new Date("2025-03-01T08:45:00Z"),
  },
  {
    id: "bb1b2a33-f1df-4c62-bb73-b2cb453fdd91",
    store_id: "d5a4e1c0-5a9a-4d3b-8f22-10a8e7a2b1c3",
    name: "Phạm Thị Hương",
    phone: "0974111222",
    email: "huong.pham@example.com",
    address: "12 Lê Lợi",
    city: "Đà Nẵng",
    state: "Hải Châu",
    zip: "550000",
    country: "Việt Nam",
    createdAt: new Date("2025-03-20T10:15:00Z"),
    updatedAt: new Date("2025-03-20T10:15:00Z"),
  },
  {
    id: "ea2a1129-7ec2-4df6-a1a8-446d3ef5b0c5",
    store_id: "d5a4e1c0-5a9a-4d3b-8f22-10a8e7a2b1c3",
    name: "Đỗ Trung Thành",
    phone: "0965234891",
    email: "thanh.do@example.com",
    address: "89 Lý Thường Kiệt",
    city: "Huế",
    state: "Phú Nhuận",
    zip: "530000",
    country: "Việt Nam",
    createdAt: new Date("2025-04-02T15:30:00Z"),
    updatedAt: new Date("2025-04-02T15:30:00Z"),
  },
];

export function ManageCustomersView() {
  const [active, setActive] = React.useState("table");
  const [openAddModal, setOpenAddModal] = React.useState(false);

  return (
    <>
      {/* modal add customer */}
      <Modal
        title="Them Khach hang moi "
        size="lg"
        opened={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
        }}
      >
        <div className=""></div>
      </Modal>
      <div className="space-y-6 bg-white rounded-lg px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-pos-blue-500">Quan Ly Khach Hang</h2>
          <button
            onClick={() => {
              setOpenAddModal(true);
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-pos-blue-500 cursor-pointer hover:bg-pos-blue-600 transition-all duration-300"
          >
            <Plus className="text-white" size={18} />
            <span className="text-white font-semibold text-sm">Them khach hang</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-5">
            {/* Bang */}
            <div
              onClick={() => {
                setActive("table");
              }}
              className={`flex items-center py-1.5 justify-center gap-2 cursor-pointer
  bg-left-bottom bg-no-repeat bg-gradient-to-r from-blue-500 to-blue-500
  transition-all duration-300 ease-out
  ${
    active === "table"
      ? "bg-[length:100%_3px]" // Khi active → giữ full gạch chân
      : "bg-[length:0%_2px] hover:bg-[length:100%_3px]"
  } // Hover mới trượt
`}
            >
              <Table2 size={20} className="text-gray-700" />
              <span className="text-lg font-semibold text-gray-700">Bang</span>
            </div>

            {/* The */}
            <div
              onClick={() => {
                setActive("card");
              }}
              className={`flex items-center py-1.5 justify-center gap-2 cursor-pointer
  bg-left-bottom bg-no-repeat bg-gradient-to-r from-blue-500 to-blue-500
  transition-all duration-300 ease-out
  ${
    active === "card"
      ? "bg-[length:100%_3px]" // Khi active → giữ full gạch chân
      : "bg-[length:0%_2px] hover:bg-[length:100%_3px]"
  } // Hover mới trượt
`}
            >
              <IdCard size={28} className="text-gray-700" />
              <span className="text-lg font-semibold text-gray-700">The</span>
            </div>
          </div>
          {/* ACTION */}
          <FilterBar
            hasBg={false}
            statusOptions={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "INACTIVE", label: "INACTIVE" },
              { value: "SOLD", label: "SOLD" },
            ]}
            //   onFilterChange={(newFilters) => {
            //     setFilters((prev) => ({
            //       ...prev,
            //       ...newFilters,
            //       product_status: newFilters.status,
            //     }));
            //   }}
            //   onSearch={(value) => {
            //     setFilters((prev) => ({ ...prev, q: value }));
            //   }}
            actions={
              <>
                <div className="relative ml-2">
                  <button
                    //   onClick={() => setOpenUploadOption((prev) => !prev)}
                    //   disabled={loading}
                    className={`bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Upload size={16} />
                    <span className="text-gray-900 font-medium text-sm">Tải lên dữ liệu</span>
                  </button>

                  {/* {openUploadOption && (
                  <div className="absolute top-full left-0 mt-1 z-50 flex flex-col  rounded-md shadow-md shadow-gray-100">
                    <button
                      disabled={loading}
                      onClick={() => fileInputRef.current?.click()}
                      className={`bg-white  text-nowrap  py-2 px-4 text-left hover:bg-gray-50 rounded-t-md  cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-gray-900 font-medium text-sm">Tải lên dữ liệu (Excel)</span>
                      <input
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log(file);
                            uploadProductByExcel(file);
                          }
                        }}
                        hidden
                        type="file"
                        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      />
                    </button>
                    <button
                      disabled={loading}
                      onClick={exampleProductExcel}
                      className={`bg-white  text-nowrap  hover:bg-gray-50   py-2 px-4 text-left rounded-b-md cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-gray-900 font-medium text-sm">Tải file mẫu (Excel)</span>
                    </button>
                  </div>
                )} */}
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  <span className="text-gray-900 font-medium text-sm"> Xuất dữ liệu</span>
                </button>
              </>
            }
          />
        </div>
        {active === "card" ? (
          <>
            {/*CARD*/}
            <div className="grid grid-cols-3 mt-8 gap-6">
              {customerInfor.map((customer) => (
                <>
                  <div className="  border border-gray-200/20 shadow rounded-lg">
                    <div className="flex items-center justify-between bg-gray-200/30 px-5 py-5 rounded-lg">
                      <div className="flex items-center justify-center gap-2 ">
                        <Image
                          alt="avt"
                          width={1000}
                          height={1000}
                          src={
                            "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671159.jpg?semt=ais_hybrid&w=740&q=80"
                          }
                          className="rounded-full w-14 h-14"
                        />
                        <div className="">
                          <p className="text-md font-semibold text-gray-700">{customer.name}</p>
                          <p className="text-sm text-gray-400">{customer.id}</p>
                        </div>
                      </div>
                      <EllipsisVertical className="text-gray-400" />
                    </div>
                    <div className="flex flex-col mb-3 gap-3 px-5 py-1.5 mt-2.5">
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-gray-400" />
                        <span className="text-pos-blue-400">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-gray-400" />
                        <span className="text-pos-blue-400">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPinned size={20} className="text-gray-400" />
                        <span className="text-gray-600">{customer.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tag size={20} className="text-gray-400" />
                        <div className="bg-green-500/10 rounded-full text-center px-3 py-0.5 text-green-500">
                          Dang hoat dong
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </>
        ) : (
          <>
            {/*Table*/}
            <Table
              className="mt-5"
              tableHeaders={tableHeaders}
              data={customerInfor}
              renderRow={(customer) => {
                return (
                  <>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.phone}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.address}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.city}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.zip}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.country}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{formatDate(customer.createdAt)}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{formatDate(customer.updatedAt)}</td>
                    <td>
                      <div className="flex items-center gap-5 pl-4">
                        <button
                          title="Sửa sản phẩm"
                          onClick={() => {
                            //   setOpenEditModal(true);
                            //   getProductById(product.id);
                          }}
                          className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          title="Xóa sản phẩm"
                          onClick={() => {
                            //   setDeleteModal(true);
                            //   getProductById(product.id);
                          }}
                          className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-red-50 text-red-500 rounded-md hover:opacity-100 hover:bg-red-500 hover:text-white opacity-70 transition-opacity duration-200 ml-auto"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                );
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
