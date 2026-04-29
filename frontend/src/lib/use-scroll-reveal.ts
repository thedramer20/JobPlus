import { useEffect } from "react";

export function useScrollReveal(triggerKey?: string) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    // Delay slightly so Suspense/lazy-loaded components are in the DOM
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(
        ".jp-reveal, .jp-reveal-up, .jp-reveal-scale, .jp-reveal-fade"
      );
      revealElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [triggerKey]);
}
