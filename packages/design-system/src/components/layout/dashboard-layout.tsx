"use client";
import React, { useState } from "react";
import { SideBar } from "../shared/dashboard-screen";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpand, setIsExpand] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex-shrink-0 ">
        <SideBar isExpand={isExpand} setIsExpand={setIsExpand} />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white z-10 border border-gray-100 p-4">
          <header>LOGO</header>
        </header>

        <main className="flex-1 p-4 overflow-y-auto bg-gray-50  scrollbar-thin scrollbar-thumb-gray-50 scrollbar-track-transparent">{children}</main>
      </div>
    </div>
  );
}
