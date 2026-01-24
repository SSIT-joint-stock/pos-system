import { LineChart as MantineLineChart } from '@mantine/charts';
import { formatCompactNumber, formatCurrency } from '../../../../../../apps/web/main/src/utils';
import SlidingTabs from './sliding-line-chart';

export type ChartPoint = {
  type: string;
  data: { key: string; value: number }[];
};
export function LineChart({
  keyChart,
  data,
  onChangeTypeTime,
}: {
  keyChart: string;
  data: ChartPoint | null;
  onChangeTypeTime: (key: string, type: 'day' | 'week' | 'month') => void;
}) {
  const formattedData = data?.data?.map((item) => ({
    date: item.key,
    value: item.value,
  }));

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-2xl font-bold">Doanh thu bán hàng</p>
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

      <MantineLineChart
        h={300}
        data={formattedData || []}
        dataKey="date"
        series={[
          {
            name: 'value',
            color: '#2563eb',
            label: 'Doanh thu (VNĐ)',
          },
        ]}
        curveType="bump"
        connectNulls
        valueFormatter={(value) => formatCompactNumber(value)}
        tooltipAnimationDuration={200}
        tooltipProps={{
          content: ({ label, payload }) => {
            if (!payload?.length) return null;
            const item = payload[0];
            return (
              <div className="bg-white shadow-lg border border-gray-100 px-4.5 py-3.5 rounded-xl text-sm overflow-scroll">
                <p className="text-gray-800 font-semibold mb-1 flex items-center gap-1">
                  <span>Thời gian: </span> <span className="text-pos-blue-600">{label}</span>
                </p>
                <p className="text-gray-500 font-semibold">
                  Doanh thu:{' '}
                  <span className="text-pos-blue-600 font-bold">{formatCurrency(item.value)}</span>
                </p>
              </div>
            );
          },
        }}
      />
    </>
  );
}
