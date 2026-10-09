import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE, CONTACT, NAV_LINKS, REGIONS } from "@/lib/constants";

const quickLinks = [
  { label: "Home", href: "/" },
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
  const currentYear = "2026";

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
                  src="/footerlogo.png"
                  alt={`${SITE_NAME} Logo`}
                  fill
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

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-warm-white/10 flex items-center justify-center hover:bg-warm-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-warm-white/10 flex items-center justify-center hover:bg-warm-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-warm-white/40">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
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
