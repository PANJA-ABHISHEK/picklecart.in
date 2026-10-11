"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { sortProducts } from "@/services/products";
import { SORT_OPTIONS } from "@/lib/constants";
import ProductCard from "@/components/products/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { SlidersHorizontal, Search } from "lucide-react";

function RegionContentInner({
  title,
  description,
  regions,
  categories,
  regionFilter,
  bgImage,
  showRegionFilter = false,
  allProducts = [],
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = searchParams.get("category") || "all";
  const activeSort = searchParams.get("sort") || "featured";
  const searchQuery = searchParams.get("search") || "";
  
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Filter by category and search
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    
    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((p) => {
        const pCats = p.categoryIds || (p.categoryId ? [p.categoryId] : []);
        return pCats.includes(activeCategory);
      });
    }

    // Filter by search query (instant local filtering)
    if (localSearch.trim().length > 0) {
      const q = localSearch.toLowerCase().trim();
      result = result.filter((p) => {
        const searchable = [p.name, p.description, p.shortDescription].join(" ").toLowerCase();
        return searchable.includes(q);
      });
    }
    
    return result;
  }, [allProducts, activeCategory, localSearch]);

  // Sort
  const [sortedProducts, setSortedProducts] = useState([...filteredProducts]);

  useEffect(() => {
    // sortProducts is now an async server action, so we must await it
    // Wait, since sortProducts is a server action, it returns a promise.
    // However, since it just does array sorting, we can either re-implement sorting locally 
    // or just await it. Local sorting is much faster for UI state.
    const sorted = [...filteredProducts];
    switch (activeSort) {
      case "price-low":
        sorted.sort((a, b) => Math.min(...a.pricing.map(p => p.price)) - Math.min(...b.pricing.map(p => p.price)));
        break;
      case "price-high":
        sorted.sort((a, b) => Math.min(...b.pricing.map(p => p.price)) - Math.min(...a.pricing.map(p => p.price)));
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "featured":
      default:
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
          return 0;
        });
    }
    setSortedProducts(sorted);
  }, [filteredProducts, activeSort]);

  // Available categories for this region
  const availableCategories = useMemo(() => {
    const catIds = new Set();
    allProducts.forEach((p) => {
      const pCats = p.categoryIds || (p.categoryId ? [p.categoryId] : []);
      pCats.forEach((c) => catIds.add(c));
    });
    return categories.filter((c) => catIds.has(c.id) || catIds.has(c.slug));
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
        className="relative h-[280px] md:h-[400px] lg:h-[450px] bg-heritage-green-dark bg-cover bg-center flex items-center justify-center"
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-charcoal/40 mix-blend-multiply" />}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        <div className="relative z-10 container-main flex flex-col items-center justify-center text-center mt-[-30px] md:mt-[-50px]">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-white to-[#E8D4B4] bg-clip-text text-transparent drop-shadow-md text-balance mb-4">
            {title}
          </h1>
          <p className="font-body text-[#F3E5C8]/90 text-base md:text-xl max-w-2xl mx-auto drop-shadow leading-relaxed font-medium text-balance">
            {description}
          </p>
        </div>
        
        {/* Wavy shape divider matching homepage */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12 lg:h-16 relative block">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-cream" />
          </svg>
        </div>
      </div>

      <div className="container-main py-8 md:py-12">
        {/* Filters & Sort Bar */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Top Row: Search & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search products in this region..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full focus:rounded-full border border-border focus:border-heritage-green bg-warm-white text-sm font-body text-charcoal !outline-none focus:!outline-none focus:ring-1 focus:ring-heritage-green/20 transition-all shadow-sm"
              />
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal size={16} className="text-charcoal-muted" />
              <select
                value={activeSort}
                onChange={(e) => updateParam("sort", e.target.value)}
                style={{ cursor: "pointer" }}
                className="text-sm font-body text-charcoal bg-warm-white border border-border rounded-full focus:rounded-full px-4 py-2 !outline-none focus:!outline-none focus:ring-1 focus:ring-heritage-green/20 focus:border-heritage-green shadow-sm transition-all"
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

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateParam("category", "all")}
              style={{ cursor: "pointer" }}
              className={`px-5 py-2 text-sm font-body font-medium rounded-full border transition-all duration-200 shadow-sm ${activeCategory === "all"
                  ? "border-heritage-green bg-heritage-green text-white"
                  : "border-border bg-warm-white text-charcoal-light hover:border-charcoal-muted hover:text-charcoal"
                }`}
            >
              All
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.slug)}
                style={{ cursor: "pointer" }}
                className={`px-5 py-2 text-sm font-body font-medium rounded-full border transition-all duration-200 shadow-sm ${activeCategory === cat.slug
                    ? "border-heritage-green bg-heritage-green text-white"
                    : "border-border bg-warm-white text-charcoal-light hover:border-charcoal-muted hover:text-charcoal"
                  }`}
              >
                {cat.name}
              </button>
            ))}
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
