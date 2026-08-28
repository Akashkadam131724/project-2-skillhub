"use client";

import type { ReactNode } from "react";
import {
  isPageSurfaceTransparent,
  normalizeSectionTheme,
  sectionThemeBandClass,
  sectionThemeDataAttribute,
  SECTION_THEME_BAND_SKIP_KEYS,
} from "@/lib/sections/section-theme";

export type SectionThemeWrapProps = {
  theme?: string | Record<string, unknown>;
  sectionKey?: string;
  pageSurfaceMode?: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Wrapper for full-bleed sections — sets data-section-theme and optional band bg.
 */
export default function SectionThemeWrap({
  theme,
  sectionKey = "",
  pageSurfaceMode,
  children,
  className = "",
}: SectionThemeWrapProps) {
  if (isPageSurfaceTransparent(pageSurfaceMode)) {
    return children;
  }

  const key = String(sectionKey || "").toLowerCase();
  const themePref =
    typeof theme === "string"
      ? normalizeSectionTheme({ section_theme: theme })
      : normalizeSectionTheme(theme);
  const bandAttr = sectionThemeDataAttribute(themePref);
  const skipBand = SECTION_THEME_BAND_SKIP_KEYS.has(key);
  const bandClass =
    !skipBand && themePref !== "inherit" ? sectionThemeBandClass(themePref) : "";

  if (!bandAttr && !bandClass) return children;

  return (
    <div
      data-section-theme={bandAttr}
      className={`relative w-full ${bandClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
