'use client';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import React from 'react';
import { DisplayField } from '../components/display-field';
import { DataActionBar } from '../components/data-action-bar';
import { ActionButtons } from '../components/action-buttons';

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
  return (
    <DashboardViewLayout>
      {/* Header */}

      <DisplayField
        label="Quản lý xuất nhập kho"
        value={
          <div className="flex items-center text-base gap-4 font-medium text-gray-500 ">
            <p className=" border-r border-r-gray-300 pr-4">
              Nhập kho:{' '}
              <span className="text-pos-blue-500 font-semibold text-lg">12.318.284.882 </span>
            </p>
            <p className=" ">
              Xuất kho: <span className="text-red-600 font-semibold text-lg">12.318.284.882 </span>
            </p>
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <Button title="Tạo phiếu nhập" icon={<Plus size={16} />} size="sm" radius="sm" />
          <Button title="Tạo phiếu xuất" icon={<Plus size={16} />} size="sm" radius="sm" />
        </div>
      </DisplayField>
      <DataActionBar
        placeholderSearch="Tìm kiếm mã lô hàng, tên khách hàng"
        statusOptions={[
          {
            width: '280px',
            key: 'status',
            label: 'Trạng thái phiếu',
            options: [
              {
                value: 'test label1',
                label: 'Tất cả',
              },
              {
                value: 'test label2',
                label: 'Nhập hàng',
              },
              {
                value: 'test label3',
                label: 'Xuất hàng',
              },
            ],
          },
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
            <td>
              <ActionButtons onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
            </td>
          </>
        )}
      />
    </DashboardViewLayout>
  );
}
