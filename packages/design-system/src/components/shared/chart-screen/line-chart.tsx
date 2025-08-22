import React, { useEffect, useRef, useState } from "react";
import { LineChart as MantineLineChart } from "@mantine/charts";
import SlidingIndicator from "./sliding-line-chart";

export type ChartPoint = {
  date: string;
  Apples: number;
};
export function LineChart() {
  const dataDefault = [
    { date: "Mar 22", Apples: 0 },
    { date: "Mar 23", Apples: 0 },
    { date: "Mar 24", Apples: 0 },
    { date: "Mar 25", Apples: 0 },
    { date: "Mar 26", Apples: 0 },
    { date: "Mar 27", Apples: 0 },
    { date: "Mar 28", Apples: 0 },
    { date: "Mar 29", Apples: 0 },
  ];

  const [chartData, setChartData] = useState<ChartPoint[]>(dataDefault);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 1000 });
  const maxApples = Math.max(...chartData.map((item) => item.Apples));
  // Cộng thêm 10%
  const maxWith10Percent = Math.round(maxApples * 1.1);
  const yProps = { domain: [0, maxWith10Percent] };
  console.log(yProps);
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      // eslint-disable-next-line prefer-const
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width: width - 20, height: height * 0.8 });
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full  pt-20">
      <div className="z-50 top-5 left-5 absolute w-full flex ">
        <p className="text-2xl font-bold">Doanh Thu </p>
      </div>
      <div className="z-50 top-5 right-5 absolute w-full flex justify-end ">
        <SlidingIndicator setState={setChartData} />
      </div>
      <MantineLineChart
        h={size.height}
        w={size.width}
        xAxisProps={{ padding: { left: 30, right: 30 } }}
        data={chartData}
        dataKey="date"
        series={[{ name: "Apples", color: "#64B5F6" }]}
        yAxisProps={yProps}
        curveType="bump"
        connectNulls
      />
    </div>
  );
}
