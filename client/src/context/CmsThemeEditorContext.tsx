"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  emptyPageTheme,
  defaultSiteTheme,
  applyPresetFill,
} from "@/lib/theme";
import type {
  CmsThemeEditorContextValue,
  CmsThemeEditorProviderProps,
  PageThemeDraft,
} from "@/components/cms/theme/types";

const CmsThemeEditorContext = createContext<CmsThemeEditorContextValue | null>(
  null
);

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
}: CmsThemeEditorProviderProps) {
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
    (key: string, next: unknown) => {
      onChange?.({ ...theme, [key]: next });
    },
    [onChange, theme]
  );

  const patchTheme = useCallback(
    (patch: PageThemeDraft) => {
      onChange?.({ ...theme, ...patch });
    },
    [onChange, theme]
  );

  const valueCtx = useMemo<CmsThemeEditorContextValue>(
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

export function useCmsThemeEditor(): CmsThemeEditorContextValue {
  const ctx = useContext(CmsThemeEditorContext);
  if (!ctx) {
    throw new Error("useCmsThemeEditor must be used within CmsThemeEditorProvider");
  }
  return ctx;
}
