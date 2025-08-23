import React from "react";
const notification = [
  {
    title: "600 thùng Cocacola đã được nhập duawoifjvoiajwoihfiuhwaiuhduiahiushdihawuhd",

    time: 5,
  },
];
export default function ItemNoti({ isFirst = false, isLast = false }: { isFirst?: boolean; isLast?: boolean }) {
  return notification.map((item, idx) => (
    <div key={idx} className="   p-2 ">
      <div className="relative flex items-center gap-4">
        <div
          className={`w-[3px] ${!isFirst && !isLast ? `h-16 top-0` : ""} ${isFirst && !isLast ? `h-8 top-8` : ""} ${isLast && !isFirst ? `h-8 bottom-8` : ""}  absolute left-[7px] bg-pos-blue-500 z-100`}
        />
        <div className=" flex items-center gap-2 z-200">
          <div className="w-[17px] h-[17px] bg-white rounded-full border-3 border-pos-blue-500"></div>
        </div>
        <div className="w-[80%] ">
          <p className="text-gray-800 font-medium line-clamp-[1]">{item.title}</p>
          <p className="text-gray-400 text-sm">{item.time} phút trước</p>
        </div>
      </div>
    </div>
  ));
}
