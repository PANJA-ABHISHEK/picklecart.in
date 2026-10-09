import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import { resolveImage } from "@/services/images";

export default function CategoryDiscovery() {
  return (
    <section className="section-padding bg-warm-white" aria-label="Browse by category">
      <div className="container-main">
        <SectionHeading
          eyebrow="What We Offer"
          title="Explore Our Collection"
          description="From fiery pickles to aromatic podis, crunchy snacks to traditional oils — discover the full range of authentic Indian food products."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* First category — larger feature card */}
          <div className="col-span-2 row-span-2" data-aos="fade-up">
            <CategoryCard category={CATEGORIES[0]} featured />
          </div>

          {/* Remaining categories */}
          {CATEGORIES.slice(1).map((cat, i) => (
            <div key={cat.id} data-aos="fade-up" data-aos-delay={100 + i * 50}>
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, featured = false }) {
  const bgUrl = resolveImage(category.image, { width: 600, height: featured ? 600 : 400, text: category.name });

  return (
    <Link
      href={`/south-indian/andhra-delights?category=${category.slug}`}
      className={`group relative block overflow-hidden rounded-sm transition-transform duration-300 active:scale-[0.98] ${
        featured ? "h-full min-h-[320px] md:min-h-[420px]" : "h-48 md:h-56"
      }`}
    >
      {/* BG Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent transition-all duration-300 group-hover:from-charcoal/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-5">
        <h3
          className={`font-display font-bold text-warm-white leading-tight ${
            featured ? "text-xl md:text-2xl" : "text-base md:text-lg"
          }`}
        >
          {category.name}
        </h3>
        {featured && (
          <p className="text-sm font-body text-warm-white/70 mt-1.5 max-w-xs">
            {category.description}
          </p>
        )}
        <span className="inline-flex items-center mt-2 text-xs font-body font-semibold text-turmeric-gold tracking-wider uppercase group-hover:text-turmeric-gold-light transition-colors">
          Explore →
        </span>
      </div>
    </Link>
  );
}
