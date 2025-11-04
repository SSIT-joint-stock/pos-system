'use client';
import React, { useState } from 'react';
import { Button, Modal, Select, Table } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import {
  Download,
  Eye,
  Package,
  TrendingDown,
  RotateCcw,
  HandCoins,
} from 'lucide-react';
import { NumberInput } from '@mantine/core';
import useInventory from '../../../../../main/src/hooks/inventory/use-inventory';
import { Inventory } from '@repo/design-system/types/inventory';
import { formatCurrency, formatDate } from '../../../../../main/src/utils/';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const tableHeaders = [
  'Sản Phẩm',
  'Số Lượng',
  'Giảm Giá',
  'Tổng Giá Trị',
  'Trạng Thái',
  'Ngày Tạo',
  'Thao Tác',
];

const statusColors: Record<string, string> = {
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
  const [revalueData, setRevalueData] = useState({ discount: 0, total: 0 });
  const [statusData, setStatusData] = useState({ status: 'ACTIVE' });

  // ✅ Excel export handler
  const handleExportExcel = () => {
    if (!inventories || inventories.length === 0) {
      alert('Không có dữ liệu để xuất.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      inventories.map((inv) => ({
        'Tên sản phẩm': inv.product?.name || '',
        'Số lượng': inv.quantity,
        'Giảm giá (%)': inv.discount,
        'Tổng giá trị': formatCurrency(inv.total),
        'Trạng thái': inv.status,
        'Ngày tạo': formatDate(inv.createdAt),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tồn kho');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'inventory_data.xlsx');
  };

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
                {formatCurrency(Number(selectedInventory?.total || 0))}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Trạng thái</p>
              {selectedInventory?.status && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[selectedInventory.status]}`}
                >
                  {selectedInventory.status}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700">Ngày tạo</p>
            {selectedInventory?.createdAt && (
              <p className="text-gray-600">
                {new Date(selectedInventory.createdAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="border-t border-gray-300 pt-4">
            {selectedInventory?.updatedAt && (
              <p className="text-sm text-gray-500">
                Lần cuối cập nhật: {new Date(selectedInventory.updatedAt).toLocaleString()}
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
          <p className="text-sm text-gray-600">
            Sản phẩm: <strong>{selectedInventory?.product?.name}</strong>
          </p>

          <NumberInput
            label="Giảm giá (%)"
            value={revalueData.discount}
            onChange={(v) => setRevalueData((p) => ({ ...p, discount: Number(v ?? 0) }))}
            min={0}
            max={100}
          />
          <NumberInput
            label="Tổng giá trị"
            value={revalueData.total}
            onChange={(v) => setRevalueData((p) => ({ ...p, total: Number(v ?? 0) }))}
            min={0}
          />
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button onClick={() => setOpenRevalueModal(false)} className="text-red-500 hover:underline">
              Hủy
            </button>
            <Button onClick={handleRevalue} title="Cập nhật" size="sm" radius="md" />
          </div>
        </div>
      </Modal>

      {/* STATUS MODAL */}
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
          <p className="text-sm text-gray-600">
            Sản phẩm: <strong>{selectedInventory?.product?.name}</strong>
          </p>
          <p className="text-sm text-gray-600">
            Trạng thái hiện tại: <strong>{selectedInventory?.status}</strong>
          </p>

          <Select
            label="Trạng thái mới"
            placeholder="Chọn trạng thái"
            value={statusData.status}
            onChange={(v) => setStatusData({ status: v ?? 'ACTIVE' })}
            data={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE' },
              { value: 'SOLD', label: 'SOLD' },
            ]}
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button onClick={() => setOpenStatusModal(false)} className="text-red-500 hover:underline">
              Hủy
            </button>
            <Button onClick={handleSetStatus} title="Cập nhật" size="sm" radius="md" />
          </div>
        </div>
      </Modal>

      {/* MAIN VIEW */}
      <div className="flex flex-col h-full">
        <FilterBar
          statusOptions={[
            { value: 'ACTIVE', label: 'ACTIVE' },
            { value: 'INACTIVE', label: 'INACTIVE' },
            { value: 'SOLD', label: 'SOLD' },
          ]}
          onFilterChange={(f) => setFilters(f)}
          onSearch={(v) => setFilters((p) => ({ ...p, productName: v }))}
          actions={
            <>
              <button
                onClick={handleExportExcel}
                className="bg-white border border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 hover:opacity-80 transition"
              >
                <Download size={16} />
                <span className="text-gray-900 font-medium text-xs">Xuất dữ liệu</span>
              </button>
            </>
          }
        />

        <Table
          total={pagination?.total}
          page={pagination?.page}
          limit={pagination?.limit}
          totalPages={pagination?.totalPages}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageChange={(page) => setPaginationParams((p) => ({ ...p, page }))}
          onPageSizeChange={(size) => setPaginationParams((p) => ({ ...p, limit: size }))}
          tableHeaders={tableHeaders}
          data={inventories}
          isLoading={loading}
          renderRow={(inv) => (
            <>
              <td className="px-4 py-2">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-900">{inv.product.name}</span>
                  <span className="text-xs text-gray-500">
                    Giá:{' '}
                    {Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(Number(inv.product.price))}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2 text-xs text-gray-900 font-medium">{inv.quantity}</td>
              <td className="px-4 py-2 text-xs text-gray-500">{inv.discount}%</td>
              <td className="px-4 py-2 text-xs text-gray-900 font-medium">
                {formatCurrency(inv.total)}
              </td>
              <td className="px-4 py-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[inv.status]}`}>
                  {inv.status}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-900 font-medium">{formatDate(inv.createdAt)}</td>
              <td>
                <div className="flex items-center gap-2 pl-4">
                  <button
                    onClick={() => {
                      setOpenViewModal(true);
                      setSelectedInventory(inv);
                    }}
                    className="flex justify-center items-center w-[32px] h-[32px] bg-gray-50 text-gray-500 rounded-md hover:bg-gray-700 hover:text-white transition"
                    title="Xem chi tiết"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setOpenRevalueModal(true);
                      setSelectedInventory(inv);
                    }}
                    className="flex justify-center items-center w-[32px] h-[32px] bg-blue-50 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
                    title="Điều chỉnh giá trị"
                  >
                    <HandCoins size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setOpenStatusModal(true);
                      setSelectedInventory(inv);
                    }}
                    className="flex justify-center items-center w-[32px] h-[32px] bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-500 hover:text-white transition"
                    title="Đổi trạng thái"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </div>
    </>
  );
}
