"use client";

import { useState } from "react";
import Image from "next/image";

type Item = { title: string; desc: string; image: string };

const ITEMS: Item[] = [
  {
    title: "Tự động đồng bộ đơn hàng thành hoá đơn",
    desc:
      "Tự động phát hành và chuyển dữ liệu lên cơ quan Thuế theo Thông tư 78. " +
      "Quản lý công nợ, thống kê số tiền, đồng bộ hoá đơn điện tử…",
    image: "/feature-1.jpg",
  },
  {
    title: "Tích hợp xuất hóa đơn điện tử khởi tạo từ máy tính tiền",
    desc: "Xuất hoá đơn khởi tạo từ máy tính tiền theo quy định mới của cơ quan Thuế.",
    image: "/feature-2.jpg",
  },
  {
    title: "Giao diện thân thiện",
    desc: "Thiết kế trực quan, thao tác nhanh, hiển thị tốt trên Mobile/Desktop.",
    image: "/feature-3.png",
  },
  {
    title: "Giao diện thân thiện",
    desc: "Thiết kế trực quan, thao tác nhanh, hiển thị tốt trên Mobile/Desktop.",
    image: "/feature-3.png",
  },
  {
    title: "Giao diện thân thiện",
    desc: "Thiết kế trực quan, thao tác nhanh, hiển thị tốt trên Mobile/Desktop.",
    image: "/feature-3.png",
  },
];

export default function AssistantFeatureSection() {
  const [idx, setIdx] = useState(0);

  return (
    <section
      id="solutions"
      // Desktop keeps full-screen + snap; mobile uses natural height and proper anchor offset
      className="mx-auto max-w-7xl px-4 md:h-screen h-auto md:snap-always md:snap-center
                 md:flex md:flex-col md:items-center md:justify-center
                 scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-12"
    >
      <div className="mx-auto mb-8 sm:mb-10 max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
          EraPOS - trợ thủ đắc lực cho người làm kinh doanh
        </h2>
        <p className="mt-3 text-gray-600">
          Tự động hoá quản lý bán hàng, xử lý đơn nhanh chóng, kiểm soát tồn
          kho, lợi nhuận rõ ràng, khởi tạo hoá đơn từ máy tính tiền.
        </p>
      </div>

      <div className="grid w-full gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Left list */}
        <div className="space-y-3">
          {ITEMS.map((it, i) => {
            const active = i === idx;
            return (
              <button
                key={it.title}
                onClick={() => setIdx(i)}
                className={`w-full rounded-xl p-4 sm:p-5 text-left transition
                   ${active ? "bg-gray-100" : "hover:bg-blue-50"}
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]/50`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-[#1976D2] text-white shrink-0">
                      <span className="text-xs">i</span>
                    </span>
                    <span className="font-medium text-[#0D2A5C] text-sm sm:text-base line-clamp-2">
                      {it.title}
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 20 20"
                    className="h-5 w-5 text-[#1976D2] shrink-0"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7 5l5 5-5 5" />
                  </svg>
                </div>
                {active && (
                  <p className="mt-3 text-sm text-gray-600">{it.desc}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Right image */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 shadow">
            <div className="mb-3 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                key={ITEMS[idx].image}
                src={ITEMS[idx].image}
                alt={ITEMS[idx].title}
                fill
                className="object-contain transition-opacity duration-300"
                sizes="(min-width: 1024px) 640px, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#"
          className="rounded-lg border border-orange-500 px-5 py-3 font-medium text-orange-600 hover:bg-orange-50"
        >
          Dùng thử miễn phí
        </a>
        <a
          href="#"
          className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600"
        >
          Nhận tư vấn
        </a>
      </div>
    </section>
  );
}
