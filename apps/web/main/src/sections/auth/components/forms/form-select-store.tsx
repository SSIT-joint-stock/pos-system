import { Button, Select } from '@repo/design-system/components/ui';
import { MoveLeft, Warehouse } from 'lucide-react';
import React from 'react';

export default function FormSelectStore({
  handleStoreSubmit,
  handleStoreChange,
  setIsStepActive,
  stores,
  currentStore,
  loading,
}: {
  handleStoreSubmit: (e: React.FormEvent) => void;
  handleStoreChange: (storeId: string) => void;
  setIsStepActive?: (step: number) => void;
  stores: any[];
  currentStore: any;
  loading: boolean;
}) {
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
        onChange={(value) => handleStoreChange(value as string)}
      />
      <Button type="submit" title="Đăng nhập" size="sm" disabled={loading} />
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          onClick={() => setIsStepActive?.(0)}
          className="flex items-center gap-2 cursor-pointer text-gray-500 group transition-all duration-300 hover:text-pos-blue-500  "
        >
          <MoveLeft size={16} className=" group-hover:-translate-x-2 transition-all duration-300" />
          <span className="text-xs font-medium ">Quay lại trang đăng nhập</span>
        </button>
      </div>
    </form>
  );
}
