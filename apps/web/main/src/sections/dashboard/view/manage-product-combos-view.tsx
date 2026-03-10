'use client';
import { Button, Table } from '@repo/design-system/components/ui';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBundles } from '../../../hooks/catalog/use-bundles';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { formatCurrency } from '../../../utils';
import { ActionButtons } from '../components/action-buttons';
import { DataActionBar } from '../components/data-action-bar';
import { DisplayField } from '../components/display-field';

const tableHeaders = [
  'Tên nhóm sản phẩm',
  'Mã SKU',
  'Số lượng thành phần',
  'Tồn kho combo',
  'Giá bán',
  'Thao tác',
];

export default function ManageProductCombosView() {
  const router = useRouter();
  const pathName = usePathname();
  const [openUploadOption, setOpenUploadOption] = useState<boolean>(false);
  const { getBundles, bundles, deleteBundle, loading, setFilters } = useBundles();

  useEffect(() => {
    getBundles();
  }, []);

  const handleAdd = () => {
    router.push(`${pathName}/create`);
  };

  const handleEdit = (id: string) => {
    router.push(`${pathName}/details/${id}`);
  };

  return (
    <>
      <DashboardViewLayout>
        {/* Header */}
        <DisplayField label="Danh sách nhóm sản phẩm">
          <Button
            title="Thêm nhóm sản phẩm"
            icon={<Plus size={16} />}
            size="sm"
            radius="sm"
            onClick={handleAdd}
          />
        </DisplayField>
        <DataActionBar
          placeholderSearch="Nhập tên nhóm sản phẩm hoặc SKU"
          onSearch={(val: string) => setFilters((prev) => ({ ...prev, q: val }))}
        />
        <Table
          hasMarginTop={false}
          tableHeaders={tableHeaders}
          data={bundles}
          loading={loading}
          renderRow={(row) => (
            <>
              <td className="px-4 py-3 text-sm font-semibold text-pos-blue-600">
                <span className="cursor-pointer hover:underline" onClick={() => handleEdit(row.id)}>
                  {row.name}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.sku}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.items?.length || 0} sản phẩm</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.quantity}</td>
              <td className="px-4 py-3 text-sm text-pos-blue-500 font-semibold ">
                {formatCurrency(row.price)}
              </td>
              <td>
                <ActionButtons
                  onView={() => handleEdit(row.id)}
                  onEdit={() => handleEdit(row.id)}
                  onDelete={async () => {
                    if (confirm('Bạn có chắc chắn muốn xóa nhóm sản phẩm này?')) {
                      await deleteBundle(row.id);
                    }
                  }}
                />
              </td>
            </>
          )}
        />
      </DashboardViewLayout>
    </>
  );
}
