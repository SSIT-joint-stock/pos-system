'use client';
import { formatCurrency } from '../../../../../main/src/utils';
import useStatistics, {
  SummaryRevenue,
} from '../../../../../main/src/hooks/statistics/use-statistics';
import {
  ChartPoint,
  LineChart,
  PieChart,
  PieChartProps,
} from '@repo/design-system/components/shared/chart-screen';
import {
  ItemBoxChart,
  ItemLowStock,
  ItemTopProducts,
} from '@repo/design-system/components/shared/item';
import { Select } from '@repo/design-system/components/ui';
import { Download, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import SlidingTabs from '@repo/design-system/components/shared/chart-screen/sliding-line-chart';
export function DashboardView() {
  const { cache, handleChangeTimeType } = useStatistics();
  const [revenue, setRevenue] = useState<ChartPoint | null>(null);
  const [revenueByCategory, setRevenueByCategory] = useState<PieChartProps | null>(null);
  const [revenueSummary, setRevenueSummary] = useState<SummaryRevenue | null>(null);
  const revenueItems = cache.find((item) => item.key === 'revenue');
  const summaryRevenueItems = cache.find((item) => item.key === 'summary-revenue');
  const revenueByCategoryItems = cache.find((item) => item.key === 'revenue-by-category');
  useEffect(() => {
    setRevenue(revenueItems?.data || []);
    setRevenueByCategory(revenueByCategoryItems?.data || null);
    setRevenueSummary(summaryRevenueItems?.data || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, revenue?.type]);

  return (
    <div className="flex  h-fit w-full gap-5 flex-col pb-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-end t">
          <div className="w-fit bg-white rounded-md py-2 px-3">
            <SlidingTabs
              data={[
                { name: 'Ngày', value: 'day' },
                { name: 'Tuần', value: 'week' },
                { name: 'Tháng', value: 'month' },
              ]}
              onChangeTypeData={(value) =>
                handleChangeTimeType('summary-revenue', value as 'day' | 'week' | 'month')
              }
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3   w-full overflow-x-auto min-h-fit">
          <ItemBoxChart title={'Tổng đơn hàng'} value={revenueSummary?.orderCount} />
          <ItemBoxChart
            value={formatCurrency(revenueSummary?.totalRevenue)}
            title={'Tổng doanh thu'}
          />
          <ItemBoxChart
            title={`Tổng số lượng sản phẩm được bán`}
            value={revenueSummary?.totalProduct}
          />
          <ItemBoxChart title={'Tổng số lượng khách hàng'} value={revenueSummary?.customerCount} />

          <div className="flex items-center justify-center h-full w-full group  hover:bg-white transition-all duration-300 border-2 border-dashed border-pos-blue-500 bg-pos-blue-100 rounded-md">
            <Plus
              className=" text-pos-blue-500  text-center group-hover:rotate-90 transition-all duration-200"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[0.9fr_0.4fr] gap-4 w-full  h-full">
        <div className=" shadow-md rounded-md   h-[400px] w-full bg-white p-6">
          <LineChart data={revenue} onChangeTypeTime={handleChangeTimeType} keyChart="revenue" />
        </div>

        <div className="overflow-hidden overflow-y-scroll bg-white  h-[400px] rounded-md shadow-md ">
          <div className="flex items-center justify-between p-4 sticky top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">Sản phẩm bán chạy</h2>
            <Select
              size="sm"
              defaultValue="Theo doanh thu giảm dần"
              data={['Theo doanh thu giảm dần', 'Theo doanh thu tăng dần']}
              position="bottom"
            />
          </div>

          <div className=" w-full h-full ">
            <ItemTopProducts />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[0.9fr_0.4fr] gap-4 w-full  h-[460px] ">
        <div className=" shadow-md rounded-md p-6  w-full bg-white h-full">
          <PieChart
            data={revenueByCategory}
            onChangeTypeTime={handleChangeTimeType}
            keyChart="revenue-by-category"
          />
        </div>
        <div className="overflow-hidden overflow-y-scroll bg-white  rounded-md shadow-md h-full ">
          <div className="flex items-center justify-between p-4 sticky top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">Sản phẩm sắp hết hàng</h2>
            <button title="Tải xuống file excel" className="text-pos-blue-500 cursor-pointer">
              <Download />
            </button>
          </div>

          <div className=" w-full h-full ">
            <ItemLowStock />
          </div>
        </div>
      </div>
    </div>
  );
}
