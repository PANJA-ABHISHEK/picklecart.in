import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";

const REGION_ID = "tamil-nadu-specials";

export const metadata = {
  title: "Tamil Nadu Specials — Time-Honoured Recipes",
  description:
    "Explore authentic Tamil Nadu food products — mango thokku, milagai podi, murukku, cold-pressed oils, and more.",
};

export default async function TamilNaduSpecialsPage() {
  const region = REGIONS.find((r) => r.id === REGION_ID);
  const allProducts = await getProductsByRegion(REGION_ID);

  return (
    <RegionPageContent
      title={region.name}
      description={region.description}
      bgImage={region.image}
      regions={[region]}
      categories={CATEGORIES}
      regionFilter={REGION_ID}
      allProducts={allProducts}
    />
  );
}
