'use client';
import React from 'react';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import { DisplayField } from '../components/display-field';
import { DataActionBar } from '../components/data-action-bar';
import { ActionButtons } from '../components/action-buttons';
import { IsUpdated } from '../components';

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
  const isUpdated = true;
  return (
    <>
      {isUpdated ? (
        <IsUpdated />
      ) : (
        <DashboardViewLayout>
          {/* Header */}

          <DisplayField label="Quản lý danh sách đơn trả hàng">
            <Button title="Tạo phiếu trả hàng" icon={<Plus size={16} />} size="sm" radius="sm" />
          </DisplayField>
          <DataActionBar
            placeholderSearch="Tìm kiếm mã trả hàng, tên khách hàng"
            statusOptions={[
              {
                width: '280px',
                key: 'status',
                label: 'Trạng thái phiếu trả',
                options: [
                  {
                    label: 'test',
                    value: 'test value',
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
                <td className="px-4 py-3 text-sm text-gray-600">{row.total}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.quantity}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.status}</td>
                <td>
                  <ActionButtons onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
                </td>
              </>
            )}
          />
        </DashboardViewLayout>
      )}
    </>
  );
}
