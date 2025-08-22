import React from "react";
const notification = [
  {
    title: "600 thùng Cocacola đã được nhập duawoifjvoiajwoihfiuhwaiuhduiahiushdihawuhd",

    time: 5,
  },
];
export default function ItemNoti() {
  return notification.map((item, idx) => (
    <div key={idx} className="   p-2 ">
      <div className="relative flex items-center gap-4">
        <div className="w-1 h-16 absolute left-2 bg-pos-blue-500 z-100" />
        <div className=" flex items-center gap-2">
          <span className="w-5 h-5 bg-pos-blue-500 rounded-full"></span>
        </div>
        <div className="w-[80%] ">
          <p className="text-gray-800 font-medium line-clamp-[1]">{item.title}</p>
          <p className="text-gray-400 text-sm">{item.time} phút trước</p>
        </div>
      </div>
    </div>
  ));
}
