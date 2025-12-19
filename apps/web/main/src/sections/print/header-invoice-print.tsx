import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import React from 'react';

export default function HeaderInvoicePrint({ title }: { title: string }) {
  const currentStore = useAtomValue(currentStoreAtom);
  return (
    <div>
      <h2 className="text-lg font-medium text-center">{currentStore?.name || 'Store name'}</h2>
      <p className="text-center text-sm">
        Hotline: {currentStore?.phone_number || <span className="italic">Chưa cập nhật</span>}
      </p>
      <p className="text-center text-sm">
        Địa chỉ: {currentStore?.address || <span className="italic">Chưa cập nhật</span>}
      </p>
      <h1 className="text-xl text-center font-semibold uppercase">{title}</h1>
    </div>
  );
}
