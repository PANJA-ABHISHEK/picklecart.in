"use client";

import { CheckCircle, Package } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="bg-cream min-h-screen py-16 px-4">
      <div className="max-w-xl mx-auto bg-warm-white p-8 md:p-12 rounded-2xl shadow-sm border border-border text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="font-display text-3xl font-bold text-charcoal mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="font-body text-charcoal-muted mb-8 text-lg">
          Thank you for shopping with PickleCart. Your traditional flavors are being prepared for dispatch.
        </p>

        {orderId && (
          <div className="bg-cream border border-border rounded-xl p-4 mb-8 inline-block min-w-[250px]">
            <p className="text-sm font-medium text-charcoal-muted mb-1">Your Order ID</p>
            <p className="font-display text-xl font-bold text-charcoal tracking-wide">#{orderId}</p>
          </div>
        )}

        <div className="space-y-4 max-w-sm mx-auto">
          <Button href="/track" className="w-full flex justify-center gap-2" size="lg">
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
