import Image from "next/image";
import React from "react";

export default function Features() {
  return (
    <section
      id="features"
      // Desktop keeps full-screen + snap; mobile uses natural height
      className="relative md:h-screen h-auto md:snap-always md:snap-start flex items-center justify-center flex-col
                 scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-0 w-full">
        {/* Stats */}
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <dt className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              +20K
            </dt>
            <dd className="mt-1 text-sm text-gray-500">Bán lẻ đáng tin cậy</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              +50K
            </dt>
            <dd className="mt-1 text-sm text-gray-500">Customers</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              +400K
            </dt>
            <dd className="mt-1 text-sm text-gray-500">Review</dd>
          </div>
        </dl>

        {/* Row 1: image left, text right (unchanged on desktop) */}
        <div className="grid items-center gap-8 md:gap-10 md:grid-cols-2 mt-10">
          <div className="order-2 md:order-1">
            <Image
              src="/edited-pos.png"
              alt="POS devices"
              width={1000}
              height={1000}
              priority
              // Mobile: natural height; Desktop: fills column height if available
              className="w-full h-auto md:h-full object-contain rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="order-1 md:order-2">
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
              Một nơi cho mọi thứ bạn cần <br className="hidden sm:block" />
            </h3>
            <p className="mt-3 max-w-prose text-gray-500">
              EraPOS đáp ứng đa dạng nhu cầu kinh doanh của bạn, từ quản lý thực
              đơn với nhiều nền tảng khác nhau, một cách dễ dàng và nhanh chóng.
            </p>
          </div>
        </div>

        {/* Row 2: text left, image right (unchanged on desktop) */}
        <div className="grid items-center gap-8 md:gap-10 md:grid-cols-2 mt-10">
          <div>
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
              Bạn có thể cài đặt mọi lúc mọi nơi{" "}
              <br className="hidden sm:block" />
            </h3>
            <p className="mt-3 max-w-prose text-gray-500">
              EraPOS rất dễ sử dụng vì bạn có thể truy cập EraPOS ở mọi nơi, mọi
              lúc trên nhiều thiết bị khác nhau chỉ bằng một tài khoản.
            </p>
          </div>

          <div>
            <Image
              src="/edited-pos.png"
              alt="POS devices"
              width={1000}
              height={1000}
              priority
              className="w-full h-auto md:h-full object-contain rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
