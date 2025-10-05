'use client';
import useStatistics from '../../../../../main/src/hooks/statistics/use-statistics';
import {
  ChartPoint,
  ItemBoxChart,
  LineChart,
  PieChart,
} from '@repo/design-system/components/shared/chart-screen';
import { ItemNotification } from '@repo/design-system/components/shared/chart-screen/';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
export function DashboardView() {
  const { notifications, cache, handleChangeTimeType } = useStatistics();
  const [revenue, setRevenue] = useState<ChartPoint | null>(null);
  const revenueItems = cache.find((item) => item.key === 'revenue');
  console.log('revenueItems', revenueItems);
  const summaryRevenueItems = cache.find((item) => item.key === 'summary-revenue');
  const revenueByCategoryItems = cache.find((item) => item.key === 'revenue-by-category');
  useEffect(() => {
    setRevenue(revenueItems?.data || []);
  }, [cache, revenue?.type]);
  return (
    <div className="flex  h-fit w-full gap-5 flex-col">
      <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-2  w-full overflow-x-auto min-h-fit">
        <ItemBoxChart title="Doanh Thu Hôm Nay" value={500000000} percent={55} />
        <ItemBoxChart title="Tiền Nhập Hàng Tháng Này" value={900000000} percent={36} />
        <ItemBoxChart title="Tổng Tiền Lãi Tháng Này" value={30102005} percent={10} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <div className="flex items-center justify-center h-full w-full group  hover:bg-white transition-all duration-300 border-2 border-dashed border-pos-blue-500 bg-pos-blue-100 rounded-2xl">
          <Plus
            className=" text-pos-blue-500  text-center group-hover:rotate-90 transition-all duration-200"
            strokeWidth={2}
          />
        </div>
      </div>
      <div className="grid grid-cols-[0.9fr_0.4fr] gap-4 w-full h-[380px]">
        <div className=" bg-white rounded-2xl shadow-md py-3 px-1">
          <LineChart data={revenue} onChangeTypeTime={handleChangeTimeType} keyChart="revenue" />
        </div>

        <div className="overflow-hidden  bg-white  rounded-2xl shadow-md  px-3.5 py-5 ">
          <h2 className="text-xl font-medium text-gray-800 ">Thông Báo</h2>

          <div className="mt-3 w-full h-full overflow-y-scroll pb-5">
            <ItemNotification notifications={notifications} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[0.9fr_0.4fr] gap-4 w-full h-full mt-8">
        <div className=" shadow-xl rounded-md">
          <PieChart />
        </div>
      </div>
    </div>
  );
}
