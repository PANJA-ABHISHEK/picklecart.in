import { SITE_URL } from "@/lib/constants";
import { getProducts } from "@/services/products";
import { products as fallbackProducts } from "@/lib/data/products";

export default async function sitemap() {
  const currentDate = new Date().toISOString();

  // Core static & landing routes
  const staticRoutes = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/pickles-in-bangalore`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/south-indian`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/south-indian/andhra-delights`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/south-indian/telangana-delights`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/south-indian/karnataka-specials`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/south-indian/tamil-nadu-specials`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/north-indian`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/corporate-bulk-orders`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/shipping-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Fetch live products with safe fallback to catalog
  let allProducts = [];
  try {
    const liveProducts = await getProducts();
    if (Array.isArray(liveProducts) && liveProducts.length > 0) {
      allProducts = liveProducts;
    } else {
      allProducts = fallbackProducts;
    }
  } catch (error) {
    console.warn("Sitemap: Falling back to static products catalog", error);
    allProducts = fallbackProducts;
  }

  // Deduplicate products by id/slug
  const seenUrls = new Set();
  const productRoutes = [];

  for (const product of allProducts) {
    const slug = product.id || product.slug;
    if (!slug) continue;

    const productUrl = `${SITE_URL}/product/${slug}`;
    if (!seenUrls.has(productUrl)) {
      seenUrls.add(productUrl);
      productRoutes.push({
        url: productUrl,
        lastModified: product.updatedAt || product.createdAt || currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...productRoutes];
}
