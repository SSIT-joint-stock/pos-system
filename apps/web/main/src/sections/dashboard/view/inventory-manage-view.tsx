'use client';
import React, { useState } from 'react';
import { Button, Modal, Select, Table } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import { Download, Eye, Package, TrendingDown, RotateCcw, HandCoins } from 'lucide-react';
import { NumberInput } from '@mantine/core';
import useInventory from '../../../../../main/src/hooks/inventory/use-inventory';
import { Inventory } from '@repo/design-system/types/inventory';
import { formatCurrency, formatDate } from '../../../../../main/src/utils/';

const tableHeaders = [
  'Sản Phẩm',
  'Số Lượng',
  'Giảm Giá',
  'Tổng Giá Trị',
  'Trạng Thái',
  'Ngày Tạo',
  'Thao Tác',
];

const statusColors = {
  ACTIVE: 'text-green-600 bg-green-50',
  INACTIVE: 'text-gray-600 bg-gray-50',
  SOLD: 'text-blue-600 bg-blue-50',
};

export function InventoryManageView() {
  const {
    inventories,
    loading,

    revalueInventory,
    setStatus,
    pagination,
    setPaginationParams,
    paginationParams,
    setFilters,
  } = useInventory();

  const [openViewModal, setOpenViewModal] = useState(false);
  const [openRevalueModal, setOpenRevalueModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory>();

  // Form states
  const [revalueData, setRevalueData] = useState({ discount: 0, total: 0 });
  const [statusData, setStatusData] = useState({ status: 'ACTIVE' });

  const handleRevalue = async () => {
    revalueInventory(selectedInventory?.id ?? '', revalueData.discount, revalueData.total);
    setOpenRevalueModal(false);
  };

  const handleSetStatus = async () => {
    setStatus(selectedInventory?.id ?? '', statusData.status);
    setOpenStatusModal(false);
  };
  return (
    <>
      {/* VIEW MODAL */}
      <Modal
        opened={openViewModal}
        onClose={() => setOpenViewModal(false)}
        size="lg"
        title={
          <div className="flex items-center gap-2 font-medium text-gray-600">
            <Package size={20} />
            <p>Xem thông tin tồn kho</p>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-700">ID</p>
              <p className="text-gray-600">{selectedInventory?.id}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Sản phẩm</p>
              <p className="text-gray-600">{selectedInventory?.product?.name}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Số lượng</p>
              <p className="text-gray-600">{selectedInventory?.quantity}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Giảm giá (%)</p>
              <p className="text-gray-600">{selectedInventory?.discount}%</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Tổng giá trị</p>
              <p className="text-gray-600">
                {Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(Number(selectedInventory?.total))}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Trạng thái</p>
              {selectedInventory && selectedInventory.status && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[selectedInventory?.status]}`}
                >
                  {selectedInventory?.status}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700">Ngày tạo</p>
            {selectedInventory && selectedInventory.createdAt && (
              <p className="text-gray-600">
                {new Date(selectedInventory?.createdAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="border-t border-gray-300 pt-4">
            {selectedInventory && selectedInventory.updatedAt && (
              <p className="text-sm text-gray-500">
                Lần cuối cập nhật: {new Date(selectedInventory?.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* REVALUE MODAL */}
      <Modal
        opened={openRevalueModal}
        size="md"
        onClose={() => setOpenRevalueModal(false)}
        title={
          <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
            <TrendingDown size={20} />
            <p>Điều chỉnh giá trị</p>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Sản phẩm: <strong>{selectedInventory?.product?.name}</strong>
            </p>
          </div>

          <NumberInput
            label="Giảm giá (%)"
            placeholder="Nhập phần trăm giảm giá"
            value={revalueData.discount}
            onChange={(value) =>
              setRevalueData((prev) => ({ ...prev, discount: Number(value ?? 0) }))
            }
            min={0}
            max={100}
          />

          <NumberInput
            label="Tổng giá trị"
            placeholder="Nhập tổng giá trị mới"
            value={revalueData.total}
            onChange={(value) => setRevalueData((prev) => ({ ...prev, total: Number(value ?? 0) }))}
            min={0}
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOpenRevalueModal(false)}
              className="text-red-500 hover:underline"
            >
              Hủy
            </button>
            <Button onClick={handleRevalue} title="Cập nhật" size="sm" radius="md" />
          </div>
        </div>
      </Modal>

      {/* SET STATUS MODAL */}
      <Modal
        opened={openStatusModal}
        size="md"
        onClose={() => setOpenStatusModal(false)}
        title={
          <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
            <RotateCcw size={20} />
            <p>Đổi trạng thái</p>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Sản phẩm: <strong>{selectedInventory?.product?.name}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Trạng thái hiện tại: <strong>{selectedInventory?.status}</strong>
            </p>
          </div>

          <Select
            label="Trạng thái mới"
            placeholder="Chọn trạng thái"
            value={statusData.status}
            onChange={(value) => setStatusData({ status: value ?? 'ACTIVE' })}
            data={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE' },
              { value: 'SOLD', label: 'SOLD' },
            ]}
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOpenStatusModal(false)}
              className="text-red-500 hover:underline"
            >
              Hủy
            </button>
            <Button onClick={handleSetStatus} title="Cập nhật" size="sm" radius="md" />
          </div>
        </div>
      </Modal>

      <div className="flex flex-col h-full">
        {/* ACTION BAR */}
        <FilterBar
          statusOptions={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'INACTIVE', label: 'INACTIVE' },
            { value: 'SOLD', label: 'SOLD' },
          ]}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, productName: value }));
          }}
          actions={
            <>
              <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Download size={16} />
                <span className="text-gray-900 font-medium text-xs">Xuất dữ liệu</span>
              </button>
            </>
          }
        />

        {/* TABLE */}
        <Table
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageChange={(page) => setPaginationParams((prev) => ({ ...prev, page }))}
          onPageSizeChange={(size) => setPaginationParams((prev) => ({ ...prev, limit: size }))}
          totalPages={pagination?.totalPages}
          tableHeaders={tableHeaders}
          data={inventories}
          isLoading={loading}
          renderRow={(inventory, idx) => (
            <tr
              key={inventory?.id || idx}
              className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300"
            >
              <td className="px-4 py-2">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-900">
                    {inventory.product.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    Giá:{' '}
                    {Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(Number(inventory.product.price))}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2 text-xs text-gray-900 font-medium">{inventory.quantity}</td>
              <td className="px-4 py-2 text-xs text-gray-500">{inventory.discount}%</td>
              <td className="px-4 py-2 text-xs text-gray-900 font-medium">
                {formatCurrency(inventory.total)}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[inventory.status]}`}
                >
                  {inventory.status}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-900 font-medium">
                {formatDate(inventory.createdAt)}
              </td>
              <td>
                <div className="flex items-center gap-2 pl-4">
                  <button
                    onClick={() => {
                      setOpenViewModal(true);
                      setSelectedInventory(inventory);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[32px] h-[32px] bg-gray-50 text-gray-500 rounded-md hover:bg-gray-700 hover:text-white transition-all duration-200"
                    title="Xem chi tiết"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setOpenRevalueModal(true);
                      setSelectedInventory(inventory);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[32px] h-[32px] bg-blue-50 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-200"
                    title="Điều chỉnh giá trị"
                  >
                    <HandCoins size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setOpenStatusModal(true);
                      setSelectedInventory(inventory);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[32px] h-[32px] bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-500 hover:text-white transition-all duration-200"
                    title="Đổi trạng thái"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </>
  );
}
