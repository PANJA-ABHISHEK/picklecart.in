"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart, itemCount } = useCart();

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
                className="flex gap-4 p-4 bg-cream rounded-sm border border-border-light"
              >
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-sm bg-cream-dark flex items-center justify-center shrink-0">
                  <span className="text-sm text-charcoal-muted font-body">
                    {item.name?.charAt(0) || "P"}
                  </span>
                </div>

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
                    <div className="flex items-center border border-border rounded-sm">
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
            <div className="bg-cream rounded-sm border border-border-light p-6">
              <h2 className="font-display text-lg font-bold text-charcoal mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm font-body">
                <div className="flex justify-between text-charcoal-light">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-light">
                  <span>Shipping</span>
                  <span className="text-heritage-green font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-charcoal font-semibold text-base">
                  <span>Total</span>
                  <span className="font-display font-bold">{formatPrice(subtotal)}</span>
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
