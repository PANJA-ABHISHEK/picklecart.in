import { getProductBySlug, getProducts, getProductsByCategory } from "@/services/products";
import { REGIONS, CATEGORIES } from "@/lib/constants";
import ProductDetailContent from "@/components/products/ProductDetailContent";
import { notFound } from "next/navigation";

export const instant = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Handle both array (Phase 1 mock) and string (Phase 2 Firestore) structures
  const productCategoryIds = product.categoryIds || (product.categoryId ? [product.categoryId] : []);
  const productRegionIds = product.regionIds || (product.regionId ? [product.regionId] : []);

  // Get related products
  const relatedFull = productCategoryIds.length > 0 
    ? await getProductsByCategory(productCategoryIds[0])
    : [];
  const related = relatedFull.filter((p) => p.id !== product.id).slice(0, 4);

  // Resolve region and category names
  const regionNames = productRegionIds
    .map((rid) => REGIONS.find((r) => r.id === rid)?.name)
    .filter(Boolean);

  const categoryNames = productCategoryIds
    .map((cid) => CATEGORIES.find((c) => c.id === cid)?.name)
    .filter(Boolean);

  return (
    <ProductDetailContent
      product={product}
      relatedProducts={related}
      regionNames={regionNames}
      categoryNames={categoryNames}
    />
  );
}
