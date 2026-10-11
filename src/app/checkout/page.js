"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { INDIAN_STATES } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { ShoppingBag, CreditCard, Lock, Loader2 } from "lucide-react";
import { createOrder } from "@/app/actions/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, itemCount, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile))
      newErrors.mobile = "Valid 10-digit mobile number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Valid 6-digit pincode is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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

      // 2. Call server action to create order
      const orderRes = await createOrder(items, formData);
      
      if (!orderRes.success) {
        alert(orderRes.error || "Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "PickleCart",
        description: "Test Transaction",
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
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#b43d2c", // pickle-red
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
      <div className="bg-warm-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={56} className="mx-auto text-charcoal-muted/30 mb-4" />
          <h1 className="font-display text-2xl font-bold text-charcoal mb-2">
            Nothing to Checkout
          </h1>
          <p className="font-body text-charcoal-muted mb-6">
            Add products to your cart before proceeding to checkout.
          </p>
          <Button href="/south-indian" size="lg">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="container-main py-8 md:py-12">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-warm-white rounded-sm border border-border-light p-5 md:p-6">
                <h2 className="font-display text-lg font-bold text-charcoal mb-5">
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <FormField label="Full Name" error={errors.fullName}>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </FormField>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Email" error={errors.email}>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="form-input"
                        placeholder="you@example.com"
                      />
                    </FormField>
                    <FormField label="Mobile Number" error={errors.mobile}>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => updateField("mobile", e.target.value)}
                        className="form-input"
                        placeholder="10-digit mobile number"
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-warm-white rounded-sm border border-border-light p-5 md:p-6">
                <h2 className="font-display text-lg font-bold text-charcoal mb-5">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <FormField label="Address" error={errors.address}>
                    <textarea
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="form-input min-h-[80px] resize-none"
                      placeholder="House/Flat No., Street, Area"
                    />
                  </FormField>
                  <FormField label="Landmark (optional)">
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => updateField("landmark", e.target.value)}
                      className="form-input"
                      placeholder="Near..."
                    />
                  </FormField>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="City" error={errors.city}>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="form-input"
                        placeholder="City"
                      />
                    </FormField>
                    <FormField label="State" error={errors.state}>
                      <select
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Pincode" error={errors.pincode}>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => updateField("pincode", e.target.value)}
                        className="form-input"
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-warm-white rounded-sm border border-border-light p-5 md:p-6">
                <h2 className="font-display text-lg font-bold text-charcoal mb-4">
                  Payment Method
                </h2>
                <div className="flex items-center gap-3 p-4 bg-cream rounded-sm border border-border">
                  <CreditCard size={22} className="text-heritage-green shrink-0" />
                  <div>
                    <p className="font-body text-sm font-medium text-charcoal">
                      Razorpay Secure Checkout
                    </p>
                    <p className="font-body text-xs text-charcoal-muted mt-0.5">
                      UPI, Debit Card, Credit Card, Net Banking, Wallets
                    </p>
                  </div>
                  <Lock size={16} className="text-heritage-green ml-auto shrink-0" />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-warm-white rounded-sm border border-border-light p-5 md:p-6">
                <h2 className="font-display text-lg font-bold text-charcoal mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex justify-between text-sm font-body"
                    >
                      <span className="text-charcoal-light truncate mr-2">
                        {item.name} ({item.variantLabel}) × {item.quantity}
                      </span>
                      <span className="text-charcoal font-medium shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-sm font-body">
                  <div className="flex justify-between text-charcoal-light">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-light">
                    <span>Shipping</span>
                    <span className="text-heritage-green">Free</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-charcoal font-semibold text-base">
                    <span>Total</span>
                    <span className="font-display font-bold">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full mt-5" disabled={isProcessing}>
                  {isProcessing ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 size={18} className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    "Place Order securely"
                  )}
                </Button>

                <p className="text-xs font-body text-charcoal-muted text-center mt-3 flex items-center justify-center gap-1">
                  <Lock size={12} />
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-body font-medium text-charcoal mb-1.5">
        {label}
      </label>
      <div className="[&_.form-input]:w-full [&_.form-input]:px-3 [&_.form-input]:py-2.5 [&_.form-input]:text-sm [&_.form-input]:font-body [&_.form-input]:text-charcoal [&_.form-input]:bg-cream [&_.form-input]:border [&_.form-input]:border-border [&_.form-input]:rounded-sm [&_.form-input]:outline-none [&_.form-input]:transition-colors focus-within:[&_.form-input]:border-heritage-green [&_.form-input]:placeholder:text-charcoal-muted">
        {children}
      </div>
      {error && (
        <p className="text-xs font-body text-pickle-red mt-1">{error}</p>
      )}
    </div>
  );
}
