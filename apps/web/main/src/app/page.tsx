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

export default function Page() {
  return (
    <>
      <Header />
      <main className="snap-y snap-mandatory h-screen scroll-smooth overflow-scroll transition-all duration-300 ">
        <Hero />
        <div className="">
          <Features />
          <AssistantFeatureSection />
          <PricingSection />
          <ConsultForm />
          <FAQ />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center flex-col snap-always snap-start pt-14">
            <h2 className="text-center mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Tin tức nổi bật
            </h2>

            <NewsCards />

            {/* <div className="mt-10 flex justify-center">
              <a
                href="#"
                className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
              >
                Xem thêms
              </a>
            </div> */}
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
