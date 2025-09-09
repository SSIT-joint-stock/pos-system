import Image from 'next/image';
import React from 'react';

export default function Features() {
  return (
    <section
      id="features"
      className="h-screen flex items-center justify-center flex-col snap-always snap-start pt-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
        {/* Stats */}
        <dl className="grid grid-cols-1 gap-8  text-center sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <dt className="text-6xl font-extrabold tracking-tight">+20K</dt>
            <dd className="mt-1 text-sm text-gray-500">Bán lẻ đáng tin cậy</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-6xl font-extrabold tracking-tight">+50K</dt>
            <dd className="mt-1 text-sm text-gray-500">Customers</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-6xl font-extrabold tracking-tight">+400K</dt>
            <dd className="mt-1 text-sm text-gray-500">Review</dd>
          </div>
        </dl>

        {/* Row 1: image left, text right */}
        <div className="grid items-center gap-10  md:grid-cols-2 relative">
          <Image
            src="/edited-pos.png"
            className="w-full h-full object-cover"
            alt="POS devices"
            width={1000}
            height={1000}
            priority
          />

          <div>
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
              Một nơi cho mọi thứ bạn cần <br className="hidden sm:block" />
            </h3>
            <p className="mt-3 max-w-prose text-gray-500">
              EraPOS đáp ứng đa dạng nhu cầu kinh doanh của bạn, từ quản lý thực đơn với nhiều nền
              tảng khác nhau, một cách dễ dàng và nhanh chóng.
            </p>
          </div>
        </div>

        {/* Row 2: text left, image right */}
        <div className="grid items-center gap-10  md:grid-cols-2 pt-4">
          <div>
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
              Bạn có thể cài đặt mọi lúc mọi nơi <br className="hidden sm:block" />
            </h3>
            <p className="mt-3 max-w-prose text-gray-500">
              EraPOS rất dễ sử dụng vì bạn có thể truy cập EraPOS ở mọi nơi, mọi lúc trên nhiều
              thiết bị khác nhau chỉ bằng một tài khoản.
            </p>
          </div>
          <Image
            src="/edited-pos.png"
            className="w-full h-full object-cover"
            alt="POS devices"
            width={1000}
            height={1000}
            priority
          />
        </div>
      </div>
    </section>
  );
}
