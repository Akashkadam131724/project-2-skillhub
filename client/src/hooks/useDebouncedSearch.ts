"use client";

import { useCallback, useState } from "react";
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from "@/hooks/useDebouncedValue";

/**
 * Search input state + debounced value for list filters.
 */
export function useDebouncedSearch(
  initial = "",
  delay = DEFAULT_SEARCH_DEBOUNCE_MS
) {
  const [value, setValue] = useState(initial);
  const debouncedValue = useDebouncedValue(value, delay);

  const reset = useCallback(() => setValue(""), []);

  return { value, setValue, debouncedValue, reset };
}
