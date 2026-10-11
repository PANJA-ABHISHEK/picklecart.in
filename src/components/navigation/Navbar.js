"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Search, Menu, X, ChevronDown } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useCart } from "@/contexts/CartContext";
import MobileDrawer from "./MobileDrawer";
import SearchModal from "./SearchModal";
import AnnouncementBar from "./AnnouncementBar";

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, toggleDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll for navbar style change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Keyboard close for dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    clearTimeout(dropdownTimeoutRef.current);
    setDropdownOpen(true);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => setDropdownOpen(false), 150);
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col ${scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-md"
            : "bg-cream"
          }`}
      >
        <AnnouncementBar />
        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-heritage-green via-pickle-red to-turmeric-gold shrink-0" />

        <div className="container-main shrink-0">
          <nav className="flex items-center justify-between h-16 md:h-18" aria-label="Main navigation">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label={`${SITE_NAME} — Home`}
            >
              <div className="relative h-12 w-48 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt={`${SITE_NAME} Logo`}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                if (link.children) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      ref={dropdownRef}
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-body font-medium transition-colors duration-200 rounded-sm ${isActive(link.href)
                            ? "text-heritage-green"
                            : "text-charcoal-light hover:text-charcoal"
                          }`}
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                      </Link>

                      {/* Dropdown */}
                      <div
                        className={`absolute top-full left-0 mt-1 min-w-[240px] bg-cream border border-border rounded-sm shadow-lg transition-all duration-200 origin-top ${dropdownOpen
                            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                          }`}
                        role="menu"
                      >
                        <div className="py-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              role="menuitem"
                              className={`block px-5 py-2.5 text-sm font-body transition-colors duration-150 ${isActive(child.href)
                                  ? "text-heritage-green bg-cream"
                                  : "text-charcoal-light hover:text-charcoal hover:bg-cream"
                                }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-body font-medium transition-colors duration-200 rounded-sm ${isActive(link.href)
                        ? "text-heritage-green"
                        : "text-charcoal-light hover:text-charcoal"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button
                onClick={toggleDrawer}
                aria-label={`Shopping cart, ${mounted ? itemCount : 0} items`}
                className="relative cursor-pointer p-2 text-charcoal-light hover:text-charcoal transition-colors duration-200 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-green"
              >
                <ShoppingCart size={20} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-pickle-red text-white text-[10px] font-body font-bold rounded-full flex items-center justify-center leading-none animate-[scaleIn_0.2s_ease-out]">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="lg:hidden p-2 text-charcoal-light hover:text-charcoal transition-colors duration-200 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-heritage-green"
              >
                <Menu size={22} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-[calc(4rem+2px)] md:h-[calc(4.5rem+2px)]" />

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
