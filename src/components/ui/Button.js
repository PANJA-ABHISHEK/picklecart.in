import Link from "next/link";

const variants = {
  primary:
    "bg-pickle-red text-white hover:bg-pickle-red-dark focus-visible:ring-pickle-red",
  secondary:
    "bg-heritage-green text-white hover:bg-heritage-green-dark focus-visible:ring-heritage-green",
  outline:
    "border-2 border-charcoal text-charcoal hover:bg-charcoal hover:!text-white focus-visible:ring-charcoal",
  "outline-light":
    "border-2 border-white !text-white hover:bg-white hover:!text-charcoal focus-visible:ring-white",
  ghost:
    "text-charcoal hover:bg-cream-dark focus-visible:ring-charcoal",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
  xl: "px-10 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-body font-semibold rounded-full tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95";

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${
    sizes[size] || sizes.md
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
