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
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      variantLabel: selectedVariant.label,
      price: selectedVariant.price,
      image: product.images?.[0] || null,
    });

    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      openDrawer();
    }, 400);
  };

  const imageUrl = resolveImage(product.images?.[0], { width: 400, height: 400, text: product.name });

  return (
    <div className={`group relative flex flex-col h-full bg-warm-white rounded-2xl border border-border-light overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.discountPercentage > 0 && (
          <Badge variant="discount">{product.discountPercentage}% Off</Badge>
        )}
        {product.bestSeller && <Badge variant="bestseller">Bestseller</Badge>}
        {!product.inStock && <Badge variant="outOfStock">Out of Stock</Badge>}
      </div>

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-cream-dark">
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
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-body text-sm font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-heritage-green transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-turmeric-gold text-turmeric-gold"
                      : "text-charcoal-muted/30"
                  }
                />
              ))}
            </div>
            <span className="text-xs font-body text-charcoal-muted">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Bottom Actions Container (Pushed to bottom) */}
        <div className="mt-auto pt-3">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-body font-bold text-charcoal">
              {formatPrice(selectedVariant.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm font-body text-charcoal-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(v);
                  }}
                  className={`px-2.5 py-1 text-xs font-body rounded-full border transition-all duration-200 ${
                    selectedVariant.id === v.id
                      ? "border-heritage-green bg-heritage-green/5 text-heritage-green font-medium"
                      : "border-border text-charcoal-muted hover:border-charcoal-muted"
                  }`}
                  aria-label={`Select ${v.label}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5 text-sm font-body font-semibold rounded-full transition-all duration-300 ${
              isAdding
                ? "bg-heritage-green text-white"
                : product.inStock
                ? "bg-charcoal text-warm-white hover:bg-heritage-green active:scale-95"
                : "bg-charcoal-muted/20 text-charcoal-muted cursor-not-allowed"
            }`}
          >
            {isAdding ? <Check size={16} /> : <ShoppingBag size={16} />}
            {isAdding ? "Added!" : product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
