'use client';
import { ActionIcon, Menu, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal, Table } from '@repo/design-system/components/ui';
import { CashTransaction } from '@repo/design-system/types';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPaymentMethod, payment_method } from '../../../constants/method';
import { getOrderItemReturnReasonLabel, ReasonCash } from '../../../constants/reason-cash';
import { useFinance } from '../../../hooks/finance/use-finance';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { DataActionBar } from '../../../sections/dashboard/components/data-action-bar';
import { DisplayField } from '../../../sections/dashboard/components/display-field';
import { formatCurrency, formatDate } from '../../../utils';
import { FormFinanceTransaction } from '../components/form-finance-transaction';

const tableHeaders = [
  'Mã phiếu',
  'Ngày ghi phiếu',
  'Đối tượng',
  'Lý do thu/chi',
  'Mã chứng từ gốc',
  'Phương thức thanh toán',
  'Số tiền',
  'Thao tác',
];

export function CashBookView() {
  const {
    transactions,
    loading,
    pagination,
    filters,
    paginationParams,
    setFilters,
    setPaginationParams,
    getTransactions,
    getDashboard,
    exportTransactions,
    cancelTransaction,
  } = useFinance();

  const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [selectedTransaction, setSelectedTransaction] = useState<CashTransaction | null>(null);

  const handleRowClick = (item: CashTransaction) => {
    setSelectedTransaction(item);
    openDetail();
  };

  const [isOpenCreateReceipt, setIsOpenCreateReceipt] = useState<boolean>(false);
  const [isOpenCreatePayment, setIsOpenCreatePayment] = useState<boolean>(false);

  useEffect(() => {
    getTransactions();
    getDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, paginationParams]);

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
              onClick={() => setIsOpenCreateReceipt(true)}
              className="hover:bg-gray-50 rounded-md p-2 text-sm font-medium text-gray-900  cursor-pointer"
            >
              Tạo phiếu thu
            </Menu.Item>
            <Menu.Item
              onClick={() => setIsOpenCreatePayment(true)}
              className="hover:bg-gray-50 rounded-md p-2 text-sm font-medium text-gray-900 cursor-pointer"
            >
              Tạo phiếu chi
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </DisplayField>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> */}
      {/* <StatCard
          title="Tổng thu (Trong ngày)"
          value={formatCurrency(Number(dashboardStats?.today?.receipts?.total || 0))}
          trend="up"
        />
        <StatCard
          title="Tổng chi (Trong ngày)"
          value={formatCurrency(Number(dashboardStats?.today?.payments?.total || 0))}
          trend="down"
        />
        <StatCard
          title="Tồn quỹ"
          value={formatCurrency(Number(dashboardStats?.current_balance || 0))}
        /> */}
      {/* </div> */}

      <DataActionBar
        dataComplete={[...new Set(transactions?.map((t) => t.code) || [])]}
        statusOptions={[
          {
            width: '280px',
            key: 'transaction_type',
            label: 'Loại giao dịch',
            options: [
              { value: 'RECEIPT', label: 'Phiếu thu' },
              { value: 'PAYMENT', label: 'Phiếu chi' },
            ],
          },
        ]}
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({
            ...prev,
            ...newFilters,
            transaction_type: newFilters.transaction_type,
          }));
        }}
        onSearch={(value) => {
          setFilters((prev) => ({ ...prev, q: value }));
        }}
        placeholderSearch="Nhập mã phiếu, tên đối tượng, mô tả..."
        isHaveUpload={false}
        onExport={exportTransactions}
        loading={loading}
      />

      <Table
        hasMarginTop={false}
        total={pagination?.total}
        page={pagination?.page}
        totalPages={pagination?.totalPages}
        limit={pagination?.limit}
        pageSize={pagination?.limit ?? paginationParams.limit}
        onPageSizeChange={(size) =>
          setPaginationParams((prev) => ({
            ...prev,
            limit: size,
          }))
        }
        onPageChange={(page) =>
          setPaginationParams((prev) => ({
            ...prev,
            page,
          }))
        }
        tableHeaders={tableHeaders}
        data={transactions}
        isLoading={loading}
        renderRow={(item: CashTransaction) => (
          <>
            <td
              onClick={() => handleRowClick(item)}
              className="px-4 py-3 text-sm font-semibold text-pos-blue-500 hover:underline cursor-pointer"
            >
              {item.code}
            </td>
            <td className="px-4 py-3 text-sm text-gray-800 font-medium">
              {formatDate(item.transaction_date)}
            </td>
            <td className="px-4 py-3 text-sm">
              {item.contact_name || (
                <span className="text-gray-500 font-medium italic">Không có dữ liệu</span>
              )}
            </td>
            <td className="px-4 py-3 text-sm">
              {getOrderItemReturnReasonLabel(item.transaction_source as ReasonCash)}
            </td>

            <td className="px-4 py-3 ">
              <span
                className={`text-sm  ${
                  item.reference_code
                    ? 'text-pos-blue-500 hover:underline cursor-pointer font-semibold'
                    : 'text-gray-500 font-medium'
                }`}
              >
                {item.reference_code || 'Không có dữ liệu'}
              </span>
            </td>
            <td className="px-4 py-3 text-sm font-semibold r">
              {formatPaymentMethod(item.payment_method as payment_method) || (
                <span className="text-gray-500 font-medium italic ">Không có dữ liệu</span>
              )}
            </td>
            <td
              className={`px-4 py-3 text-sm font-semibold ${
                item.transaction_type === 'RECEIPT' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.transaction_type === 'RECEIPT' ? '+' : '-'}
              {formatCurrency(item.amount)}
            </td>
            <td className="px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                {item.status !== 'CANCELLED' ? (
                  <Tooltip label="Hủy phiếu" withArrow position="bottom">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        if (confirm('Bạn có chắc chắn muốn hủy phiếu này?')) {
                          cancelTransaction(item.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </ActionIcon>
                  </Tooltip>
                ) : (
                  <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">
                    Đã hủy
                  </span>
                )}
              </div>
            </td>
          </>
        )}
      />

      <Modal
        opened={openedDetail}
        onClose={closeDetail}
        title={
          <p className="text-base font-semibold">
            Chi tiết{' '}
            {selectedTransaction?.transaction_type === 'RECEIPT' ? 'phiếu thu' : 'phiếu chi'} -{' '}
            {selectedTransaction?.code}
          </p>
        }
        size="lg"
        radius="sm"
      >
        {selectedTransaction && (
          <FormFinanceTransaction
            type={selectedTransaction.transaction_type}
            initialData={selectedTransaction}
            isReadOnly={true}
            onSuccess={() => {}}
            onCancel={closeDetail}
          />
        )}
      </Modal>

      <Modal
        opened={isOpenCreateReceipt}
        onClose={() => setIsOpenCreateReceipt(false)}
        size="lg"
        title={<p className="text-base font-semibold">Tạo phiếu thu</p>}
      >
        <FormFinanceTransaction
          type="RECEIPT"
          onSuccess={() => {
            setIsOpenCreateReceipt(false);
            getTransactions();
            getDashboard();
          }}
          onCancel={() => setIsOpenCreateReceipt(false)}
        />
      </Modal>

      <Modal
        opened={isOpenCreatePayment}
        onClose={() => setIsOpenCreatePayment(false)}
        size="lg"
        title={<p className="text-base font-semibold">Tạo phiếu chi</p>}
      >
        <FormFinanceTransaction
          type="PAYMENT"
          onSuccess={() => {
            setIsOpenCreatePayment(false);
            getTransactions();
            getDashboard();
          }}
          onCancel={() => setIsOpenCreatePayment(false)}
        />
      </Modal>
    </DashboardViewLayout>
  );
}
