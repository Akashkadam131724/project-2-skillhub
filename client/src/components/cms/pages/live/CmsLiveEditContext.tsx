"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { defaultSiteTheme } from "@/lib/theme";
import type {
  CmsLiveEditContextValue,
  CmsLiveEditProviderProps,
} from "../types";

const CmsLiveEditContext = createContext<CmsLiveEditContextValue | null>(null);

/**
 * Shared live-edit page identity — same shape on home/vendor/blog/etc.
 * Provide once at the edit page; consume anywhere under the tree.
 */
export function CmsLiveEditProvider({
  pageKey,
  entityId,
  entityLabel = null,
  publicHref = null,
  pageContext = null,
  initialTheme = null,
  children,
}: CmsLiveEditProviderProps) {
  const [pageTheme, setPageTheme] = useState<Record<string, unknown>>(
    () => initialTheme || defaultSiteTheme()
  );

  useEffect(() => {
    if (initialTheme) setPageTheme(initialTheme);
  }, [initialTheme]);

  const value = useMemo(
    () => ({
      pageKey,
      entityId,
      entityLabel,
      publicHref,
      pageContext,
      pageTheme,
      setPageTheme,
    }),
    [
      pageKey,
      entityId,
      entityLabel,
      publicHref,
      pageContext,
      pageTheme,
    ]
  );

  return (
    <CmsLiveEditContext.Provider value={value}>
      {children}
    </CmsLiveEditContext.Provider>
  );
}

export function useCmsLiveEdit(): CmsLiveEditContextValue {
  const ctx = useContext(CmsLiveEditContext);
  if (!ctx) {
    throw new Error("useCmsLiveEdit must be used within CmsLiveEditProvider");
  }
  return ctx;
}
