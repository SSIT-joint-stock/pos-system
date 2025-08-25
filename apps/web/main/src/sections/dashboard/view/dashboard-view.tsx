"use client";
import { ItemBoxChart, LineChart, PieChart } from "@repo/design-system/components/shared/chart-screen";
import ItemNoti from "@repo/design-system/components/shared/chart-screen/item-noti";
import { Plus } from "lucide-react";

export function DashboardView() {
  return (
    <div className="flex h-full w-full gap-5 flex-col p-5">
      <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-2  w-full overflow-x-auto min-h-fit">
        <ItemBoxChart title="Doanh Thu Hôm Nay" value={500000000} percent={55} />
        <ItemBoxChart title="Tiền Nhập Hàng Tháng Này" value={900000000} percent={36} />
        <ItemBoxChart title="Tổng Tiền Lãi Tháng Này" value={30102005} percent={10} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <ItemBoxChart title="Tổng Doanh Thu Tháng" value={500000000000} percent={5} />
        <div className="flex items-center justify-center h-full w-full group  hover:bg-white transition-all duration-300 border-2 border-dashed border-pos-blue-500 bg-pos-blue-100 rounded-2xl">
          <Plus
            className=" text-pos-blue-500  text-center group-hover:rotate-90 transition-all duration-200"
            strokeWidth={2}
          />
        </div>
      </div>
      <div className="flex w-full justify-between h-full">
        <div className="w-[75%]  bg-white rounded-xl shadow-md py-3 px-1">
          <LineChart />
        </div>

        <div className="w-[23%] overflow-hidden  bg-white  rounded-2xl shadow-md  p-5 ">
          <h2 className="text-xl font-semibold ">Thông Báo</h2>

          <div className="mt-3 w-full h-full max-h-[300px] overflow-y-scroll pb-5">
            <ItemNoti isFirst={true} />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti />
            <ItemNoti isLast={true} />
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex justify-between">
        <div className="w-[75%] h-full shadow-xl rounded-2xl">
          <PieChart />
        </div>
        <div className="w-[23%]   flex flex-col justify-between gap-2 ">
          <ItemBoxChart title="Doanh Thu Hôm Nay" value={500000000} percent={55} />
          <ItemBoxChart title="Tổng Tiền Lãi Tháng Này" value={30102005} percent={10} />
          <ItemBoxChart title="Tiền Nhập Hàng Tháng Này" value={900000000} percent={36} />
        </div>
      </div>
    </div>
  );
}
