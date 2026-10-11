"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ChevronDown, ShoppingBag } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useCart } from "@/contexts/CartContext";

export default function MobileDrawer({ isOpen, onClose }) {
  const pathname = usePathname();
  const { itemCount, toggleDrawer } = useCart();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleSubmenu = (label) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm bg-warm-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <div className="relative h-[40px] w-[130px]">
            <Image
              src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740885/picklecart_assets/logo.png"
              alt={`${SITE_NAME} Logo`}
              fill
              loading="lazy"
              className="object-contain object-left"
            />
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 text-charcoal-light hover:text-charcoal transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-green"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-5" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              if (link.children) {
                const isExpanded = expandedMenu === link.label;
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => toggleSubmenu(link.label)}
                      className={`w-full flex items-center justify-between py-3 text-base font-body font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-heritage-green"
                          : "text-charcoal-light"
                      }`}
                      aria-expanded={isExpanded}
                    >
                      {link.label}
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? "max-h-60" : "max-h-0"
                      }`}
                    >
                      <ul className="pl-4 pb-2 space-y-0.5 border-l-2 border-cream-dark">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={`block py-2.5 text-sm font-body transition-colors ${
                                isActive(child.href)
                                  ? "text-heritage-green font-medium"
                                  : "text-charcoal-muted hover:text-charcoal"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`block py-3 text-base font-body font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-heritage-green"
                        : "text-charcoal-light hover:text-charcoal"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Cart link in drawer */}
          <div className="mt-6 pt-6 border-t border-border">
            <button
              onClick={() => {
                onClose();
                toggleDrawer();
              }}
              className="w-full flex items-center gap-3 py-3 text-base font-body font-medium text-charcoal-light hover:text-charcoal transition-colors"
            >
              <ShoppingBag size={20} />
              Cart
              {mounted && itemCount > 0 && (
                <span className="ml-auto bg-pickle-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
