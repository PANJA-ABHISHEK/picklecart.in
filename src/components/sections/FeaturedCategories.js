import Link from "next/link";
import { resolveImage } from "@/services/images";
import SectionHeading from "@/components/ui/SectionHeading";

const featuredCategories = [
  {
    title: "Podis & Powders",
    description: "Aromatic gunpowder blends for idli, dosa & rice.",
    image: "/images/featured/podis.jpg",
    href: "/south-indian/andhra-delights?category=podi-powders",
    accent: "bg-pickle-red",
  },
  {
    title: "Traditional Snacks",
    description: "Crunchy murukku, mixture & pakodas for tea time.",
    image: "/images/featured/snacks.jpg",
    href: "/south-indian/andhra-delights?category=snacks",
    accent: "bg-heritage-green",
  },
  {
    title: "Cold-Pressed Oils",
    description: "Pure sesame & groundnut oils for authentic cooking.",
    image: "/images/featured/oils.jpg",
    href: "/south-indian/andhra-delights?category=oils",
    accent: "bg-turmeric-gold-dark",
  },
  {
    title: "Groceries & Millets",
    description: "Premium millets, spices & traditional staples.",
    image: "/images/featured/groceries.jpg",
    href: "/south-indian/andhra-delights?category=groceries-millets",
    accent: "bg-earthy-brown",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="section-padding bg-warm-white" aria-label="Featured food categories">
      <div className="container-main">
        <SectionHeading
          eyebrow="Beyond Pickles"
          title="More from Our Kitchen"
          description="PickleCart is more than pickles. Explore our collection of podis, snacks, oils, millets, and traditional staples."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {featuredCategories.map((cat, i) => {
            const bgUrl = resolveImage(cat.image, { width: 700, height: 400, text: cat.title });
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative flex items-end overflow-hidden rounded-sm h-56 md:h-64 lg:h-72 transition-transform duration-300 active:scale-[0.98]"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                {/* BG */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${bgUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/30 to-transparent" />

                {/* Accent bar */}
                <div className={`absolute top-0 left-0 w-1 h-full ${cat.accent}`} />

                {/* Content */}
                <div className="relative z-10 p-5 md:p-6">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-warm-white">
                    {cat.title}
                  </h3>
                  <p className="font-body text-sm text-warm-white/70 mt-1.5 max-w-xs">
                    {cat.description}
                  </p>
                  <span className="inline-block mt-3 text-xs font-body font-semibold text-turmeric-gold tracking-wider uppercase group-hover:text-turmeric-gold-light transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
