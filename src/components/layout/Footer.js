"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE, CONTACT, NAV_LINKS, REGIONS } from "@/lib/constants";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Pickles in Bangalore", href: "/pickles-in-bangalore" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Corporate & Bulk Orders", href: "/corporate-bulk-orders" },
];

const customerLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
];

const regionLinks = REGIONS.filter((r) => r.parentRoute).map((r) => ({
  label: r.name,
  href: `${r.parentRoute}/${r.slug}`,
}));

export default function Footer() {
  const pathname = usePathname();
  const currentYear = "2026";

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-charcoal text-warm-white/80">
      {/* Main Footer */}
      <div className="container-main py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <div className="relative h-12 w-48 mb-2 transition-opacity hover:opacity-100 opacity-90">
                <Image
                  src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740886/picklecart_assets/footerlogo.png"
                  alt={`${SITE_NAME} Logo`}
                  fill
                  loading="lazy"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4 font-body text-warm-white/60">
              {SITE_TAGLINE}
            </p>
            <p className="text-sm leading-relaxed font-body">
              Authentic Indian pickles, podis, snacks &amp; traditional food
              products. Handcrafted with recipes passed down through generations.
            </p>

            <div className="flex items-center gap-4 mt-5">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:scale-110 transition-transform origin-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30">
                  <radialGradient id="ig-rg" cx="30%" cy="100%" r="100%">
                    <stop offset="0%" stopColor="#fd5" />
                    <stop offset="10%" stopColor="#fd5" />
                    <stop offset="50%" stopColor="#ff543e" />
                    <stop offset="100%" stopColor="#c837ab" />
                  </radialGradient>
                  <path fill="url(#ig-rg)" d="M14,2h20c6.627,0,12,5.373,12,12v20c0,6.627-5.373,12-12,12H14C7.373,46,2,40.627,2,34V14C2,7.373,7.373,2,14,2z" />
                  <path fill="#fff" d="M24,14c-5.514,0-10,4.486-10,10c0,5.514,4.486,10,10,10c5.514,0,10-4.486,10-10C34,18.486,29.514,14,24,14z M24,31 c-3.859,0-7-3.14-7-7c0-3.859,3.141-7,7-7c3.859,0,7,3.141,7,7C31,27.86,27.859,31,24,31z" />
                  <circle fill="#fff" cx="34.5" cy="13.5" r="2.5" />
                  <path fill="#fff" d="M34,8H14c-3.309,0-6,2.691-6,6v20c0,3.309,2.691,6,6,6h20c3.309,0,6-2.691,6-6V14C40,10.691,37.309,8,34,8z M37,34 c0,1.654-1.346,3-3,3H14c-1.654,0-3-1.346-3-3V14c0-1.654,1.346-3,3-3h20c1.654,0,3,1.346,3,3V34z" />
                </svg>
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:scale-110 transition-transform origin-center"
              >
                <svg viewBox="0 0 36 36" width="30" height="30">
                  <path fill="#1877F2" d="M36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.974 6.559 16.417 15.188 17.785v-12.58h-4.568V18h4.568v-3.963c0-4.509 2.686-7.002 6.812-7.002 1.967 0 4.025.352 4.025.352v4.426h-2.268c-2.234 0-2.934 1.386-2.934 2.812V18h5.01l-.8 5.205h-4.21v12.58C29.441 34.417 36 26.974 36 18z"/>
                  <path fill="#ffffff" d="M25.32 23.205l.8-5.205h-5.01v-3.376c0-1.426.7-2.812 2.934-2.812h2.268V7.386s-2.058-.352-4.025-.352c-4.126 0-6.812 2.493-6.812 7.002V18h-4.568v5.205h4.568v12.58a18.156 18.156 0 005.625 0v-12.58h4.21z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base font-semibold text-warm-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-warm-white/60 hover:text-warm-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Links */}
          <div>
            <h3 className="font-display text-base font-semibold text-warm-white mb-3">
              Our Regions
            </h3>
            <ul className="space-y-2.5">
              {regionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-warm-white/60 hover:text-warm-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/north-indian"
                  className="text-sm font-body text-warm-white/60 hover:text-warm-white transition-colors"
                >
                  North Indian Style
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-base font-semibold text-warm-white mb-3">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-warm-white/40" />
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="text-sm font-body text-warm-white/60 hover:text-warm-white transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0 text-warm-white/40" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm font-body text-warm-white/60 hover:text-warm-white transition-colors"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-warm-white/40" />
                <span className="text-sm font-body text-warm-white/60">
                  {CONTACT.address}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="mt-0.5 shrink-0 text-warm-white/40" />
                <span className="text-sm font-body text-warm-white/60">
                  {CONTACT.businessHours}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-white/10">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1.5 text-center sm:text-left">
            <p className="text-xs font-body text-warm-white/50">
              © {currentYear} {SITE_NAME}. All rights reserved.
            </p>
            <p className="text-xs font-body text-warm-white/50 flex flex-wrap items-center justify-center sm:justify-start gap-1">
              <span>Developed by</span>
              <a href="mailto:panjaabhishek57@gmail.com" className="inline-flex items-center gap-1 font-medium text-warm-white/70 hover:text-warm-white transition-colors" title="Email Panja Abhishek">
                Panja Abhishek <Mail size={10} />
              </a>
              <span>and</span>
              <a href="mailto:bhaskarvanjarapu207@gmail.com" className="inline-flex items-center gap-1 font-medium text-warm-white/70 hover:text-warm-white transition-colors" title="Email Bhaskar Vanjarapu">
                Bhaskar Vanjarapu <Mail size={10} />
              </a>
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-2 sm:mt-0">
            {customerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-body text-warm-white/40 hover:text-warm-white/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
