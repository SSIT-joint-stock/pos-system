"use client";

import { useState } from "react";

const items = [
  {
    question: "Phần mềm bán hàng EraPOS phù hợp với mô hình kinh doanh nào?",
    answer:
      "Dù bạn kinh doanh cửa hàng tạp hoá, shop thời trang, quán ăn hay chuỗi siêu thị mini, EraPOS đều đáp ứng tốt. Phần mềm linh hoạt cho cá nhân, hộ kinh doanh nhỏ lẻ lẫn doanh nghiệp quy mô vừa và lớn.",
  },
  {
    question: "Có bắt buộc phải xuất hoá đơn điện tử từ máy tính tiền không?",
    answer:
      "Không bắt buộc cho mọi trường hợp. Tuy nhiên, EraPOS hỗ trợ hoá đơn điện tử đạt chuẩn, kết nối nhanh với nhà cung cấp và máy in hoá đơn.",
  },
  {
    question: "Sử dụng EraPOS mang lại lợi ích gì?",
    answer:
      "Quản lý bán hàng, kho, khách hàng, khuyến mãi; báo cáo doanh thu theo thời gian thực; đồng bộ đa thiết bị; giảm sai sót vận hành.",
  },
  {
    question: "Phần mềm quản lý bán hàng EraPOS có dễ dùng không?",
    answer:
      "Giao diện trực quan, bước thiết lập nhanh; có hướng dẫn và hỗ trợ kỹ thuật tiếng Việt.",
  },
  {
    question: "Giá phần mềm quản lý bán hàng EraPOS đắt không?",
    answer:
      "Nhiều gói phù hợp ngân sách từ cá nhân đến doanh nghiệp; có bản dùng thử miễn phí.",
  },
  {
    question: "EraPOS có tích hợp được với các thiết bị bán hàng khác không?",
    answer:
      "Hỗ trợ máy in hoá đơn, máy quét mã vạch, ngăn kéo đựng tiền, cân điện tử… Kết nối USB, LAN tuỳ thiết bị.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="support"
      className="bg-white md:h-screen h-auto md:snap-always md:snap-center
                 flex items-center justify-center flex-col
                 scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-12 py-12 md:py-0"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold">
          Câu hỏi thường gặp về phần mềm quản lý bán hàng EraPOS
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Nếu bạn vẫn còn băn khoăn hoặc muốn nhận tư vấn theo nhu cầu cụ thể,
          đừng ngần ngại liên hệ ngay với chúng tôi để được hỗ trợ tốt nhất.
        </p>

        <div className="mt-8 space-y-4">
          {items.map((it, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            return (
              <div
                key={i}
                className={
                  "rounded-xl shadow-sm border transition-colors overflow-hidden " +
                  (isOpen
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 border-gray-200")
                }
              >
                {/* Header */}
                <button
                  className={
                    "flex w-full items-center justify-between gap-4 px-5 py-4 text-left rounded-xl focus:outline-none " +
                    (isOpen ? "text-white" : "text-gray-900") +
                    " focus-visible:ring-2 focus-visible:ring-blue-400"
                  }
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span className="font-semibold">{it.question}</span>

                  <svg
                    className={
                      "h-5 w-5 shrink-0 transition-transform " +
                      (isOpen ? "rotate-180 text-white" : "text-gray-500")
                    }
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Animated panel */}
                <div
                  id={panelId}
                  className={
                    "grid transition-[grid-template-rows] duration-300 ease-out " +
                    (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                  }
                >
                  <div className="min-h-0 overflow-hidden px-5 pb-5">
                    <div
                      className={
                        "rounded-lg " +
                        (isOpen
                          ? "bg-white/95 text-gray-700"
                          : "bg-gray-50 text-gray-600")
                      }
                    >
                      <p className="p-4 leading-relaxed">{it.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
