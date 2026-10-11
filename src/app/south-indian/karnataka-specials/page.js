import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";

const REGION_ID = "karnataka-specials";

export const metadata = {
  title: "Karnataka Specials — Diverse Culinary Traditions",
  description:
    "Explore unique Karnataka food products — traditional pickles, mango thokku, curry leaf podi, and more.",
};

export default async function KarnatakaSpecialsPage() {
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
