"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Minus, Plus, ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductCard from "@/components/products/ProductCard";
import { resolveImage } from "@/services/images";

export default function ProductDetailContent({
  product,
  relatedProducts,
  regionNames,
  categoryNames,
}) {
  const { addItem, openDrawer } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        variantLabel: selectedVariant.label,
        price: selectedVariant.price,
        image: product.images?.[0] || null,
      });
    }
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      openDrawer();
    }, 500);
  };

  const mainImage = resolveImage(product.images?.[selectedImageIndex], { width: 800, height: 800, text: product.name });

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
          <div>
            {/* Main Image */}
            <div className="aspect-square rounded-sm overflow-hidden bg-cream-dark mb-3">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${mainImage})` }}
                role="img"
                aria-label={product.name}
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
                      className={`w-16 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                        selectedImageIndex === i
                          ? "border-heritage-green"
                          : "border-border hover:border-charcoal-muted"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${thumbUrl})` }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.bestSeller && <Badge variant="bestseller">Bestseller</Badge>}
              {product.discountPercentage > 0 && (
                <Badge variant="discount">{product.discountPercentage}% Off</Badge>
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
            <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-turmeric-gold text-turmeric-gold"
                          : "text-charcoal-muted/20"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-body text-charcoal-muted">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Short description */}
            <p className="font-body text-charcoal-light mt-3 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl font-display font-bold text-charcoal">
                {formatPrice(selectedVariant.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg font-body text-charcoal-muted line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-sm font-body font-semibold text-pickle-red">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Variants */}
            <div className="mt-5">
              <p className="text-sm font-body font-medium text-charcoal mb-2">
                Size / Weight
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 text-sm font-body rounded-sm border-2 transition-all duration-200 ${
                      selectedVariant.id === v.id
                        ? "border-heritage-green bg-heritage-green/5 text-heritage-green font-semibold"
                        : "border-border text-charcoal-light hover:border-charcoal-muted"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
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
                disabled={!product.inStock || isAdding}
                size="lg"
                className="flex-1"
              >
                <ShoppingBag size={18} className="mr-2" />
                {isAdding ? "Added to Cart!" : "Add to Cart"}
              </Button>
              <Button
                href="/checkout"
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <Truck size={18} className="mx-auto text-heritage-green mb-1" />
                <p className="text-xs font-body text-charcoal-muted">Pan-India Delivery</p>
              </div>
              <div className="text-center">
                <Shield size={18} className="mx-auto text-heritage-green mb-1" />
                <p className="text-xs font-body text-charcoal-muted">Quality Assured</p>
              </div>
              <div className="text-center">
                <RotateCcw size={18} className="mx-auto text-heritage-green mb-1" />
                <p className="text-xs font-body text-charcoal-muted">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12 md:mt-16 border-t border-border pt-8">
          <div className="flex gap-6 mb-6 border-b border-border">
            {["description", "ingredients", "storage", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-body font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-heritage-green text-heritage-green"
                    : "border-transparent text-charcoal-muted hover:text-charcoal"
                }`}
              >
                {tab === "storage" ? "Storage & Shelf Life" : tab}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === "description" && (
              <p className="font-body text-charcoal-light leading-relaxed">
                {product.description}
              </p>
            )}
            {activeTab === "ingredients" && (
              <p className="font-body text-charcoal-light leading-relaxed">
                {product.ingredients || "Ingredients information will be available soon."}
              </p>
            )}
            {activeTab === "storage" && (
              <div className="space-y-3">
                <p className="font-body text-charcoal-light">
                  <strong className="text-charcoal">Storage:</strong> {product.storageInfo}
                </p>
                <p className="font-body text-charcoal-light">
                  <strong className="text-charcoal">Shelf Life:</strong> {product.shelfLife}
                </p>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-3 font-body text-charcoal-light">
                <p>We deliver across India. Orders are typically dispatched within 1–2 business days.</p>
                <p>Standard delivery takes 4–7 business days depending on your location.</p>
                <p>You will receive tracking information via email once your order is shipped.</p>
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
