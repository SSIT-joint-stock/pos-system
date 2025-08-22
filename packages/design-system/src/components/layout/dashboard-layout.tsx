"use client";
import React, { useState } from "react";
import { SideBar } from "../shared/dashboard-screen";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isExpand, setIsExpand] = useState(false  );

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <aside className="flex-shrink-0 ">
        <SideBar isExpand={isExpand} setIsExpand={setIsExpand} />
      </aside>

      <main className="flex-1 p-4 overflow-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-transparent ">
        {children}
      </main>
    </div>
  );
}
