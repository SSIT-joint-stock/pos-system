import { DonutChart as MantinePieChart } from "@mantine/charts";
import React, { useEffect, useRef, useState } from "react";

export function PieChart() {
  const pieChartColors = [
    "#FF6384", // pink/red
    "#36A2EB", // blue
    "#FFCE56", // yellow
    "#4BC0C0", // teal
    "#9966FF", // purple
    "#FF9F40", // orange
    "#E57373", // light red
    "#64B5F6", // light blue
    "#81C784", // green
    "#BA68C8", // violet
    "#FFD54F", // amber
    "#4DD0E1", // cyan
    "#F06292", // pink
    "#9575CD", // indigo
    "#AED581", // light green
    "#7986CB", // muted blue
    "#FF8A65", // coral
    "#A1887F", // brown/stone
    "#90A4AE", // slate
    "#DCE775", // lime
  ];
  const data = [
    { name: "Đồ ăn", value: 400 },
    { name: "Đồ uống", value: 300 },
    { name: "Đồ cá nhân và gia dụng", value: 100 },
    { name: "Thực phẩm đông lạnh", value: 200 },
    { name: "Thuốc lá", value: 200 },
    { name: "Khác", value: 160 },
  ];
  const total = data.reduce((sum, item) => (sum += item.value), 0);
  const dataWithColor = data.map((item, idx) => {
    return {
      ...item,
      color: pieChartColors[idx],
    };
  });

  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    console.log(size);
  }, [size]);
  return (
    <>
      <div className="flex gap-10 px-10 py-5 items-center h-full w-full bg-white  rounded-2xl overflow-y-hidden">
        <div className="flex gap-5 flex-col w-full h-full ">
          <h2 className="font-bold text-2xl  ">Doanh Thu Theo Ngành Hàng </h2>
          <div className="flex flex-wrap scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-amber-100/0 max-w-[300px] max-h-[200px] gap-3 overflow-y-scroll">
            {dataWithColor.map((item, idx) => (
              <div
                key={idx}
                className=" flex gap-3 items-center w-fit h-fit bg-zinc-100 px-2 font-bold py-1 rounded-md shadow-xs "
              >
                <div className={` w-4 h-4 `} style={{ backgroundColor: item.color }} />
                <p className="truncate text-sm">{`${item.name} - ${((item.value * 100) / total).toFixed(0)} %`}</p>
              </div>
            ))}
          </div>
        </div>
        <div ref={containerRef} className="h-full w-full flex items-center justify-center">
          <MantinePieChart
            h={size}
            w={size}
            data={dataWithColor}
            withLabels
            labelsType="percent"
            withTooltip
            tooltipDataSource="segment"
            thickness={30}
          />
        </div>
      </div>
    </>
  );
}
