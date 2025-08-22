"use client";
import { ItemBoxChart, LineChart, PieChart } from "@repo/design-system/components/shared/chart-screen";
import ItemNoti from "@repo/design-system/components/shared/chart-screen/item-noti";
import { Wallet, PiggyBank, CloudDownload, HandCoins, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export function DashboardView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  return (
    <div ref={containerRef} className="flex h-full w-full gap-5 flex-col">
      <div className="flex gap-5  w-full overflow-x-auto max-h-fit pb-[2px] scrollbar-none">
        <ItemBoxChart title="Doanh Thu Hôm Nay" reveneu={500000000} percent={55} icon={<Wallet />} />
        <ItemBoxChart title="Tiền Nhập Hàng Tháng Này" reveneu={900000000} percent={36} icon={<CloudDownload />} />
        <ItemBoxChart title="Tổng Tiền Lãi Tháng Này" reveneu={30102005} percent={10} icon={<HandCoins />} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" reveneu={500000000000} percent={5} icon={<PiggyBank />} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" reveneu={500000000000} percent={5} icon={<PiggyBank />} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" reveneu={500000000000} percent={5} icon={<PiggyBank />} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" reveneu={500000000000} percent={5} icon={<PiggyBank />} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" reveneu={500000000000} percent={5} icon={<PiggyBank />} />
        <div className="flex items-center justify-center  hover:bg-white transition-all duration-300 border-2 border-dashed border-pos-blue-500 bg-pos-blue-100 rounded-2xl">
          <Plus className=" text-pos-blue-500 w-[250px] h-[36] text-center" strokeWidth={2} />
        </div>
      </div>
      <div className="flex w-full justify-between h-full">
        <div className="w-[75%]  bg-white rounded-xl shadow-md py-3 px-1">
          <LineChart />
        </div>

        <div className="w-[23%] bg-white  rounded-2xl shadow-md  p-5 ">
          <h2 className="text-xl font-semibold ">Thông Báo</h2>

          <div className="mt-3">
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex justify-between">
        <div className="w-[75%] h-full shadow-xl rounded-2xl">
          <PieChart />
        </div>
        <div className="w-[23%]   flex flex-col justify-between gap-2 ">
          <ItemBoxChart title="Doanh Thu Hôm Nay" reveneu={500000000} percent={55} icon={<Wallet />} />
          <ItemBoxChart title="Tổng Tiền Lãi Tháng Này" reveneu={30102005} percent={10} icon={<HandCoins />} />
          <ItemBoxChart title="Tiền Nhập Hàng Tháng Này" reveneu={900000000} percent={36} icon={<CloudDownload />} />
        </div>
      </div>
    </div>
  );
}
