import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="relative isolate h-screen w-full overflow-hidden flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(to top, rgba(6,35,110,1), rgba(28,83,214,0.98), rgba(255,255,255,0))",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          {/* LEFT: Product image */}
          <div className="flex justify-center">
            <Image
              className="h- w-"
              alt="POS devices"
              src="/hero.png"
              height={1000}
              width={1000}
              priority
            />
          </div>

          {/* RIGHT: Text content */}
          <div className="text-white md:pl-6">
            <h1 className="mb-3 text-4xl font-extrabold leading-tight md:text-5xl">
              EraPOS — PHẦN MỀM QUẢN LÝ BÁN HÀNG CHUYÊN NGHIỆP
            </h1>
            <p className="mb-6 max-w-xl text-base/relaxed md:text-lg">
              TÍCH HỢP HÓA ĐƠN ĐIỆN TỬ KHỞI TẠO TỪ MÁY TÍNH TIỀN
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition
                           bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-xl hover:brightness-110"
              >
                Dùng thử miễn phí
              </a>
              <a
                href="#"
                className="inline-flex rounded-full border-2 border-white/90 px-5 py-3 text-sm font-bold text-white
                           hover:bg-white/10 transition"
              >
                Tư vấn miễn phí
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
