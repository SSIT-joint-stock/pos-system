'use client';
import React, { useState } from 'react';
import { Button, Modal, Select, Table, Loading } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import {
  BadgeAlert,
  Download,
  Eye,
  Package,
  Trash,
  TrendingUp,
  TrendingDown,
  RotateCcw,
} from 'lucide-react';
import { NumberInput } from '@mantine/core';

const tableHeaders = ['Sản Phẩm', 'Số Lượng', 'Giảm Giá', 'Tổng Giá Trị', 'Trạng Thái', 'Thao Tác'];

const statusColors = {
  ACTIVE: 'text-green-600 bg-green-50',
  INACTIVE: 'text-gray-600 bg-gray-50',
  SOLD: 'text-blue-600 bg-blue-50',
};

const mockInventories = [
  {
    id: '83d23ff8-39e0-42ee-a552-0a53832a3774',
    product_id: 'a9ede775-748c-4be1-8180-a994829bb6eb',
    quantity: 20,
    discount: 15,
    total: 100,
    status: 'INACTIVE',
    createdAt: '2025-09-09T17:20:35.255Z',
    updatedAt: '2025-09-10T03:53:50.625Z',
    product: {
      name: 'iPhone 16 Pro Max',
      price: 300,
    },
  },
  {
    id: '12345678-1234-1234-1234-123456789012',
    product_id: 'abcdefgh-1234-5678-9012-abcdefghijkl',
    quantity: 50,
    discount: 20,
    total: 240,
    status: 'ACTIVE',
    createdAt: '2025-09-08T10:30:00.000Z',
    updatedAt: '2025-09-11T08:15:30.000Z',
    product: {
      name: 'Samsung Galaxy S24',
      price: 250,
    },
  },
];

export function InventoryManageView() {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAdjustModal, setOpenAdjustModal] = useState(false);
  const [openRevalueModal, setOpenRevalueModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventories, setInventories] = useState(mockInventories);
  const [loading, setLoading] = useState(false);

  // Form states
  const [adjustValue, setAdjustValue] = useState({ delta: 0 });
  const [revalueData, setRevalueData] = useState({ discount: 0, total: 0 });
  const [statusData, setStatusData] = useState({ status: 'ACTIVE' });

  const handleGetInventories = async () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setInventories(mockInventories);
      setLoading(false);
    }, 1000);
  };

  const handleAdjustQuantity = async () => {
    console.log('Adjust quantity:', adjustValue);

    setOpenAdjustModal(false);
  };

  const handleRevalue = async () => {
    console.log('Revalue:', revalueData);

    setOpenRevalueModal(false);
  };

  const handleSetStatus = async () => {
    console.log('Set status:', statusData);

    setOpenStatusModal(false);
  };

  const handleDelete = async () => {
    console.log('Delete inventory:', selectedInventory?.id);

    setDeleteModal(false);
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
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[selectedInventory?.status]}`}
              >
                {selectedInventory?.status}
              </span>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700">Ngày tạo</p>
            <p className="text-gray-600">
              {new Date(selectedInventory?.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <p className="text-sm text-gray-500">
              Lần cuối cập nhật: {new Date(selectedInventory?.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </Modal>

      {/* ADJUST QUANTITY MODAL */}
      <Modal
        opened={openAdjustModal}
        size="md"
        onClose={() => setOpenAdjustModal(false)}
        title={
          <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
            <TrendingUp size={20} />
            <p>Điều chỉnh số lượng</p>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Sản phẩm: <strong>{selectedInventory?.product?.name}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Số lượng hiện tại: <strong>{selectedInventory?.quantity}</strong>
            </p>
          </div>

          <NumberInput
            label="Số lượng thay đổi"
            placeholder="Nhập số lượng (âm = xuất, dương = nhập)"
            value={adjustValue.delta}
            onChange={(value) => setAdjustValue({ delta: value })}
            description="Số âm để xuất hàng, số dương để nhập hàng"
            required
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOpenAdjustModal(false)}
              className="text-red-500 hover:underline"
            >
              Hủy
            </button>
            <Button onClick={handleAdjustQuantity} title="Xác nhận" size="sm" radius="md" />
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
            onChange={(value) => setRevalueData((prev) => ({ ...prev, discount: value }))}
            min={0}
            max={100}
          />

          <NumberInput
            label="Tổng giá trị"
            placeholder="Nhập tổng giá trị mới"
            value={revalueData.total}
            onChange={(value) => setRevalueData((prev) => ({ ...prev, total: value }))}
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
            onChange={(value) => setStatusData({ status: value })}
            data={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE' },
              { value: 'SOLD', label: 'SOLD' },
            ]}
            required
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

      {/* DELETE MODAL */}
      <Modal opened={deleteModal} size="sm" onClose={() => setDeleteModal(false)}>
        <div className="space-y-3 flex flex-col items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
              <BadgeAlert size={38} />
            </div>
            <div className="text-lg font-bold text-center">Bạn Có Chắc Chắn Muốn Xóa?</div>
            <div className="text-sm text-gray-500 text-center">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan của tồn kho này sẽ biến
              mất.
            </div>
          </div>
          <Button
            onClick={handleDelete}
            color="red"
            size="md"
            className="bg-red-600 rounded-lg text-white py-2 cursor-pointer font-bold w-full"
            title="Xác nhận xóa"
          />
          <button onClick={() => setDeleteModal(false)} className="cursor-pointer">
            Hủy
          </button>
        </div>
      </Modal>

      <div className="flex flex-col h-full">
        {/* ACTION BAR */}
        <FilterBar
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
          totalPages={10}
          tableHeaders={tableHeaders}
          data={inventories}
          isLoading={loading}
          loading={<Loading color="#333" />}
          renderRow={(inventory, idx) => (
            <tr
              key={idx}
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
                {Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(Number(inventory.total))}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[inventory.status]}`}
                >
                  {inventory.status}
                </span>
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
                      setOpenAdjustModal(true);
                      setSelectedInventory(inventory);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[32px] h-[32px] bg-green-50 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-all duration-200"
                    title="Điều chỉnh số lượng"
                  >
                    <TrendingUp size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setOpenRevalueModal(true);
                      setSelectedInventory(inventory);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[32px] h-[32px] bg-blue-50 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-200"
                    title="Điều chỉnh giá trị"
                  >
                    <TrendingDown size={14} />
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

                  <button
                    onClick={() => {
                      setDeleteModal(true);
                      setSelectedInventory(inventory);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[32px] h-[32px] bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-200"
                    title="Xóa"
                  >
                    <Trash size={14} />
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
