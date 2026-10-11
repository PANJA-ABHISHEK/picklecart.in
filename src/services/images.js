/**
 * Image Service Abstraction
 *
 * Phase 1: Uses local/placeholder images.
 * Phase 2: Will switch to Cloudinary URLs.
 *
 * All image references go through this module so
 * switching to Cloudinary requires zero component changes.
 */

import cloudinaryMap from "@/lib/cloudinary-map.json";

/**
 * Get the image URL for a given path.
 * Resolves local image paths and placeholders to high-speed Cloudinary CDN URLs.
 */
export function getImageUrl(path, options = {}) {
  if (!path) return getPlaceholderUrl(options);

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (cloudinaryMap[path]) return cloudinaryMap[path];

  const withSlash = path.startsWith("/") ? path : `/${path}`;
  if (cloudinaryMap[withSlash]) return cloudinaryMap[withSlash];

  const withoutSlash = path.startsWith("/") ? path.slice(1) : path;
  if (cloudinaryMap[withoutSlash]) return cloudinaryMap[withoutSlash];

  const basename = path.split("/").pop();
  if (cloudinaryMap[basename]) return cloudinaryMap[basename];

  return path;
}

/**
 * Resolves an image path. If it's a mock local path for products/categories that doesn't exist yet,
 * it automatically generates and returns a beautiful placeholder.
 */
export function resolveImage(path, options = {}) {
  if (!path) return getPlaceholderUrl(options);

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (cloudinaryMap[path]) return cloudinaryMap[path];
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  if (cloudinaryMap[withSlash]) return cloudinaryMap[withSlash];
  const withoutSlash = path.startsWith("/") ? path.slice(1) : path;
  if (cloudinaryMap[withoutSlash]) return cloudinaryMap[withoutSlash];
  const basename = path.split("/").pop();
  if (cloudinaryMap[basename]) return cloudinaryMap[basename];

  if (path.startsWith("/images/products/") || path.startsWith("/images/categories/") || path.startsWith("/images/regions/")) {
    return getPlaceholderUrl(options);
  }

  return getImageUrl(path, options);
}

/**
 * Generate a beautiful image URL.
 * Maps keywords to our high-resolution Cloudinary placeholder URLs.
 */
export function getPlaceholderUrl({
  width = 800,
  height = 600,
  text = "PickleCart",
} = {}) {
  const lower = text.toLowerCase();
  let relPath = '/images/placeholders/pickle.jpg';

  if (lower.includes('gongura')) relPath = '/images/placeholders/gongura.jpg';
  else if (lower.includes('chicken') || lower.includes('mutton') || lower.includes('prawn') || lower.includes('non-veg')) relPath = '/images/placeholders/mutton.jpg';
  else if (lower.includes('oil')) relPath = '/images/placeholders/oil.jpg';
  else if (lower.includes('millet') || lower.includes('grocer') || lower.includes('idli')) relPath = '/images/placeholders/millet.jpg';
  else if (lower.includes('snack') || lower.includes('murukku') || lower.includes('mixture') || lower.includes('pakoda')) relPath = '/images/placeholders/snack.jpg';
  else if (lower.includes('sweet') || lower.includes('laddu')) relPath = '/images/placeholders/sweet.jpg';
  else if (lower.includes('podi') || lower.includes('powder') || lower.includes('karam') || lower.includes('chutney')) relPath = '/images/placeholders/food-1.jpg';

  return cloudinaryMap[relPath] || relPath;
}

/**
 * Get optimized hero image props for Next.js Image.
 */
export function getHeroImageProps(slide) {
  return {
    src: slide.image || getPlaceholderUrl({ width: 1920, height: 1080, text: slide.title }),
    alt: slide.title || "PickleCart Hero",
    fill: true,
    priority: slide.id === "andhra-heritage", // only first slide is priority
    sizes: "(max-width: 768px) 100vw, 100vw",
    quality: 85,
    style: { objectFit: "cover" },
  };
}

/**
 * Get product image props for Next.js Image.
 */
export function getProductImageProps(product, index = 0) {
  const src =
    product.images?.[index] ||
    getPlaceholderUrl({ width: 600, height: 600, text: product.name });

  return {
    src,
    alt: product.name,
    width: 600,
    height: 600,
    sizes: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
    quality: 80,
    style: { objectFit: "cover" },
  };
}
