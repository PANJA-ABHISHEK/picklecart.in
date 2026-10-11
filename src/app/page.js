import HeroSlider from "@/components/hero/HeroSlider";
import RegionalDiscovery from "@/components/regional/RegionalDiscovery";
import BestSellers from "@/components/products/BestSellers";
import TraditionalStory from "@/components/sections/TraditionalStory";
import WhyPickleCart from "@/components/sections/WhyPickleCart";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import CorporateCTA from "@/components/sections/CorporateCTA";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PickleCart | Traditional Indian Pickles Online | Fresh from Bangalore",
  description:
    "Buy authentic South Indian, Andhra, and traditional homemade-style Indian pickles online from PickleCart Bangalore. Handcrafted Avakaya, Gongura, Chicken pickles & podis with doorstep delivery across India.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PickleCart | Traditional Indian Pickles Online | Fresh from Bangalore",
    description:
      "Buy authentic South Indian, Andhra, and traditional homemade-style Indian pickles online from PickleCart Bangalore. Handcrafted Avakaya, Gongura, Chicken pickles & podis with doorstep delivery across India.",
    url: "https://picklecart.in",
  },
};

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
