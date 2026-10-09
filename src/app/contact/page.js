"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = "Valid email is required";
    if (!formData.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setSubmitted(true);
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div
        className="relative h-[250px] md:h-[350px] lg:h-[380px] overflow-hidden bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(/contactusbackground.png)` }}
      >
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="relative z-10 container-main flex flex-col items-center justify-center text-center mt-[-20px] md:mt-[-40px]">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white drop-shadow-lg">
            Contact Us
          </h1>
          <p className="font-body text-warm-white/95 mt-3 md:mt-5 text-base md:text-xl max-w-2xl mx-auto drop-shadow-md leading-relaxed font-medium">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="container-main py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-charcoal mb-5">Get in Touch</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-heritage-green shrink-0" />
                  <div>
                    <p className="text-sm font-body font-medium text-charcoal">Phone</p>
                    <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="text-sm font-body text-charcoal-light hover:text-heritage-green transition-colors">{CONTACT.phone}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle size={18} className="mt-0.5 text-heritage-green shrink-0" />
                  <div>
                    <p className="text-sm font-body font-medium text-charcoal">WhatsApp</p>
                    <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm font-body text-charcoal-light hover:text-heritage-green transition-colors">{CONTACT.phone}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-heritage-green shrink-0" />
                  <div>
                    <p className="text-sm font-body font-medium text-charcoal">Email</p>
                    <a href={`mailto:${CONTACT.email}`} className="text-sm font-body text-charcoal-light hover:text-heritage-green transition-colors">{CONTACT.email}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-heritage-green shrink-0" />
                  <div>
                    <p className="text-sm font-body font-medium text-charcoal">Address</p>
                    <p className="text-sm font-body text-charcoal-light">{CONTACT.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 text-heritage-green shrink-0" />
                  <div>
                    <p className="text-sm font-body font-medium text-charcoal">Business Hours</p>
                    <p className="text-sm font-body text-charcoal-light">{CONTACT.businessHours}</p>
                  </div>
                </li>
              </ul>

              {/* Social */}
              <div className="flex items-center gap-3 mt-6">
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center hover:bg-heritage-green hover:text-white transition-all" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center hover:bg-heritage-green hover:text-white transition-all" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-sm overflow-hidden border border-border h-52 md:h-64">
              <iframe
                src={CONTACT.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PickleCart Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-warm-white rounded-sm border border-border-light p-6 md:p-8">
              <h2 className="font-display text-xl font-bold text-charcoal mb-5">Send Us a Message</h2>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-heritage-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} className="text-heritage-green" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-charcoal mb-2">Message Received!</h3>
                  <p className="font-body text-sm text-charcoal-muted">
                    Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Your Name" error={errors.name}>
                      <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="form-input" placeholder="Full name" />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="form-input" placeholder="you@example.com" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Mobile (optional)">
                      <input type="tel" value={formData.mobile} onChange={(e) => updateField("mobile", e.target.value)} className="form-input" placeholder="Phone number" />
                    </Field>
                    <Field label="Subject (optional)">
                      <input type="text" value={formData.subject} onChange={(e) => updateField("subject", e.target.value)} className="form-input" placeholder="How can we help?" />
                    </Field>
                  </div>
                  <Field label="Message" error={errors.message}>
                    <textarea value={formData.message} onChange={(e) => updateField("message", e.target.value)} className="form-input min-h-[120px] resize-none" placeholder="Tell us more..." />
                  </Field>
                  <Button type="submit" size="lg">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-body font-medium text-charcoal mb-1.5">{label}</label>
      <div className="[&_.form-input]:w-full [&_.form-input]:px-3 [&_.form-input]:py-2.5 [&_.form-input]:text-sm [&_.form-input]:font-body [&_.form-input]:text-charcoal [&_.form-input]:bg-cream [&_.form-input]:border [&_.form-input]:border-border [&_.form-input]:rounded-sm [&_.form-input]:outline-none [&_.form-input]:transition-colors focus-within:[&_.form-input]:border-heritage-green [&_.form-input]:placeholder:text-charcoal-muted">
        {children}
      </div>
      {error && <p className="text-xs font-body text-pickle-red mt-1">{error}</p>}
    </div>
  );
}
