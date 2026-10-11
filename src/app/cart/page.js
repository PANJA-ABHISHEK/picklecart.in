"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { resolveImage } from "@/services/images";
import { validatePromoCode } from "@/services/promocodes";

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    subtotal, 
    clearCart, 
    itemCount,
    appliedPromo,
    isPromoValid,
    discountAmount,
    total,
    applyPromo,
    removePromo
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError("");
    
    const result = await validatePromoCode(promoInput, subtotal);
    if (result.valid) {
      applyPromo(result.promo);
      setPromoInput("");
    } else {
      setPromoError(result.error);
    }
    
    setIsApplyingPromo(false);
  };

  if (items.length === 0) {
    return (
      <div className="bg-warm-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={56} className="mx-auto text-charcoal-muted/30 mb-4" />
          <h1 className="font-display text-2xl font-bold text-charcoal mb-2">
            Your Cart is Empty
          </h1>
          <p className="font-body text-charcoal-muted mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button href="/south-indian" size="lg">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-white min-h-screen">
      <div className="container-main py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
            Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </h1>
          <button
            onClick={clearCart}
            className="text-sm font-body text-charcoal-muted hover:text-pickle-red transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 p-4 bg-surface rounded-2xl shadow-sm border border-border-light"
              >
                {/* Image */}
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-cream-dark bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${resolveImage(item.image, { width: 150, height: 150, text: item.name })})` }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-body font-semibold text-charcoal text-sm md:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs font-body text-charcoal-muted mt-0.5">
                    {item.variantLabel}
                  </p>
                  <p className="text-sm font-body font-semibold text-charcoal mt-1">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-border rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="p-2 text-charcoal-muted hover:text-charcoal transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-body font-medium text-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="p-2 text-charcoal-muted hover:text-charcoal transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-base font-body font-bold text-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  aria-label={`Remove ${item.name}`}
                  className="p-1 text-charcoal-muted hover:text-pickle-red transition-colors self-start"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <Link
              href="/south-indian"
              className="inline-flex items-center gap-2 text-sm font-body text-heritage-green hover:text-heritage-green-dark transition-colors mt-4"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6 md:p-8">
              <h2 className="font-display text-lg font-bold text-charcoal mb-4">
                Order Summary
              </h2>

              {/* Promo Code Section */}
              <div className="mb-6 space-y-2">
                {!appliedPromo || !isPromoValid ? (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-earthy-brown font-mono uppercase"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo || !promoInput.trim()}
                        className="px-4 py-2 bg-earthy-brown text-white text-sm font-semibold rounded-lg hover:bg-earthy-brown-dark transition-colors disabled:opacity-50"
                      >
                        {isApplyingPromo ? "..." : "Apply"}
                      </button>
                    </div>
                    {promoError && <p className="text-pickle-red text-xs mt-1 font-medium">{promoError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-heritage-green/10 px-3 py-2 rounded-lg border border-heritage-green/20">
                    <div className="flex items-center gap-2 text-heritage-green">
                      <Tag size={14} />
                      <span className="text-sm font-bold font-mono">{appliedPromo.code}</span>
                    </div>
                    <button onClick={removePromo} className="text-xs text-charcoal-muted hover:text-pickle-red underline">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between text-charcoal-light">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {appliedPromo && isPromoValid && (
                  <div className="flex justify-between text-heritage-green font-medium">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-charcoal-light">
                  <span>Shipping</span>
                  <span className="text-heritage-green font-medium">Calculated at checkout</span>
                </div>
                
                <div className="border-t border-border pt-3 flex justify-between text-charcoal font-semibold text-base">
                  <span>Total</span>
                  <span className="font-display font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              <Button href="/checkout" size="lg" className="w-full mt-5">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
