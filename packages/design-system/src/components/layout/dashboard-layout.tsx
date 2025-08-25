"use client";
import React, { useState } from "react";
import { SideBar } from "../shared/dashboard-screen";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <div className=" flex">
      <aside className="sticky top-0 h-screen">
        <SideBar isExpand={isExpand} setIsExpand={setIsExpand} />
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50 ">{children}</main>{" "}
    </div>
  );
}
