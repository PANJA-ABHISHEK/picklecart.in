import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const REGION_ID = "tamil-nadu-specials";

export const metadata = {
  title: "Tamil Nadu Pickles & Podis Online | Authentic Idli Podi & Thokku | PickleCart",
  description:
    "Explore traditional Tamil Nadu culinary favourites online. Authentic Mango thokku, traditional Idli milagai podi, tangy lemon pickle, and cold-pressed sesame oil from PickleCart.",
  alternates: {
    canonical: "/south-indian/tamil-nadu-specials",
  },
  openGraph: {
    title: "Tamil Nadu Pickles & Podis Online | Authentic Idli Podi & Thokku | PickleCart",
    description:
      "Explore traditional Tamil Nadu culinary favourites online. Authentic Mango thokku, traditional Idli milagai podi, and tangy lemon pickle.",
    url: "https://picklecart.in/south-indian/tamil-nadu-specials",
  },
};

export const dynamic = "force-dynamic";

export default async function TamilNaduSpecialsPage() {
  const region = REGIONS.find((r) => r.id === REGION_ID);
  const allProducts = await getProductsByRegion(REGION_ID);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "South Indian Style", url: "/south-indian" },
    { name: "Tamil Nadu Specials", url: "/south-indian/tamil-nadu-specials" },
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
