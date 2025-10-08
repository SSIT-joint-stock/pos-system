'use client';
import React from 'react';
import Image from 'next/image';
import useStatistics from '../../../../../../apps/web/main/src/hooks/statistics/use-statistics';
import { truncateText } from '../../../../../../apps/web/main/src/utils';

export function ItemLowStock() {
  const { lowStockProducts } = useStatistics();
  return (
    <>
      {lowStockProducts?.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-gray-500 font-medium text-base">Không có dữ liệu</span>
        </div>
      ) : (
        <>
          {lowStockProducts?.map((item, idx) => (
            <div
              key={item.product.id}
              className={`py-2 px-4  mt-4 flex items-center justify-between ${
                item.status === 'critical'
                  ? 'bg-red-50'
                  : item.status === 'warning'
                    ? 'bg-yellow-50'
                    : 'bg-white'
              }`}
            >
              {/* Hình ảnh + số thứ tự */}
              <div className="flex items-center gap-5">
                <span className="font-semibold text-gray-700">#{idx + 1}</span>
                <Image
                  src={'/placeholder.jpg'}
                  alt={item.product.name}
                  width={68}
                  height={68}
                  className="rounded-md object-cover"
                />
              </div>

              {/* Thông tin sản phẩm */}
              <div className="flex flex-col justify-between flex-1 mx-3">
                <h3 title={item.product.name} className="text-sm text-pos-blue-800 font-semibold">
                  {truncateText(item.product.name, 45)}
                </h3>
                <span className="text-gray-500 font-medium text-sm">
                  Tồn kho: {item.product.inventory.quantity}
                </span>
                <span className="text-gray-500 font-medium text-sm">
                  Bán 30 ngày qua: {item.totalSold30Days}
                </span>
              </div>

              {/* Thông tin bổ sung */}
              <div className="flex flex-col items-end">
                <span
                  className={`text-sm font-semibold ${
                    item.status === 'critical'
                      ? 'text-red-600'
                      : item.status === 'warning'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                  }`}
                >
                  {item.status === 'critical'
                    ? 'Nguy cấp'
                    : item.status === 'warning'
                      ? 'Cảnh báo'
                      : 'Ổn định'}
                </span>
                <span className="text-gray-500 text-sm mt-1">
                  Trung bình: {item.avgDailySales.toFixed(1)}/ngày
                </span>
                <span className="text-gray-500 text-sm">Còn khoảng: {item.daysRemaining} ngày</span>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
