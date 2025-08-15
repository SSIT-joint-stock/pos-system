"use client";
import { DonutChart as MantinePieChart } from "@mantine/charts";
import React, { useEffect, useRef, useState } from "react";

export function PieChart() {
  // const pieChartColors = [
  //   "#FF6384", // pink/red
  //   "#36A2EB", // blue
  //   "#FFCE56", // yellow
  //   "#4BC0C0", // teal
  //   "#9966FF", // purple
  //   "#FF9F40", // orange
  //   "#E57373", // light red
  //   "#64B5F6", // light blue
  //   "#81C784", // green
  //   "#BA68C8", // violet
  //   "#FFD54F", // amber
  //   "#4DD0E1", // cyan
  //   "#F06292", // pink
  //   "#9575CD", // indigo
  //   "#AED581", // light green
  //   "#7986CB", // muted blue
  //   "#FF8A65", // coral
  //   "#A1887F", // brown/stone
  //   "#90A4AE", // slate
  //   "#DCE775", // lime
  // ];
  // const data = [
  //   { name: "USA", value: 400 },
  //   { name: "India", value: 300 },
  //   { name: "Japan", value: 100 },
  //   { name: "Other", value: 200 },
  //   { name: "Yapo", value: 200 },
  //   { name: "Brazil", value: 350 },
  //   { name: "Germany", value: 250 },
  //   { name: "France", value: 180 },
  //   { name: "Canada", value: 220 },
  //   { name: "Mexico", value: 150 },
  //   { name: "Russia", value: 280 },
  //   { name: "Australia", value: 190 },
  //   { name: "Italy", value: 170 },
  //   { name: "South Korea", value: 210 },
  //   { name: "Spain", value: 160 },
  //   { name: "UK", value: 300 },
  //   { name: "South Africa", value: 140 },
  //   { name: "Argentina", value: 130 },
  //   { name: "Egypt", value: 120 },
  //   { name: "Vietnam", value: 200 },
  // ];
  // const total = data.reduce((sum, item) => (sum += item.value), 0);
  // const dataWithColor = data.map((item, idx) => {
  //   return {
  //     ...item,
  //     color: pieChartColors[idx],
  //   };
  // });

  // const containerRef = useRef<HTMLDivElement>(null);
  // const [size, setSize] = useState(200);

  // useEffect(() => {
  //   if (!containerRef.current) return;

  //   const observer = new ResizeObserver((entries) => {
  //     // eslint-disable-next-line prefer-const
  //     for (let entry of entries) {
  //       const { width } = entry.contentRect;
  //       setSize(width / 4);
  //     }
  //   });

  //   observer.observe(containerRef.current);

  //   return () => observer.disconnect();
  // }, []);

  // return (
  //   <div ref={containerRef} className="bg-white  flex w-full h-[300px] px-5 py-3 items-center gap-30 rounded-sm">
  //     <div className="flex gap-5 flex-col w-fit h-full ">
  //       <h2 className="font-bold text-2xl mb-3 ">Sale by catagory</h2>
  //       <div className="flex flex-wrap scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-amber-100/0 max-w-[300px] max-h-[200px] gap-3 overflow-y-scroll">
  //         {dataWithColor.map((item, idx) => (
  //           <div
  //             key={idx}
  //             className=" flex gap-3 items-center w-fit h-fit bg-zinc-100 px-2 font-bold py-1 rounded-md shadow-xs "
  //           >
  //             <div className={` w-4 h-4 `} style={{ backgroundColor: item.color }} />
  //             <p className="truncate text-sm">{`${item.name} - ${((item.value * 100) / total).toFixed(0)} %`}</p>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     <DonutChart
  //       size={size}
  //       withLabelsLine={false}
  //       thickness={50}
  //       tooltipDataSource="segment"
  //       withLabels
  //       data={dataWithColor}
  //     />
  //   </div>
  // );
  const data = [
    { name: "USA", value: 400, color: "indigo.6" },
    { name: "India", value: 300, color: "yellow.6" },
    { name: "Japan", value: 300, color: "teal.6" },
    { name: "Other", value: 200, color: "gray.6" },
  ];
  return <MantinePieChart withLabelsLine={false} withLabels data={data} size={200} h={200}  />;
}
