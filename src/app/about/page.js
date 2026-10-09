import { getPlaceholderUrl } from "@/services/images";
import { testimonials } from "@/lib/data/products";
import Button from "@/components/ui/Button";
import { Leaf, Award, HandHeart, MapPin, ShieldCheck, Flame, Star, Quote } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Learn about PickleCart's story, heritage, traditional recipes, and commitment to authentic Indian food products.",
};

const values = [
  { icon: Leaf, title: "Authentic Ingredients", desc: "Sourced from trusted farmers across India." },
  { icon: HandHeart, title: "Generational Recipes", desc: "Preserved traditions from South Indian kitchens." },
  { icon: Flame, title: "Handcrafted Preparation", desc: "Small-batch, hand-mixed with care and attention." },
  { icon: MapPin, title: "Regional Identity", desc: "Every region's unique culinary personality honoured." },
  { icon: ShieldCheck, title: "No Preservatives", desc: "Pure, natural ingredients — nothing artificial." },
  { icon: Award, title: "Quality Assured", desc: "Every product tested before it reaches you." },
];

export default function AboutPage() {
  // Removed bgUrl generator

  return (
    <div className="bg-warm-white">
      {/* Hero */}
      <div
        className="relative h-[250px] md:h-[350px] lg:h-[380px] overflow-hidden bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(/aboutuspagebackground.png)` }}
      >
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="relative z-10 container-main flex flex-col items-center justify-center text-center px-4 mt-[-20px] md:mt-[-40px]">
          <span className="text-xs md:text-sm font-body font-bold tracking-[0.25em] uppercase text-turmeric-gold mb-3 block drop-shadow-md">
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-warm-white drop-shadow-lg">
            About PickleCart
          </h1>
          <p className="font-body text-warm-white/95 mt-3 md:mt-5 text-base md:text-xl max-w-2xl mx-auto drop-shadow-md leading-relaxed font-medium">
            Discover the heritage, traditional recipes, and the passion that goes into every jar we craft.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-5">
              Fill Your Cart with Tradition
            </h2>
            <p className="font-body text-charcoal-light leading-relaxed mb-4">
              PickleCart was born from a simple belief — that the authentic flavours of Indian kitchens deserve to reach every home across the country. We bring you traditional pickles, podis, snacks, and food products prepared with recipes that have been lovingly passed down through generations.
            </p>
            <p className="font-body text-charcoal-light leading-relaxed">
              Every jar of pickle, every packet of podi, and every bag of murukku carries the warmth and authenticity of a home kitchen. We work with families and small producers who share our passion for quality, tradition, and flavour.
            </p>
          </div>
        </div>
      </section>

      {/* Heritage split */}
      <section className="bg-cream">
        <div className="md:grid md:grid-cols-2 min-h-[400px]">
          <div className="h-64 md:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${getPlaceholderUrl({ width: 700, height: 500, text: "Heritage" })})` }} />
          <div className="flex items-center px-6 py-12 md:px-10 lg:px-16" data-aos="fade-left">
            <div className="max-w-md">
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-earthy-brown mb-3 block">Our Heritage</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-4">
                From Traditional Kitchens to Modern Homes
              </h2>
              <p className="font-body text-charcoal-light leading-relaxed mb-3">
                The recipes we use are inspired by the culinary traditions of Andhra Pradesh, Telangana, Karnataka, and Tamil Nadu — regions known for their bold, aromatic, and deeply flavourful cuisine.
              </p>
              <p className="font-body text-charcoal-light leading-relaxed">
                We respect traditional methods — sun-drying, hand-grinding, slow-mixing — because we know that great food cannot be rushed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-heritage-green mb-3 block">What We Stand For</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal">Our Quality Promise</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-5 rounded-sm bg-cream border border-border-light">
                  <Icon size={22} className="text-heritage-green mb-3" />
                  <h3 className="font-display text-base font-semibold text-charcoal mb-1.5">{v.title}</h3>
                  <p className="font-body text-sm text-charcoal-light">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-cream">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className="bg-warm-white rounded-sm p-6 border border-border-light">
                <Quote size={20} className="text-turmeric-gold/30 mb-2" />
                <p className="font-body text-sm text-charcoal-light leading-relaxed mb-3">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < t.rating ? "fill-turmeric-gold text-turmeric-gold" : "text-charcoal-muted/20"} />
                  ))}
                </div>
                <p className="text-sm font-body font-semibold text-charcoal">{t.name}</p>
                <p className="text-xs font-body text-charcoal-muted">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-earthy-brown text-center">
        <div className="container-main" data-aos="fade-up">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-warm-white mb-4">
            Ready to Taste Tradition?
          </h2>
          <p className="font-body text-warm-white/70 mb-6 max-w-md mx-auto">
            Explore our collection of authentic Indian food products.
          </p>
          <Button href="/south-indian" variant="outline-light" size="lg">
            Explore PickleCart
          </Button>
        </div>
      </section>
    </div>
  );
}
