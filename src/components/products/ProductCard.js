"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Heart, Check } from "lucide-react";
import { formatPrice, sortVariantsByWeight } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { resolveImage } from "@/services/images";

export default function ProductCard({ product, className = "" }) {
  const { addItem, openDrawer } = useCart();
  const rawVariants = useMemo(() => product.pricing || product.variants || [], [product.pricing, product.variants]);
  const variants = useMemo(() => sortVariantsByWeight(rawVariants), [rawVariants]);
  const [selectedVariant, setSelectedVariant] = useState(
    () => variants[0] || { price: product.price || 0, label: "Default", id: "default" }
  );
  const [isAdding, setIsAdding] = useState(false);

  // Sync to smallest starting weight whenever the product changes
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    } else {
      setSelectedVariant({ price: product.price || 0, label: "Default", id: "default" });
    }
  }, [product.id, variants]);

  const isVariantActive = (v) => {
    if (!selectedVariant) return false;
    if (v.id && selectedVariant.id) return v.id === selectedVariant.id;
    if (v.weight && selectedVariant.weight) return v.weight === selectedVariant.weight;
    if (v.label && selectedVariant.label) return v.label === selectedVariant.label;
    return v === selectedVariant;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const price = selectedVariant?.price ?? product.price ?? 0;
    const variantId = selectedVariant?.id || selectedVariant?.weight || selectedVariant?.label || "default";
    const variantLabel = selectedVariant?.weight || selectedVariant?.label || "Default";

    addItem({
      productId: product.id,
      variantId,
      name: product.name,
      variantLabel,
      price,
      image: product.image || product.images?.[0] || null,
    });

    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      openDrawer();
    }, 400);
  };

  const productImg = product.image || product.images?.[0] || null;
  const imageUrl = resolveImage(productImg, { width: 400, height: 400, text: product.name });

  const currentPrice = selectedVariant?.price ?? product.price ?? 0;
  const compareAtPrice = selectedVariant?.originalPrice || product.compareAtPrice;
  const hasDiscount = compareAtPrice && compareAtPrice > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
    : (product.discountPercentage || 0);

  return (
    <div className={`group relative flex flex-col h-full bg-warm-white rounded-2xl border border-border-light overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
      {/* Badges - Left */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.bestSeller && <Badge variant="bestseller">Bestseller</Badge>}
        {(!product.inStock && !variants.some(v => v.inStock)) && <Badge variant="outOfStock">Out of Stock</Badge>}
      </div>

      {/* Badges - Right */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
          <Badge variant="discount">{discountPercentage}% Off</Badge>
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.slug || product.id}`} className="block relative aspect-square overflow-hidden bg-cream-dark">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="p-3.5 md:p-4 flex flex-col flex-grow">
        {/* Name */}
        <Link href={`/product/${product.slug || product.id}`}>
          <h3 className="font-body text-sm font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-heritage-green transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Bottom Actions Container (Pushed to bottom) */}
        <div className="mt-auto pt-3">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-body font-bold text-charcoal">
              {formatPrice(currentPrice)}
            </span>
            {compareAtPrice && (
              <span className="text-sm font-body text-charcoal-muted line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {variants.map((v, idx) => {
                const active = isVariantActive(v);
                return (
                  <button
                    key={v.id || v.weight || idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(v);
                    }}
                    className={`px-2.5 py-1 text-xs font-body rounded-full border transition-all duration-200 cursor-pointer ${
                      active
                        ? "border-heritage-green bg-heritage-green text-warm-white font-semibold shadow-xs"
                        : "border-border-light bg-warm-white text-charcoal-muted hover:border-charcoal-muted/60 hover:text-charcoal"
                    }`}
                    aria-label={`Select ${v.weight || v.label}`}
                    aria-pressed={active}
                  >
                    {v.weight || v.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock && !selectedVariant?.inStock || isAdding}
            className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5 text-sm font-body font-semibold rounded-full transition-all duration-300 ${
              isAdding
                ? "bg-heritage-green text-white"
                : (product.inStock || selectedVariant?.inStock)
                ? "bg-charcoal text-warm-white hover:bg-heritage-green active:scale-95 cursor-pointer"
                : "bg-charcoal-muted/20 text-charcoal-muted cursor-not-allowed"
            }`}
          >
            {isAdding ? <Check size={16} /> : <ShoppingBag size={16} />}
            {isAdding ? "Added!" : (product.inStock || selectedVariant?.inStock) ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

