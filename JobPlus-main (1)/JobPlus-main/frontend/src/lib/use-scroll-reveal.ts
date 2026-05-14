import { useEffect } from "react";

export function useScrollReveal(triggerKey?: string) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll(
        ".jp-reveal, .jp-reveal-up, .jp-reveal-scale, .jp-reveal-fade"
      );
      
      // For admin pages, add is-visible class immediately since content is already in view
      const isAdminPage = window.location.pathname.startsWith("/admin");
      
      revealElements.forEach((el) => {
        if (isAdminPage) {
          el.classList.add("is-visible");
        } else {
          // For other pages, use IntersectionObserver
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
          observer.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [triggerKey]);
}
