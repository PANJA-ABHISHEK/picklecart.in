"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getProductsByRegion, getProducts, sortProducts } from "@/services/products";
import { SORT_OPTIONS } from "@/lib/constants";
import ProductCard from "@/components/products/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { SlidersHorizontal } from "lucide-react";

function RegionContentInner({
  title,
  description,
  regions,
  categories,
  regionFilter,
  bgImage,
  showRegionFilter = false,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = searchParams.get("category") || "all";
  const activeSort = searchParams.get("sort") || "featured";

  // Get products based on region filter
  const allProducts = useMemo(() => {
    if (regionFilter) {
      return getProductsByRegion(regionFilter);
    }
    // South Indian overview — get all products from all south regions
    const regionIds = regions.map((r) => r.id);
    return getProducts().filter((p) =>
      p.regionIds.some((rid) => regionIds.includes(rid))
    );
  }, [regionFilter, regions]);

  // Filter by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return allProducts;
    return allProducts.filter((p) => p.categoryIds.includes(activeCategory));
  }, [allProducts, activeCategory]);

  // Sort
  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, activeSort);
  }, [filteredProducts, activeSort]);

  // Available categories for this region
  const availableCategories = useMemo(() => {
    const catIds = new Set();
    allProducts.forEach((p) => p.categoryIds.forEach((c) => catIds.add(c)));
    return categories.filter((c) => catIds.has(c.id));
  }, [allProducts, categories]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "featured") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative h-[250px] md:h-[350px] lg:h-[380px] bg-heritage-green-dark bg-cover bg-center flex items-center justify-center"
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-charcoal/30" />}
        <div className="relative z-10 container-main flex flex-col items-center justify-center text-center mt-[-20px] md:mt-[-40px]">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white drop-shadow-lg">
            {title}
          </h1>
          <p className="font-body text-warm-white/95 mt-3 md:mt-5 text-base md:text-xl max-w-2xl mx-auto drop-shadow-md leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </div>

      <div className="container-main py-8 md:py-12">
        {/* Filters & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam("category", "all")}
              style={{ cursor: "pointer" }}
              className={`px-4 py-2 text-sm font-body font-medium rounded-full border transition-all duration-200 ${activeCategory === "all"
                  ? "border-heritage-green bg-heritage-green text-white"
                  : "border-border bg-warm-white text-charcoal-light hover:border-charcoal-muted"
                }`}
            >
              All
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.slug)}
                style={{ cursor: "pointer" }}
                className={`px-4 py-2 text-sm font-body font-medium rounded-full border transition-all duration-200 ${activeCategory === cat.slug
                    ? "border-heritage-green bg-heritage-green text-white"
                    : "border-border bg-warm-white text-charcoal-light hover:border-charcoal-muted"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={16} className="text-charcoal-muted" />
            <select
              value={activeSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              style={{ cursor: "pointer" }}
              className="text-sm font-body text-charcoal bg-warm-white border border-border rounded-full px-4 py-2 focus:outline-none focus:border-heritage-green"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product count */}
        <p className="text-sm font-body text-charcoal-muted mb-6">
          {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"} found
        </p>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-display text-xl text-charcoal mb-2">
              No products found
            </p>
            <p className="font-body text-charcoal-muted">
              Try selecting a different category or clearing your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegionPageContent(props) {
  return (
    <Suspense
      fallback={
        <div className="bg-cream min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-heritage-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RegionContentInner {...props} />
    </Suspense>
  );
}
