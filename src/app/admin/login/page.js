"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAdmin } from "@/app/actions/auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await loginAdmin(username, password);
      if (result.success) {
        window.location.href = "/admin/products";
      } else {
        setError(result.error || "Invalid username or password.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream w-full relative overflow-hidden px-4">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-heritage-green/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pickle-red/5 rounded-full blur-3xl pointer-events-none" />
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-border-light relative z-10 h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-heritage-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream w-full relative overflow-hidden px-4">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-heritage-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pickle-red/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-border-light relative z-10">
        <div className="p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <Image
              src="https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740885/picklecart_assets/logo.png"
              alt="PickleCart"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-charcoal">Store Admin</h1>
            <p className="text-sm text-charcoal/60 mt-2 font-body">
              Please sign in to manage the store.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-body font-medium text-charcoal mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-light bg-cream/30 focus:border-heritage-green focus:ring-1 focus:ring-heritage-green/20 outline-none transition-all text-charcoal font-body text-sm placeholder:text-charcoal-muted"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-charcoal mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-light bg-cream/30 focus:border-heritage-green focus:ring-1 focus:ring-heritage-green/20 outline-none transition-all text-charcoal font-body text-sm placeholder:text-charcoal-muted"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-charcoal text-white py-3.5 rounded-xl font-display font-bold text-sm tracking-wide hover:bg-charcoal-light transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        <div className="bg-cream/50 p-4 text-center border-t border-border-light">
          <p className="text-xs font-body font-medium text-charcoal-muted">
            PickleCart Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
