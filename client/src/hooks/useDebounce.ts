import { useState, useEffect } from "react";

/**
 * Delays updating a value until the user stops typing.
 * Perfect for search inputs — avoids firing an API call on every keystroke.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 400);
 *   useEffect(() => { fetchResults(debouncedSearch) }, [debouncedSearch]);
 */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup on every change
  }, [value, delay]);

  return debounced;
};