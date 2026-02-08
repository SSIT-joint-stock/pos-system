'use client';

import { Menu } from '@mantine/core';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { DataActionBar } from '../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../sections/dashboard/components/display-field';
import { formatCurrency } from '../../../utils';

const tableHeaders = [
  'Mã phiếu',
  'Ngày ghi phiếu',
  'Tên đối tượng',
  '	Lý do thu chi',
  'Mã chứng từ gốc',
  'Số tiền',
];
export type CashBookItem = {
  id: string;
  voucherCode: string; // Mã phiếu
  date: string; // Ngày ghi phiếu
  objectName: string; // Tên đối tượng
  reason: string; // Lý do thu/chi
  refCode?: string; // Mã chứng từ gốc
  type: 'IN' | 'OUT'; // Thu | Chi
  amount: number; // Số tiền
};

export const cashBookData: CashBookItem[] = [
  {
    id: '1',
    voucherCode: 'PT001',
    date: '2026-01-01',
    objectName: 'Khách hàng Nguyễn Văn A',
    reason: 'Thanh toán đơn hàng',
    refCode: 'HD001',
    type: 'IN',
    amount: 5_000_000,
  },
  {
    id: '2',
    voucherCode: 'PC001',
    date: '2026-01-02',
    objectName: 'Nhà cung cấp ABC',
    reason: 'Thanh toán nhập hàng',
    refCode: 'PN001',
    type: 'OUT',
    amount: 2_000_000,
  },
  {
    id: '3',
    voucherCode: 'PT002',
    date: '2026-01-03',
    objectName: 'Khách hàng Trần Thị B',
    reason: 'Thanh toán dịch vụ',
    refCode: 'HD002',
    type: 'IN',
    amount: 3_000_000,
  },
  {
    id: '4',
    voucherCode: 'PC002',
    date: '2026-01-04',
    objectName: 'Chi phí vận hành',
    reason: 'Trả tiền điện nước',
    refCode: '',
    type: 'OUT',
    amount: 1_000_000,
  },
];

export function CashBookView() {
  return (
    <DashboardViewLayout>
      <DisplayField label="Danh sách thu/chi">
        <Menu shadow="lg" width={200} withinPortal={false} position="bottom" offset={5}>
          <Menu.Target>
            <div>
              <Button icon={<Plus size={'16'} />} radius="sm" title={'Tạo phiếu'} size="sm" />
            </div>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              // onClick={() => setIsOpenModalSelectPurchase(true)}
              className="hover:bg-gray-50 rounded-md p-2 text-sm font-medium text-gray-900  cursor-pointer"
            >
              Tạo phiếu thu
            </Menu.Item>
            <Menu.Item
              // onClick={() => setIsOpenSearch(true)}
              className="hover:bg-gray-50 rounded-md p-2 text-sm font-medium text-gray-900 cursor-pointer"
            >
              Tạo phiếu chi
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </DisplayField>
      {/* <div className="grid grid-cols-3 items-center justify-between gap-4">
        <ItemBoxChart title={'Tổng thu'} value={100.0} />
        <ItemBoxChart value={formatCurrency(10000000)} title={'Tổng chi'} />
        <ItemBoxChart title={`Tồn quỹ`} value={formatCurrency(10000000)} />
      </div> */}

      <DataActionBar
        // dataComplete={[...new Set(products?.map((p) => p.name) || [])]}
        statusOptions={[
          {
            width: '280px',
            key: 'product_status',
            label: 'Trạng thái sản phẩm',
            options: [
              { value: 'ACTIVE', label: 'Đang kinh doanh ' },
              { value: 'INACTIVE', label: 'Ngừng kinh doanh' },
              { value: 'SOLD', label: 'Đã bán hết' },
            ],
          },
        ]}
        // onFilterChange={(newFilters) => {
        //   setFilters((prev) => ({
        //     ...prev,
        //     ...newFilters,
        //     product_status: newFilters.product_status,
        //   }));
        // }}
        // onSearch={(value) => {
        //   setFilters((prev) => ({ ...prev, q: value }));
        // }}
        // onExport={handleExportExcel}
        // onUpload={uploadProductByExcel}
        // onDownloadTemplate={exampleProductExcel}
        // loading={loading}
        placeholderSearch="Nhập tên sản phẩm, mã sản phẩm, barcode..."
        isHaveUpload={false}
      />

      {/* TABLE AND PAGINATION */}

      <Table
        hasMarginTop={false}
        // total={pagination?.total}
        // page={pagination?.page}
        // totalPages={pagination?.totalPages}
        // limit={pagination?.limit}
        // pageSize={pagination?.limit ?? paginationParams.limit}
        // onPageSizeChange={(size) =>
        //   setPaginationParams((prev) => ({
        //     ...prev,
        //     limit: size,
        //   }))
        // }
        // onPageChange={(page) =>
        //   setPaginationParams((prev) => ({
        //     ...prev,
        //     page,
        //   }))
        // }
        tableHeaders={tableHeaders}
        data={cashBookData}
        // isLoading={loading}
        renderRow={(item: CashBookItem) => (
          <>
            <td className="px-4 py-3 text-sm font-medium">{item.voucherCode}</td>
            <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
            <td className="px-4 py-3 text-sm">{item.objectName}</td>
            <td className="px-4 py-3 text-sm">{item.reason}</td>
            <td className="px-4 py-3 text-sm">{item.refCode || '-'}</td>
            <td
              className={`px-4 py-3 text-sm font-semibold ${
                item.type === 'IN' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {item.type === 'IN' ? '+' : '-'}
              {formatCurrency(item.amount)}
            </td>
          </>
        )}
      />
    </DashboardViewLayout>
  );
}
