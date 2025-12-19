import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate md:h-screen h-auto w-full overflow-hidden flex md:items-center md:snap-always md:snap-center pt-24 sm:pt-28 md:pt-0 scroll-mt-24 md:scroll-mt-12"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(6,35,110,1) 0%, rgba(28,83,214,0.98) 50%, rgba(28,83,214,0.6) 80%, rgba(255,255,255,0) 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "max(0px, env(safe-area-inset-top))",
      }}
    >
      <div className="relative z-10 mx-auto flex md:min-h-screen min-h-0 max-w-6xl items-center px-4 py-10 sm:py-14 md:py-0 w-full">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          {/* Text first on mobile; remains right on desktop */}
          <div className="text-white md:pl-6 order-1 md:order-2 text-center md:text-left">
            <h1 className="mb-3 text-3xl sm:text-4xl font-extrabold leading-tight md:text-5xl">
              EraPOS — PHẦN MỀM QUẢN LÝ BÁN HÀNG CHUYÊN NGHIỆP
            </h1>
            <p className="mb-6 mx-auto md:mx-0 max-w-xl text-base/relaxed md:text-lg">
              TÍCH HỢP HÓA ĐƠN ĐIỆN TỬ KHỞI TẠO TỪ MÁY TÍNH TIỀN
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/auth/register"
                className="inline-flex rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition
                           bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-xl hover:brightness-110"
              >
                Dùng thử miễn phí
              </Link>
              <a
                href="#contact"
                className="inline-flex rounded-full border-2 border-white/90 px-5 py-3 text-sm font-bold text-white
                           hover:bg-white/10 transition"
              >
                Tư vấn miễn phí
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center order-2 md:order-1">
            <Image
              alt="POS devices"
              src="/edited-pos.png"
              width={1000}
              height={1000}
              priority
              className="w-full h-auto max-w-[520px] sm:max-w-[600px] md:max-w-none md:h-xl md:w-xl"
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 600px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
