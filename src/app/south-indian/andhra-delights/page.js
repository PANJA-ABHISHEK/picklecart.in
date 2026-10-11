import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";

const REGION_ID = "andhra-delights";

export const metadata = {
  title: "Andhra Delights — Bold & Fiery Flavours",
  description:
    "Discover bold, fiery, and authentic Andhra food products — avakaya, gongura pickle, chicken pickle, idli podi, and more from the heartland of Andhra Pradesh.",
};

export const dynamic = "force-dynamic";

export default async function AndhraDelightsPage() {
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
