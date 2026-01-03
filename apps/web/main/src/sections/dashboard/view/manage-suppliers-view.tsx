"use client";
import { Button, Modal, Table } from "@repo/design-system/components/ui";
import { Supplier } from "@repo/design-system/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardViewLayout from "../../../../../main/src/layouts/dashboard-view-layout";

import { Tooltip } from "@mantine/core";
import {
  SUPPLIER_STATUS,
  SUPPLIER_STATUS_MAP,
} from "../../../../../main/src/constants/status";
import { useSupplier } from "../../../../../main/src/hooks/suplier/use-supplier";
import { truncateText } from "../../../../../main/src/utils";
import { FormCreateSupplier } from "../components";
import { ActionButtons } from "../components/action-buttons";
import { DataActionBar } from "../components/data-action-bar";
import { DeleteConfirmationModal } from "../components/delete-confirmation-modal";
import { DisplayField } from "../components/display-field";

const tableHeaders = [
  "Mã nhà cung cấp",
  "Tên nhà cung cấp",
  "Số Điện Thoại",
  "Email",
  "Địa Chỉ",
  "Mã số thuế",
  "Trạng thái",
  "Thao Tác",
];
export const supplierStatusOptions = Object.entries(SUPPLIER_STATUS).map(
  ([key, item]) => ({
    label: item.label,
    value: item.value,
    color: item.color,
    key, // optional
  })
);

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
    downloadSupplierTemplate,
    importSuppliersExcel,
    exportSuppliersExcel,
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
              width: "280px",
              key: "status",
              label: "Trạng thái nhà cung cấp",
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
          onDownloadTemplate={() => {
            downloadSupplierTemplate();
          }}
          onUpload={(file) => {
            if (!currentStore) return;
            importSuppliersExcel(currentStore.id, file);
          }}
          onExport={() => {
            if (!currentStore) return;
            exportSuppliersExcel(currentStore.id);
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

                <Tooltip label={supplier.name} position="top" withArrow>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {supplier?.name}
                  </td>
                </Tooltip>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.phone || (
                    <span className="text-sm text-gray-500 italic">
                      Không có dữ liệu
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.email || (
                    <span className=" text-gray-500 italic">
                      Không có dữ liệu
                    </span>
                  )}
                </td>
                <Tooltip
                  label={supplier.address || "Không có dữ liệu"}
                  position="top"
                  withArrow
                  color="rgba(125, 124, 124, 1)"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {(supplier &&
                      supplier?.address &&
                      truncateText(supplier?.address, 54)) || (
                      <span className=" text-gray-500 italic">
                        Không có dữ liệu
                      </span>
                    )}
                  </td>
                </Tooltip>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {supplier.tax_code || (
                    <span className=" text-gray-500 italic ">
                      Không có dữ liệu
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
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
        title={
          <p className="text-base  font-semibold text-gray-900 ">
            Thêm nhà cung cấp
          </p>
        }
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
          <p className="text-base  font-semibold text-gray-900 ">
            Chi tiết nhà cung cấp - {selectedSupplier?.name}
          </p>
        }
        size="xl"
        opened={openViewModal}
        onClose={() => setOpenViewModal(false)}
      >
        <FormCreateSupplier
          setIsEditForm={setIsEditForm}
          setOpenViewModal={setOpenViewModal}
          onFetchNewData={getSuppliers}
          isEditForm={isEditForm}
          selectedSupplier={selectedSupplier}
        />
      </Modal>

      <DeleteConfirmationModal
        itemName={selectedSupplier?.name}
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => {
          deleteSupplier(selectedSupplier?.id || "");
          setDeleteModal(false);
        }}
      />
    </>
  );
}
