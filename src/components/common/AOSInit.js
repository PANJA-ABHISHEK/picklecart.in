"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  useEffect(() => {
    // Slight delay ensures React hydration completes before AOS mutates the DOM
    const timer = setTimeout(() => {
      AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
        disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
