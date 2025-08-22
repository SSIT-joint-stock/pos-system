"use client";
import { Autocomplete } from "@mantine/core";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const categories = [
  "Tất cả",
  "Đồ uống",
  "Đồ ăn nhanh",
  "Ăn vặt & Bánh kẹo",
  "Đồ đông lạnh",
  "Thực phẩm",
  "Đồ gia dụng & cá nhân",
  "Khác",
];

export function ProductFilter() {
  return (
    <div className=" flex h-fit gap-5 ">
      <div className="flex flex-col gap-2 w-full h-full ">
        <p className="font-bold text-gray-900">Tìm kiếm sản phẩm</p>
        <Autocomplete
          radius={"0.75rem"}
          size="md"
          placeholder="Nhập SKU, mã vạch hoặc tên sản phẩm"
          leftSection={<Search />}
          rightSection={<X className="hover:text-red-600"></X>}
          data={[
            "Mì Hảo Hảo",
            "Trà Xanh Không Độ",
            "Cà phê G7",
            "Bánh mì",
            "Bánh Chocopie",
            "Sữa TH True Milk",
            "Nước suối La Vie",
            "Kem Merino",
            "Khăn giấy Pulppy",
            "Bánh tráng trộn",
          ]}
          maxDropdownHeight={200}
          comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
        />
        <FloatingTabIndicator />
      </div>
    </div>
  );
}

export default function FloatingTabIndicator() {
  const [active, setActive] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const updateIndicator = useCallback(() => {
    if (tabRefs.current[active] && containerRef.current) {
      const tab = tabRefs.current[active]!;
      const container = containerRef.current;
      const tabRect = tab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setIndicatorStyle({
        width: tabRect.width,
        height: tabRect.height,
        transform: `translateX(${tabRect.left - containerRect.left}px)`,
      });
    }
  }, [active]);

  useEffect(() => {
    updateIndicator();
  }, [active, updateIndicator]);

  // update on window resize
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      updateIndicator();
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [active, containerRef, updateIndicator]);

  return (
    <div className="w-full gap-5 flex items-center  py-3 rounded scrollbar-fixed overflow-auto ">
      <div ref={containerRef} className="relative flex gap-6 px-2 ">
        {/* floating block behind active tab */}
        <span
          className="absolute top-0 left-0 bg-pos-blue-700 rounded-xl transition-all duration-300"
          style={indicatorStyle}
        />

        {categories.map((tab, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            onClick={() => setActive(i)}
            className={`relative px-3 py-2 text-sm font-medium z-10 transition-colors whitespace-nowrap ${
              active === i ? "text-gray-100" : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
