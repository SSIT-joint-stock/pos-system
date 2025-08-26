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
    <div>
      <Header></Header>
      <Hero></Hero>
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.3),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.3),transparent_40%)]">
        <Features></Features>
        <AssistantFeatureSection></AssistantFeatureSection>
        <PricingSection></PricingSection>
        <ConsultForm></ConsultForm>
        <FAQ></FAQ>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Heading */}
          <h2 className="text-center text-3xl font-extrabold text-gray-900 md:text-4xl">
            Tin tức nổi bật
          </h2>

          {/* Cards */}
          <div className="mt-10">
            <NewsCards />
          </div>

          {/* Button */}
          <div className="mt-10 flex justify-center">
            <a
              href="#"
              className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600"
            >
              Xem thêm
            </a>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
