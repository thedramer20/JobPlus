import { useState, useEffect } from 'react';

/**
 * Delays updating a value until `delay` ms after the
 * last change. Prevents API calls on every keystroke.
 *
 * Usage:
 *   const debouncedQuery = useDebounce(searchQuery, 400);
 *   useEffect(() => {
 *     if (debouncedQuery) fetchJobs(debouncedQuery);
 *   }, [debouncedQuery]);
 */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
