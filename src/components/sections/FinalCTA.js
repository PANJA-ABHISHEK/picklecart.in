import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="section-padding bg-warm-white" aria-label="Start shopping">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center" data-aos="fade-up">
          <span className="inline-block text-xs font-body font-semibold tracking-[0.2em] uppercase text-heritage-green mb-4">
            PickleCart
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
            Fill Your Cart with Tradition
          </h2>
          <p className="font-body text-charcoal-light mt-4 text-base md:text-lg leading-relaxed max-w-md mx-auto">
            Bring authentic Indian flavours home. Explore our collection of handcrafted pickles, podis, snacks, and more.
          </p>
          <div className="mt-8">
            <Button href="/south-indian" size="xl">
              Explore PickleCart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
