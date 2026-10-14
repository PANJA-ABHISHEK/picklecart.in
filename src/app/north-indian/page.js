import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";

const REGION_ID = "north-indian";

export const metadata = {
  title: "North Indian Pickles Online | Authentic Aam Ka Achaar & Mixed Pickle | PickleCart",
  description:
    "Buy authentic North Indian pickles online crafted in traditional cold-pressed mustard oil. Classic Punjabi Aam Ka Achaar, mixed vegetable pickle, and spicy flavours delivered across India.",
  alternates: {
    canonical: "/north-indian",
  },
  openGraph: {
    title: "North Indian Pickles Online | Authentic Aam Ka Achaar & Mixed Pickle | PickleCart",
    description:
      "Buy authentic North Indian pickles online crafted in traditional cold-pressed mustard oil. Classic Punjabi Aam Ka Achaar and mixed vegetable pickle.",
    url: "https://picklecart.in/north-indian",
  },
};

export const dynamic = "force-dynamic";

export default async function NorthIndianPage() {
  const region = REGIONS.find((r) => r.id === REGION_ID);
  const allProducts = await getProductsByRegion(REGION_ID);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "North Indian Style", url: "/north-indian" },
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
        regions={[region]}
        categories={CATEGORIES}
        regionFilter={REGION_ID}
        bgImage="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740865/picklecart_assets/northindianpagebackground.png"
        allProducts={allProducts}
      />
    </>
  );
}
