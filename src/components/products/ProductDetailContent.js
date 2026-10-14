"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, ShoppingCart, Minus, Plus, ChevronRight, Truck, Shield, PackageCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, sortVariantsByWeight } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import { resolveImage } from "@/services/images";

export default function ProductDetailContent({
  product,
  relatedProducts,
  regionNames,
  categoryNames,
}) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const rawVariants = useMemo(() => product.pricing || product.variants || [], [product.pricing, product.variants]);
  const variants = useMemo(() => sortVariantsByWeight(rawVariants), [rawVariants]);
  const [selectedVariant, setSelectedVariant] = useState(
    () => variants[0] || { price: product.price || 0, label: "Default", id: "default" }
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

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

  const isOutOfStock = product.inStock === false && !selectedVariant?.inStock;
  const currentPrice = selectedVariant?.price ?? product.price ?? 0;

  const handleAddToCart = () => {
    const variantId = selectedVariant?.id || selectedVariant?.weight || selectedVariant?.label || "default";
    const variantLabel = selectedVariant?.weight || selectedVariant?.label || "Default";

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        variantId,
        name: product.name,
        variantLabel,
        price: currentPrice,
        image: product.image || product.images?.[0] || null,
      });
    }
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      openDrawer();
    }, 500);
  };

  const handleBuyNow = () => {
    const variantId = selectedVariant?.id || selectedVariant?.weight || selectedVariant?.label || "default";
    const variantLabel = selectedVariant?.weight || selectedVariant?.label || "Default";

    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        variantId,
        name: product.name,
        variantLabel,
        price: currentPrice,
        image: product.image || product.images?.[0] || null,
      });
    }
    router.push("/checkout");
  };

  const productImg = product.image || product.images?.[selectedImageIndex] || null;
  const mainImage = resolveImage(productImg, { width: 800, height: 800, text: product.name });

  const compareAtPrice = selectedVariant?.originalPrice || product.compareAtPrice;
  const hasDiscount = compareAtPrice && compareAtPrice > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
    : (product.discountPercentage || 0);

  return (
    <div className="bg-warm-white min-h-screen">
      <div className="container-main py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm font-body text-charcoal-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight size={14} />
          {regionNames[0] && (
            <>
              <Link href="/south-indian" className="hover:text-charcoal transition-colors">South Indian</Link>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-charcoal font-medium truncate">{product.name}</span>
        </nav>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="lg:max-w-xl mx-auto w-full">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-cream-dark mb-4 shadow-sm border border-black/5">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => {
                  const thumbUrl = resolveImage(img, { width: 150, height: 150, text: product.name });
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === i
                          ? "border-heritage-green"
                          : "border-border hover:border-charcoal-muted"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image
                        src={thumbUrl}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        fill
                        loading="lazy"
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.bestSeller && <Badge variant="bestseller">Bestseller</Badge>}
              {discountPercentage > 0 && (
                <Badge variant="discount">{discountPercentage}% Off</Badge>
              )}
            </div>

            {/* Categories & Region */}
            <div className="flex flex-wrap gap-2 text-xs font-body text-charcoal-muted mb-2">
              {categoryNames.map((name) => (
                <span key={name} className="px-2 py-0.5 bg-cream rounded-sm">{name}</span>
              ))}
              {regionNames.map((name) => (
                <span key={name} className="px-2 py-0.5 bg-cream rounded-sm">{name}</span>
              ))}
            </div>

            {/* Product Name */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Removed Rating per user request */}



            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-display font-bold text-charcoal">
                {formatPrice(currentPrice)}
              </span>
              {compareAtPrice && (
                <span className="text-lg font-body text-charcoal-muted line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-sm font-body font-semibold text-pickle-red px-2 py-1 bg-red-50 rounded-md">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {/* Variants */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm font-body font-medium text-charcoal mb-2">
                Size / Weight
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => {
                  const active = isVariantActive(v);
                  return (
                    <button
                      key={v.id || v.weight || idx}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-sm font-body rounded-md border-2 transition-all duration-200 cursor-pointer ${
                        active
                          ? "border-heritage-green bg-heritage-green text-warm-white font-semibold shadow-xs"
                          : "border-border bg-white text-charcoal-light hover:border-charcoal-muted hover:text-charcoal"
                      }`}
                      aria-pressed={active}
                    >
                      {v.weight || v.label}
                    </button>
                  );
                })}
              </div>
              {selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                <p className="text-xs font-body text-pickle-red mt-1.5">
                  Only {selectedVariant.stock} left in stock
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-5">
              <p className="text-sm font-body font-medium text-charcoal mb-2">Quantity</p>
              <div className="flex items-center border border-border rounded-sm w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="p-2.5 text-charcoal-muted hover:text-charcoal transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 text-base font-body font-semibold text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  aria-label="Increase quantity"
                  className="p-2.5 text-charcoal-muted hover:text-charcoal transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart size={18} className="mr-2" />
                {isAdding ? "Added to Cart!" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <Truck size={18} className="text-heritage-green" />
                </div>
                <p className="text-xs font-body text-charcoal-muted font-medium">Pan-India Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <Shield size={18} className="text-heritage-green" />
                </div>
                <p className="text-xs font-body text-charcoal-muted font-medium">Quality Assured</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <PackageCheck size={18} className="text-heritage-green" />
                </div>
                <p className="text-xs font-body text-charcoal-muted font-medium">Freshness Sealed</p>
              </div>
            </div>


          </div>
        </div>

        {/* Extended Details Section (Premium Tabs) */}
        <div className="mt-12 md:mt-16 pt-10 border-t border-border w-full flex flex-col items-center">
          
          {/* Tab Controls (Pill Style) */}
          <div className="flex w-full bg-cream p-2 rounded-full mb-8 border border-border-light shadow-sm overflow-x-auto no-scrollbar">
            {["description", "ingredients", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-full text-sm md:text-base font-display font-bold capitalize transition-all duration-300 whitespace-nowrap text-center ${
                  activeTab === tab
                    ? "bg-white text-heritage-green shadow-sm"
                    : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Box */}
          <div className="w-full bg-cream/30 p-6 md:p-10 rounded-3xl border border-border-light min-h-[250px]">
            {activeTab === "description" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-display text-2xl font-bold text-charcoal mb-4">About this Product</h3>
                <div className="font-body text-charcoal-light text-base md:text-lg leading-relaxed whitespace-pre-line break-words">
                  {product.description}
                </div>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-display text-2xl font-bold text-charcoal mb-4">Ingredients</h3>
                <p className="font-body text-charcoal-light text-base md:text-lg leading-relaxed break-words">
                  {product.ingredients 
                    ? (Array.isArray(product.ingredients) ? product.ingredients.join(", ") : product.ingredients)
                    : "No ingredients information provided."}
                </p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-display text-2xl font-bold text-charcoal mb-4">Shipping Information</h3>
                <div className="space-y-3 font-body text-charcoal-light text-base md:text-lg leading-relaxed">
                  <p>We deliver across India. Orders are typically dispatched within 1–2 business days.</p>
                  <p>Standard delivery takes 4–7 business days depending on your location.</p>
                  <p>You will receive tracking information via email once your order is shipped.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-16 pt-8 border-t border-border">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
