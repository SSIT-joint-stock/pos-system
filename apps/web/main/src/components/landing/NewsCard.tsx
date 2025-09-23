// app/components/NewsCards.tsx
export default function NewsCards() {
  const posts = [
    {
      href: "#",
      date: "15 Tháng 8, 2025",
      title: "#1 Phần Mềm Quản Lý Kho EraPOS: Đa Tính Năng, Giá Rẻ, Dễ Dùng",
      excerpt:
        "Phần mềm quản lý kho EraPOS là chìa khóa giúp doanh nghiệp giảm thất thoát, tối ưu hàng tồn và vận hành hiệu quả…",
    },
    {
      href: "#",
      date: "15 Tháng 8, 2025",
      title: "Hướng Dẫn Quản Lý Đơn Hàng Bằng Google Sheet (Tải File Miễn Phí)",
      excerpt:
        "Quản lý đơn hàng bằng Google Sheet được nhiều người sử dụng để tiết kiệm chi phí, phù hợp cho cá nhân và nhóm nhỏ…",
    },
    {
      href: "#",
      date: "14 Tháng 8, 2025",
      title:
        "Quy Trình Quản Lý Kho Theo ISO: Chuyên Nghiệp, Hiệu Quả, Bền Vững",
      excerpt:
        "Quy trình theo ISO là bước nền tảng giúp doanh nghiệp tổ chức kho hàng chuyên nghiệp, hiệu quả và dễ mở rộng…",
    },
    {
      href: "#",
      date: "14 Tháng 8, 2025",
      title:
        "Quy Trình Quản Lý Kho Theo ISO: Chuyên Nghiệp, Hiệu Quả, Bền Vững",
      excerpt:
        "Quy trình theo ISO là bước nền tảng giúp doanh nghiệp tổ chức kho hàng chuyên nghiệp, hiệu quả và dễ mở rộng…",
    },
    {
      href: "#",
      date: "14 Tháng 8, 2025",
      title:
        "Quy Trình Quản Lý Kho Theo ISO: Chuyên Nghiệp, Hiệu Quả, Bền Vững",
      excerpt:
        "Quy trình theo ISO là bước nền tảng giúp doanh nghiệp tổ chức kho hàng chuyên nghiệp, hiệu quả và dễ mở rộng…",
    },
    {
      href: "#",
      date: "14 Tháng 8, 2025",
      title:
        "Quy Trình Quản Lý Kho Theo ISO: Chuyên Nghiệp, Hiệu Quả, Bền Vững",
      excerpt:
        "Quy trình theo ISO là bước nền tảng giúp doanh nghiệp tổ chức kho hàng chuyên nghiệp, hiệu quả và dễ mở rộng…",
    },
  ];

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <a
          key={i}
          href={p.href}
          aria-label={p.title}
          className="group block h-full min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg
                     overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          {/* Image placeholder */}
          <div className="relative overflow-hidden rounded-t-2xl bg-gray-200">
            <div className="aspect-[16/9] w-full" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 16l5-5 4 4 5-6 4 5" />
              </svg>
            </div>
          </div>

          {/* Body */}
          <div className="flex min-w-0 flex-col p-4 sm:p-5">
            {/* Date */}
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 min-w-0">
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span className="min-w-0 break-words [overflow-wrap:anywhere] [word-break:break-word]">
                {p.date}
              </span>
            </div>

            {/* Title */}
            <h3
              className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-600
                           break-words [overflow-wrap:anywhere] [word-break:break-word] hyphens-auto [text-wrap:balance]"
            >
              {p.title}
            </h3>

            {/* Excerpt */}
            <p className="flex-1 line-clamp-2 text-gray-600 break-words [overflow-wrap:anywhere] [word-break:break-word] hyphens-auto">
              {p.excerpt}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
