import { getPlaceholderUrl } from "@/services/images";

const steps = [
  {
    step: "01",
    title: "Select Ingredients",
    description:
      "We begin with the finest seasonal produce — hand-picked mangoes, fresh gongura, sun-dried chillies, and premium spices sourced directly from trusted farmers.",
    image: "/images/story/ingredients.jpg",
  },
  {
    step: "02",
    title: "Traditional Preparation",
    description:
      "Each recipe follows time-honoured methods — hand-cut, sun-dried, and slow-mixed to ensure every ingredient retains its natural flavour and character.",
    image: "/images/story/preparation.jpg",
  },
  {
    step: "03",
    title: "Spice & Season",
    description:
      "Our signature spice blends are carefully measured and mixed by hand. No artificial preservatives — just authentic combinations perfected over generations.",
    image: "/picklecartimg2.png",
  },
  {
    step: "04",
    title: "Seal & Deliver",
    description:
      "Prepared with care and sealed to preserve freshness, every jar reaches your table with the same homemade warmth and quality we stand behind.",
    image: "/images/story/final.jpg",
  },
];

export default function TraditionalStory() {
  return (
    <section className="section-padding bg-cream" aria-label="Our traditional preparation process">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-body font-semibold tracking-[0.2em] uppercase text-earthy-brown mb-3">
            The PickleCart Way
          </span>
          <h2 className="font-display font-bold text-charcoal">
            Every Jar Carries a Story
          </h2>
          <p className="mt-4 text-base md:text-lg font-body text-charcoal-light leading-relaxed">
            From farm-fresh ingredients to your table — discover the care and tradition behind every PickleCart product.
          </p>
        </div>

        {/* Steps — editorial alternating layout */}
        <div className="space-y-12 md:space-y-0">
          {steps.map((item, i) => {
            const isReversed = i % 2 !== 0;
            const bgUrl = item.image || getPlaceholderUrl({ width: 600, height: 500, text: item.title });

            return (
              <div
                key={item.step}
                className={`md:grid md:grid-cols-2 md:gap-8 lg:gap-12 items-center ${
                  i > 0 ? "mt-12 md:mt-10 lg:mt-12" : ""
                }`}
                data-aos="fade-up"
              >
                {/* Image */}
                <div
                  className={`relative aspect-video rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-cream-dark ${
                    isReversed ? "md:order-2" : ""
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgUrl})` }}
                    role="img"
                    aria-label={item.title}
                  />
                  {/* Step number overlay */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-warm-white/95 backdrop-blur-sm text-charcoal shadow-lg flex items-center justify-center text-base font-display font-bold border border-warm-white/50">
                    {item.step}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`mt-5 md:mt-0 ${
                    isReversed ? "md:order-1 md:text-right" : ""
                  }`}
                >
                  <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-turmeric-gold">
                    Step {item.step}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-charcoal mt-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-charcoal-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
