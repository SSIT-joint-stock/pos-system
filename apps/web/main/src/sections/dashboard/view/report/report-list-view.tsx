'use client';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import DashboardViewLayout from '../../../../layouts/dashboard-view-layout';
import { DisplayField } from '../../../../sections/dashboard/components/display-field';

export function ReportListView() {
  const currentStore = useAtomValue(currentStoreAtom);

  // {
  //   title: 'Báo cáo trả hàng',
  //   path: `/dashboard/store/${currentStore?.id}/report-order-return`,
  // },
  // {
  //   title: 'Báo cáo tồn kho',
  //   path: `/dashboard/store/${currentStore?.id}/report-stock`,
  // },
  // {
  //   title: 'Báo cáo sổ kho',
  //   path: `/dashboard/store/${currentStore?.id}/report-book-stock`,
  // },
  return (
    <DashboardViewLayout>
      <DisplayField label="Danh sách báo cáo" />
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="bg-white rounded-sm p-6">
          <Link
            href={`/dashboard/store/${currentStore?.id}/report-list/report-customers`}
            className="text-pos-blue-500 hover:underline cursor-pointer text-xl font-semibold text-center"
          >
            Báo cáo khách hàng
          </Link>
        </div>
        <div className="bg-white rounded-sm p-6">
          <Link
            href={`/dashboard/store/${currentStore?.id}/report-list/report-suppliers`}
            className="text-pos-blue-500 hover:underline cursor-pointer text-xl font-semibold text-center"
          >
            Báo cáo nhà cung cấp
          </Link>
        </div>
      </div>
      {/*  */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="bg-white rounded-sm p-6">
          <Link
            href={`/dashboard/store/${currentStore?.id}/report-list/report-employees`}
            className="text-pos-blue-500 hover:underline cursor-pointer text-xl font-semibold text-center"
          >
            Báo cáo nhân viên
          </Link>
        </div>
        <div className="bg-white rounded-sm p-6">
          <Link
            href={`/dashboard/store/${currentStore?.id}/report-list/report-orders`}
            className="text-pos-blue-500 hover:underline cursor-pointer text-xl font-semibold text-center"
          >
            Báo cáo bán hàng
          </Link>
        </div>
      </div>
      {/*  */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="bg-white rounded-sm p-6">
          <Link
            href={`/dashboard/store/${currentStore?.id}/report-list/report-order-return`}
            className="text-pos-blue-500 hover:underline cursor-pointer text-xl font-semibold text-center"
          >
            Báo cáo trả hàng
          </Link>
        </div>
        <div className="bg-white rounded-sm p-6">
          <Link
            href={`/dashboard/store/${currentStore?.id}/report-list/report-stock`}
            className="text-pos-blue-500 hover:underline cursor-pointer text-xl font-semibold text-center"
          >
            Báo cáo tồn kho
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="bg-white rounded-sm p-6">
          <Link
            href={`/dashboard/store/${currentStore?.id}/report-list/report-book-stock`}
            className="text-pos-blue-500 hover:underline cursor-pointer text-xl font-semibold text-center"
          >
            Báo cáo sổ kho
          </Link>
        </div>
        {/* <div className="bg-white rounded-sm p-6">
          <Link
            href={`/dashboard/store/${currentStore?.id}/report-list/report-book-stock`}
            className="text-pos-blue-500 hover:underline cursor-pointer text-xl font-semibold text-center"
          >
            Báo cáo sổ quỹ
          </Link>
        </div> */}
      </div>
    </DashboardViewLayout>
  );
}
