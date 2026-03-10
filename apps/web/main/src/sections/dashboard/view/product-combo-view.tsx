'use client';

import { usePathname } from 'next/navigation';
import { FormProductCombo } from '../components/form-product-combo';

export default function ProductComboView() {
  const pathName = usePathname();
  const isEdit = !!pathName && (pathName.includes('/details/') || pathName.includes('/edit/'));
  const id = isEdit ? pathName?.split('/').pop() : undefined;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Chi tiết nhóm sản phẩm' : 'Thêm nhóm sản phẩm mới'}
        </h1>
        <p className="text-sm text-gray-500">
          {isEdit
            ? 'Cập nhật thông tin và các thành phần của combo sản phẩm'
            : 'Tạo combo mới bằng cách kết hợp nhiều sản phẩm đơn lẻ'}
        </p>
      </div>

      <FormProductCombo bundleId={id} />
    </div>
  );
}
