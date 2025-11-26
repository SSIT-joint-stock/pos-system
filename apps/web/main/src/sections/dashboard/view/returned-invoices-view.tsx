'use client';
import { Button, Table } from '@repo/design-system/components/ui';
import { Copy, Download, MessageCircle, Plus, Upload } from 'lucide-react';
import React, { useState } from 'react';
import FilterBar from '../components/filter-bar';

export const tableHeaders = [
  'Mã phiếu trả',
  'Ngày trả',
  'Tên khách hàng',
  'Tổng tiền trả',
  'Số sản phẩm',
  'Trạng thái',
  'Thao tác',
];

export const tableData = [
  {
    stt: 1,
    code: 'PT001',
    date: '26/11/2025',
    customer: 'Nguyễn Văn A',
    total: '120.000',
    quantity: 3,
    status: 'Hoàn tất',
  },
  {
    stt: 2,
    code: 'PT002',
    date: '26/11/2025',
    customer: 'Trần Thị B',
    total: '80.000',
    quantity: 2,
    status: 'Hoàn tất',
  },
  {
    stt: 3,
    code: 'PT003',
    date: '26/11/2025',
    customer: 'Pham Minh C',
    total: '250.000',
    quantity: 5,
    status: 'Đang xử lý',
  },
  {
    stt: 4,
    code: 'PT004',
    date: '25/11/2025',
    customer: 'Lê Thu D',
    total: '60.000',
    quantity: 1,
    status: 'Hoàn tất',
  },
  {
    stt: 5,
    code: 'PT005',
    date: '25/11/2025',
    customer: 'Nguyễn Văn A',
    total: '150.000',
    quantity: 4,
    status: 'Đã hủy',
  },
  {
    stt: 6,
    code: 'PT006',
    date: '24/11/2025',
    customer: 'Khách Lệ',
    total: '95.000',
    quantity: 2,
    status: 'Hoàn tất',
  },
  {
    stt: 7,
    code: 'PT007',
    date: '24/11/2025',
    customer: 'Tạ Minh E',
    total: '40.000',
    quantity: 1,
    status: 'Đang xử lý',
  },
  {
    stt: 8,
    code: 'PT008',
    date: '23/11/2025',
    customer: 'Võ Đình F',
    total: '300.000',
    quantity: 6,
    status: 'Hoàn tất',
  },
  {
    stt: 9,
    code: 'PT009',
    date: '22/11/2025',
    customer: 'Trần Đại G',
    total: '15.000',
    quantity: 1,
    status: 'Hoàn tất',
  },
  {
    stt: 10,
    code: 'PT010',
    date: '21/11/2025',
    customer: 'Khách Lệ',
    total: '50.000',
    quantity: 2,
    status: 'Đang xử lý',
  },
];

export function ReturnedInvoicesView() {
  const [openUploadOption, setOpenUploadOption] = useState<boolean>(false);
  return (
    <div className="h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-semibold text-pos-blue-500">Quản lý phiếu trả hàng bán</h1>
        </div>
        <Button title="Tạo phiếu trả hàng bán" icon={<Plus size={16} />} size="sm" radius="sm" />
      </div>
      <FilterBar
        placeholderInputSearch="Tìm kiếm mã trả hàng, tên khách hàng"
        statusOptions={[
          { value: 'ACTIVE', label: 'Tất cả ' },
          { value: 'INACTIVE', label: 'Nhập kho' },
          { value: 'SOLD', label: 'Xuất kho' },
        ]}
        // onFilterChange={(newFilters) => {
        //   setFilters((prev) => ({
        //     ...prev,
        //     ...newFilters,
        //     product_status: newFilters.status,
        //   }));
        // }}
        // onSearch={(value) => {
        //   setFilters((prev) => ({ ...prev, q: value }));
        // }}
        actions={
          <>
            <div className="relative">
              <button
                className={`bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Upload size={16} />
                <span className="text-gray-900 font-medium text-sm">Tải lên dữ liệu</span>
              </button>

              {openUploadOption && (
                <div className="absolute top-full left-0 mt-1 z-50 flex flex-col  rounded-md shadow-md shadow-gray-100">
                  <button
                    className={`bg-white  text-nowrap  py-2 px-4 text-left hover:bg-gray-50 rounded-t-md  cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className="text-gray-900 font-medium text-sm">
                      Tải lên dữ liệu (Excel)
                    </span>
                    <input
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log(file);
                        }
                      }}
                      hidden
                      type="file"
                    />
                  </button>
                  <button
                    className={`bg-white  text-nowrap  hover:bg-gray-50   py-2 px-4 text-left rounded-b-md cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className="text-gray-900 font-medium text-sm">Tải file mẫu (Excel)</span>
                  </button>
                </div>
              )}
            </div>
            <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <Download size={16} />
              <span className="text-gray-900 font-medium text-sm"> Xuất dữ liệu</span>
            </button>
          </>
        }
      />
      <Table
        hasMarginTop={false}
        tableHeaders={tableHeaders}
        data={tableData}
        renderRow={(row) => (
          <>
            <td className="px-4 py-3 text-sm font-semibold text-blue-600">{row.code}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.date}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.customer}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.total}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.quantity}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.status}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2 justify-end">
                <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors">
                  <Copy size={18} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors">
                  <MessageCircle size={18} />
                </button>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
}
