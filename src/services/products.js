/**
 * Product Service Abstraction
 *
 * Phase 1: Returns mock data from local modules.
 * Phase 2: Will switch to Firestore queries without UI changes.
 */

import { products } from "@/lib/data/products";

/**
 * Get all products.
 */
export function getProducts() {
  return products;
}

/**
 * Get a single product by its slug.
 */
export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) || null;
}

/**
 * Get products belonging to a specific category.
 */
export function getProductsByCategory(categoryId) {
  return products.filter((p) => p.categoryIds.includes(categoryId));
}

/**
 * Get products belonging to a specific region.
 */
export function getProductsByRegion(regionId) {
  return products.filter((p) => p.regionIds.includes(regionId));
}

/**
 * Get products by both region AND category.
 */
export function getProductsByRegionAndCategory(regionId, categoryId) {
  return products.filter(
    (p) => p.regionIds.includes(regionId) && p.categoryIds.includes(categoryId)
  );
}

/**
 * Search products by name, tags, category, or region.
 */
export function searchProducts(query) {
  if (!query || !query.trim()) return [];

  const q = query.toLowerCase().trim();

  return products.filter((p) => {
    const searchable = [
      p.name,
      p.shortDescription,
      ...p.tags,
      ...p.categoryIds,
      ...p.regionIds,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(q);
  });
}

/**
 * Get featured products.
 */
export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

/**
 * Get best-selling products.
 */
export function getBestSellingProducts() {
  return products.filter((p) => p.bestSeller);
}

/**
 * Get newest products (mock: returns last N).
 */
export function getNewestProducts(count = 8) {
  return [...products].reverse().slice(0, count);
}

/**
 * Sort products by a given criterion.
 */
export function sortProducts(productList, sortBy = "featured") {
  const sorted = [...productList];

  switch (sortBy) {
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.reverse();
    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.bestSeller && !b.bestSeller) return -1;
        if (!a.bestSeller && b.bestSeller) return 1;
        return 0;
      });
  }
}
