import { Leaf, Award, HandHeart, MapPin, ShieldCheck, Flame } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Authentic Ingredients",
    description:
      "We source fresh produce and spices directly from trusted farmers — no shortcuts, no substitutes.",
  },
  {
    icon: HandHeart,
    title: "Traditional Recipes",
    description:
      "Our recipes are inspired by generations of home cooks, preserving the authentic taste of regional Indian cuisine.",
  },
  {
    icon: Flame,
    title: "Handcrafted Quality",
    description:
      "Every batch is prepared with care and attention, maintaining the character of small-batch, homemade food.",
  },
  {
    icon: MapPin,
    title: "Regional Flavours",
    description:
      "From Andhra's bold spice to Tamil Nadu's subtle tang — we celebrate the culinary diversity of India.",
  },
  {
    icon: ShieldCheck,
    title: "Freshness Promise",
    description:
      "No artificial preservatives or additives. Just pure, natural ingredients prepared the right way.",
  },
  {
    icon: Award,
    title: "Quality You Can Trust",
    description:
      "Every product is tasted, tested, and approved before it reaches your doorstep. Quality is non-negotiable.",
  },
];

export default function WhyPickleCart() {
  return (
    <section className="py-4 md:py-8 bg-cream" aria-label="Why choose PickleCart">
      <div className="container-main">
        {/* Main division with blended gradient */}
        <div className="bg-gradient-to-br from-[#FDFBF7] via-[#E6D4BE] to-[#B08D6A] rounded-[2rem] shadow-2xl shadow-earthy-brown/10 border border-white/40 px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12 lg:px-16 lg:py-14 relative overflow-hidden">
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-turmeric-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-heritage-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative max-w-2xl mx-auto text-center mb-6 md:mb-10">
            <span className="inline-block text-xs font-body font-semibold tracking-[0.2em] uppercase text-earthy-brown mb-3">
              Our Promise
            </span>
            <h2 className="font-display font-bold text-charcoal text-3xl md:text-4xl lg:text-5xl">
              Why PickleCart
            </h2>
            <p className="mt-4 text-base md:text-lg font-body text-charcoal-light leading-relaxed">
              We believe in food that tells a story — prepared with authenticity, served with trust.
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {values.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group p-4 md:p-6 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm hover:bg-white/95 hover:shadow-xl hover:shadow-earthy-brown/10 hover:-translate-y-1 transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                >
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/80 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-turmeric-gold/20 transition-colors duration-300 shadow-sm">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-earthy-brown group-hover:text-earthy-brown-dark transition-colors duration-300" />
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-charcoal mb-1.5 md:mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-charcoal-light leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
