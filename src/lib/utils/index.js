/**
 * Format a number as INR currency.
 */
export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Generate a slug from a string.
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Safely parse JSON with a fallback.
 */
export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Generate a simple unique ID.
 */
export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "mock-id-fallback";
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Check if we're running on the client.
 */
export function isClient() {
  return typeof window !== "undefined";
}

/**
 * Calculate discount percentage.
 */
export function calcDiscount(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Parse weight/volume string into a normalized numeric value (in grams / ml) for comparison.
 */
export function parseWeightValue(str) {
  if (!str) return 0;
  const s = String(str).toLowerCase().trim();
  const match = s.match(/([\d.]+)\s*(kg|k\.g|g|gm|gms|gram|grams|l|litre|litres|ml)?/i);
  if (!match) return 0;
  const num = parseFloat(match[1]) || 0;
  const unit = (match[2] || "").toLowerCase();
  if (unit === "kg" || unit === "k.g" || unit === "l" || unit === "litre" || unit === "litres") {
    return num * 1000;
  }
  return num;
}

/**
 * Sorts variants by weight ascending (smallest weight first).
 * If weights cannot be parsed or are identical, falls back to price ascending.
 */
export function sortVariantsByWeight(variants = []) {
  if (!Array.isArray(variants) || variants.length === 0) return [];
  return [...variants].sort((a, b) => {
    const wA = parseWeightValue(a.weight || a.label);
    const wB = parseWeightValue(b.weight || b.label);
    if (wA > 0 && wB > 0 && wA !== wB) {
      return wA - wB;
    }
    return (a.price || 0) - (b.price || 0);
  });
}
