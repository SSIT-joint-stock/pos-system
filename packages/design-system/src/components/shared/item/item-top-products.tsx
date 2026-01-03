import Image from 'next/image';
import { useEffect } from 'react';
import useStatistics from '../../../../../../apps/web/main/src/hooks/statistics/use-statistics';
import { formatCurrency, truncateText } from '../../../../../../apps/web/main/src/utils';

export function ItemTopProducts() {
  const { topsProducts, getTopProducts } = useStatistics();
  console.log(topsProducts);
  useEffect(() => {
    getTopProducts();
  }, []);
  return (
    <>
      {topsProducts.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-gray-500 font-medium text-base">Không có dữ liệu</span>
        </div>
      ) : (
        <>
          {topsProducts?.map((item, idx) => (
            <div
              className="py-2 px-4 border-y border-y-pos-blue-100 mt-4 flex items-center justify-between"
              key={item?.id}
            >
              <div className="flex items-center gap-5">
                <span>#{idx + 1}</span>
                <Image
                  src={'/placeholder.jpg'}
                  alt={item.name}
                  width={68}
                  height={68}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 mx-3">
                <h3 className="text-base text-pos-blue-800 font-semibold">
                  {truncateText(item?.name || '', 40)}
                </h3>
                <span className="text-gray-500 font-medium text-sm">
                  Đơn vị cơ bản: {item.baseUnit}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-pos-blue-600 font-semibold">
                  {formatCurrency(item.price)}
                </span>
                <span className="text-gray-500 font-medium text-sm">
                  Số lượng đã bán: {item.quantitySold}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
