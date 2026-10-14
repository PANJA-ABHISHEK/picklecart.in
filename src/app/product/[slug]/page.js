import { getProductBySlug, getProductsByCategory } from "@/services/products";
import { REGIONS, CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
import ProductDetailContent from "@/components/products/ProductDetailContent";
import { notFound } from "next/navigation";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo/schema";
import { resolveImage } from "@/services/images";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | PickleCart" };

  const rawImage = product.image || (Array.isArray(product.images) && product.images[0]) || null;
  const imageUrl = rawImage ? resolveImage(rawImage, { width: 800, height: 800, text: product.name }) : null;
  
  const desc = product.shortDescription || product.description || `Buy authentic ${product.name} online from PickleCart. Prepared with traditional spices, cold-pressed oil, and time-tested recipes.`;
  const canonicalUrl = `/product/${slug}`;

  return {
    title: `${product.name} | Buy Traditional Pickles Online`,
    description: desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | PickleCart`,
      description: desc,
      url: `${SITE_URL}${canonicalUrl}`,
      type: "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 800,
              height: 800,
              alt: `${product.name} - Traditional Indian Pickles by PickleCart`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | PickleCart`,
      description: desc,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Handle both array (Phase 1 mock) and string (Phase 2 Firestore) structures
  const productCategoryIds = product.categoryIds || (product.categoryId ? [product.categoryId] : []);
  const productRegionIds = product.regions || product.regionIds || (product.regionId ? [product.regionId] : []);

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

  // Structured Data Schemas
  const productSchema = generateProductSchema(product);
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: regionNames[0] || "Regional Pickles", url: "/south-indian" },
    { name: product.name, url: `/product/${slug}` },
  ]);

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
      <ProductDetailContent
        product={product}
        relatedProducts={related}
        regionNames={regionNames}
        categoryNames={categoryNames}
      />
    </>
  );
}
