const variants = {
  discount: "bg-pickle-red text-white",
  bestseller: "bg-turmeric-gold text-charcoal",
  new: "bg-heritage-green text-white",
  featured: "bg-earthy-brown text-warm-white",
  outOfStock: "bg-charcoal-muted text-warm-white",
};

export default function Badge({ children, variant = "discount", className = "" }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[11px] font-body font-semibold uppercase tracking-wider rounded-sm ${
        variants[variant] || variants.discount
      } ${className}`}
    >
      {children}
    </span>
  );
}
