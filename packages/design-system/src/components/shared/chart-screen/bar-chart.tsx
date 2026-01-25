import { BarChart } from '@mantine/charts';
import { formatCompactNumber, formatCurrency } from '../../../../../../apps/web/main/src/utils';
import SlidingTabs from './sliding-line-chart';

export interface CategoryDataProps {
  categories: {
    name: string;
    value: number;
  }[];
  total: number;
}

export function CategoryBarChart({
  data,
  onChangeTypeTime,
  keyChart,
}: {
  data: CategoryDataProps | null;
  onChangeTypeTime: (key: string, type: 'day' | 'week' | 'month') => void;
  keyChart: string;
}) {
  // Chuyển đổi dữ liệu cho BarChart
  // BarChart của Mantine hoạt động tốt nhất khi mỗi item là 1 cột trên trục X
  const chartData =
    data?.categories.map((item) => ({
      name: item.name,
      'Doanh thu': item.value,
      // color: getColorFromName(item.name),
    })) || [];

  return (
    <>
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="font-semibold text-2xl">Doanh thu theo ngành hàng</h2>

        <SlidingTabs
          data={[
            { name: 'Ngày', value: 'day' },
            { name: 'Tuần', value: 'week' },
            { name: 'Tháng', value: 'month' },
          ]}
          onChangeTypeData={(value) =>
            onChangeTypeTime(keyChart, value as 'day' | 'week' | 'month')
          }
        />
      </div>

      <div className="w-full h-[350px]">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-2xl font-bold">Chưa có dữ liệu</p>
          </div>
        ) : (
          <BarChart
            h={300}
            data={chartData}
            dataKey="name" // Trục X hiển thị tên ngành hàng
            series={[{ name: 'Doanh thu', color: 'blue.5' }]} // Màu cột mặc định
            valueFormatter={(value) => formatCompactNumber(value)}
            tickLine="y"
            gridAxis="xy"
            withTooltip
            tooltipProps={{
              content: ({ payload }) => {
                if (!payload?.length) return null;
                const item = payload[0];
                return (
                  <div className="bg-white shadow-lg border border-gray-100 px-4 py-2 rounded-lg text-sm">
                    <p className="font-semibold text-gray-800">{item.payload.name}</p>
                    <p className="text-pos-blue-500 font-semibold">
                      Doanh thu: {formatCurrency(item.value)}
                    </p>
                  </div>
                );
              },
            }}
          />
        )}
      </div>
    </>
  );
}
