export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className = "",
}) {
  const alignClasses = {
    center: "text-center mx-auto",
    left: "text-left",
    right: "text-right ml-auto",
  };

  return (
    <div className={`max-w-2xl mb-8 md:mb-10 ${alignClasses[align]} ${className}`}>
      {eyebrow && (
        <span
          className={`inline-block text-xs font-body font-semibold tracking-[0.2em] uppercase mb-3 ${
            light ? "text-turmeric-gold-light" : "text-heritage-green"
          }`}
        >
          {eyebrow}
        </span>
      )}
      {title && (
        <h2
          className={`font-display font-bold leading-tight ${
            light ? "text-warm-white" : "text-charcoal"
          }`}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={`mt-4 text-base md:text-lg leading-relaxed ${
            light ? "text-warm-white/80" : "text-charcoal-light"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
