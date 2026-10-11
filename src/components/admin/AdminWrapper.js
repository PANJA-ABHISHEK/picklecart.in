"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AdminSidebar from "./AdminSidebar";

export default function AdminWrapper({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  
  // Don't apply admin shell on the login page
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="flex-1 w-full">{children}</div>;
  }

  return (
    <>
      <AdminSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ml-0 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-border-light p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <Link href="/" className="relative h-8 w-32 block">
            <Image src="/logo.png" alt="PickleCart" fill className="object-contain object-left" />
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="p-1.5 rounded-md text-charcoal hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
