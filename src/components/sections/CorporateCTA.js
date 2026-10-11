import Image from "next/image";
import { Gift, Building2 } from "lucide-react";
import Button from "@/components/ui/Button";

const bgUrl = "https://res.cloudinary.com/epv5nqqv/image/upload/f_auto,q_auto/v1791740862/picklecart_assets/bulkorderhomebackgroundimage.png";

export default function CorporateCTA() {
  return (
    <section className="py-8 md:py-10 bg-cream" aria-label="Corporate and bulk orders">
      <div className="container-main">
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-charcoal/10 border border-white/50">
          {/* Background Image */}
          <Image
            src={bgUrl}
            alt="Corporate Gifting & Bulk Orders"
            fill
            loading="lazy"
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/75 to-charcoal/30 backdrop-blur-[2px]" />

          {/* Content */}
          <div className="relative z-10 px-6 py-16 md:py-20 lg:py-24 flex flex-col items-center justify-center min-h-[400px]">
        <div className="max-w-3xl w-full mx-auto text-center flex flex-col items-center" data-aos="fade-up">
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-warm-white/10 flex items-center justify-center">
              <Building2 size={22} className="text-turmeric-gold-light" />
            </div>
            <div className="w-12 h-12 rounded-full bg-warm-white/10 flex items-center justify-center">
              <Gift size={22} className="text-turmeric-gold-light" />
            </div>
          </div>

          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-warm-white leading-tight">
            Corporate Gifting &amp; Bulk Orders
          </h2>
          <p className="font-body text-warm-white/70 mt-4 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            Looking for authentic food gifts for your team, clients, or events?
            We offer curated hampers, custom packaging, and special pricing for
            bulk orders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full">
            <Button href="/corporate-bulk-orders" variant="outline-light" size="lg">
              Explore Corporate &amp; Bulk Orders
            </Button>
            <Button href="/contact" variant="outline-light" size="lg" className="border-white/50 text-white/90 hover:border-white hover:text-white">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}
