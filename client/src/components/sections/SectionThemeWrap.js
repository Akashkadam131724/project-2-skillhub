"use client";

import {
  normalizeSectionTheme,
  sectionThemeBandClass,
  sectionThemeDataAttribute,
  SECTION_THEME_BAND_SKIP_KEYS,
  SECTION_INHERIT_DARK_BAND_KEYS,
} from "@/lib/section-theme";

/**
 * Wrapper for full-bleed sections — sets data-section-theme and optional band bg.
 */
export default function SectionThemeWrap({
  theme,
  sectionKey = "",
  children,
  className = "",
}) {
  const key = String(sectionKey || "").toLowerCase();
  const themePref =
    typeof theme === "string"
      ? normalizeSectionTheme({ section_theme: theme })
      : normalizeSectionTheme(theme);
  const inheritDark =
    themePref === "inherit" && SECTION_INHERIT_DARK_BAND_KEYS.has(key);
  const bandAttr =
    sectionThemeDataAttribute(themePref) ?? (inheritDark ? "dark" : undefined);
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
