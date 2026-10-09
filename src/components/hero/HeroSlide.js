"use client";

import { useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { resolveImage } from "@/services/images";

export default function HeroSlide({ slide, isActive }) {
  const contentRef = useRef(null);

  // Subtle animation on active
  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;

    if (isActive) {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      });
    } else {
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
    }
  }, [isActive]);

  const bgUrl = resolveImage(slide.image, { width: 1920, height: 1080, text: slide.title });
  const mobileBgUrl = resolveImage(slide.mobileImage || slide.image, { width: 1080, height: 1920, text: slide.title });

  return (
    <div className="relative w-full h-full">
      {/* Background Image - Desktop */}
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        {/* Ken Burns effect */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out ${
            isActive ? "scale-105" : "scale-100"
          }`}
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      </div>

      {/* Background Image - Mobile */}
      <div
        className="absolute inset-0 bg-cover bg-center block md:hidden"
        style={{ backgroundImage: `url(${mobileBgUrl})` }}
      >
        {/* Ken Burns effect */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out ${
            isActive ? "scale-105" : "scale-100"
          }`}
          style={{ backgroundImage: `url(${mobileBgUrl})` }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-charcoal/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="container-main w-full">
          <div ref={contentRef} className="max-w-3xl mx-auto flex flex-col items-center" style={{ opacity: 0 }}>
            {/* Eyebrow */}
            {slide.eyebrow && (
              <span className="inline-block text-xs font-body font-semibold tracking-[0.25em] uppercase !text-turmeric-gold mb-4 drop-shadow-sm">
                {slide.eyebrow}
              </span>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold !text-white leading-[1.1] mb-4 whitespace-pre-line drop-shadow-md">
              {slide.title}
            </h1>

            {/* Subtitle */}
            {slide.subtitle && (
              <p className="text-base md:text-lg font-body font-medium !text-white mb-3 drop-shadow-sm">
                {slide.subtitle}
              </p>
            )}

            {/* Description */}
            {slide.description && (
              <p className="text-sm md:text-base font-body !text-white/90 leading-relaxed mb-8 max-w-xl text-center drop-shadow-sm">
                {slide.description}
              </p>
            )}

            {/* CTA */}
            {slide.ctaLabel && (
              <Button
                href={slide.ctaHref}
                variant="outline-light"
                size="lg"
              >
                {slide.ctaLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
