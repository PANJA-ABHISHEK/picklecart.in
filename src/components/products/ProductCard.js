"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Heart, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import Badge from "@/components/ui/Badge";
import { resolveImage } from "@/services/images";

export default function ProductCard({ product, className = "" }) {
  const { addItem, openDrawer } = useCart();
  const variants = product.pricing || product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || { price: 0, label: "Default", id: "default" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      variantLabel: selectedVariant.weight || selectedVariant.label || "Default",
      price: selectedVariant.price,
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

  const compareAtPrice = selectedVariant.originalPrice || product.compareAtPrice;
  const hasDiscount = compareAtPrice && compareAtPrice > selectedVariant.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((compareAtPrice - selectedVariant.price) / compareAtPrice) * 100)
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
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label={product.name}
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

        {/* Removed Rating per user request */}

        {/* Bottom Actions Container (Pushed to bottom) */}
        <div className="mt-auto pt-3">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-body font-bold text-charcoal">
              {formatPrice(selectedVariant.price)}
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
              {variants.map((v, idx) => (
                <button
                  key={v.id || idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(v);
                  }}
                  className={`px-2.5 py-1 text-xs font-body rounded-full border transition-all duration-200 ${
                    selectedVariant.id === v.id
                      ? "border-heritage-green bg-heritage-green/5 text-heritage-green font-medium"
                      : "border-border text-charcoal-muted hover:border-charcoal-muted"
                  }`}
                  aria-label={`Select ${v.weight || v.label}`}
                >
                  {v.weight || v.label}
                </button>
              ))}
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
                ? "bg-charcoal text-warm-white hover:bg-heritage-green active:scale-95"
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
