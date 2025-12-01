'use client';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { Customer } from '@repo/design-system/types';

import { DisplayField } from '../components/display-field';
import { DataActionBar } from '../components/data-action-bar';
import { ActionButtons } from '../components/action-buttons';
import { useSupplier } from '../../../../../main/src/hooks/suplier/use-supplier';
import { SUPPLIER_STATUS, SUPPLIER_STATUS_MAP } from '../../../../../main/src/constants/status';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';
import { FormCreateSupplier } from '../components';
import { truncateText } from '../../../../../main/src/utils';
import { Tooltip } from '@mantine/core';

const tableHeaders = [
  'Mã nhà cung cấp',
  'Tên nhà cung cấp',
  'Số Điện Thoại',
  'Email',
  'Địa Chỉ',
  'Mã số thuế',
  'Trạng thái',
  'Thao Tác',
];
export const supplierStatusOptions = Object.entries(SUPPLIER_STATUS).map(([key, item]) => ({
  label: item.label,
  value: item.value,
  color: item.color,
  key, // optional
}));

export function ManageSuppliersView() {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();

  const {
    suppliers,
    paginationParams,
    filters,
    pagination,
    currentStore,
    loading,
    setPaginationParams,
    setFilters,
    setPagination,
    buildParams,
    setSortBy,
    setSort,
    getSuppliers,
  } = useSupplier();

  useEffect(() => {
    if (!currentStore?.id) return;
    getSuppliers();
  }, [currentStore?.id, paginationParams, filters]);

  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Quản lý nhà cung cấp">
          <Button
            onClick={() => {
              setOpenAddModal(true);
            }}
            icon={<Plus size={16} />}
            title="Thêm nhà cung cấp"
            size="sm"
            radius="sm"
          />
        </DisplayField>
        <DataActionBar
          dataComplete={[...new Set(suppliers?.map((p) => p.name) || [])]}
          placeholderSearch="Tìm kiếm tên, email, mã của nhà cung cấp"
          statusOptions={[
            {
              width: '280px',
              key: 'status',
              label: 'Trạng thái nhà cung cấp',
              options: supplierStatusOptions,
            },
          ]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
              status: newFilters.status,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
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
          data={suppliers}
          isLoading={loading}
          renderRow={(supplier) => {
            return (
              <>
                <td className="px-4 py-3 text-sm font-semibold text-pos-blue-600">
                  {supplier.code}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">{supplier.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.phone || (
                    <span className="text-sm text-gray-500 italic">Không có dữ liệu</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.email || (
                    <span className=" text-gray-500 italic">Không có dữ liệu</span>
                  )}
                </td>
                <Tooltip
                  label={supplier.address}
                  position="top"
                  withArrow
                  color="rgba(125, 124, 124, 1)"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {(supplier && supplier?.address && truncateText(supplier?.address, 54)) || (
                      <span className=" text-gray-500 italic">Không có dữ liệu</span>
                    )}
                  </td>
                </Tooltip>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.tax_code || (
                    <span className=" text-gray-500 italic ">Không có dữ liệu</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span
                    className={`${SUPPLIER_STATUS_MAP[supplier.status].color} ${SUPPLIER_STATUS_MAP[supplier.status].bgColor} py-2 px-3 rounded-md`}
                  >
                    {SUPPLIER_STATUS_MAP[supplier.status].label}
                  </span>
                </td>

                <td>
                  <ActionButtons
                    onView={() => {}}
                    onEdit={() => {
                      setEditModal(true);
                      setSelectedCustomer(supplier);
                    }}
                    onDelete={() => {
                      setSelectedCustomer(supplier);
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
        title="Thêm nhà cung cấp"
        size="xl"
        opened={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
        }}
      >
        <FormCreateSupplier
          isOpenModal={openAddModal}
          setIsOpenModal={setOpenAddModal}
          onFetchNewData={getSuppliers}
        />
      </Modal>
      {/* modal eidt customer */}
      {/* <Modal
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
      </Modal> */}

      {/* <DeleteConfirmationModal
        itemName={selectedCustomer?.name}
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => {
          deleteCustomer(selectedCustomer?.id || '');
          setDeleteModal(false);
        }}
      /> */}
    </>
  );
}
