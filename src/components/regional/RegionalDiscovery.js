import Link from "next/link";
import { REGIONS } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import { resolveImage } from "@/services/images";

export default function RegionalDiscovery() {
  return (
    <section className="section-padding bg-cream" aria-label="Explore by region">
      <div className="container-main">
        <SectionHeading
          eyebrow="Regional Flavours"
          title="Taste the Tradition of Every Region"
          description="Each region of India has its own culinary identity. Discover authentic flavours from Andhra, Telangana, Karnataka, Tamil Nadu, and North India."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {REGIONS.map((region, i) => (
            <div
              key={region.id}
              className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 100}
            >
              <RegionCard region={region} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionCard({ region }) {
  const href = region.parentRoute
    ? `${region.parentRoute}/${region.slug}`
    : `/${region.slug}`;
  const bgUrl = resolveImage(region.cardImage || region.image, { width: 800, height: 600, text: region.name });

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-[0.98] h-64 md:h-72 lg:h-80 ring-1 ring-black/5"
    >
      {/* BG Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/30 to-charcoal/5 transition-all duration-300 group-hover:from-charcoal/85" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-5 md:p-6">
        <h3 className="font-display font-bold text-warm-white leading-tight text-xl md:text-2xl">
          {region.name}
        </h3>
        <p className="font-body text-warm-white/70 mt-1.5 text-sm md:text-base max-w-sm">
          {region.shortDescription}
        </p>
        <span className="inline-flex items-center mt-3 text-xs font-body font-semibold text-turmeric-gold tracking-wider uppercase group-hover:text-turmeric-gold-light transition-colors">
          Explore {region.name} →
        </span>
      </div>
    </Link>
  );
}
