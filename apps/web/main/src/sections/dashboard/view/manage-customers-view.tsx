'use client';
import {
  BadgeAlert,
  Download,
  Edit,
  EllipsisVertical,
  IdCard,
  Mail,
  MapPinned,
  Pen,
  Phone,
  Plus,
  Table2,
  Tag,
  Trash,
  Upload,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button, Modal, Pagination, Table } from '@repo/design-system/components/ui';
import { formatDate } from '@repo/utils';
import FormCreateCustomer from '../components/form-create-customer';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { useCustomer } from '../../../../../main/src/hooks/customers/use-customer';
import { Customer } from '@repo/design-system/types';
import FilterBar from '../components/filter-bar';
import { useClickOutside } from '@repo/design-system/hooks/client';

const tableHeaders = [
  'Tên Khách Hàng',
  'Số Điện Thoại',
  'Email',
  'Địa Chỉ',
  'Thành Phố',
  'Mã Bưu Điện',
  'Ngày Tạo',
  'Thao Tác',
];

export function ManageCustomersView() {
  const openMenuRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('table');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [isOpenOptionCard, setIsOpenOptionCard] = useState(false);

  const currentStore = useAtomValue(currentStoreAtom);
  const {
    getCustomers,
    deleteCustomer,
    createCustomer,
    updateCustomer,
    setPaginationParams,
    setFilters,
    customers,
    createCustomerForm,
    updateCustomerForm,
    pagination,
    paginationParams,
    filters,
    loading,
  } = useCustomer();
  const setMenu = (customerId: string) => {
    setSelectedCustomer(customers.find((customer) => customer.id === customerId));
    setIsOpenOptionCard(true);
  };
  useClickOutside(openMenuRef, () => {
    setIsOpenOptionCard(false);
  });
  useEffect(() => {
    if (!currentStore?.id) return;
    getCustomers();
  }, [currentStore?.id, paginationParams, filters]);

  return (
    <>
      {/* modal add customer */}
      <Modal
        title="Thêm khách hàng mới "
        size="xl"
        opened={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
        }}
      >
        <FormCreateCustomer
          setOpenAddModal={setOpenAddModal}
          createCustomer={createCustomer}
          createCustomerForm={createCustomerForm}
          onSuccess={() => {
            getCustomers();
          }}
        />
      </Modal>
      {/* modal eidt customer */}
      <Modal
        title="Sửa thông tin khách hàng"
        size="xl"
        opened={editModal}
        onClose={() => {
          setEditModal(false);
        }}
      >
        <FormCreateCustomer
          isEditForm
          selectedCustomer={selectedCustomer}
          updateCustomer={updateCustomer}
          updateCustomerForm={updateCustomerForm}
          setOpenEditModal={setEditModal}
          onSuccess={() => {
            getCustomers();
          }}
        />
      </Modal>
      <Modal opened={deleteModal} size="lg" onClose={() => setDeleteModal(false)}>
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
          <div className="flex flex-col gap-2 w-full">
            <Button
              style={{ width: '100%' }}
              color="red"
              size={'md'}
              onClick={() => {
                deleteCustomer(selectedCustomer?.id || '');
                setDeleteModal(false);
              }}
              className="bg-red-600 rounded-lg text-white cursor-pointer font-bold "
              title="Xác nhận xóa"
            />

            <button
              onClick={() => {
                setDeleteModal(false);
              }}
              className="cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
      <div className="space-y-6 bg-white rounded-lg px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-pos-blue-500">Quản Lý Khách Hàng</h2>
          <button
            onClick={() => {
              setOpenAddModal(true);
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-pos-blue-500 cursor-pointer hover:bg-pos-blue-600 transition-all duration-300"
          >
            <Plus className="text-white" size={18} />
            <span className="text-white font-semibold text-sm">Thêm khách hàng</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-700">Hiển thị theo: </span>
            <div className="flex items-center gap-5">
              {/* Bang */}
              <div
                onClick={() => {
                  setActive('table');
                }}
                className={`flex items-center py-1.5 justify-center gap-2 cursor-pointer
  bg-left-bottom bg-no-repeat bg-gradient-to-r from-blue-500 to-blue-500
  transition-all duration-300 ease-out
  ${
    active === 'table'
      ? 'bg-[length:100%_3px]' // Khi active → giữ full gạch chân
      : 'bg-[length:0%_2px] hover:bg-[length:100%_3px]'
  } // Hover mới trượt
`}
              >
                <Table2 size={20} className="text-gray-700" />
                <span className="text-lg font-semibold text-gray-700">Bảng</span>
              </div>

              {/* The */}
              <div
                onClick={() => {
                  setActive('card');
                }}
                className={`flex items-center py-1.5 justify-center gap-2 cursor-pointer
  bg-left-bottom bg-no-repeat bg-gradient-to-r from-blue-500 to-blue-500
  transition-all duration-300 ease-out
  ${
    active === 'card'
      ? 'bg-[length:100%_3px]' // Khi active → giữ full gạch chân
      : 'bg-[length:0%_2px] hover:bg-[length:100%_3px]'
  } // Hover mới trượt
`}
              >
                <IdCard size={28} className="text-gray-700" />
                <span className="text-lg font-semibold text-gray-700">Thẻ</span>
              </div>
            </div>
          </div>
          {/* ACTION */}
          <FilterBar
            placeholderInputSearch="Tìm kiếm khách hàng"
            hasBg={false}
            setWidth="100%"
            hasDatePicker={false}
            onSearch={(value) => {
              setFilters((prev) => ({ ...prev, q: value }));
            }}
            actions={
              <>
                <div className="relative ml-2">
                  <button
                    className={`bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Upload size={16} />
                    <span className="text-gray-900 font-medium text-sm">Tải lên dữ liệu</span>
                  </button>
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
        {active === 'card' ? (
          <>
            {/*CARD*/}
            <div className="grid grid-cols-3 mt-8 gap-6">
              {customers.map((customer) => (
                <>
                  <div className="  border border-gray-200/20 shadow rounded-lg">
                    <div className="flex items-center justify-between bg-gray-200/30 px-5 py-5 rounded-lg">
                      <div className="flex items-center justify-center gap-2 ">
                        <Image
                          alt="avt"
                          width={1000}
                          height={1000}
                          src={
                            'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671159.jpg?semt=ais_hybrid&w=740&q=80'
                          }
                          className="rounded-full w-14 h-14"
                        />
                        <div className="">
                          <p className="text-sm font-semibold text-gray-700">{customer.name}</p>
                          <p className="text-sm text-gray-400">{customer.id}</p>
                        </div>
                      </div>
                      <div ref={openMenuRef} className="relative">
                        <button
                          onClick={() => setMenu(customer?.id)}
                          className="cursor-pointer hover:bg-gray-200 transition-colors duration-300 rounded-full p-2"
                        >
                          <EllipsisVertical size={20} className="text-gray-400" />
                        </button>
                        <div
                          className={`${isOpenOptionCard && selectedCustomer?.id === customer.id ? 'opacity-100 visible' : 'opacity-0 invisible'} absolute top-full mt-2 right-0 w-28  h-fit z-10 bg-white rounded-md py-2 px-1 shadow-lg text-sm font-medium transition-all duration-200 ease-in-out `}
                        >
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setEditModal(true);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 w-full duration-300 transition-colors cursor-pointer"
                          >
                            <Pen size={14} />
                            <span className="text-gray-600">Sửa</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setDeleteModal(true);
                            }}
                            className="flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 w-full duration-300 transition-colors cursor-pointer"
                          >
                            <Trash size={14} />
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mb-3 gap-3 px-5 py-1.5 mt-2.5">
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-gray-400" />
                        <span className="text-pos-blue-500">
                          {customer.email || (
                            <span className="text-gray-500 italic text-sm">Chưa có email</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-gray-400" />
                        <span className="text-pos-blue-500">
                          {customer.phone || (
                            <span className="text-gray-500 italic text-sm">Chưa có sdt</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPinned size={20} className="text-gray-400" />
                        <span className="text-gray-600">
                          {customer.address || (
                            <span className="text-gray-500 italic text-sm">Chưa có địa chỉ</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tag size={20} className="text-gray-400" />
                        <div className="bg-green-500/10 rounded-full text-sm text-center px-3 py-0.5 text-green-500">
                          Đang hoạt đông
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
            {/*PAGINATION*/}
            <div className="flex items-center justify-center w-full h-full">
              <Pagination
                total={Number(pagination?.totalPages)}
                onChange={(page) => setPaginationParams((prev) => ({ ...prev, page }))}
              />
            </div>
          </>
        ) : (
          <>
            {/*Table*/}
            <Table
              // className="mt-5"
              total={pagination?.total}
              page={pagination?.page}
              totalPages={pagination?.totalPages}
              limit={pagination?.limit}
              pageSize={pagination?.limit ?? paginationParams.limit}
              onPageChange={(page) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  page,
                }))
              }
              onPageSizeChange={(size) =>
                setPaginationParams((prev) => ({
                  ...prev,
                  limit: size,
                }))
              }
              tableHeaders={tableHeaders}
              data={customers}
              isLoading={loading}
              renderRow={(customer) => {
                return (
                  <>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.name}</td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {customer.phone || (
                        <span className="text-xs text-gray-500 italic">Không có dữ liệu</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {customer.email || (
                        <span className=" text-gray-500 italic">Không có dữ liệu</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {customer.address || (
                        <span className=" text-gray-500 italic">Không có dữ liệu</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {customer.city || (
                        <span className=" text-gray-500 italic">Không có dữ liệu</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {customer.zip || (
                        <span className=" text-gray-500 italic">Không có dữ liệu</span>
                      )}
                    </td>
                    {/* <td className="px-4 py-2 text-sm text-gray-700">
                      {customer.country || (
                        <span className="text-sm text-gray-500 italic">Không có dữ liệu</span>
                      )}
                    </td> */}
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {formatDate(customer.createdAt)}
                    </td>

                    <td>
                      <div className="flex items-center gap-5 pl-4">
                        <button
                          title="Sửa thông tin khách hàng"
                          onClick={() => {
                            setEditModal(true);
                            setSelectedCustomer(customer);
                          }}
                          className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          title="Xóa khách hàng"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setDeleteModal(true);
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
