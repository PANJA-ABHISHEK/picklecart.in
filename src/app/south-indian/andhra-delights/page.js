import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const REGION_ID = "andhra-delights";

export const metadata = {
  title: "Andhra Pickles Online | Authentic Avakaya, Gongura & Chicken Pickle | PickleCart",
  description:
    "Order authentic Andhra style pickles online. Traditional Guntur chilli Avakaya, tangy Gongura pachadi, spicy Andhra Chicken pickle, and fresh podis dispatched from Bangalore across India.",
  alternates: {
    canonical: "/south-indian/andhra-delights",
  },
  openGraph: {
    title: "Andhra Pickles Online | Authentic Avakaya, Gongura & Chicken Pickle | PickleCart",
    description:
      "Order authentic Andhra style pickles online. Traditional Guntur chilli Avakaya, tangy Gongura pachadi, and spicy Andhra Chicken pickle.",
    url: "https://picklecart.in/south-indian/andhra-delights",
  },
};

export const dynamic = "force-dynamic";

export default async function AndhraDelightsPage() {
  const region = REGIONS.find((r) => r.id === REGION_ID);
  const allProducts = await getProductsByRegion(REGION_ID);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "South Indian Style", url: "/south-indian" },
    { name: "Andhra Delights", url: "/south-indian/andhra-delights" },
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
