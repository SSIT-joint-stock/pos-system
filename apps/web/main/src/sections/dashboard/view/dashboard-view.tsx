"use client";
import { ItemBoxChart, LineChart, PieChart } from "@repo/design-system/components/shared/chart-screen";
import { Wallet, PiggyBank, CloudDownload, HandCoins, ShoppingBag, TrendingUp, Award } from "lucide-react";
import React from "react";

const topProducts = [
  { name: "Bánh quy bơ", orders: 1200, icon: <ShoppingBag className="text-blue-500" size={20} /> },
  { name: "Sữa tươi Vinamilk", orders: 950, icon: <ShoppingBag className="text-green-500" size={20} /> },
  { name: "Mì gói Hảo Hảo", orders: 870, icon: <ShoppingBag className="text-orange-500" size={20} /> },
  { name: "Nước ngọt Coca-Cola", orders: 820, icon: <ShoppingBag className="text-red-500" size={20} /> },
  { name: "Gạo ST25", orders: 790, icon: <ShoppingBag className="text-yellow-500" size={20} /> },
  { name: "Dầu ăn Neptune", orders: 760, icon: <ShoppingBag className="text-purple-500" size={20} /> },
  { name: "Bánh mì tươi", orders: 700, icon: <ShoppingBag className="text-pink-500" size={20} /> },
];
export function DashboardView() {
  return (
    <div className="h-full ">
      <div className="grid grid-cols-4 gap-5 ">
        <ItemBoxChart title="Doanh Thu Hôm Nay" reveneu={500000000} percent={55} icon={<Wallet />} />
        <ItemBoxChart title="Tiền Nhập Hàng Tháng Này" reveneu={900000000} percent={36} icon={<CloudDownload />} />
        <ItemBoxChart title="Tổng Tiền Lãi Tháng Này" reveneu={30102005} percent={10} icon={<HandCoins />} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" reveneu={500000000000} percent={5} icon={<PiggyBank />} />
      </div>
      <div className="flex items-center gap-4  mt-5   h-[75%]">
        <div className="w-[74.5%] h-full bg-white rounded-xl drop-shadow-md py-3 px-1">
          <LineChart />
        </div>
      </div>

      {/* <div className="w-full h-full"> */}
      <PieChart />
      {/* </div> */}
    </div>
  );
}
