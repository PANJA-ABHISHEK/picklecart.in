import { REGIONS, CATEGORIES } from "@/lib/constants";
import RegionPageContent from "@/components/regional/RegionPageContent";
import { getProductsByRegion } from "@/services/products";

const REGION_ID = "north-indian";

const northCategories = [
  { id: "veg-pickles", name: "Pickles", slug: "veg-pickles", description: "", image: "" },
  { id: "snacks", name: "Snacks", slug: "snacks", description: "", image: "" },
  { id: "podi-powders", name: "Powders", slug: "podi-powders", description: "", image: "" },
  { id: "other-items", name: "Other Items", slug: "other-items", description: "", image: "" },
];

export const metadata = {
  title: "North Indian Style — Hearty & Aromatic Pickles",
  description:
    "Explore authentic North Indian pickles, mixed vegetable pickle, aam ka achaar, and more — made with mustard oil and traditional spices.",
};

export const dynamic = "force-dynamic";

export default async function NorthIndianPage() {
  const region = REGIONS.find((r) => r.id === REGION_ID);
  const allProducts = await getProductsByRegion(REGION_ID);

  return (
    <RegionPageContent
      title={region.name}
      description={region.description}
      regions={[region]}
      categories={northCategories}
      regionFilter={REGION_ID}
      bgImage="/northindianpagebackground.png"
      allProducts={allProducts}
    />
  );
}
