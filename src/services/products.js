"use server";

import { adminDb } from "@/lib/firebase/admin";

export async function getProducts() {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug) {
  try {
    if (!adminDb) return null;
    const doc = await adminDb.collection("products").doc(slug).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

export async function getProductsByCategory(categoryId) {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("products").where("categoryId", "==", categoryId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
}

export async function getProductsByRegion(regionId) {
  try {
    if (!adminDb) return [];
    
    // New schema: products with 'regions' array
    const snapshotArray = await adminDb.collection("products").where("regions", "array-contains", regionId).get();
    // Old schema: products with 'regionId' string
    const snapshotString = await adminDb.collection("products").where("regionId", "==", regionId).get();
    
    const productsMap = new Map();
    snapshotArray.docs.forEach(doc => productsMap.set(doc.id, { id: doc.id, ...doc.data() }));
    snapshotString.docs.forEach(doc => productsMap.set(doc.id, { id: doc.id, ...doc.data() }));
    
    return Array.from(productsMap.values());
  } catch (error) {
    console.error(`Error fetching products for region ${regionId}:`, error);
    return [];
  }
}

export async function getProductsByRegionAndCategory(regionId, categoryId) {
  try {
    const byRegion = await getProductsByRegion(regionId);
    return byRegion.filter(p => p.categoryId === categoryId);
  } catch (error) {
    console.error("Error filtering products by region & category:", error);
    return [];
  }
}

export async function searchProducts(query) {
  try {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    
    // Since Firestore doesn't have native full-text search, we fetch all and filter for this scale
    const allProducts = await getProducts();
    return allProducts.filter(p => {
      const searchable = [p.name, p.description, p.categoryId, p.regionId, ...(p.regions || [])].join(" ").toLowerCase();
      return searchable.includes(q);
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("products").where("featured", "==", true).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getBestSellingProducts() {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("products").where("bestSeller", "==", true).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching best-selling products:", error);
    return [];
  }
}

export async function getNewestProducts(count = 8) {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").limit(count).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching newest products:", error);
    return [];
  }
}

export async function sortProducts(productListPromise, sortBy = "featured") {
  const productList = await productListPromise;
  const sorted = [...productList];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => Math.min(...a.pricing.map(p => p.price)) - Math.min(...b.pricing.map(p => p.price)));
    case "price-high":
      return sorted.sort((a, b) => Math.min(...b.pricing.map(p => p.price)) - Math.min(...a.pricing.map(p => p.price)));
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
