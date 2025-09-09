// app/components/ConsultForm.tsx
export default function ConsultForm() {
  return (
    <section
      id="contact"
      className="relative w-full h-screen flex items-center justify-center flex-col  snap-always snap-center scroll-mt-12"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(6,35,110,1), rgba(28,83,214,0.95), rgba(255,255,255,0))',
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-12 lg:px-8">
        {/* LEFT: Form card (moved first) */}
        <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 sm:p-6 md:p-7 lg:p-8">
          <h3 className="text-center text-base font-semibold tracking-wide text-[#0D2A5C]">
            ĐĂNG KÝ NHẬN TƯ VẤN VÀ DÙNG THỬ
          </h3>

          <form className="mt-5 space-y-4">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Họ và tên *"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none ring-blue-500/20 placeholder:text-gray-400 focus:ring-4"
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email *"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none ring-blue-500/20 placeholder:text-gray-400 focus:ring-4"
              />
            </div>
            <div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Số điện thoại *"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none ring-blue-500/20 placeholder:text-gray-400 focus:ring-4"
              />
            </div>
            <div>
              <input
                id="tax"
                name="tax"
                type="text"
                placeholder="Mã số thuế *"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none ring-blue-500/20 placeholder:text-gray-400 focus:ring-4"
              />
            </div>
            <div>
              <input
                id="product"
                name="product"
                type="text"
                placeholder="Sản phẩm quan tâm *"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none ring-blue-500/20 placeholder:text-gray-400 focus:ring-4"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
            >
              Nhận tư vấn ngay!
            </button>
          </form>
        </div>

        {/* RIGHT: Title + bullets */}
        <div className="text-white">
          <h2 className="text-center lg:text-left text-3xl md:text-4xl font-extrabold tracking-tight">
            ĐĂNG KÝ NHẬN TƯ VẤN VÀ <br className="hidden md:block" />
            DÙNG THỬ MIỄN PHÍ
          </h2>

          <ul className="mt-8 space-y-4 text-base/relaxed md:text-lg">
            {[
              'Giá cả hợp lý chỉ từ 70K/tháng',
              'Đa dạng tính năng quản lý bán hàng',
              'Tích hợp hoá đơn khởi tạo từ máy tính tiền',
              'Giao diện trực quan, dễ dàng sử dụng',
              'Theo dõi tình hình kinh doanh từ xa qua điện thoại',
              'Tiết kiệm thời gian, công sức',
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0L3.293 9.957a1 1 0 0 1 1.414-1.414l3.043 3.043 6.543-6.543a1 1 0 0 1 1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
