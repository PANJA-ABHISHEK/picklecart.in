import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";

const REGION_ID = "telangana-delights";

export const metadata = {
  title: "Telangana Delights — Rich & Rustic Flavours",
  description:
    "Explore authentic Telangana food products — traditional pickles, podis, and snacks from the Deccan heartland.",
};

export const dynamic = "force-dynamic";

export default async function TelanganaDelightsPage() {
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
