'use client';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
import { DollarSign, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { Supplier } from '@repo/design-system/types';

import { DisplayField } from '../components/display-field';
import { DataActionBar } from '../components/data-action-bar';
import { ActionButtons } from '../components/action-buttons';
import { useSupplier } from '../../../../../main/src/hooks/suplier/use-supplier';
import { SUPPLIER_STATUS, SUPPLIER_STATUS_MAP } from '../../../../../main/src/constants/status';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';
import { FormCreateSupplier } from '../components';
import { truncateText } from '../../../../../main/src/utils';
import { Tabs, Tooltip } from '@mantine/core';
import { ItemBoxChart } from '@repo/design-system/components/shared/item';

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
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [isEditForm, setIsEditForm] = useState<boolean>(false);

  const {
    suppliers,
    paginationParams,
    filters,
    pagination,
    currentStore,
    loading,
    deleteSupplier,
    setPaginationParams,
    setFilters,
    getSuppliers,
  } = useSupplier();

  useEffect(() => {
    if (!currentStore?.id) return;
    getSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id, paginationParams, filters]);

  return (
    <>
      <DashboardViewLayout>
        <DisplayField label="Quản lý nhà cung cấp">
          <Button
            onClick={() => {
              setOpenAddModal(true);
              setIsEditForm(false);
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

                <td className="px-4 py-3 text-sm text-gray-700">
                  <Tooltip label={supplier.name} position="top" withArrow>
                    {supplier && supplier?.name && truncateText(supplier?.name, 54)}
                  </Tooltip>
                </td>
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
                  label={supplier.address || 'Không có dữ liệu'}
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
                    className={`${SUPPLIER_STATUS_MAP[supplier.status].color} ${SUPPLIER_STATUS_MAP[supplier.status].bgColor} py-2 px-3 rounded-md text-nowrap`}
                  >
                    {SUPPLIER_STATUS_MAP[supplier.status].label}
                  </span>
                </td>

                <td>
                  <ActionButtons
                    onView={() => {
                      setOpenViewModal(true);
                      setSelectedSupplier(supplier);
                      setIsEditForm(true);
                    }}
                    onEdit={() => {
                      setSelectedSupplier(supplier);
                    }}
                    onDelete={() => {
                      setSelectedSupplier(supplier);
                      setDeleteModal(true);
                    }}
                  />
                </td>
              </>
            );
          }}
        />
      </DashboardViewLayout>
      {/* modal add supplier */}
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

      {/* modal view supplier */}
      <Modal
        title={
          <p className="text-lg font-medium text-gray-900 ">
            Chi tiết nhà cung cấp - {selectedSupplier?.name}
          </p>
        }
        size="xl"
        opened={openViewModal}
        onClose={() => setOpenViewModal(false)}
      >
        <Tabs variant="pills" radius="sm" defaultValue="info" className="mt-2.5 ">
          <Tabs.List>
            <Tabs.Tab value="info">Thông tin nhà cung cấp</Tabs.Tab>
            <Tabs.Tab value="order">Đơn xuất/nhật kho hàng</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info">
            <div className="space-y-3 mt-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-pos-blue-500 text-xl font-semibold">Thông tin nhà cung cấp</h2>
                <div className="flex items-center gap-3 mt-3">
                  <ItemBoxChart
                    className="flex-1"
                    title={'Tổng đơn hàng xuất/nhập'}
                    value={0}
                    bgIcon="bg-pos-blue-50"
                    colorIcon="text-pos-blue-500"
                    icon={<ShoppingBag size={18} />}
                  />
                  <ItemBoxChart
                    className="flex-1"
                    title={'Tổng tiền'}
                    bgIcon="bg-green-50"
                    colorIcon="text-green-500"
                    icon={<DollarSign size={18} />}
                    value={0}
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-pos-blue-500 text-xl font-semibold">Sửa thông tin</h2>
                <FormCreateSupplier
                  setIsEditForm={setIsEditForm}
                  setOpenViewModal={setOpenViewModal}
                  onFetchNewData={getSuppliers}
                  isEditForm={isEditForm}
                  selectedSupplier={selectedSupplier}
                />
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="order">Messages tab content</Tabs.Panel>
        </Tabs>
      </Modal>

      <DeleteConfirmationModal
        itemName={selectedSupplier?.name}
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => {
          deleteSupplier(selectedSupplier?.id || '');
          setDeleteModal(false);
        }}
      />
    </>
  );
}
