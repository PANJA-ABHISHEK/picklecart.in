import HeroSlider from "@/components/hero/HeroSlider";
import RegionalDiscovery from "@/components/regional/RegionalDiscovery";
import BestSellers from "@/components/products/BestSellers";
import TraditionalStory from "@/components/sections/TraditionalStory";
import WhyPickleCart from "@/components/sections/WhyPickleCart";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import CorporateCTA from "@/components/sections/CorporateCTA";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <RegionalDiscovery />
      <BestSellers />
      <CorporateCTA />
      <TraditionalStory />
      <WhyPickleCart />
      <TestimonialsSection />
    </>
  );
}
