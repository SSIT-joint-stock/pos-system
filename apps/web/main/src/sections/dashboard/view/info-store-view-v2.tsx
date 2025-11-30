'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button, Input } from '@repo/design-system/components/ui';
import { InfoConfigPayment, InfoStore } from '../components';

const link = [
  {
    title: 'Thông tin cửa hàng',
    link: 'store-info?tab=store',
  },
  {
    title: 'Thông tin tích điểm',
    link: 'store-info?tab=reward',
  },
  {
    title: 'Thông tin thanh toán',
    link: 'store-info?tab=payment',
  },
];
export function InfoStoreViewV2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  useEffect(() => {
    if (!tab) {
      router.push('store-info?tab=store');
    }
  }, [router, tab]);

  return (
    <div className="grid grid-cols-[0.2fr_1fr] h-full gap-3">
      <div className="h-full w-full bg-white flex flex-col gap-3 p-4 rounded-md text-nowrap">
        {link.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className={`text-base font-semibold text-gray-800 hover:text-pos-blue-500 hover:bg-pos-blue-50 py-2 px-3 cursor-pointer  transition-all duration-300 ${
              tab === item.link.split('=')[1] ? 'bg-pos-blue-50 text-pos-blue-500' : ''
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="h-full w-full bg-white p-8 rounded-md">
        {tab === 'store' && <InfoStore />}
        {tab === 'reward' && (
          <div className="space-y-12">
            <h1 className="text-3xl font-semibold text-pos-blue-500 border-b-2 pb-1 border-b-pos-blue-500 w-fit">
              Thiết lập tích điểm
            </h1>
            <form action="" className="w-full space-y-4">
              <div className="space-y-1.5">
                <p className="text-sm text-gray-700 font-semibold">Tỷ lệ tích điểm quy đổi</p>
                <div className="flex items-center gap-4 ">
                  <Input className="flex-1" radius="sm" rightSection="VND" />
                  <p className="text-base font-semibold text-gray-800 flex-1"> = 1 điểm thưởng</p>
                </div>
                <span className="text-xs font-semibold">Ví dụ: 100,000,000 VND = 1 điểm</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-gray-700 font-semibold">Giá trị quy đổi</p>
                <div className="flex items-center gap-4 ">
                  <Input className="flex-1" radius="sm" rightSection="VND" />
                  <p className="text-base font-semibold text-gray-800 flex-1"> = 1 điểm thưởng</p>
                </div>
                <span className="text-xs font-semibold">
                  Ví dụ: 1 điểm = 5,000 VND khi quy đổi điểm thưởng.
                </span>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button type="button" title="Sửa" size="sm" variant="light" />
                <Button type="submit" title={'Cập nhật'} size="sm" />
              </div>
            </form>
          </div>
        )}
        {tab === 'payment' && <InfoConfigPayment tab={tab} />}
      </div>
    </div>
  );
}
