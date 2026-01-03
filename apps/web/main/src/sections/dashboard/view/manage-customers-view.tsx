'use client';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { Customer } from '@repo/design-system/types';
import { formatDate } from '@repo/utils';
import { useAtomValue } from 'jotai';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCustomer } from '../../../../../main/src/hooks/customers/use-customer';
import FormCreateCustomer from '../components/form-create-customer';

import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
import { ActionButtons } from '../components/action-buttons';
import { DataActionBar } from '../components/data-action-bar';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';
import { DisplayField } from '../components/display-field';

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
  const [openAddModal, setOpenAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();

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
    downloadCustomerTemplate,
    exportCustomersExcel,
    importCustomersExcel,
  } = useCustomer();

  useEffect(() => {
    if (!currentStore?.id) return;
    getCustomers();
  }, [currentStore?.id, paginationParams, filters]);

  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Quản lý khách hàng">
          <Button
            onClick={() => {
              setOpenAddModal(true);
            }}
            icon={<Plus size={16} />}
            title="Thêm khách hàng"
            size="sm"
            radius="sm"
          />
        </DisplayField>
        <DataActionBar
          placeholderSearch="Tìm kiếm tên khách hàng"
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              product_status: newFilters.status,
            }));
          }}
          onDownloadTemplate={() => {
            if (!currentStore) return;
            downloadCustomerTemplate(currentStore.id);
          }}
          onExport={() => {
            if (!currentStore) return;
            exportCustomersExcel(currentStore.id);
          }}
          onUpload={(file) => {
            if (!currentStore) return;
            importCustomersExcel(currentStore.id, file);
          }}
        />

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
                <td className="px-4 py-3 text-sm text-gray-700">{customer.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {customer.phone || (
                    <span className="text-sm text-gray-500 italic">Không có dữ liệu</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {customer.email || (
                    <span className=" text-gray-500 italic">Không có dữ liệu</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {customer.address || (
                    <span className=" text-gray-500 italic">Không có dữ liệu</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {customer.city || <span className=" text-gray-500 italic">Không có dữ liệu</span>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {customer.zip || <span className=" text-gray-500 italic">Không có dữ liệu</span>}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatDate(customer.createdAt)}
                </td>

                <td>
                  <ActionButtons
                    onEdit={() => {
                      setEditModal(true);
                      setSelectedCustomer(customer);
                    }}
                    onDelete={() => {
                      setSelectedCustomer(customer);
                      setDeleteModal(true);
                    }}
                  />
                </td>
              </>
            );
          }}
        />
      </DashboardViewLayout>
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

      <DeleteConfirmationModal
        itemName={selectedCustomer?.name}
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => {
          deleteCustomer(selectedCustomer?.id || '');
          setDeleteModal(false);
        }}
      />
    </>
  );
}
