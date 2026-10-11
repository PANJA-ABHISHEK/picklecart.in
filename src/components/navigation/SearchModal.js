"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/services/products";
import { formatPrice, debounce } from "@/lib/utils";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (q) => {
      if (q.trim().length >= 2) {
        try {
          const res = await searchProducts(q);
          setResults(res.slice(0, 8));
        } catch (e) {
          setResults([]);
        }
      } else {
        setResults([]);
      }
    }, 250),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search products">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-2xl mx-auto mt-20 md:mt-32 px-4">
        <div className="bg-warm-white rounded-sm shadow-xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <Search size={20} className="text-charcoal-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search pickles, podis, snacks..."
              className="flex-1 text-base font-body text-charcoal bg-transparent outline-none placeholder:text-charcoal-muted"
              aria-label="Search products"
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              className="p-1 text-charcoal-muted hover:text-charcoal transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Results */}
          {query.trim().length >= 2 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <ul className="py-2">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-cream transition-colors"
                      >
                        <div className="w-12 h-12 rounded-sm bg-cream-dark flex items-center justify-center shrink-0 overflow-hidden">
                          <span className="text-xs text-charcoal-muted font-body">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-body font-medium text-charcoal truncate">
                            {product.name}
                          </p>
                          <p className="text-xs font-body text-charcoal-muted mt-0.5">
                            {product.shortDescription}
                          </p>
                        </div>
                        <span className="text-sm font-body font-semibold text-charcoal shrink-0">
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-sm font-body text-charcoal-muted">
                    No products found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Hint */}
          {query.trim().length < 2 && (
            <div className="py-8 text-center">
              <p className="text-sm font-body text-charcoal-muted">
                Type at least 2 characters to search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
