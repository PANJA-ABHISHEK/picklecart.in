import { getProductBySlug, getProducts, getProductsByCategory } from "@/services/products";
import { REGIONS, CATEGORIES } from "@/lib/constants";
import ProductDetailContent from "@/components/products/ProductDetailContent";
import { notFound } from "next/navigation";

export const instant = false;

export async function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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
  const product = getProductBySlug(slug);

  if (!product) notFound();

  // Get related products
  const related = getProductsByCategory(product.categoryIds[0])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Resolve region and category names
  const regionNames = product.regionIds
    .map((rid) => REGIONS.find((r) => r.id === rid)?.name)
    .filter(Boolean);

  const categoryNames = product.categoryIds
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
