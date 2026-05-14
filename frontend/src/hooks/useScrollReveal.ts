import { useState, useEffect, useRef } from 'react';

/**
 * Returns { ref, visible } where visible becomes true
 * when the element scrolls into view.
 *
 * Usage:
 *   const { ref, visible } = useScrollReveal();
 *   return (
 *     <section
 *       ref={ref}
 *       className={`my-section ${visible ? 'my-section--visible' : ''}`}
 *     />
 *   );
 */
export const useScrollReveal = (threshold = 0.15) => {
  const ref     = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold }
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [threshold]);

  return { ref, visible };
};
