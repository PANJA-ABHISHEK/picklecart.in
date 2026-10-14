"use client";

import { useState } from "react";
import { REQUIREMENT_TYPES } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { Building2, Gift, CheckCircle, MessageCircle } from "lucide-react";
import { submitBulkEnquiry } from "@/app/actions/enquiries";

const WHATSAPP_PHONE = "918123808404";

function buildCorporateWhatsAppUrl(data) {
  const lines = [
    "*NEW CORPORATE / BULK ORDER ENQUIRY*",
    "*PickleCart Bangalore*",
    "----------------------------------------",
    `*Full Name:* ${data.fullName || "N/A"}`,
    `*Company / Org:* ${data.company && data.company.trim() ? data.company.trim() : "N/A"}`,
    `*Mobile Number:* ${data.mobile || "N/A"}`,
    `*Email Address:* ${data.email || "N/A"}`,
    `*Location:* ${data.location && data.location.trim() ? data.location.trim() : "Not specified"}`,
    "----------------------------------------",
    `*Requirement Type:* ${data.requirementType || "General Bulk Order"}`,
    `*Approx Quantity:* ${data.quantity && data.quantity.trim() ? data.quantity.trim() : "Not specified"}`,
    "----------------------------------------",
    "*Requirement Details:*",
    data.message && data.message.trim() ? data.message.trim() : "N/A",
    "----------------------------------------",
    "Sent via PickleCart Website (picklecart.in)",
  ];

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function CorporateBulkOrdersContent() {
  const [formData, setFormData] = useState({
    fullName: "", company: "", mobile: "", email: "", location: "",
    requirementType: "", quantity: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Name is required";
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.replace(/\s+/g, ""))) {
      e.mobile = "Valid 10-digit mobile number required";
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = "Valid email required";
    if (!formData.requirementType) e.requirementType = "Please select a requirement type";
    if (!formData.message.trim()) e.message = "Please describe your requirement";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    
    setSubmitting(true);
    const waUrl = buildCorporateWhatsAppUrl(formData);
    setWhatsappUrl(waUrl);

    try {
      await submitBulkEnquiry(formData);
    } catch (err) {
      console.error("Backend error saving bulk enquiry:", err);
    }

    setSubmitted(true);
    setSubmitting(false);

    // Open WhatsApp in a new tab with all details pre-filled
    try {
      window.open(waUrl, "_blank");
    } catch (e) {
      console.error("Popup error:", e);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Hero */}
      <div className="relative pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero/hero-5.png)" }}
        />
        <div className="absolute inset-0 bg-charcoal/75 backdrop-blur-[2px]" />
        
        <div className="container-main relative z-10 text-center">
          <div className="inline-flex justify-center items-center gap-3 mb-4 px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/10">
            <Building2 size={16} className="text-turmeric-gold" />
            <span className="text-[10px] md:text-xs font-body font-bold !text-white tracking-[0.2em] uppercase drop-shadow-sm">Premium Partners</span>
            <Gift size={16} className="text-turmeric-gold" />
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold !text-white leading-tight mb-3 drop-shadow-xl">
            Corporate / Bulk Orders
          </h1>
          
          <p className="font-body !text-white/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Authentic Indian food products for corporate gifting, events, wholesale, and bulk orders. Delivered with care, packaged with tradition.
          </p>
        </div>
      </div>

      <div className="container-main relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Floating Benefits Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8 md:mb-10 -mt-10 md:-mt-16">
            {[
              { title: "Corporate Gifting", desc: "For employees & clients" },
              { title: "Wholesale", desc: "For retail & restaurants" },
              { title: "Custom Packs", desc: "Personalised branding" },
              { title: "Bulk Pricing", desc: "Exclusive discounts" }
            ].map((item) => (
              <div key={item.title} className="p-4 md:p-5 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl shadow-charcoal/5 border border-white/50 text-center hover:-translate-y-1.5 transition-transform duration-300">
                <div className="w-10 h-10 mx-auto rounded-full bg-cream flex items-center justify-center mb-2.5">
                  <CheckCircle size={18} className="text-heritage-green" />
                </div>
                <h3 className="text-sm md:text-base font-body font-bold text-charcoal mb-0.5">{item.title}</h3>
                <p className="text-xs font-body text-charcoal-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl shadow-charcoal/5 border border-border-light p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-3">
                Tell Us Your Requirement
              </h2>
              <div className="w-16 h-1 bg-turmeric-gold mx-auto rounded-full"></div>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto bg-heritage-green/10 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle size={44} className="text-heritage-green" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">
                  Enquiry Submitted Successfully!
                </h3>
                <p className="font-body text-base text-charcoal-muted max-w-lg mx-auto leading-relaxed mb-6">
                  Thank you for reaching out! We have received your requirement. A direct WhatsApp message to{" "}
                  <span className="font-bold text-charcoal">+91 81238 08404</span> with all your enquiry details has also been prepared.
                </p>

                {/* Summary Card */}
                <div className="bg-cream/60 border border-border-light rounded-2xl p-5 max-w-md mx-auto mb-8 text-left space-y-2 text-sm font-body shadow-2xs">
                  <div className="flex justify-between items-center text-charcoal pb-1 border-b border-border-light/50">
                    <span className="text-charcoal-muted text-xs font-medium">Customer:</span>
                    <span className="font-bold">{formData.fullName}</span>
                  </div>
                  {formData.company && (
                    <div className="flex justify-between items-center text-charcoal">
                      <span className="text-charcoal-muted text-xs font-medium">Company:</span>
                      <span className="font-medium">{formData.company}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-charcoal">
                    <span className="text-charcoal-muted text-xs font-medium">Mobile:</span>
                    <span className="font-medium">{formData.mobile}</span>
                  </div>
                  <div className="flex justify-between items-center text-charcoal">
                    <span className="text-charcoal-muted text-xs font-medium">Requirement Type:</span>
                    <span className="font-medium">{formData.requirementType}</span>
                  </div>
                  {formData.quantity && (
                    <div className="flex justify-between items-center text-charcoal">
                      <span className="text-charcoal-muted text-xs font-medium">Quantity:</span>
                      <span className="font-medium">{formData.quantity}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex justify-between items-center text-charcoal">
                      <span className="text-charcoal-muted text-xs font-medium">Location:</span>
                      <span className="font-medium">{formData.location}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                    style={{ color: "#FFFFFF" }}
                  >
                    <MessageCircle size={20} className="fill-white text-white" />
                    <span>Chat on WhatsApp (+91 81238 08404)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "", company: "", mobile: "", email: "", location: "",
                        requirementType: "", quantity: "", message: "",
                      });
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-cream border border-border-light text-charcoal font-semibold rounded-xl text-sm transition-colors shadow-2xs cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg mb-4 font-medium">{errors.form}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name *" error={errors.fullName}>
                    <input type="text" value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="form-input" placeholder="Your name" />
                  </Field>
                  <Field label="Company / Organization">
                    <input type="text" value={formData.company} onChange={(e) => updateField("company", e.target.value)} className="form-input" placeholder="Company name (optional)" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Mobile Number *" error={errors.mobile}>
                    <input type="tel" value={formData.mobile} onChange={(e) => updateField("mobile", e.target.value)} className="form-input" placeholder="10-digit number" />
                  </Field>
                  <Field label="Email *" error={errors.email}>
                    <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="form-input" placeholder="you@company.com" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Location">
                    <input type="text" value={formData.location} onChange={(e) => updateField("location", e.target.value)} className="form-input" placeholder="City / State" />
                  </Field>
                  <Field label="Requirement Type *" error={errors.requirementType}>
                    <select value={formData.requirementType} onChange={(e) => updateField("requirementType", e.target.value)} className="form-input">
                      <option value="">Select type</option>
                      {REQUIREMENT_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </Field>
                </div>
                <Field label="Approximate Quantity">
                  <input type="text" value={formData.quantity} onChange={(e) => updateField("quantity", e.target.value)} className="form-input" placeholder="e.g. 100 jars, 50 hampers" />
                </Field>
                <Field label="Your Requirement *" error={errors.message}>
                  <textarea value={formData.message} onChange={(e) => updateField("message", e.target.value)} className="form-input min-h-[120px] resize-none" placeholder="Describe your requirement, products, timeline, etc." />
                </Field>
                <div className="mt-8 text-center">
                  <Button 
                    type="submit" 
                    size="xl" 
                    disabled={submitting}
                    className="w-full md:w-auto min-w-[260px] shadow-lg shadow-charcoal/10 hover:shadow-xl hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>{submitting ? "Submitting..." : "Submit Enquiry"}</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-body font-semibold text-charcoal mb-2">{label}</label>
      <div className="[&_.form-input]:w-full [&_.form-input]:px-4 [&_.form-input]:py-3 [&_.form-input]:text-sm [&_.form-input]:font-body [&_.form-input]:text-charcoal [&_.form-input]:bg-cream/50 [&_.form-input]:border [&_.form-input]:border-border-light [&_.form-input]:rounded-lg [&_.form-input]:outline-none [&_.form-input]:transition-all focus-within:[&_.form-input]:bg-white focus-within:[&_.form-input]:border-heritage-green focus-within:[&_.form-input]:ring-4 focus-within:[&_.form-input]:ring-heritage-green/10 [&_.form-input]:placeholder:text-charcoal-muted/70">
        {children}
      </div>
      {error && <p className="text-xs font-body font-medium text-pickle-red mt-1.5">{error}</p>}
    </div>
  );
}
