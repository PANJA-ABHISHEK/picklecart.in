"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { heroSlides } from "@/lib/data/hero";
import HeroSlide from "./HeroSlide";

import "swiper/css";
import "swiper/css/effect-fade";

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const AUTOPLAY_DELAY = 2000;

  const startProgress = useCallback(() => {
    clearInterval(progressInterval.current);
    setProgress(0);
    const step = 50; // ms
    let elapsed = 0;
    progressInterval.current = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100));
      if (elapsed >= AUTOPLAY_DELAY) {
        clearInterval(progressInterval.current);
      }
    }, step);
  }, []);

  useEffect(() => {
    setMounted(true);
    startProgress();
    return () => clearInterval(progressInterval.current);
  }, [activeIndex, startProgress]);

  const goTo = (index) => {
    swiperRef.current?.slideTo(index);
  };

  const goNext = () => swiperRef.current?.slideNext();
  const goPrev = () => swiperRef.current?.slidePrev();

  if (!mounted) {
    return <section className="relative w-full h-[85vh] md:h-[90vh] lg:h-screen bg-charcoal"></section>;
  }

  return (
    <>
      <section className="relative w-full h-[85vh] md:h-[90vh] lg:h-[95vh] overflow-hidden bg-charcoal" aria-label="Hero carousel">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          loop
          speed={1000}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <HeroSlide slide={slide} isActive={activeIndex === index} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows — desktop only */}
        <div className="hidden md:flex absolute inset-y-0 left-0 right-0 z-20 pointer-events-none">
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 rounded-full bg-warm-white/10 backdrop-blur-sm text-warm-white flex items-center justify-center hover:bg-warm-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-white"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 rounded-full bg-warm-white/10 backdrop-blur-sm text-warm-white flex items-center justify-center hover:bg-warm-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-white"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Bottom Controls: Pagination + Progress */}
        <div className="absolute bottom-[40px] md:bottom-[60px] lg:bottom-[80px] left-0 right-0 z-30">
          <div className="container-main flex items-center justify-center">
            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Hero slide navigation">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                  className={`relative h-1 rounded-full transition-all duration-500 ${
                    activeIndex === index
                      ? "w-10 bg-warm-white"
                      : "w-5 bg-warm-white/30 hover:bg-warm-white/50"
                  }`}
                >
                  {activeIndex === index && (
                    <span
                      className="absolute inset-0 rounded-full bg-turmeric-gold origin-left"
                      style={{
                        transform: `scaleX(${progress / 100})`,
                        transition: "transform 50ms linear",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wavy shape divider connecting to the marquee */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12 lg:h-16 relative block">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-cream" />
          </svg>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-cream pt-4 md:pt-6 lg:pt-8 pb-1">
        <div className="bg-[#6B4B3E] text-warm-white py-3 md:py-3.5 lg:py-4 overflow-hidden relative flex shadow-inner border-y border-charcoal/10">
          <div className="flex whitespace-nowrap animate-marquee items-center text-xs md:text-sm lg:text-[15px] font-bold tracking-[0.15em] font-body uppercase w-max">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="flex items-center shrink-0">
              <span className="mx-4 md:mx-6 flex items-center gap-4 md:gap-6">
                <span>NO PRESERVATIVES</span>
                <span className="text-turmeric-gold-light">•</span>
              </span>
              <span className="mx-4 md:mx-6 flex items-center gap-4 md:gap-6">
                <span>FARM FRESH INGREDIENTS</span>
                <span className="text-turmeric-gold-light">•</span>
              </span>
              <span className="mx-4 md:mx-6 flex items-center gap-4 md:gap-6">
                <span>TRADITIONAL RECIPES</span>
                <span className="text-turmeric-gold-light">•</span>
              </span>
              <span className="mx-4 md:mx-6 flex items-center gap-4 md:gap-6">
                <span>EXPORT QUALITY</span>
                <span className="text-turmeric-gold-light">•</span>
              </span>
              <span className="mx-4 md:mx-6 flex items-center gap-4 md:gap-6">
                <span>TRUSTED BY 1000+ FAMILIES</span>
                <span className="text-turmeric-gold-light">•</span>
              </span>
              <span className="mx-4 md:mx-6 flex items-center gap-4 md:gap-6">
                <span>PURE GHEE</span>
                <span className="text-turmeric-gold-light">•</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
