import { DonutChart as MantinePieChart } from '@mantine/charts';
import React, { useEffect, useRef, useState } from 'react';
import { formatCurrency, getColorFromName } from '../../../../../../apps/web/main/src/utils';
import SlidingTabs from './sliding-line-chart';
export interface PieChartProps {
  categories: {
    name: string;
    value: number;
  }[];
  total: number;
}
export function PieChart({
  data,
  onChangeTypeTime,
  keyChart,
}: {
  data: PieChartProps | null;
  onChangeTypeTime: (key: string, type: 'day' | 'week' | 'month') => void;
  keyChart: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartData =
    data?.categories.map((item) => {
      return {
        name: item.name,
        value: Math.max(item.value, 10000),
        color: getColorFromName(item.name),
        rawValue: item.value,
      };
    }) || [];
  const [size, setSize] = useState(500);
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      // eslint-disable-next-line prefer-const
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setSize(width / 2);
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {}, [size]);
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h2 className="font-semibold text-2xl  ">Doanh Thu Theo Ngành Hàng </h2>

        <SlidingTabs onChangeTypeTime={(type) => onChangeTypeTime(keyChart, type)} />
      </div>
      <div className={'w-full h-full'}>
        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-2xl font-bold">Chưa có dữ liệu</p>
          </div>
        ) : (
          <div className="grid grid-cols-[0.8fr_1fr] gap-4 justify-between mt-6">
            <div className="flex flex-wrap scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-amber-100/0 w-fit h-fit gap-3 overflow-y-scroll">
              {chartData?.map((item, idx) => (
                <div
                  key={idx}
                  className=" flex gap-3 items-center w-fit h-fit bg-zinc-100 px-2 font-bold py-1 rounded-md shadow-xs "
                >
                  <div className={` w-4 h-4 `} style={{ backgroundColor: item.color }} />
                  <p className="truncate text-sm">{`${item.name} - ${formatCurrency(item.value)} `}</p>
                </div>
              ))}
            </div>

            <div ref={containerRef} className="flex items-center justify-center">
              <>
                <MantinePieChart
                  h={300}
                  w={500}
                  size={260}
                  data={chartData || []}
                  withLabels
                  tooltipAnimationDuration={200}
                  tooltipProps={{
                    content: ({ payload }) => {
                      if (!payload?.length) return null;
                      const item = payload[0];

                      return (
                        <div className="bg-white shadow-lg border border-gray-100 px-4.5 py-3.5 rounded-xl text-sm">
                          <p className="text-gray-800 font-semibold mb-1 flex items-center gap-1">
                            <span>Ngành hàng: </span>{' '}
                            <span className="text-pos-blue-600">{item.name}</span>
                          </p>
                          <p className="text-gray-500">
                            Doanh thu:{' '}
                            <span className="text-pos-blue-600 font-bold">
                              {formatCurrency(item.value)}
                            </span>
                          </p>
                        </div>
                      );
                    },
                  }}
                  labelsType="value"
                  withTooltip
                  tooltipDataSource="segment"
                  thickness={30}
                />
              </>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
