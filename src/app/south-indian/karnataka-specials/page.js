import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const REGION_ID = "karnataka-specials";

export const metadata = {
  title: "Karnataka Pickles & Podis Online | Traditional Karnataka Thokku | PickleCart",
  description:
    "Explore traditional Karnataka food products from PickleCart Bangalore. Authentic mango thokku, tangy amla pickles, aromatic curry leaf podi, and local kitchen favourites.",
  alternates: {
    canonical: "/south-indian/karnataka-specials",
  },
  openGraph: {
    title: "Karnataka Pickles & Podis Online | Traditional Karnataka Thokku | PickleCart",
    description:
      "Explore traditional Karnataka food products from PickleCart Bangalore. Authentic mango thokku, tangy amla pickles, and aromatic podis.",
    url: "https://picklecart.in/south-indian/karnataka-specials",
  },
};

export const dynamic = "force-dynamic";

export default async function KarnatakaSpecialsPage() {
  const region = REGIONS.find((r) => r.id === REGION_ID);
  const allProducts = await getProductsByRegion(REGION_ID);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "South Indian Style", url: "/south-indian" },
    { name: "Karnataka Specials", url: "/south-indian/karnataka-specials" },
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
