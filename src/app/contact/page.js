"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, MessageCircle, ChevronRight } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { submitContactQuery } from "@/app/actions/enquiries";
import { fetchLocations } from "@/app/actions/locations";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  useEffect(() => {
    async function loadLocations() {
      const data = await fetchLocations();
      setLocations(data);
      // Try to select primary location initially
      const primaryIdx = data.findIndex(loc => loc.isPrimary);
      if (primaryIdx !== -1) setActiveLocationIndex(primaryIdx);
    }
    loadLocations();
  }, []);

  const activeLoc = locations[activeLocationIndex] || null;

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

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    
    const res = await submitContactQuery(formData);
    if (res.success) {
      setSubmitted(true);
    } else {
      setErrors({ form: res.error });
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="relative min-h-[300px] sm:min-h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden flex items-center justify-center bg-heritage-green py-10 md:py-0">
        <div className="absolute inset-0">
          <Image 
            src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740863/picklecart_assets/contactusbackground.png" 
            alt="Contact PickleCart" 
            fill
            className="object-cover object-center md:object-bottom"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-charcoal/30" />
        
        <div className="relative z-10 container-main flex flex-col items-center justify-center text-center px-4 pt-4 pb-8 md:py-0">
          <span className="text-xs md:text-sm font-body font-bold tracking-[0.25em] uppercase text-turmeric-gold mb-2 md:mb-3 block drop-shadow-md">
            Get In Touch
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-white to-[#E8D4B4] bg-clip-text text-transparent drop-shadow-md text-balance mb-3 md:mb-4">
            Contact Us
          </h1>
          <p className="font-body text-[#F3E5C8]/90 text-sm sm:text-base md:text-xl max-w-2xl mx-auto drop-shadow leading-relaxed font-medium text-balance">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Elegant Wavy Bottom Divider - Colored to match bg-cream (#FDF6EC) */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12 lg:h-16 relative block">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-[#FDF6EC]" />
          </svg>
        </div>
      </div>

      <div className="container-main py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-charcoal mb-5">Our Stores</h2>
              
              {locations.length > 1 && (
                <div className="flex flex-col gap-2 mb-6">
                  {locations.map((loc, idx) => (
                    <button
                      key={loc.id}
                      onClick={() => setActiveLocationIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                        activeLocationIndex === idx 
                        ? "bg-heritage-green/10 border-heritage-green/20" 
                        : "bg-surface border-border hover:bg-surface-alt"
                      }`}
                    >
                      <span className={`font-semibold text-sm ${activeLocationIndex === idx ? "text-heritage-green" : "text-charcoal"}`}>
                        {loc.name}
                      </span>
                      {activeLocationIndex === idx && <ChevronRight size={16} className="text-heritage-green" />}
                    </button>
                  ))}
                </div>
              )}

              {activeLoc ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h3 className="font-display font-bold text-lg text-charcoal mb-4 hidden">{activeLoc.name}</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Phone size={18} className="mt-0.5 text-heritage-green shrink-0" />
                      <div>
                        <p className="text-sm font-body font-medium text-charcoal">Phone</p>
                        <a href={`tel:${(activeLoc.phone || CONTACT.phone).replace(/\s/g, "")}`} className="text-sm font-body text-charcoal-light hover:text-heritage-green transition-colors">
                          {activeLoc.phone || CONTACT.phone}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageCircle size={18} className="mt-0.5 text-heritage-green shrink-0" />
                      <div>
                        <p className="text-sm font-body font-medium text-charcoal">WhatsApp</p>
                        <a href={`https://wa.me/${(activeLoc.whatsapp || CONTACT.whatsapp).replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm font-body text-charcoal-light hover:text-heritage-green transition-colors">
                          {activeLoc.whatsapp || CONTACT.whatsapp}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail size={18} className="mt-0.5 text-heritage-green shrink-0" />
                      <div>
                        <p className="text-sm font-body font-medium text-charcoal">Email</p>
                        <a href={`mailto:${activeLoc.email || CONTACT.email}`} className="text-sm font-body text-charcoal-light hover:text-heritage-green transition-colors">
                          {activeLoc.email || CONTACT.email}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin size={18} className="mt-0.5 text-heritage-green shrink-0" />
                      <div>
                        <p className="text-sm font-body font-medium text-charcoal">Address</p>
                        <p className="text-sm font-body text-charcoal-light">{activeLoc.address}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock size={18} className="mt-0.5 text-heritage-green shrink-0" />
                      <div>
                        <p className="text-sm font-body font-medium text-charcoal">Business Hours</p>
                        <p className="text-sm font-body text-charcoal-light">{activeLoc.hours}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-charcoal-muted">Loading locations...</div>
              )}

              {/* Social */}
              <div className="flex items-center gap-4 mt-8">
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform origin-center" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30">
                    <radialGradient id="ig-rg-contact" cx="30%" cy="100%" r="100%">
                      <stop offset="0%" stopColor="#fd5" />
                      <stop offset="10%" stopColor="#fd5" />
                      <stop offset="50%" stopColor="#ff543e" />
                      <stop offset="100%" stopColor="#c837ab" />
                    </radialGradient>
                    <path fill="url(#ig-rg-contact)" d="M14,2h20c6.627,0,12,5.373,12,12v20c0,6.627-5.373,12-12,12H14C7.373,46,2,40.627,2,34V14C2,7.373,7.373,2,14,2z" />
                    <path fill="#fff" d="M24,14c-5.514,0-10,4.486-10,10c0,5.514,4.486,10,10,10c5.514,0,10-4.486,10-10C34,18.486,29.514,14,24,14z M24,31 c-3.859,0-7-3.14-7-7c0-3.859,3.141-7,7-7c3.859,0,7,3.141,7,7C31,27.86,27.859,31,24,31z" />
                    <circle fill="#fff" cx="34.5" cy="13.5" r="2.5" />
                    <path fill="#fff" d="M34,8H14c-3.309,0-6,2.691-6,6v20c0,3.309,2.691,6,6,6h20c3.309,0,6-2.691,6-6V14C40,10.691,37.309,8,34,8z M37,34 c0,1.654-1.346,3-3,3H14c-1.654,0-3-1.346-3-3V14c0-1.654,1.346-3,3-3h20c1.654,0,3,1.346,3,3V34z" />
                  </svg>
                </a>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform origin-center" aria-label="Facebook">
                  <svg viewBox="0 0 36 36" width="30" height="30">
                    <path fill="#1877F2" d="M36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.974 6.559 16.417 15.188 17.785v-12.58h-4.568V18h4.568v-3.963c0-4.509 2.686-7.002 6.812-7.002 1.967 0 4.025.352 4.025.352v4.426h-2.268c-2.234 0-2.934 1.386-2.934 2.812V18h5.01l-.8 5.205h-4.21v12.58C29.441 34.417 36 26.974 36 18z"/>
                    <path fill="#ffffff" d="M25.32 23.205l.8-5.205h-5.01v-3.376c0-1.426.7-2.812 2.934-2.812h2.268V7.386s-2.058-.352-4.025-.352c-4.126 0-6.812 2.493-6.812 7.002V18h-4.568v5.205h4.568v12.58a18.156 18.156 0 005.625 0v-12.58h4.21z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Map */}
            {activeLoc && activeLoc.mapUrl && (
              <div className="rounded-3xl overflow-hidden border border-border h-52 md:h-64 mt-6 animate-in fade-in duration-700">
                <iframe
                  src={activeLoc.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PickleCart Location"
                />
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 p-6 md:p-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-8">Send Us a Message</h2>

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
                  {errors.form && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-sm mb-4">{errors.form}</div>}
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
      <div className="[&_.form-input]:w-full [&_.form-input]:px-4 [&_.form-input]:py-3 [&_.form-input]:text-sm [&_.form-input]:font-body [&_.form-input]:text-charcoal [&_.form-input]:bg-cream [&_.form-input]:border [&_.form-input]:border-border-light [&_.form-input]:rounded-xl [&_.form-input]:outline-none [&_.form-input]:transition-all focus-within:[&_.form-input]:border-heritage-green focus-within:[&_.form-input]:ring-1 focus-within:[&_.form-input]:ring-heritage-green/20 [&_.form-input]:placeholder:text-charcoal-muted">
        {children}
      </div>
      {error && <p className="text-xs font-body text-pickle-red mt-1">{error}</p>}
    </div>
  );
}
