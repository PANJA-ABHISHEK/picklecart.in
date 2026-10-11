"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Search, MapPin, Package, CheckCircle2, Truck, Box, AlertCircle, X } from "lucide-react";
import { trackOrder } from "@/app/actions/orders";

export default function TrackOrderPage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    
    setIsTracking(true);
    setTrackingResult(null);
    setErrorMessage(null);

    // Call the real tracking API
    trackOrder(trackingInput).then(res => {
      setIsTracking(false);
      if (res.success) {
        setTrackingResult(res.data);
      } else {
        setErrorMessage(res.error || "We couldn't find an order matching that details. Please check your Order ID or registered mobile number.");
      }
    }).catch(err => {
      setIsTracking(false);
      setErrorMessage("Something went wrong while tracking. Please check your connection and try again.");
      console.error(err);
    });
  };

  return (
    <div className="bg-white min-h-[75vh] flex flex-col items-center justify-start pt-24 pb-20 px-4 border-t border-border-light">
      
      <div className="w-full max-w-3xl bg-[#F5EBD6] rounded-[2rem] border border-[#E8D4B4]/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Track Your Order
          </h1>
          <p className="font-body text-charcoal-muted text-base md:text-lg max-w-xl mx-auto">
            Enter your mobile number or Order ID below to get real-time dispatch updates.
          </p>
        </div>

        <form onSubmit={handleTrack} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 items-end mb-6">
          <div className="flex-1 w-full">
            <div className="relative group">
              <input
                id="trackInput"
                type="text"
                value={trackingInput}
                onChange={(e) => {
                  setTrackingInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter Mobile No. or Order ID"
                className="w-full pl-12 pr-4 py-4 text-base font-body text-charcoal bg-white border border-border-light rounded-xl outline-none transition-all focus:border-heritage-green focus:ring-4 focus:ring-heritage-green/10 placeholder:text-charcoal-muted/50 shadow-sm"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted transition-colors group-focus-within:text-heritage-green" />
            </div>
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full sm:w-auto h-[56px] whitespace-nowrap px-8 shadow-md"
            disabled={isTracking}
          >
            {isTracking ? "Locating..." : "Track Order"}
          </Button>
        </form>

        {/* Elegant Error Notification Card */}
        {errorMessage && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-red-50/90 border border-red-200/90 rounded-2xl shadow-sm flex items-start gap-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-red-600 mt-0.5 shadow-sm">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1 pr-1">
              <h4 className="text-sm font-bold font-body text-red-900">Order Not Found</h4>
              <p className="text-xs font-body text-red-700/90 mt-1 leading-relaxed">
                {errorMessage}
              </p>
              <p className="text-[11px] font-body text-red-600/75 mt-1.5 font-medium">
                Tip: Enter your 10-digit mobile number or full Order ID (e.g. #AES4lF3z...).
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => setErrorMessage(null)} 
              className="text-red-400 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-100/60"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Dynamic Tracking Results UI */}
        {trackingResult && (
          <div className="max-w-xl mx-auto mt-10 mb-8 p-6 bg-white rounded-2xl border border-border-light shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-border-light pb-4 mb-6">
              <div>
                <p className="text-xs font-body font-bold text-charcoal-muted uppercase tracking-wider mb-1">Order Details</p>
                <h3 className="font-display font-bold text-xl text-charcoal">{trackingResult.orderId}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs font-body font-bold text-charcoal-muted uppercase tracking-wider mb-1">Status</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-turmeric-gold/10 text-turmeric-gold-dark text-sm font-semibold rounded-full">
                  <Truck size={14} />
                  {trackingResult.status}
                </span>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border-light">
              {trackingResult.steps.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                    step.completed ? "border-heritage-green text-heritage-green" : "border-border text-border"
                  }`}>
                    {step.completed ? <CheckCircle2 size={14} className="fill-heritage-green text-white" /> : <div className="w-2 h-2 rounded-full bg-border" />}
                  </div>

                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] px-4 md:px-0">
                    <div className={`p-3 rounded-xl border ${step.completed ? 'bg-heritage-green/5 border-heritage-green/20' : 'bg-transparent border-transparent'} md:group-odd:text-right`}>
                      <h4 className={`text-sm font-bold font-body ${step.completed ? 'text-charcoal' : 'text-charcoal-muted'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs font-body text-charcoal-muted mt-1">{step.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-border-light flex items-center gap-3">
              <Box size={20} className="text-heritage-green" />
              <p className="text-sm font-body text-charcoal">
                Expected Delivery: <strong className="font-bold">{trackingResult.expectedDelivery}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Info Footer */}
        {!trackingResult && (
          <div className="pt-10 border-t border-border-light/60 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white shrink-0 flex items-center justify-center mt-0.5 shadow-sm">
                <MapPin size={18} className="text-earthy-brown" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-charcoal mb-1">Real-time Updates</h3>
                <p className="text-xs font-body text-charcoal-muted leading-relaxed">
                  Tracking information is synced directly with our delivery partners usually within 12 hours of dispatch.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white shrink-0 flex items-center justify-center mt-0.5 shadow-sm">
                <Package size={18} className="text-earthy-brown" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-charcoal mb-1">Need Help?</h3>
                <p className="text-xs font-body text-charcoal-muted leading-relaxed">
                  If you have trouble finding your order, please contact our support team at picklecartblr@gmail.com.
                </p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
