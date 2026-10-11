import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProducts } from "@/services/products";

import { generateBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata = {
  title: "South Indian Pickles & Podis Online | Authentic Regional Flavours | PickleCart",
  description:
    "Buy authentic South Indian pickles, podis, and traditional food products online. Discover spicy Andhra avakaya, gongura, Karnataka thokku, and Tamil Nadu specials handcrafted with cold-pressed oils.",
  alternates: {
    canonical: "/south-indian",
  },
  openGraph: {
    title: "South Indian Pickles & Podis Online | Authentic Regional Flavours | PickleCart",
    description:
      "Buy authentic South Indian pickles, podis, and traditional food products online. Discover spicy Andhra avakaya, gongura, Karnataka thokku, and Tamil Nadu specials.",
    url: "https://picklecart.in/south-indian",
  },
};

export const dynamic = "force-dynamic";

export default async function SouthIndianPage() {
  const southRegions = REGIONS.filter((r) => r.parentRoute === "/south-indian");
  const regionIds = southRegions.map(r => r.id);
  
  const allProductsFull = await getProducts();
  const allProducts = allProductsFull.filter(p => regionIds.includes(p.regionId));

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "South Indian Style", url: "/south-indian" },
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
        title="South Indian Style"
        description="Bold, aromatic, and deeply rooted in tradition — explore authentic food products from across South India."
        regions={southRegions}
        categories={CATEGORIES}
        regionFilter={null}
        bgImage="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740866/picklecart_assets/southindianpagebackground.png"
        showRegionFilter
        allProducts={allProducts}
      />
    </>
  );
}
