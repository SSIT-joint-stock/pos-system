"use client";
import React, { useState, useRef } from "react";
import {
  ProductFilter,
  CartDetails,
  SalesProducts,
} from "@repo/design-system/components/shared/dashboard-screen";
import { MoveHorizontal } from "lucide-react";

export  function SalesView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rightWidth, setRightWidth] = useState(50); // default 30% width for left

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const startWidth = rightWidth;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = startX - e.clientX;
      const newWidth = (((startWidth / 100) * containerWidth + deltaX) / containerWidth) * 100;
      if (newWidth > 10 && newWidth < 90) {
        setRightWidth(newWidth);
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex gap-0">
      {/* Left panel */}
      <div
        className=" flex flex-1 h-full bg-white border border-gray-300 rounded-2xl overflow-auto"
        // style={{ width: `${leftWidth}%` }}
      >
        <CartDetails />
      </div>

      {/* Divider */}
      <div
        className="w-6 flex items-center justify-center cursor-col-resize touch-none "
        onPointerDown={handlePointerDown}
      >
        <MoveHorizontal className="w-4" />
      </div>

      {/* Right panel */}
      <div
        style={{ width: `${rightWidth}%` }}
        className="flex flex-col h-[100%] gap-5 p-5 bg-white border border-gray-300 rounded-2xl "
      >
        <ProductFilter />
        <SalesProducts />
      </div>
    </div>
  );
}
