"use client";

import Link from "next/link";
import Logo from "../common/Logo";

const pagesItems = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Tính năng",
    href: "/features",
  },
  {
    title: "Bảng giá",
    href: "/pricing",
  },
  {
    title: "Hỗ trợ",
    href: "/support",
  },
  {
    title: "Liên hệ",
    href: "/contact",
  },
];
export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Logo />

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8  font-medium text-lg ">
          {pagesItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="hover:text-blue-600  transition-colors duration-300">
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/auth/register"
            className="rounded-full border px-6 py-2 border-pos-blue-500 text-pos-blue-500 text-base font-medium hover:text-pos-blue-50 hover:bg-pos-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-pos-blue-300">
            Đăng ký
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full px-5 py-2 border bg-pos-blue-500 text-pos-blue-50 text-base font-medium ">
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
