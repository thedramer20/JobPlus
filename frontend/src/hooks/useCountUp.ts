import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to `target` when the element
 * enters the viewport. Triggers only once.
 *
 * Usage:
 *   const { display, ref } = useCountUp(4200000, 2000, '', '+');
 *   return <div ref={ref}>{display}</div>  // shows "4,200,000+"
 */
export const useCountUp = (
  target: number,
  duration = 2000,
  prefix  = '',
  suffix  = ''
) => {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);

          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic — starts fast, slows at end
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [target, duration, started]);

  return {
    display: `${prefix}${count.toLocaleString()}${suffix}`,
    ref,
  };
};
