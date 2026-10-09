"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { resolveImage } from "@/services/images";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();

  // Body scroll lock
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isDrawerOpen) closeDrawer();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-warm-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display text-lg font-bold text-charcoal flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
            {itemCount > 0 && (
              <span className="text-sm font-body font-normal text-charcoal-muted">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="p-2 text-charcoal-light hover:text-charcoal transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-green"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-charcoal-muted/30 mb-4" />
              <p className="font-display text-lg text-charcoal mb-2">
                Your cart is empty
              </p>
              <p className="text-sm font-body text-charcoal-muted mb-6">
                Discover authentic Indian pickles and traditional food products.
              </p>
              <Button href="/south-indian" onClick={closeDrawer} size="sm">
                Start Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3 pb-4 border-b border-border-light last:border-0"
                >
                  {/* Image */}
                  <div 
                    className="w-16 h-16 rounded-sm bg-cream-dark bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${resolveImage(item.image, { width: 100, height: 100, text: item.name })})` }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-charcoal truncate">
                      {item.name}
                    </p>
                    <p className="text-xs font-body text-charcoal-muted mt-0.5">
                      {item.variantLabel}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-border rounded-sm">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="p-1.5 text-charcoal-muted hover:text-charcoal transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-body font-medium text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1
                            )
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          className="p-1.5 text-charcoal-muted hover:text-charcoal transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-body font-semibold text-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="p-1 text-charcoal-muted hover:text-pickle-red transition-colors self-start"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-charcoal-muted">Subtotal</span>
              <span className="text-lg font-display font-bold text-charcoal">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs font-body text-charcoal-muted">
              Shipping calculated at checkout
            </p>
            <div className="flex gap-2">
              <Button
                href="/cart"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={closeDrawer}
              >
                View Cart
              </Button>
              <Button
                href="/checkout"
                size="sm"
                className="flex-1"
                onClick={closeDrawer}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
