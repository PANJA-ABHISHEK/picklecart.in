"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { INDIAN_STATES } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { 
  ShoppingBag, 
  CreditCard, 
  Lock, 
  Loader2, 
  ArrowLeft, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { createOrder } from "@/app/actions/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    subtotal, 
    itemCount, 
    clearCart,
    appliedPromo,
    isPromoValid,
    discountAmount,
    shippingFee,
    isFreeShipping,
    total
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    country: "India",
    pincode: "",
    city: "",
    state: "",
    addressLine1: "",
    addressLine2: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Auto-lookup City and State from Indian Pincode
  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    updateField("pincode", val);

    if (val.length === 6) {
      try {
        setIsLookingUpPincode(true);
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          if (po.District) updateField("city", po.District);
          if (po.State) {
            // Find closest match in INDIAN_STATES if possible
            const matchedState = INDIAN_STATES.find(
              (s) => s.toLowerCase() === po.State.toLowerCase()
            ) || po.State;
            updateField("state", matchedState);
          }
        }
      } catch (err) {
        console.warn("Pincode lookup error:", err);
      } finally {
        setIsLookingUpPincode(false);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile))
      newErrors.mobile = "Valid 10-digit mobile number is required (starts with 6-9)";
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Valid 6-digit pincode is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Delivery Address Line 1 is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      // Map form fields to backend customer schema
      const customerInfo = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        phone: formData.mobile.trim(),
        country: formData.country || "India",
        pincode: formData.pincode.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        address: formData.addressLine1.trim(),
        landmark: formData.addressLine2.trim(),
      };

      // 2. Call server action to create order with optional applied promo
      const orderRes = await createOrder(items, customerInfo, appliedPromo?.code);
      
      if (!orderRes.success) {
        alert(orderRes.error || "Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: orderRes.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "PickleCart",
        description: "PickleCart Order Payment",
        order_id: orderRes.razorpayOrderId,
        handler: async function (response) {
          try {
            setIsProcessing(true);
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderRes.orderId,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              router.push(`/checkout/success?order_id=${orderRes.orderId}`);
            } else {
              alert("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          } catch (err) {
            console.error("Verification error", err);
            alert("Error verifying payment. Please contact support.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerInfo.fullName,
          email: customerInfo.email,
          contact: customerInfo.mobile,
        },
        theme: {
          color: "#8C2D19", // PickleCart red
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        alert("Payment Failed. Reason: " + response.error.description);
      });
      
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("An error occurred during checkout.");
    } finally {
      setIsProcessing(false);
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
            Nothing to Checkout
          </h1>
          <p className="font-body text-charcoal-muted mb-8 text-sm">
            Add traditional pickles, sweets, or snacks to your cart before proceeding to checkout.
          </p>
          <Button href="/south-indian" size="lg" className="w-full bg-[#8C2D19] hover:bg-[#732414] text-white rounded-xl shadow-md">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-8 md:py-12">
      <div className="container-main max-w-6xl mx-auto px-4">
        
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-charcoal-muted hover:text-[#8C2D19] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Cart</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Checkout Details Form */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              <div className="bg-white rounded-2xl border border-[#E8DFC9] p-6 md:p-8 shadow-sm">
                
                {/* Header Title */}
                <div className="mb-6">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
                    Checkout
                  </h1>
                  <p className="text-sm font-body text-charcoal-muted mt-1">
                    Fill in your details to complete the order.
                  </p>
                  <p className="text-xs font-body text-charcoal-muted/80 mt-2 bg-[#FAF6EE] px-3.5 py-2 rounded-lg border border-[#E8DFC9] inline-block">
                    Continue as a guest. All orders receive instant tracking &amp; confirmation updates.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Row 1: Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" error={errors.fullName} required>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className="form-input-checkout"
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                    </FormField>

                    <FormField label="Email" error={errors.email} required>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="form-input-checkout"
                        placeholder="your@email.com"
                        autoComplete="email"
                      />
                    </FormField>
                  </div>

                  {/* Row 2: Phone Number with Country Code */}
                  <FormField label="Phone Number" error={errors.mobile} required>
                    <div className="flex border border-[#DFD5C0] rounded-xl bg-white overflow-hidden focus-within:border-[#8C2D19] transition-colors shadow-2xs">
                      <div className="flex items-center gap-1.5 px-3.5 bg-[#FAF6EE] border-r border-[#E8DFC9] text-xs font-semibold text-charcoal shrink-0">
                        <span>IN +91</span>
                        <ChevronDown size={13} className="text-charcoal-muted" />
                      </div>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                          updateField("mobile", digits);
                        }}
                        className="w-full px-3.5 py-2.5 text-sm font-body text-charcoal bg-transparent outline-none placeholder:text-charcoal-muted/60"
                        placeholder="XXXXXXXXXX"
                        autoComplete="tel"
                        maxLength={10}
                      />
                    </div>
                  </FormField>

                  {/* Row 3: Country */}
                  <FormField label="Country" required>
                    <select
                      value={formData.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      className="form-input-checkout"
                    >
                      <option value="India">India</option>
                    </select>
                  </FormField>

                  {/* Row 4: Pincode */}
                  <FormField 
                    label="Pincode / Zipcode" 
                    error={errors.pincode} 
                    required
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={handlePincodeChange}
                        className="form-input-checkout font-mono"
                        placeholder="000000"
                        maxLength={6}
                        autoComplete="postal-code"
                      />
                      {isLookingUpPincode && (
                        <span className="absolute right-3.5 top-3 text-xs text-[#8C2D19] flex items-center gap-1">
                          <Loader2 size={13} className="animate-spin" /> Auto-filling...
                        </span>
                      )}
                    </div>
                  </FormField>

                  {/* Row 5: City & State (Auto-filled or editable) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="City" error={errors.city} required>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="form-input-checkout"
                        placeholder="Auto-filled from pincode"
                        autoComplete="address-level2"
                      />
                    </FormField>

                    <FormField label="State/Province" error={errors.state} required>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        className="form-input-checkout"
                        placeholder="Auto-filled from pincode"
                        autoComplete="address-level1"
                      />
                    </FormField>
                  </div>

                  {/* Row 6: Delivery Address Line 1 */}
                  <FormField label="Delivery Address Line 1" error={errors.addressLine1} required>
                    <input
                      type="text"
                      value={formData.addressLine1}
                      onChange={(e) => updateField("addressLine1", e.target.value)}
                      className="form-input-checkout"
                      placeholder="e.g. GR Residency, Madhapur..."
                      autoComplete="street-address"
                    />
                  </FormField>

                  {/* Row 7: Address Line 2 (Optional) */}
                  <FormField label="Address Line 2">
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => updateField("addressLine2", e.target.value)}
                      className="form-input-checkout"
                      placeholder="Landmark, Area, Colony (Optional)"
                      autoComplete="address-line2"
                    />
                  </FormField>
                </div>

                {/* Payment Method Section */}
                <div className="mt-8 pt-6 border-t border-[#E8DFC9]">
                  <h3 className="font-display text-lg font-bold text-charcoal mb-3">
                    Payment Method
                  </h3>

                  {/* Pay Online Active Card */}
                  <div className="border-2 border-[#8C2D19] bg-[#FAF6EE] rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFC9] flex items-center justify-center p-2 shadow-2xs shrink-0">
                        <Image
                          src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740887/picklecart_assets/razorpay-icon.png"
                          alt="Razorpay"
                          width={24}
                          height={24}
                          loading="lazy"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-charcoal">
                            Pay Online
                          </p>
                          <span className="text-[10px] font-bold text-[#072654] bg-[#3395FF]/10 px-2 py-0.5 rounded-full border border-[#3395FF]/20">
                            Razorpay
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-muted">
                          Cards, UPI, Wallets, NetBanking
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 size={20} className="text-[#8C2D19]" />
                  </div>

                  {/* Payment Breakdown Inside Left Section */}
                  <div className="mt-6 pt-4 border-t border-[#E8DFC9] space-y-2 text-sm font-body">
                    <div className="flex justify-between text-charcoal/80">
                      <span>Subtotal</span>
                      <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-charcoal/80">
                      <span>Delivery</span>
                      <span className={isFreeShipping ? "font-bold text-emerald-700" : "font-semibold text-charcoal"}>
                        {isFreeShipping ? "FREE" : formatPrice(shippingFee)}
                      </span>
                    </div>

                    {appliedPromo && isPromoValid && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount ({appliedPromo.code})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline pt-2 border-t border-[#E8DFC9]">
                      <span className="font-display font-bold text-base text-charcoal">Total</span>
                      <span className="font-display font-bold text-2xl text-charcoal">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Pay Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full mt-5 bg-[#8C2D19] hover:bg-[#732414] text-white py-3.5 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Pay {formatPrice(total)}</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs font-body text-charcoal-muted text-center mt-3 flex items-center justify-center gap-1.5">
                    <Lock size={12} />
                    <span>100% secure payment powered by Razorpay</span>
                  </p>
                </div>

              </div>

            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
              
              <div className="bg-white rounded-2xl border border-[#E8DFC9] p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold text-charcoal mb-4">
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="space-y-3.5 mb-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex justify-between items-start text-sm pb-3 border-b border-[#F0EAE0] last:border-0 last:pb-0"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-charcoal truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-charcoal-muted font-body mt-0.5">
                          {item.variantLabel ? `${item.variantLabel} • ` : ""}Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-charcoal shrink-0 font-body">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="border-t border-[#E8DFC9] pt-3.5 space-y-2 text-sm font-body">
                  <div className="flex justify-between text-charcoal/80">
                    <span>Subtotal</span>
                    <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-charcoal/80">
                    <span>Delivery</span>
                    <span className={isFreeShipping ? "font-bold text-emerald-700 font-mono" : "font-semibold text-charcoal"}>
                      {isFreeShipping ? "FREE" : formatPrice(shippingFee)}
                    </span>
                  </div>

                  {appliedPromo && isPromoValid && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="border-t border-[#E8DFC9] pt-3 flex justify-between items-baseline text-charcoal">
                    <span className="font-display font-bold text-base">Total</span>
                    <span className="font-display font-bold text-2xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Edit Cart Button */}
                <Link
                  href="/cart"
                  className="w-full mt-5 bg-white border border-[#DFD5C0] hover:bg-[#FAF6EE] text-charcoal py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Edit Cart</span>
                </Link>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}

function FormField({ label, error, required = false, children }) {
  return (
    <div>
      <label className="block text-xs md:text-sm font-semibold text-charcoal mb-1.5">
        {label}
        {required && <span className="text-[#8C2D19] ml-1 font-bold">*</span>}
      </label>
      <div className="[&_.form-input-checkout]:w-full [&_.form-input-checkout]:px-4 [&_.form-input-checkout]:py-2.5 [&_.form-input-checkout]:text-sm [&_.form-input-checkout]:font-body [&_.form-input-checkout]:text-charcoal [&_.form-input-checkout]:bg-white [&_.form-input-checkout]:border [&_.form-input-checkout]:border-[#DFD5C0] [&_.form-input-checkout]:rounded-xl [&_.form-input-checkout]:outline-none [&_.form-input-checkout]:transition-colors focus-within:[&_.form-input-checkout]:border-[#8C2D19] [&_.form-input-checkout]:placeholder:text-charcoal-muted/60 shadow-2xs">
        {children}
      </div>
      {error && (
        <p className="text-xs font-body text-[#8C2D19] mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
