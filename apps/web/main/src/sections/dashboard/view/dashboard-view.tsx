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
        <ItemBoxChart title="Doanh Thu Hôm Nay" reveneu={"500.000.000d"} percent={"55"} icon={<Wallet />} />
        <ItemBoxChart
          title="Tiền Nhập Hàng Tháng Này"
          reveneu={"900.000.000d"}
          percent={"36"}
          icon={<CloudDownload />}
        />
        <ItemBoxChart title="Tổng Tiền Lãi Tháng Này" reveneu={"30.102.005"} percent={"10"} icon={<HandCoins />} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" reveneu={"500.000.000.000d"} percent={"5"} icon={<PiggyBank />} />
      </div>
      <div className="flex items-center gap-4 py-3 px-1mt-4 h-[75%]">
        <div className="w-[74.5%] h-full bg-white rounded-md drop-shadow-md">
          <LineChart />
        </div>
        <div className="w-[24%] ml-1.5 h-full drop-shadow-md">
          {/* Tiêu đề */}
          <div className="w-[98%] h-full bg-white rounded-b-md overflow-y-auto scrollbar-thin scrollbar-thumb-blue-50 scrollbar-track-transparent">
            <div className=" bg-pos-blue-400 text-white text-center py-3 rounded-t-md ">
              <h2 className="font-bold text-lg flex justify-center items-center gap-2">
                <TrendingUp size={20} /> Top 7 Sản Phẩm Bán Chạy
              </h2>
            </div>

            {/* Danh sách */}
            <div className=" flex flex-col gap-3  rounded-b-md p-4 ">
              {topProducts.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 hover:bg-blue-50 transition-all duration-300 p-3 rounded-lg shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && <Award className="text-yellow-400" size={20} />}
                    {index === 1 && <Award className="text-gray-400" size={20} />}
                    {index === 2 && <Award className="text-orange-500" size={20} />}
                    {index > 2 && item.icon}
                    <span className="font-medium text-sm truncate whitespace-nowrap overflow-hidden max-w-[120px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-gray-600 font-semibold text-xs">{item.orders.toLocaleString()} đơn</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PieChart />
    </div>
  );
}
