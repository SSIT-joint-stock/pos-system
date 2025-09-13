"use client";
import React from "react";
import FilterBar from "../components/filter-bar";
import { DatePickerInput, Input, Modal, Select, Table } from "@repo/design-system/components/ui";
import {
  BadgeAlert,
  Calendar1,
  Edit,
  Eye,
  Pencil,
  Plus,
  Trash,
  UserPen,
  UserPlus,
  UserRoundSearch,
} from "lucide-react";
import Image from "next/image";
import { Textarea } from "@mantine/core";
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
              <span className={`text-xs font-medium rounded-xl ${statusColors[product.status]}`}>{product.status}</span>
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
                  className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-gray-700 hover:text-white opacity-70 transition-opacity duration-200"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                  onClick={() => {
                    setOpenEditModal(true);
                    setOpenViewModal(false);
                    setSelectedProduct(product);
                  }}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-red-50 text-red-500 rounded-md hover:opacity-100 hover:bg-red-500 hover:text-white opacity-70 transition-opacity duration-200 ml-auto"
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
        )}
      />
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
          <div className="space-y-1">
            <label className="block text-sm font-medium">Full Name</label>
            <Input size="sm" placeholder="Ho va ten" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Email</label>
            <Input size="sm" placeholder="Email" type="email" />
          </div>
          <div className="flex flex-row gap-4 items-center justify-between">
            <div className="w-full space-y-1 ">
              <label className="block text-sm font-medium">Gioi Tinh</label>
              <Select placeholder="Gioi Tinh" size="sm" data={["Nam", "Nu"]} className="text-sm font-medium" />
            </div>
            <div className="w-full space-y-1">
              <label className="block text-sm font-medium">Trang Thai</label>
              <Select
                placeholder="Gioi Tinh"
                size="sm"
                data={["Dang lam viec", "Thu viec"]}
                className="text-sm font-medium"
              />
            </div>
          </div>
          <div className=" space-y-1.5">
            <label className="block text-sm font-medium">Ngay tham gia</label>
            <DatePickerInput
              size="sm"
              rightSection={<Calendar1 size={16} />}
              radius="md"
              placeholder="VD: 15/08/2025"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Dia Chi</label>
            <Input size="sm" placeholder="Dia chi" type="text" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Mobile Number</label>
            <Input size="sm" placeholder="So dien thoai" type="number" />
          </div>
          <div className="space-y-1">
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
              className="px-5 py-1 rounded-lg  text-red-600 hover:text-red-400"
            >
              Huy
            </button>
            <button type="submit" className="px-5 py-1 rounded-lg bg-pos-blue-400 text-white hover:opacity-90">
              Them Nhan Vien
            </button>
          </div>
        </form>
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
          <button
            onClick={() => {
              setDeleteModal(false);
            }}
            className="cursor-pointer"
          >
            Hủy
          </button>
        </div>
      </Modal>

      {/* View and Edit MODAL */}
      <Modal
        size="lg"
        opened={openEditModal || openViewModal}
        onClose={() => {
          setOpenEditModal(false);
          setOpenViewModal(false);
        }}
        title={
          openEditModal ? (
            <div className="flex items-center justify-center gap-3">
              <UserPen className="text-gray-500 " size={20} />
              <p className="text-gray-500 font-semibold">Chinh Sua Thong Tin Nhan Vien</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <UserRoundSearch className="text-gray-500" size={20} />
              <p className="text-gray-500 font-semibold">Xem Thong Tin Nhan Vien</p>
            </div>
          )
        }
      >
        <div className="space-y-2">
          <div className="flex flex-col gap-1.5">
            <div className="relative h-32 bg-[url('https://png.pngtree.com/background/20250108/original/pngtree-delicate-rainbow-background-pastel-texture-with-a-splash-of-color-picture-image_15231453.jpg')] bg-cover bg-center rounded-lg transition-all duration-300">
              <button className="absolute inset-0 flex items-center justify-center p-3 bg-black/40 rounded-md hover:bg-black/60 transition hover:opacity-100 opacity-0">
                <Pencil size={20} className="text-white" />
              </button>
              <div className="absolute -bottom-10 left-6 border-4 border-white rounded-full">
                <div className="relative">
                  <Image
                    src="https://i.pinimg.com/originals/6e/ea/71/6eea71cd65edef17878a46e75d2ee5f7.jpg"
                    alt="avatar"
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-md"
                  />
                  <button className="absolute inset-0 flex items-center hover:opacity-100 opacity-0  justify-center bg-black/40 rounded-full hover:bg-black/60 transition">
                    <Pencil size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-5">
              {openEditModal ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    setOpenEditModal(true);
                    setOpenViewModal(false);
                  }}
                  className="flex items-center text-nowrap gap-1 justify-center border border-gray-300 rounded-lg px-2 py-1 hover:bg-pos-blue-400 hover:text-white group"
                >
                  <Pencil size={15} className="font-medium text-gray-500 group-hover:text-white " />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-white">Chinh sua</span>
                </button>
              )}
            </div>
          </div>
          <div className={`flex flex-col gap-3 ${openEditModal ? "mt-9" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="px-2">
                <p className="text-lg font-semibold text-gray-800">{selectedProduct?.fullName}</p>
                <p className="text-xs text-gray-400">{selectedProduct?.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-7 px-4">
            {openEditModal ? (
              <h1 className="text-center font-bold text-gray-700 text-lg mb-6">Chỉnh Sửa Thông Tin Nhân Viên</h1>
            ) : (
              <h1 className="text-center font-bold text-gray-700 text-lg mb-6">Thông Tin Chi Tiết Nhân Viên</h1>
            )}

            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {/* Họ và tên */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Họ và tên</p>
                {openEditModal ? (
                  <Input size="xs" radius="md" className="mt-2" placeholder="VD: Nguyen Van A" />
                ) : (
                  <p className="text-sm font-medium text-gray-700">{selectedProduct?.fullName ?? "—"}</p>
                )}
              </div>

              {/* Giới tính */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Giới tính</p>
                {openEditModal ? (
                  <Select
                    size="xs"
                    radius="md"
                    data={["Nam", "Nu"]}
                    placeholder="Chon gioi tinh"
                    className="mt-1 text-sm font-medium"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-700">{selectedProduct?.gender ?? "—"}</p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Ngày sinh</p>
                {openEditModal ? (
                  <DatePickerInput
                    size="xs"
                    radius="md"
                    className="mt-2"
                    leftSection={<Calendar1 size={16} />}
                    placeholder="VD: 15/08/2025"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-700 ">{selectedProduct?.dateOfBirth ?? "—"}</p>
                )}
              </div>
              {/* Email */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                {openEditModal ? (
                  <Input type="email" size="xs" placeholder="VD: abc@gmail.com" className="mt-2" radius="md" />
                ) : (
                  <p className="text-sm font-medium text-gray-700">{selectedProduct?.email ?? "—"}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Số điện thoại</p>
                {openEditModal ? (
                  <Input size="xs" type="number" className="mt-2" placeholder="VD: 012345678" radius="md" />
                ) : (
                  <p className="text-sm font-medium text-gray-700">{selectedProduct?.phone ?? "—"}</p>
                )}
              </div>

              {/* Địa chỉ */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Địa chỉ</p>
                {openEditModal ? (
                  <Input size="xs" placeholder={"VD: Quang Ninh"} className="mt-2" radius="md" />
                ) : (
                  <p className="text-sm font-medium text-gray-700">{selectedProduct?.address ?? "—"}</p>
                )}
              </div>

              {/* Trang Thai*/}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Trạng thái</p>
                {openEditModal ? (
                  <Select
                    data={["Dang lam viec", "Nghi viec", "Thu viec"]}
                    size="xs"
                    placeholder="Chon trang thai"
                    className="mt-1 font-medium text-sm"
                    radius="md"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-700 ">{selectedProduct?.status ?? "—"}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Ngày tham gia</p>
                {openEditModal ? (
                  <DatePickerInput
                    size="xs"
                    leftSection={<Calendar1 size={16} />}
                    placeholder="VD: 15/08/2025"
                    className="mt-2"
                    radius="md"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-700 ">{selectedProduct?.hireDate ?? "—"}</p>
                )}
              </div>
            </div>
            <div className="mt-10 p-4 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Ghi chú</p>
              {openEditModal ? (
                <Textarea
                  autosize
                  minRows={3}
                  maxRows={5}
                  placeholder="Them ghi chu..."
                  className="text-xs font-normal text-gray-800 placeholder:italic placeholder:text-xs"
                />
              ) : (
                <p className="text-sm text-gray-700">{selectedProduct?.note ?? "Không có ghi chú thêm."}</p>
              )}
            </div>
            {openEditModal ? (
              <div className="mt-10">
                <div className="flex items-center justify-end gap-4 border-t border-t-gray-300 pt-6">
                  <button
                    onClick={() => {
                      setOpenEditModal(false);
                    }}
                    className="text-red-500 hover:text-red-300 px-3.5 rounded-md py-1 transition-all duration-300 "
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      setOpenEditModal(false);
                    }}
                    className="px-3.5 py-1 bg-pos-blue-500 text-pos-blue-50 rounded-md hover:bg-pos-blue-400 transition-all duration-300"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-10 ">
                <div className="border-t border-t-gray-300 pt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Cập nhật lần cuối: 12/09/2025</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setOpenViewModal(false);
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
