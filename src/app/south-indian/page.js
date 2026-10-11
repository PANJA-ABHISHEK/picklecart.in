import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProducts } from "@/services/products";

export const metadata = {
  title: "South Indian Style — Authentic Pickles & Food Products",
  description:
    "Explore our collection of authentic South Indian pickles, podis, snacks, and traditional food products from Andhra, Telangana, Karnataka, and Tamil Nadu.",
};

export default async function SouthIndianPage() {
  const southRegions = REGIONS.filter((r) => r.parentRoute === "/south-indian");
  const regionIds = southRegions.map(r => r.id);
  
  const allProductsFull = await getProducts();
  const allProducts = allProductsFull.filter(p => regionIds.includes(p.regionId));

  return (
    <RegionPageContent
      title="South Indian Style"
      description="Bold, aromatic, and deeply rooted in tradition — explore authentic food products from across South India."
      regions={southRegions}
      categories={CATEGORIES}
      regionFilter={null}
      bgImage="/southindianpagebackground.png"
      showRegionFilter
      allProducts={allProducts}
    />
  );
}
