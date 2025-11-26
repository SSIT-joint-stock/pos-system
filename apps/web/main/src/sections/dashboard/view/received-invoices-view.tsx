'use client';
import { Button, Table } from '@repo/design-system/components/ui';
import { Copy, Download, MessageCircle, Plus, Upload } from 'lucide-react';
import React, { useState } from 'react';
import FilterBar from '../components/filter-bar';

const tableHeaders = [
  'Mã lô hàng',
  'Ngày giao dịch',
  'Nhà cung cấp / Khách hàng',
  'Hình thức TT',
  'Nhập kho',
  'Xuất kho',
  'Chuyển kho',
  'Mô tả',
  'Thao tác',
];

const tableData = [
  {
    stt: 1,
    code: 'NK2208',
    date: '26/11/2025',
    customer: '',
    method: '',
    import: '80.000',
    export: '-',
    transfer: '-',
    note: 'Tạo kho từ sản phẩm: chai rửa ch...',
  },
  {
    stt: 2,
    code: 'XK3728',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '60.000',
    transfer: '-',
    note: 'Đơn hàng DH8375',
  },
  {
    stt: 3,
    code: 'XK3721',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '140.000',
    transfer: '-',
    note: 'Đơn hàng DH8368',
  },
  {
    stt: 4,
    code: 'XK3720',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '160.000',
    transfer: '-',
    note: 'Đơn hàng DH8367',
  },
  {
    stt: 5,
    code: 'XK3718',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '300.000',
    transfer: '-',
    note: 'Đơn hàng DH8365',
  },
  {
    stt: 6,
    code: 'XK3716',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '10',
    transfer: '-',
    note: 'Đơn hàng DH8363',
  },
  {
    stt: 7,
    code: 'XK3713',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '20.000',
    transfer: '-',
    note: 'Đơn hàng DH8359',
  },
  {
    stt: 8,
    code: 'XK3711',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '20.000',
    transfer: '-',
    note: 'Đơn hàng DH8357',
  },
  {
    stt: 9,
    code: 'XK3701',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '10',
    transfer: '-',
    note: 'Đơn hàng DH8343',
  },
  {
    stt: 10,
    code: 'XK3699',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'TM/CK',
    import: '-',
    export: '10',
    transfer: '-',
    note: 'Đơn hàng DH8341',
  },
  {
    stt: 11,
    code: 'XK3696',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '10',
    transfer: '-',
    note: 'Đơn hàng DH8338',
  },
  {
    stt: 12,
    code: 'XK3695',
    date: '26/11/2025',
    customer: 'Khách Lệ',
    method: 'Tiền mặt',
    import: '-',
    export: '10',
    transfer: '-',
    note: 'Đơn hàng DH8337',
  },
];

export function ReceivedInvoicesView() {
  const [openUploadOption, setOpenUploadOption] = useState<boolean>(false);
  return (
    <div className="h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-semibold text-pos-blue-500">Quản lý xuất nhập kho</h1>
          <div className="flex items-center text-base gap-4 font-medium text-gray-500 ">
            <p className=" border-r border-r-gray-300 pr-4">
              Nhập kho:{' '}
              <span className="text-pos-blue-500 font-semibold text-lg">12.318.284.882 </span>
            </p>
            <p className=" ">
              Xuất kho: <span className="text-red-600 font-semibold text-lg">12.318.284.882 </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button title="Tạo phiếu nhập" icon={<Plus size={16} />} size="sm" radius="sm" />
          <Button title="Tạo phiếu xuất" icon={<Plus size={16} />} size="sm" radius="sm" />
        </div>
      </div>
      <FilterBar
        placeholderInputSearch="Nhập mã lô hàng, tên khách hàng"
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
            <td className="px-4 py-3 text-sm text-gray-600">{row.method}</td>
            <td className="px-4 py-3 text-sm text-pos-blue-500 font-medium">{row.import}</td>
            <td className="px-4 py-3 text-sm text-red-600 font-medium">{row.export}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.transfer}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{row.note}</td>
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
