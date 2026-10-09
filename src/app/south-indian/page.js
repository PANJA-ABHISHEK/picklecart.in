import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";

export const metadata = {
  title: "South Indian Style — Authentic Pickles & Food Products",
  description:
    "Explore our collection of authentic South Indian pickles, podis, snacks, and traditional food products from Andhra, Telangana, Karnataka, and Tamil Nadu.",
};

export default function SouthIndianPage() {
  const southRegions = REGIONS.filter((r) => r.parentRoute === "/south-indian");

  return (
    <RegionPageContent
      title="South Indian Style"
      description="Bold, aromatic, and deeply rooted in tradition — explore authentic food products from across South India."
      regions={southRegions}
      categories={CATEGORIES}
      regionFilter={null}
      bgImage="/southindianpagebackground.png"
      showRegionFilter
    />
  );
}
