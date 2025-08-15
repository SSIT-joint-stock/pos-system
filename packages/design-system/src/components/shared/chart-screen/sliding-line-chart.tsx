import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { ChartPoint } from "./line-chart";

export default function SlidingTabs({ setState }: { setState: (state: ChartPoint[]) => void }) {
  const data2 = [
    {
      date: "Mar 22",
      Apples: 110,
    },
    {
      date: "Mar 23",
      Apples: 60,
    },
    {
      date: "Mar 24",
      Apples: 80,
    },
    {
      date: "Mar 25",
      Apples: 0,
    },
    {
      date: "Mar 26",
      Apples: null,
    },
    {
      date: "Mar 27",
      Apples: 40,
    },
    {
      date: "Mar 28",
      Apples: 120,
    },
    {
      date: "Mar 29",
      Apples: 80,
    },
  ];

  const data1 = [
    { date: "Mar 22", Apples: 90 },
    { date: "Mar 23", Apples: 50 },
    { date: "Mar 24", Apples: 70 },
    { date: "Mar 25", Apples: 0 },
    { date: "Mar 26", Apples: 30 },
    { date: "Mar 27", Apples: 60 },
    { date: "Mar 28", Apples: 100 },
    { date: "Mar 29", Apples: 75 },
  ];

  const data3 = [
    { date: "Mar 22", Apples: 130 },
    { date: "Mar 23", Apples: 80 },
    { date: "Mar 24", Apples: 95 },
    { date: "Mar 25", Apples: 50 },
    { date: "Mar 26", Apples: 0 },
    { date: "Mar 27", Apples: 70 },
    { date: "Mar 28", Apples: 110 },
    { date: "Mar 29", Apples: 85 },
  ];
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabs = [
    { name: "Ngày", data: data1 },
    { name: "Tuần", data: data2 },
    { name: "Tháng", data: data3 },
  ];
  // Cập nhật vị trí/size indicator
  const moveIndicator = () => {
    const btn = containerRef.current?.querySelectorAll<HTMLButtonElement>("button")[active];
    if (btn && indicatorRef.current) {
      indicatorRef.current.style.width = `${btn.offsetWidth}px`;
      indicatorRef.current.style.transform = `translateX(${btn.offsetLeft - 3}px)`;
    }
  };

  useLayoutEffect(() => {
    moveIndicator();
    window.addEventListener("resize", moveIndicator);
    return () => window.removeEventListener("resize", moveIndicator);
  }, [active]);

  useEffect(() => {
    setState(data1);
  }, []);

  return (
    <div ref={containerRef} className="relative flex w-fit  rounded-lg p-1 overflow-x-auto">
      {/* Indicator */}
      <div
        ref={indicatorRef}
        className="absolute top-1 bottom-1 bg-gray-100 rounded-md  shadow transition-all duration-300"
      />
      {/* Tabs */}
      {tabs.map((item, i) => (
        <button
          key={item.name}
          onClick={() => {
            setActive(i);
            setState(item.data);
          }}
          className={`relative z-10 px-5 py-1 text-center text-xs font-medium whitespace-nowrap ${
            active === i ? "text-pos-blue-400" : "text-pos-blue-400"
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
