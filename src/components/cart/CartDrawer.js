"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
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
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm sm:max-w-md bg-[#FAF6EE] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DFC9] bg-white">
          <h2 className="font-display text-lg font-bold text-charcoal flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#8C2D19]" />
            Your Cart
            {itemCount > 0 && (
              <span className="text-xs font-body font-normal text-charcoal-muted">
                ({itemCount})
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="p-1.5 text-charcoal-muted hover:text-charcoal transition-colors rounded-lg focus:outline-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFC9] flex items-center justify-center mb-3 text-[#8C2D19]">
                <ShoppingBag size={32} />
              </div>
              <p className="font-display text-lg font-bold text-charcoal mb-1">
                Your cart is empty
              </p>
              <p className="text-xs font-body text-charcoal-muted mb-6 max-w-xs">
                Explore our traditional pickles, pods, and regional sweets.
              </p>
              <Button href="/south-indian" onClick={closeDrawer} size="sm" className="bg-[#8C2D19] hover:bg-[#732414] text-white rounded-xl">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="bg-white border border-[#E8DFC9] rounded-2xl p-3.5 shadow-2xs flex gap-3 items-center"
                >
                  {/* Thumbnail Image */}
                  <div 
                    className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0 border border-[#E8DFC9] bg-cream-dark"
                    style={{ backgroundImage: `url(${resolveImage(item.image, { width: 100, height: 100, text: item.name })})` }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0 pr-1">
                        <p className="text-sm font-display font-bold text-charcoal truncate">
                          {item.name}
                        </p>
                        <p className="text-xs font-body text-charcoal-muted mt-0.5">
                          {item.variantLabel || "Standard"}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-charcoal-muted hover:text-pickle-red transition-colors p-1 cursor-pointer shrink-0"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price */}
                      <span className="text-sm font-body font-semibold text-charcoal">
                        {formatPrice(item.price)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DFD5C0] rounded-full px-2 py-0.5 bg-[#FAF6EE] shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1 text-charcoal-muted hover:text-charcoal cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 text-xs font-bold text-charcoal font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1 text-charcoal-muted hover:text-charcoal cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Two Stacked Action Buttons */}
        {items.length > 0 && (
          <div className="border-t border-[#E8DFC9] px-5 py-4 space-y-3 bg-[#FAF6EE]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-charcoal font-medium">Subtotal</span>
              <span className="text-base font-display font-bold text-charcoal">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="text-xs font-body text-charcoal-muted">
              Shipping &amp; taxes calculated at checkout
            </p>

            {/* Stacked Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <Link
                href="/cart"
                onClick={closeDrawer}
                style={{ color: "#FFFFFF" }}
                className="w-full bg-[#8C2D19] hover:bg-[#732414] !text-white text-white py-3 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 text-sm text-center cursor-pointer"
              >
                <span style={{ color: "#FFFFFF" }} className="!text-white text-white">Go to Checkout</span>
                <ArrowRight size={16} className="!text-white text-white" style={{ color: "#FFFFFF" }} />
              </Link>

              <button
                type="button"
                onClick={closeDrawer}
                className="w-full bg-white hover:bg-[#F3EAD7] border border-[#DFD5C0] text-charcoal py-3 rounded-xl font-semibold text-sm transition-all text-center cursor-pointer shadow-2xs"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
