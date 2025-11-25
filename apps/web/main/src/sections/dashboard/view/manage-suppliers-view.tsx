'use client';
import { BadgeAlert, Download, Edit, Plus, Trash, Upload } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { formatDate } from '@repo/utils';
import FormCreateCustomer from '../components/form-create-customer';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { useCustomer } from '../../../../../main/src/hooks/customers/use-customer';
import { Customer } from '@repo/design-system/types';
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

export function ManageSuppliersView() {
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
      {/* modal add supplier */}
      <Modal
        title="Thêm nhà cung cấp mới"
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
      {/* modal edit supplier */}
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
          <h2 className="text-2xl font-bold text-pos-blue-500">Quản lý nhà cung cấp</h2>
          <div className="flex items-center gap-3">
            <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <Upload size={16} />
              <span className="text-gray-900 font-medium text-sm"> Tải lên dữ liệu</span>
            </button>
            <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <Download size={16} />
              <span className="text-gray-900 font-medium text-sm"> Xuất dữ liệu</span>
            </button>
            <button
              onClick={() => {
                setOpenAddModal(true);
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-pos-blue-500 cursor-pointer hover:bg-pos-blue-600 transition-all duration-300"
            >
              <Plus className="text-white" size={18} />
              <span className="text-white font-semibold text-sm">Thêm nhà cung cấp</span>
            </button>
          </div>
        </div>

        <div>
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
        </div>
      </div>
    </>
  );
}
