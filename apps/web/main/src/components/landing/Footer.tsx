import Link from "next/link";
import Logo from "../common/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0d] text-neutral-300 snap-always snap-start">
      {/* Top */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo isTextWhite />
            <p className="mt-5 max-w-md leading-relaxed text-neutral-400">
              Transforming the way you conduct transactions, taking your
              Point-of-Sale system to the next level.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold">Products</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="hover:text-white">
                  Commerce
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Point of sale
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Payments
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Online
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Types */}
          <div>
            <h4 className="text-white font-semibold">Business Types</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="hover:text-white">
                  Quick Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Full Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Food &amp; beverage
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Fast casual
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Retail
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources + Contact */}
          <div>
            <h4 className="text-white font-semibold">Resources</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Quick Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Full Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Fast casual
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Sales
                </Link>
              </li>
            </ul>

            <h4 className="mt-8 text-white font-semibold">Contact</h4>
            <ul className="mt-4 space-y-3">
              <li>
                Customer support:{" "}
                <a href="tel:18557006000" className="hover:text-white">
                  1 (855) 700-6000
                </a>
              </li>
              <li>
                Sales:{" "}
                <a href="tel:18004701673" className="hover:text-white">
                  1 (800) 470-1673
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-4">
              {/* simple inline icons */}
              <Link
                href="#"
                aria-label="Facebook"
                className="rounded-full bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                >
                  <path d="M13 22v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4z" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="rounded-full bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                >
                  <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 .9 7.2 31 31 0 0 0 .6 12a31 31 0 0 0 .3 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.2-1.6.3-3.2.3-4.8s-.1-3.2-.3-4.8ZM9.8 14.7V9.3l5.6 2.7-5.6 2.7z" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="rounded-full bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                >
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1-.001 6.001A3 3 0 0 1 12 9z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10" />
      <div className="mx-auto max-w-7xl px-6 py-5 text-sm">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-white">
              Terms
            </Link>
            <Link href="#" className="hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white">
              Cookies
            </Link>
          </div>
          <p className="text-neutral-400">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
