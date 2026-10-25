"use client";
import { useEffect } from "react";

/**
 * Scroll-reveal without any library. Elements with [data-reveal] that start below the fold get a
 * "pending" state, then fade/slide in once when they enter the viewport. Above-the-fold content is never hidden.
 */
export default function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) return;
      el.classList.add("reveal-pending");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
