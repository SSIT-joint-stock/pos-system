"use client";
import React from "react";
import FilterBar from "../components/filter-bar";
import { Input, Modal, Select, Table } from "@repo/design-system/components/ui";
import { Edit, Eye, Plus, Trash, UserPlus } from "lucide-react";
import Image from "next/image";
const employees = [
  {
    id: "E001",
    fullName: "Nguyễn Văn A",
    gender: "Nam",
    dateOfBirth: "1995-04-12",
    position: "Nhân viên Kinh doanh",
    salary: 12000000,
    hireDate: "2025-01-10",
    contractMonths: 8,
    status: "Đang làm việc",
    email: "nguyenvana@company.com",
    phone: "0901234567",
    address: "Hà Nội",
  },
  {
    id: "E002",
    fullName: "Trần Thị B",
    gender: "Nữ",
    dateOfBirth: "1998-07-25",
    position: "Nhân viên IT",
    salary: 15000000,
    hireDate: "2025-02-01",
    contractMonths: 8,
    status: "Đang làm việc",
    email: "tranthib@company.com",
    phone: "0912345678",
    address: "TP. Hồ Chí Minh",
  },
  {
    id: "E003",
    fullName: "Phạm Văn C",
    gender: "Nam",
    dateOfBirth: "1992-11-03",
    position: "Kế toán",
    salary: 10000000,
    hireDate: "2025-03-15",
    contractMonths: 8,
    status: "Thử việc",
    email: "phamvanc@company.com",
    phone: "0934567890",
    address: "Đà Nẵng",
  },
];
export default function EmployeesView() {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [openModalAdd, setOpenModalAdd] = React.useState(false);
  const tableHeaders = ["Mã NV", "Họ và Tên", "Địa chỉ", "Lương", "Trạng thái", "Ngay tham gia", "Hành động"];
  const statusColors: Record<string, string> = {
    "Đang làm việc": "bg-green-100 text-green-800 px-2 py-1",
    "Nghỉ việc": "bg-red-100 text-red-800 px-2 py-1",
    "Thử việc": "bg-yellow-100 text-yellow-800 px-2 py-1",
    "Đang nghỉ phép": "bg-blue-100 text-blue-800 px-2 py-1",
    "Đang tạm nghỉ": "bg-purple-100 text-purple-800 px-2 py-1",
  };
  return (
    <>
      {openModalAdd && (
        <Modal
          opened={openModalAdd}
          onClose={() => setOpenModalAdd(false)}
          size="lg"
          title={
            <div className="flex items-center gap-2 text-lg font-medium">
              <UserPlus size={20} />
              <p>Them Nhan Vien Moi</p>
            </div>
          }
        >
          <div className="relative">
            {/* Background upload */}
            <div className="h-32 bg-gray-300 rounded-lg flex items-center justify-center relative">
              <button className="p-3 bg-black/40 rounded-full hover:bg-black/60 transition">
                <Plus size={20} className="text-white" />
              </button>
            </div>
            <div className="absolute -bottom-10 left-6 border-4 border-white rounded-full">
              <div className="relative">
                <Image
                  src="https://i.pinimg.com/originals/6e/ea/71/6eea71cd65edef17878a46e75d2ee5f7.jpg"
                  alt="avatar"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-white shadow-md"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full hover:bg-black/60 transition">
                  <Plus size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="mt-14 space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <Input size="sm" placeholder="Ho va ten" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input size="sm" placeholder="Email" type="email" />
            </div>
            <div className="flex flex-row gap-4 items-center justify-between">
              <div className="w-full">
                <label className="block text-sm font-medium">Gioi Tinh</label>
                <Select placeholder="Gioi Tinh" size="sm" data={["Nam", "Nu"]} className="text-sm font-medium"></Select>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium">Trang Thai</label>
                <Select
                  placeholder="Trang Thai"
                  size="sm"
                  data={["Dang lam viec", "Thu viec"]}
                  className="text-sm font-medium"
                ></Select>
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center justify-between">
              <div className="w-full">
                <label className="block text-sm font-medium">Ngay tham gia</label>
                <Select placeholder="Gioi Tinh" size="sm" data={["Nam", "Nu"]} className="text-sm font-medium"></Select>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium">Vi Tri</label>
                <Select
                  placeholder="Vi tri"
                  size="sm"
                  data={["Ke toan", "Nhan vien", "Quan Ly", "Nhan Vien Ky Thuat"]}
                  className="text-sm font-medium"
                ></Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Dia Chi</label>
              <Input size="sm" placeholder="Dia chi" type="text" />
            </div>
            <div>
              <label className="block text-sm font-medium">Mobile Number</label>
              <Input size="sm" placeholder="So dien thoai" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                placeholder="Description"
                className="w-full border-gray-300 border rounded-lg px-3 py-2 outline-0"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setOpenModalAdd(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:opacity-90"
              >
                Add
              </button>
            </div>
          </form>
        </Modal>
      )}

      <FilterBar
        actions={
          <>
            <button
              onClick={() => setOpenModalAdd(true)}
              className="bg-pos-blue-400 border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <Plus size={16} className="text-white" />
              <span className="text-white font-medium text-xs"> Them nhan vien</span>
            </button>
          </>
        }
      />
      {/* TABLE AND PAGINATION */}
      <Table
        totalPages={10}
        tableHeaders={tableHeaders}
        data={employees}
        renderRow={(product, idx) => (
          <>
            <tr key={idx} className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300">
              <td className="px-4 py-2 text-xs font-medium text-gray-900">{product.id}</td>
              <td className="px-4 py-2 text-xs text-gray-500 font-medium">{product.fullName}</td>
              <td className="px-4 py-2 text-xs text-gray-500">{product.address}</td>
              <td className="px-4 py-2 text-xs text-gray-500">
                {Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(product.salary))}
              </td>
              <td className="px-4 py-2">
                <span className={`text-xs font-medium rounded-xl ${statusColors[product.status]}`}>
                  {product.status}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">{product.hireDate}</td>
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
    </>
  );
}
