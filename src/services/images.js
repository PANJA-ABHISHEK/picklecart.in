/**
 * Image Service Abstraction
 *
 * Phase 1: Uses local/placeholder images.
 * Phase 2: Will switch to Cloudinary URLs.
 *
 * All image references go through this module so
 * switching to Cloudinary requires zero component changes.
 */

/**
 * Get the image URL for a given path.
 * In Phase 1, returns the path as-is (public directory or placeholder).
 * In Phase 2, this will construct a Cloudinary URL.
 */
export function getImageUrl(path, options = {}) {
  if (!path) return getPlaceholderUrl(options);

  // Phase 2: Replace with Cloudinary transformation URL
  // const { width, height, quality } = options;
  // return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/.../${path}`;

  return path;
}

/**
 * Resolves an image path. If it's a mock local path for products/categories that doesn't exist yet,
 * it automatically generates and returns a beautiful placeholder.
 * It allows /images/hero/ paths through since we have those files.
 */
export function resolveImage(path, options = {}) {
  if (!path) return getPlaceholderUrl(options);
  
  if (path.startsWith("/images/products/") || path.startsWith("/images/categories/") || path.startsWith("/images/regions/")) {
    return getPlaceholderUrl(options);
  }
  
  return getImageUrl(path, options);
}

/**
 * Generate a beautiful image URL.
 * Since external services were failing, we use a guaranteed local food image.
 */
export function getPlaceholderUrl({
  width = 800,
  height = 600,
  text = "PickleCart",
} = {}) {
  const lower = text.toLowerCase();
  
  // Intelligently map keywords to our downloaded realistic placeholder images
  if (lower.includes('gongura')) return '/images/placeholders/gongura.jpg';
  if (lower.includes('chicken') || lower.includes('mutton') || lower.includes('prawn') || lower.includes('non-veg')) return '/images/placeholders/mutton.jpg';
  if (lower.includes('oil')) return '/images/placeholders/oil.jpg';
  if (lower.includes('millet') || lower.includes('grocer') || lower.includes('idli')) return '/images/placeholders/millet.jpg';
  if (lower.includes('snack') || lower.includes('murukku') || lower.includes('mixture') || lower.includes('pakoda')) return '/images/placeholders/snack.jpg';
  if (lower.includes('sweet') || lower.includes('laddu')) return '/images/placeholders/sweet.jpg';
  if (lower.includes('podi') || lower.includes('powder') || lower.includes('karam') || lower.includes('chutney')) return '/images/placeholders/food-1.jpg'; // Samosa/chutney for podis
  
  // By default, since this is PickleCart, return a beautiful pickle image
  return `/images/placeholders/pickle.jpg`;
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
