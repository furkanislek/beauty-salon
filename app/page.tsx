import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import TreatmentSection from "@/components/home/TreatmentSection";
import ServicesSection from "@/components/home/ServicesSection";
import PricingSection from "@/components/home/PricingSection";
import DiscountSection from "@/components/home/DiscountSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import BlogSection from "@/components/home/BlogSection";
import AppointmentSection from "@/components/home/AppointmentSection";
import { Suspense } from "react";

export const revalidate = 3600; // 1 saat cache

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TreatmentSection />
        <ServicesSection />
        <PricingSection />
        <DiscountSection />
        <TestimonialSection />
        <BlogSection />
        <Suspense
          fallback={<div className="py-20 text-center">Yükleniyor...</div>}
        >
          <AppointmentSection />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
