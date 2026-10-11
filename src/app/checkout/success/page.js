"use client";

import { useState, Suspense } from "react";
import { CheckCircle, Package, Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-cream min-h-screen py-16 px-4">
      <div className="max-w-xl mx-auto bg-warm-white p-8 md:p-12 rounded-2xl shadow-sm border border-border text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-3">
          Order Placed Successfully!
        </h1>
        
        <p className="font-body text-charcoal-muted mb-8 text-base md:text-lg max-w-md mx-auto">
          Thank you for shopping with PickleCart. Your traditional flavors are being prepared with care for dispatch.
        </p>

        {orderId && (
          <div className="max-w-md mx-auto mb-8 text-left">
            {/* Order ID Card */}
            <div className="bg-[#FAF6EE] border border-[#E8DFC9] rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-2 text-center">
                Your Order ID
              </p>
              
              <div className="flex items-center justify-between gap-3 bg-white border border-[#E2D8C3] rounded-xl px-4 py-3 shadow-inner">
                <span className="font-mono text-base md:text-lg font-bold text-charcoal select-all truncate">
                  #{orderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                    copied
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-charcoal text-white hover:bg-charcoal/90 active:scale-95 shadow-sm"
                  }`}
                  title="Copy Order ID to clipboard"
                  aria-label="Copy Order ID"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Friendly Reminder Box */}
              <div className="mt-4 p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-start gap-3">
                <span className="text-base leading-none shrink-0 mt-0.5" role="img" aria-label="pin">📌</span>
                <p className="text-xs text-amber-950/90 leading-relaxed font-body">
                  <strong>Friendly Reminder:</strong> Please copy or note down your <strong>Order ID</strong>. You will need it to track your delivery status later, as this page won&apos;t be shown again once closed. <em>(A confirmation email has also been sent to your inbox!)</em>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3.5 max-w-sm mx-auto">
          <Button
            href={orderId ? `/track?orderId=${orderId}` : "/track"}
            className="w-full flex justify-center items-center gap-2"
            size="lg"
          >
            <Package size={20} />
            Track Order
          </Button>
          <Button href="/" variant="outline" className="w-full" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
