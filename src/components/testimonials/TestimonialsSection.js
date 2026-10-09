"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data/products";
import SectionHeading from "@/components/ui/SectionHeading";

import "swiper/css";

export default function TestimonialsSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="section-padding bg-cream" aria-label="Customer testimonials">
      <div className="container-main">
        <SectionHeading
          eyebrow="What Our Customers Say"
          title="Loved by Families Across India"
          description="Real reviews from real customers who trust PickleCart for authentic Indian food products."
        />

        {mounted ? (
          <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop
          className="pb-4"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-warm-white rounded-sm p-6 md:p-7 border border-border-light h-full flex flex-col">
                {/* Quote icon */}
                <Quote size={24} className="text-turmeric-gold/30 mb-3 shrink-0" />

                {/* Review text */}
                <p className="font-body text-sm text-charcoal-light leading-relaxed flex-1">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Rating */}
                <div className="flex items-center gap-0.5 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < t.rating
                          ? "fill-turmeric-gold text-turmeric-gold"
                          : "text-charcoal-muted/20"
                      }
                    />
                  ))}
                </div>

                {/* Customer */}
                <div className="mt-3 pt-3 border-t border-border-light">
                  <p className="text-sm font-body font-semibold text-charcoal">
                    {t.name}
                  </p>
                  <p className="text-xs font-body text-charcoal-muted mt-0.5">
                    {t.location}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        ) : (
          <div className="h-[250px] w-full" />
        )}
      </div>
    </section>
  );
}
