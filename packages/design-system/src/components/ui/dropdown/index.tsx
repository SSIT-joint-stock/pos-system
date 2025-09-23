import { Bolt, Moon } from "lucide-react";
import React from "react";

export default function UserDropDown() {
  return (
    <div className="w-[220px] h-[300px] bg-white rounded-xl shadow-lg p-5 space-y-5 absolute top-15 -right-3 z-50">
      {/* Chỉnh sửa thông tin */}
      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
        <Bolt className="text-blue-500" />
        <p className="text-gray-800 font-medium">Chỉnh sửa thông tin</p>
      </div>

      {/* Chế độ tối */}
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
        <div className="flex items-center gap-3">
          <Moon className="text-gray-700" />
          <p className="text-gray-800 font-medium">Chế độ tối</p>
        </div>

        {/* Toggle Button */}
      </div>
    </div>
  );
}
