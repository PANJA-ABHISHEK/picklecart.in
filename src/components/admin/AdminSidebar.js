"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/actions/auth";
import { 
  Package, 
  Tags, 
  ShoppingCart, 
  LogOut,
  X,
  Settings,
  MessageSquare,
  Ticket,
  MapPin
} from "lucide-react";

const MENU_ITEMS = [
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Discounts", href: "/admin/promocodes", icon: Ticket },
  { name: "Store Locations", href: "/admin/locations", icon: MapPin },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show sidebar on the login page or while hydrating
  if (!mounted || pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    await logoutAdmin();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-charcoal/50 z-30 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen && setMobileOpen(false)}
      />

      <div className={`w-64 bg-white h-screen border-r border-border-light fixed left-0 top-0 flex flex-col shadow-sm z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link 
            href="/" 
            className="relative h-12 w-40 block hover:opacity-80 transition-opacity"
            title="Go to Live Website"
          >
            <Image
              src="/logo.png"
              alt="PickleCart Official Logo"
              fill
              className="object-contain"
            />
          </Link>
          <button 
            className="lg:hidden p-2 -mr-3 text-charcoal-light hover:text-charcoal"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-earthy-brown/10 text-earthy-brown" 
                  : "text-charcoal/70 hover:bg-cream hover:text-earthy-brown"
              }`}
            >
              <Icon size={20} className={isActive ? "text-earthy-brown" : "text-charcoal/50"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-light">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-surface rounded-lg border border-border">
          <div className="w-8 h-8 rounded-full bg-earthy-brown/20 flex items-center justify-center text-earthy-brown font-bold text-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-charcoal truncate">Admin</p>
            <p className="text-xs text-charcoal/50">Administrator</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-pickle-red hover:bg-pickle-red/10 font-medium transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
      </div>
    </>
  );
}
