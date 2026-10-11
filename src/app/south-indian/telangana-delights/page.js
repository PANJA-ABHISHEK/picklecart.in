import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const REGION_ID = "telangana-delights";

export const metadata = {
  title: "Telangana Pickles & Podis Online | Authentic Deccan Flavours | PickleCart",
  description:
    "Buy authentic Telangana style pickles and podis online. Traditional garlic pachadi, tangy tomato pickle, Gongura karam, and spice powders delivered fresh to your door.",
  alternates: {
    canonical: "/south-indian/telangana-delights",
  },
  openGraph: {
    title: "Telangana Pickles & Podis Online | Authentic Deccan Flavours | PickleCart",
    description:
      "Buy authentic Telangana style pickles and podis online. Traditional garlic pachadi, tangy tomato pickle, and Gongura karam from PickleCart.",
    url: "https://picklecart.in/south-indian/telangana-delights",
  },
};

export const dynamic = "force-dynamic";

export default async function TelanganaDelightsPage() {
  const region = REGIONS.find((r) => r.id === REGION_ID);
  const allProducts = await getProductsByRegion(REGION_ID);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "South Indian Style", url: "/south-indian" },
    { name: "Telangana Delights", url: "/south-indian/telangana-delights" },
  ]);

  return (
    <>
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
      <RegionPageContent
        title={region.name}
        description={region.description}
        bgImage={region.image}
        regions={[region]}
        categories={CATEGORIES}
        regionFilter={REGION_ID}
        allProducts={allProducts}
      />
    </>
  );
}
