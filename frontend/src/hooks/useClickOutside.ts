import { useEffect, RefObject } from 'react';

/**
 * Calls `handler` when a click occurs outside the `ref` element.
 *
 * Usage:
 *   const menuRef = useRef(null);
 *   useClickOutside(menuRef, () => setMenuOpen(false));
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};
