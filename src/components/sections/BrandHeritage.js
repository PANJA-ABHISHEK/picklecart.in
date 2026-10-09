import { getPlaceholderUrl } from "@/services/images";
import Button from "@/components/ui/Button";

export default function BrandHeritage() {
  const bgUrl = getPlaceholderUrl({ width: 1400, height: 600, text: "PickleCart Heritage" });

  return (
    <section className="relative overflow-hidden" aria-label="Brand heritage">
      {/* Split layout — image + content */}
      <div className="md:grid md:grid-cols-2 min-h-[400px] md:min-h-[500px]">
        {/* Image side */}
        <div
          className="relative h-64 md:h-auto bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgUrl})`,
          }}
          data-aos="fade-right"
        >
          <div className="absolute inset-0 bg-charcoal/20" />
        </div>

        {/* Content side */}
        <div
          className="bg-earthy-brown flex items-center"
          data-aos="fade-left"
        >
          <div className="px-6 py-12 md:px-10 lg:px-16 md:py-16 max-w-lg">
            <span className="inline-block text-xs font-body font-semibold tracking-[0.2em] uppercase text-turmeric-gold-light mb-4">
              Our Heritage
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-warm-white leading-tight">
              From Traditional Kitchens to Modern Homes
            </h2>
            <p className="font-body text-warm-white/70 mt-4 leading-relaxed">
              Every PickleCart product carries a story — of ingredients carefully
              selected, recipes lovingly preserved, and flavours that bridge
              generations. We bring the warmth and authenticity of traditional
              Indian kitchens to your doorstep.
            </p>
            <p className="font-body text-warm-white/60 mt-3 text-sm leading-relaxed">
              Our recipes are inspired by the culinary wisdom of home cooks from
              Andhra, Telangana, Karnataka, and Tamil Nadu — each region
              contributing its own unique character to our collection.
            </p>
            <div className="mt-6">
              <Button href="/about" variant="outline-light" size="md">
                Read Our Story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
