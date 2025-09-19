import React from "react";
import Header from "@main/components/landing/Header";
import AssistantFeatureSection from "@main/components/landing/AssistantFeatureSection";
import PricingSection from "@main/components/landing/PricingSection";
import Footer from "@main/components/landing/Footer";
import Hero from "@main/components/landing/Hero";
import Features from "@main/components/landing/Features";
import FAQ from "@main/components/landing/FAQ";
import NewsCards from "@main/components/landing/NewsCard";
import ConsultForm from "@main/components/landing/ConsultForm";

/**
 * Goals
 * - Keep desktop appearance **identical**.
 * - Improve mobile by:
 *   • Using CSS Grid for section layout scaffolding
 *   • Relaxing full-viewport locks (no forced h-screen on mobile)
 *   • Enabling scroll-snap only on md+ screens
 *   • Making the News grid responsive
 */

export default function Page() {
  return (
    <>
      <Header />

      {/* Scroll + snap behavior: only enable on md+ so mobile feels natural */}
      <main
        className={[
          "scroll-smooth transition-all duration-300 overflow-x-hidden",
          // Desktop keeps your original snap experience
          "md:snap-y md:snap-mandatory md:h-screen md:overflow-y-scroll",
          // Mobile: normal flow (prevents awkward full-screen sections)
          "h-auto",
          "pt-20 sm:pt-24 md:pt-0",
        ].join(" ")}
      >
        {/* Top hero remains full-bleed */}
        <Hero />

        {/* Grid shell: does not change desktop layout but gives us neat mobile behavior */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-y-16">
          {/* Full-width sections by default (col-span-12 on md to preserve current look) */}
          <section className="col-span-1 md:col-span-12">
            <Features />
          </section>

          <section className="col-span-1 md:col-span-12">
            <AssistantFeatureSection />
          </section>

          <section className="col-span-1 md:col-span-12">
            <PricingSection />
          </section>

          <section className="col-span-1 md:col-span-12">
            <ConsultForm />
          </section>

          <section className="col-span-1 md:col-span-12">
            <FAQ />
          </section>

          {/* News: preserve desktop spacing; relax height on mobile; gridify cards */}
          <section className="col-span-1 md:col-span-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 md:h-screen h-auto flex md:items-center md:justify-center flex-col md:snap-always md:snap-start pt-10 md:pt-14">
              <h2 className="text-center mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
                Tin tức nổi bật
              </h2>

              {/* If your <NewsCards /> already returns a grid, great. If not, wrap it with a responsive grid here. */}
              <div className="">
                <NewsCards />
              </div>

              {/* Optional: CTA container remains, just commented out as in your original */}
              {/* <div className="mt-10 flex justify-center">
                <a
                  href="#"
                  className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
                >
                  Xem thêm
                </a>
              </div> */}
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}

/**
 * Notes / Drop-in tweaks for child components (optional, if you see mobile issues):
 *
 * 1) Replace `h-screen` with `md:h-screen h-auto` wherever a section feels too tall on phones.
 * 2) For two-column sections (image + text), a good default:
 *    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"> ... </div>
 * 3) For feature cards:
 *    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ... </div>
 * 4) For FAQs, ensure questions don’t overflow:
 *    <dl className="space-y-4 md:space-y-6"> ... </dl>
 * 5) If you rely on sticky/absolute elements in desktop, gate them behind md+:
 *    className="md:sticky md:top-24"
 */
