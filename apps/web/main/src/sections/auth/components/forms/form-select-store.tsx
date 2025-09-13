import { Button, Select } from '@repo/design-system/components/ui';
import { Warehouse } from 'lucide-react';
import React from 'react';

export default function ormSelectStore({
  handleStoreSubmit,
  handleStoreChange,
  stores,
  currentStore,
  loading,
}: {
  handleStoreSubmit: (e: React.FormEvent) => void;
  handleStoreChange: (storeId: string) => void;
  stores: any[];
  currentStore: any;
  loading: boolean;
}) {
  console.log(stores);
  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleStoreSubmit}>
      <Select
        leftSection={<Warehouse size={16} />}
        placeholder="Chọn cửa hàng"
        searchable
        label="Chọn cửa hàng"
        value={currentStore?.id || ''}
        data={stores.map((store: any) => ({
          label: store.name,
          value: store.id,
          description: store.description,
          member: store.membersCount,
        }))}
        onChange={handleStoreChange}
      />
      <Button type="submit" title="Đăng nhập" size="sm" disabled={loading} />
    </form>
  );
}
