"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  emptyPageTheme,
  defaultSiteTheme,
  applyPresetFill,
} from "@/lib/theme";

const CmsThemeEditorContext = createContext(null);

/**
 * Shared resolved theme + helpers for Colors / Surface / Background tabs.
 */
export function CmsThemeEditorProvider({
  mode = "site",
  inheritFrom = "site",
  inheritedTheme = null,
  value,
  onChange,
  children,
}) {
  const isPage = mode === "page";

  const theme = useMemo(
    () => ({
      ...(isPage ? emptyPageTheme() : defaultSiteTheme()),
      ...(value || {}),
    }),
    [isPage, value]
  );

  const parent = useMemo(
    () =>
      applyPresetFill({
        ...defaultSiteTheme(),
        ...(inheritedTheme || {}),
      }),
    [inheritedTheme]
  );

  const inheritNoun =
    inheritFrom === "template" ? "template theme" : "global site theme";
  const inheritShort =
    inheritFrom === "template" ? "template" : "site theme";

  const setField = useCallback(
    (key, next) => {
      onChange?.({ ...theme, [key]: next });
    },
    [onChange, theme]
  );

  const patchTheme = useCallback(
    (patch) => {
      onChange?.({ ...theme, ...patch });
    },
    [onChange, theme]
  );

  const valueCtx = useMemo(
    () => ({
      isPage,
      theme,
      parent,
      inheritNoun,
      inheritShort,
      setField,
      patchTheme,
      onChange,
      clearToInherit: () => onChange?.(emptyPageTheme()),
    }),
    [
      isPage,
      theme,
      parent,
      inheritNoun,
      inheritShort,
      setField,
      patchTheme,
      onChange,
    ]
  );

  return (
    <CmsThemeEditorContext.Provider value={valueCtx}>
      {children}
    </CmsThemeEditorContext.Provider>
  );
}

export function useCmsThemeEditor() {
  const ctx = useContext(CmsThemeEditorContext);
  if (!ctx) {
    throw new Error("useCmsThemeEditor must be used within CmsThemeEditorProvider");
  }
  return ctx;
}
