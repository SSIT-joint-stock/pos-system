"use client";

import { useMemo, useState } from "react";

type PlanKey = "basic" | "premium" | "deluxe";

const plans: Record<
  PlanKey,
  {
    title: string;
    subtitle: string;
    priceMonthly: number;
    cta: string;
    featured?: boolean;
  }
> = {
  basic: {
    title: "Basic",
    subtitle:
      "Limited use, has minimal features and can be used on one platform",
    priceMonthly: 20,
    cta: "Try for Free",
  },
  premium: {
    title: "Premium",
    subtitle: "Unlimited usage and extra features not in basic class",
    priceMonthly: 60,
    cta: "Try for Free",
    featured: true,
  },
  deluxe: {
    title: "Deluxe",
    subtitle: "Everything is in your hands, you can adjust it to your needs",
    priceMonthly: 80,
    cta: "Contact Us",
  },
};

const featureRows = [
  {
    label: "14 Days Free",
    values: { basic: true, premium: true, deluxe: true },
  },
  {
    label: "Accept Online Feedback",
    values: { basic: true, premium: true, deluxe: true },
  },
  {
    label: "Unlimited Items",
    values: { basic: false, premium: true, deluxe: true },
  },
  {
    label: "Unlimited Tablets",
    values: { basic: false, premium: true, deluxe: true },
  },
  {
    label: "Tablet App Menu",
    values: { basic: false, premium: true, deluxe: true },
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const formatPrice = (m: number) =>
    yearly ? `$ ${m * 12} / yr` : `$ ${m} / mo`;

  return (
    <section
      id="pricing"
      className="mx-auto max-w-6xl px-4 md:h-screen h-auto md:snap-always md:snap-center
                 flex flex-col items-center justify-center w-full
                 scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-12 py-12 md:py-0"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Lựa chọn an toàn, tạm biệt rủi ro
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Dùng thử miễn phí 14 ngày, mở khóa tất cả tính năng
        </p>

        {/* Toggle */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <span className={!yearly ? "font-semibold" : "text-gray-500"}>
            Theo tháng
          </span>
          <button
            type="button"
            onClick={() => setYearly((v) => !v)}
            aria-pressed={yearly}
            className={`relative h-7 w-14 overflow-hidden rounded-full transition-colors ${
              yearly ? "bg-gray-900" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-200 ${
                yearly ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
          <span className={yearly ? "font-semibold" : "text-gray-500"}>
            Theo năm
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch w-full">
        {Object.entries(plans).map(([key, plan]) => {
          const isFeatured = !!plan.featured;
          return (
            <div
              key={key}
              className={`flex flex-col rounded-xl border bg-white p-6 shadow-sm transition h-full ${
                isFeatured ? "ring-1 ring-gray-400 sm:-mt-4" : "border-gray-200"
              }`}
            >
              {isFeatured && (
                <span className="mb-3 inline-block rounded-md bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{plan.subtitle}</p>
              <div className="mt-6 text-3xl font-bold">
                {formatPrice(plan.priceMonthly)}
              </div>

              <div className="mt-auto mb-6 pt-6">
                <button
                  className={`w-full rounded-md px-4 py-2 text-sm font-medium ${
                    plan.cta === "Contact Us"
                      ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      : isFeatured
                        ? "bg-gray-800 text-white hover:bg-gray-900"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison table (keeps desktop look; mobile scrolls horizontally) */}
      <div className="mt-12 w-full overflow-x-auto">
        <table className="w-full min-w-[720px] md:min-w-0 border-collapse text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">TEST MANAGEMENT</th>
              <th className="px-6 py-3 text-center font-semibold">BASIC</th>
              <th className="px-6 py-3 text-center font-semibold">PREMIUM</th>
              <th className="px-6 py-3 text-center font-semibold">DELUXE</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {featureRows.map((row) => (
              <tr key={row.label} className="odd:bg-white even:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{row.label}</td>
                <td className="px-6 py-4">
                  <Cell value={row.values.basic} />
                </td>
                <td className="px-6 py-4">
                  <Cell value={row.values.premium} />
                </td>
                <td className="px-6 py-4">
                  <Cell value={row.values.deluxe} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Cell({ value }: { value: boolean }) {
  const Icon = useMemo(() => (value ? CheckIcon : CrossIcon), [value]);
  return (
    <div className="flex items-center justify-center">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
          value ? "bg-gray-200 text-gray-800" : "bg-gray-200 text-gray-500"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0L3.293 9.957a1 1 0 0 1 1.414-1.414l3.043 3.043 6.543-6.543a1 1 0 0 1 1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.225 4.811a1 1 0 0 0-1.414 1.414L8.586 10l-3.775 3.775a1 1 0 1 0 1.414 1.414L10 11.414l3.775 3.775a1 1 0 0 0 1.414-1.414L11.414 10l3.775-3.775a1 1 0 1 0-1.414-1.414L10 8.586 6.225 4.811z" />
    </svg>
  );
}
