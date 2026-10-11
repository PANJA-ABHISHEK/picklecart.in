"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Truck, 
  ShieldCheck, 
  CreditCard,
  Percent,
  Sparkles,
  X
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { resolveImage } from "@/services/images";

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
    shippingFee,
    isFreeShipping,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
    total,
    applyPromo,
    removePromo
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchCoupons() {
      try {
        setLoadingCoupons(true);
        const res = await fetch("/api/promocodes");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setAvailableCoupons(data.coupons || []);
        }
      } catch (err) {
        console.error("Error fetching active coupons", err);
      } finally {
        if (isMounted) setLoadingCoupons(false);
      }
    }
    fetchCoupons();
    return () => { isMounted = false; };
  }, []);

  const handleApplyPromo = async (codeToApply = null) => {
    const code = (codeToApply || promoInput).trim();
    if (!code) return;
    setIsApplyingPromo(true);
    setPromoError("");
    
    try {
      const res = await fetch("/api/promocodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartTotal: subtotal }),
      });
      const result = await res.json();
      if (result.valid) {
        applyPromo(result.promo);
        setPromoInput("");
        setShowCoupons(false);
      } else {
        setPromoError(result.error || "Invalid promo code.");
      }
    } catch (err) {
      console.error("Error validating promo code", err);
      setPromoError("Failed to validate promo code. Please try again.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF6EE] min-h-screen flex items-center justify-center py-16 px-4">
        <div className="bg-white max-w-md w-full text-center p-8 md:p-10 rounded-3xl border border-[#E8DFC9] shadow-sm">
          <div className="w-20 h-20 bg-[#FAF6EE] text-[#8C2D19] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#E8DFC9]">
            <ShoppingBag size={40} />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">
            Your Cart is Empty
          </h1>
          <p className="font-body text-charcoal-muted mb-8 text-sm">
            Looks like you haven&apos;t added any traditional pickles or sweets to your cart yet.
          </p>
          <Button href="/south-indian" size="lg" className="w-full bg-[#8C2D19] hover:bg-[#732414] text-white rounded-xl shadow-md">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      <div className="container-main py-8 md:py-12">
        {/* Page Title & Clear Cart */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
              Your Cart
            </h1>
            <p className="text-xs md:text-sm text-charcoal-muted font-body mt-0.5">
              {itemCount} {itemCount === 1 ? "item" : "items"} selected for delivery
            </p>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs md:text-sm font-body text-charcoal-muted hover:text-pickle-red transition-colors underline cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          {/* Left Column: Product Table & Items */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 items-center bg-[#F4EDE0] border border-[#E8DFC9] rounded-2xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-charcoal/70">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Size</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-1 text-right">Total</div>
            </div>

            {/* Cart Items List */}
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;
              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="bg-white rounded-2xl border border-[#E8DFC9] p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200"
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 items-center gap-3">
                    {/* Product Image & Title */}
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div 
                        className="w-14 h-14 rounded-xl bg-cream-dark bg-cover bg-center shrink-0 border border-[#E8DFC9] shadow-2xs"
                        style={{ backgroundImage: `url(${resolveImage(item.image, { width: 110, height: 110, text: item.name })})` }}
                      />
                      <div className="min-w-0 pr-2">
                        <h3 className="font-display font-bold text-charcoal text-sm sm:text-base leading-snug line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-charcoal-muted font-body mt-0.5">
                          {item.variantLabel}
                        </p>
                      </div>
                    </div>

                    {/* Size Pill */}
                    <div className="col-span-2 flex justify-center">
                      <span className="bg-[#FAF0E6] text-[#8C2D19] border border-[#F0DFD3] px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono tracking-tight shadow-2xs">
                        {item.variantLabel || "Standard"}
                      </span>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-center font-body font-semibold text-charcoal text-sm sm:text-base">
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <div className="flex items-center border border-[#DFD5C0] rounded-full px-2 py-0.5 bg-[#FAF6EE] shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-charcoal font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1 text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        aria-label={`Remove ${item.name}`}
                        className="p-1 text-charcoal-muted/70 hover:text-pickle-red transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="col-span-1 text-right font-display font-bold text-charcoal text-sm sm:text-base">
                      {formatPrice(itemTotal)}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex gap-3">
                    <div 
                      className="w-16 h-16 rounded-xl bg-cream-dark bg-cover bg-center shrink-0 border border-[#E8DFC9]"
                      style={{ backgroundImage: `url(${resolveImage(item.image, { width: 130, height: 130, text: item.name })})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-bold text-charcoal text-sm leading-snug line-clamp-2">
                            {item.name}
                          </h3>
                          <span className="inline-block mt-1 bg-[#FAF0E6] text-[#8C2D19] border border-[#F0DFD3] px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono">
                            {item.variantLabel || "Standard"}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1 text-charcoal-muted hover:text-pickle-red transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-[#DFD5C0] rounded-full px-2 py-0.5 bg-[#FAF6EE]">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="p-0.5 text-charcoal-muted hover:text-charcoal"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2 text-xs font-bold text-charcoal font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="p-0.5 text-charcoal-muted hover:text-charcoal"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        
                        <span className="font-display font-bold text-charcoal text-sm sm:text-base">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Navigation */}
            <div className="pt-3">
              <Link
                href="/south-indian"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8C2D19] hover:text-[#732414] transition-colors"
              >
                <ArrowLeft size={15} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Card & Trust Badges */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-3">
            
            <div className="bg-white rounded-2xl border border-[#E8DFC9] p-4 sm:p-5 shadow-xs">
              <h2 className="font-display text-lg sm:text-xl font-bold text-charcoal mb-3.5 tracking-tight">
                Order Summary
              </h2>

              {/* Coupon Code Section */}
              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Coupon Code
                </label>

                {!appliedPromo || !isPromoValid ? (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        className="flex-1 px-3 py-1.5 bg-[#FAF6EE] border border-[#E2D8C3] rounded-xl text-xs font-mono uppercase text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:border-[#8C2D19] transition-colors"
                      />
                      <button
                        onClick={() => handleApplyPromo()}
                        disabled={isApplyingPromo || !promoInput.trim()}
                        className="px-3.5 py-1.5 bg-[#FAF6EE] hover:bg-[#F3EAD7] text-[#8C2D19] border border-[#E2D8C3] text-xs font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                      >
                        {isApplyingPromo ? "..." : "Apply"}
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-pickle-red text-xs font-medium mt-1">
                        {promoError}
                      </p>
                    )}

                    {/* View Available Coupons Trigger */}
                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => setShowCoupons((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C2D19] hover:text-[#732414] transition-colors cursor-pointer"
                      >
                        <Tag size={12} />
                        <span>View available coupons</span>
                        {showCoupons ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>

                      {/* Collapsible Available Coupons List */}
                      {showCoupons && (
                        <div className="mt-2 p-2.5 bg-[#FAF6EE] border border-[#E2D8C3] rounded-xl space-y-2 max-h-48 overflow-y-auto">
                          {loadingCoupons ? (
                            <p className="text-[11px] text-charcoal-muted text-center py-1.5">Loading active coupons...</p>
                          ) : availableCoupons.length === 0 ? (
                            <div className="text-center py-1.5 text-[11px] text-charcoal-muted">
                              <Sparkles size={14} className="mx-auto text-amber-600 mb-1" />
                              No active coupons available at this moment.
                            </div>
                          ) : (
                            availableCoupons.map((coupon) => (
                              <div
                                key={coupon.id}
                                className="bg-white border border-dashed border-[#8C2D19]/40 rounded-xl p-2.5 flex items-start justify-between gap-2 shadow-2xs hover:border-[#8C2D19] transition-colors"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-[11px] text-[#8C2D19] bg-[#FAF0E6] px-1.5 py-0.5 rounded-md">
                                      {coupon.code}
                                    </span>
                                    <span className="text-[11px] font-semibold text-charcoal">
                                      {coupon.discountType === "percentage" 
                                        ? `${coupon.discountValue}% OFF` 
                                        : `₹${coupon.discountValue} OFF`}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-charcoal-muted mt-0.5 leading-tight">
                                    {coupon.minOrderValue > 0 ? `Above ₹${coupon.minOrderValue}` : "No minimum order"}
                                    {coupon.maxDiscount > 0 ? ` • Max ₹${coupon.maxDiscount}` : ""}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleApplyPromo(coupon.code)}
                                  className="text-[11px] font-bold text-[#8C2D19] hover:underline shrink-0 px-2 py-0.5 bg-[#FAF6EE] rounded-lg border border-[#E2D8C3] cursor-pointer"
                                >
                                  Apply
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Tag size={13} />
                      <span className="text-xs font-bold font-mono uppercase tracking-wide">
                        {appliedPromo.code}
                      </span>
                      <span className="text-xs font-medium text-emerald-700">
                        (₹{discountAmount} saved)
                      </span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-xs text-charcoal-muted hover:text-pickle-red underline font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 border-t border-[#E8DFC9] pt-3 text-xs sm:text-sm font-body">
                <div className="flex justify-between text-charcoal/80">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
                </div>

                {/* Delivery Row */}
                <div className="flex justify-between items-center text-charcoal/80">
                  <span>Delivery</span>
                  {isFreeShipping ? (
                    <span className="font-bold text-emerald-700 font-mono tracking-tight text-xs">FREE</span>
                  ) : (
                    <span className="font-semibold text-charcoal">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                {/* Free Delivery Status & Progress Bar */}
                {isFreeShipping ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-700 shrink-0" />
                    <span>You have unlocked free delivery!</span>
                  </div>
                ) : (
                  <div className="space-y-1 pt-0.5">
                    <div className="flex justify-between text-[11px] text-charcoal-muted font-medium">
                      <span>Add {formatPrice(amountNeededForFreeShipping)} more for free delivery</span>
                      <span className="font-mono">{formatPrice(subtotal)} / {formatPrice(freeShippingThreshold)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E8DFC9] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#8C2D19] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Applied Discount */}
                {appliedPromo && isPromoValid && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="border-t border-[#E8DFC9] pt-3 flex justify-between items-baseline text-charcoal">
                  <span className="font-display font-bold text-base sm:text-lg">Total</span>
                  <span className="font-display font-bold text-xl sm:text-2xl text-charcoal">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="text-[11px] text-charcoal-muted leading-tight font-body mt-1">
                  A GST-compliant tax invoice will be emailed after confirmation.
                </p>
              </div>

              {/* Primary Checkout Button */}
              <Button
                href="/checkout"
                size="md"
                style={{ color: "#FFFFFF" }}
                className="w-full mt-3.5 bg-[#8C2D19] hover:bg-[#732414] !text-white text-white py-2.5 sm:py-3 rounded-xl font-semibold shadow-xs transition-all flex items-center justify-center gap-2 text-sm"
              >
                <CreditCard size={16} className="!text-white text-white" style={{ color: "#FFFFFF" }} />
                <span className="!text-white text-white" style={{ color: "#FFFFFF" }}>Proceed to Checkout</span>
              </Button>
            </div>

            {/* Trust Badges below summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-0.5">
              {/* Badge 1: Free Delivery */}
              <div className="bg-[#FAF6EE] border border-[#E8DFC9] rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E8DFC9] flex items-center justify-center text-[#8C2D19] shrink-0 shadow-2xs">
                  <Truck size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-charcoal font-display leading-tight">
                    Free Delivery above {formatPrice(freeShippingThreshold)}
                  </h4>
                  <p className="text-[10px] text-charcoal-muted font-body leading-tight mt-0.5">
                    Estimated: 3–5 business days
                  </p>
                </div>
              </div>

              {/* Badge 2: Secure Payment */}
              <div className="bg-[#FAF6EE] border border-[#E8DFC9] rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E8DFC9] flex items-center justify-center text-[#8C2D19] shrink-0 shadow-2xs">
                  <ShieldCheck size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-charcoal font-display leading-tight">
                    Secure Payment
                  </h4>
                  <p className="text-[10px] text-charcoal-muted font-body leading-tight mt-0.5">
                    100% secure processing with Razorpay
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowClearConfirm(false)}
        >
          <div 
            className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-7 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowClearConfirm(false)}
              className="absolute top-4 right-4 p-1.5 text-charcoal-muted hover:text-charcoal rounded-full hover:bg-[#FAF6EE] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#B82914] flex items-center justify-center mb-4 mx-auto border border-[#FADCD7]">
              <Trash2 size={24} />
            </div>

            <h3 className="font-display text-xl font-bold text-charcoal text-center">
              Clear Your Cart?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted text-center mt-1.5 mb-6 font-body leading-relaxed">
              Are you sure you want to remove all {itemCount} {itemCount === 1 ? "item" : "items"} from your cart? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#DFD5C0] bg-[#FAF6EE] hover:bg-[#F2EADB] text-charcoal font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#8C2D19] hover:bg-[#732414] text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
