"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed font-inter top-0 z-50 w-full bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* Put your file in /public, e.g. /blue2.png */}
          <Image
            src="/blue2.png"
            alt="Logo"
            width={40}
            height={40}
            priority
            className="rounded"
          />
          <span className="text-2xl font-bold tracking-tight">EraPOS</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600 text-xl ">
            Trang chủ
          </Link>
          <Link href="/features" className="hover:text-blue-600 text-xl">
            Tính năng
          </Link>
          <Link href="/pricing" className="hover:text-blue-600 text-xl">
            Bảng giá
          </Link>
          <Link href="/support" className="hover:text-blue-600 text-xl">
            Hỗ trợ
          </Link>
          <Link href="/contact" className="hover:text-blue-600 text-xl">
            Liên hệ
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href=""
            className="rounded-md border px-6 py-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600"
          >
            Đăng ký
          </Link>
          <Link
            href=""
            className="rounded-md px-5 py-2 border bg-blue-600 text-white hover:text-blue-600 hover:bg-white hover:border-blue-600"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
