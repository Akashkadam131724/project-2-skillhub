"use client";

import { useEffect, useState } from "react";

/** Default debounce for CMS list search (ms). */
export const DEFAULT_SEARCH_DEBOUNCE_MS = 500;

/**
 * Returns a debounced copy of `value`.
 * Empty values update immediately (no delay).
 */
export function useDebouncedValue(value, delay = DEFAULT_SEARCH_DEBOUNCE_MS) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const wait = value && delay > 0 ? delay : 0;
    const timer = setTimeout(() => setDebounced(value), wait);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
