import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BrandsSection from "@/components/BrandsSection";
import ProductsSection from "@/components/ProductsSection";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import CoverageSection from "@/components/CoverageSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <BrandsSection />
        <ProductsSection />
        <HowItWorks />
        <TrustSection />
        <CoverageSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
