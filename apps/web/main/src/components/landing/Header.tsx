'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '../common/Logo';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

const pagesItems = [
  { title: 'Giới thiệu', href: '#home' },
  { title: 'Tính năng', href: '#features' },
  { title: 'Giải pháp', href: '#solutions' },
  { title: 'Bảng giá', href: '#pricing' },
  { title: 'Liên hệ', href: '#contact' },
  { title: 'Hỗ trợ', href: '#support' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    setActiveHash(window.location.hash || '#home');

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Logo />

        {/* Hamburger Menu Button (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              // Close icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Nav Items (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-lg">
          {pagesItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className={`transition-colors duration-300 ${
                activeHash === item.href ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }`}
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Actions (Desktop only) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/auth/register"
            className="rounded-full border px-6 py-2 border-pos-blue-500 text-pos-blue-500 text-base font-medium hover:text-pos-blue-50 hover:bg-pos-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-pos-blue-300"
          >
            Đăng ký
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full px-5 py-2 border bg-pos-blue-500 text-pos-blue-50 text-base font-medium"
          >
            Đăng nhập
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-white shadow-md">
          <nav className="flex flex-col gap-3 text-base font-medium">
            {pagesItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`transition-colors duration-300 ${
                  activeHash === item.href ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/auth/register"
              className="rounded-full border px-6 py-2 border-pos-blue-500 text-pos-blue-500 text-base font-medium hover:text-pos-blue-50 hover:bg-pos-blue-500 transition-all duration-300 text-center"
            >
              Đăng ký
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full px-5 py-2 border bg-pos-blue-500 text-pos-blue-50 text-base font-medium text-center"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
