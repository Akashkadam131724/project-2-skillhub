"use client";

import { mediaUrl } from "@/lib/cms-api";
import { bannerBgStyle } from "@/lib/banner-bg";
import { pageBandThemeForFill } from "@/lib/section-band-surfaces";
import {
  normalizeSectionTheme,
  sectionThemeDataAttribute,
  surfaceToneForSectionTheme,
} from "@/lib/section-theme";

const SURFACE_CLASS = {
  white: "section-band-bg",
  muted: "section-band-bg section-band-bg--muted",
  dark: "section-band-bg",
};

const SECTION_THEME_CLASS = {
  why_choose: "bg-ink text-white",
  stats: "bg-ink text-white",
  hero_classic:
    "bg-gradient-to-b from-white via-slate-50/90 to-white section-theme-heading dark:from-slate-950 dark:via-slate-950 dark:to-slate-900",
  hero_split: "bg-white dark:bg-slate-950",
  hero_centered: "bg-slate-50 dark:bg-slate-900",
  hero_minimal: "bg-white dark:bg-slate-950",
  hero_stats: "bg-ink text-white",
  hero_asymmetric: "bg-white dark:bg-slate-950",
  hero_dual_cta:
    "bg-gradient-to-br from-slate-50 via-white to-brand-soft dark:from-slate-950 dark:via-slate-950 dark:to-slate-900",
};

/**
 * Global section shell — custom bg → forced section theme → built-in look → page alternation.
 */
export default function SectionSurface({
  sectionKey,
  section_bg_color,
  section_bg_img,
  legacy_bg_color,
  surfaceTone,
  sectionTheme = "inherit",
  pageBandFill = "",
  children,
  className = "",
}) {
  const bgUrl = mediaUrl(section_bg_img);
  const bgColor = String(section_bg_color || legacy_bg_color || "").trim();
  const pageFill = String(pageBandFill || "").trim();
  const hasCustomBg = Boolean(bgUrl || bgColor);
  const hasPageFill = Boolean(!hasCustomBg && pageFill);

  const themePref = normalizeSectionTheme(
    typeof sectionTheme === "string"
      ? { section_theme: sectionTheme }
      : sectionTheme
  );
  const forcedTone = surfaceToneForSectionTheme(themePref);
  const hasForcedTheme = forcedTone !== null;

  const themeClass =
    !hasCustomBg && !hasForcedTheme
      ? SECTION_THEME_CLASS[sectionKey] || ""
      : "";

  const tone =
    surfaceTone && surfaceTone !== "transparent" && surfaceTone !== "none"
      ? surfaceTone
      : null;
  const effectiveTone = hasForcedTheme ? forcedTone : tone;

  const surfaceClass =
    !hasCustomBg && !hasPageFill && effectiveTone && (hasForcedTheme || !themeClass)
      ? SURFACE_CLASS[effectiveTone] || ""
      : "";

  const builtInDarkBand =
    !hasCustomBg &&
    !hasForcedTheme &&
    String(SECTION_THEME_CLASS[sectionKey] || "").includes("bg-ink");

  const themeAttr = sectionThemeDataAttribute(themePref);
  const fillTheme = pageBandThemeForFill(pageFill);
  const bandAttr =
    themeAttr ??
    (fillTheme === "dark"
      ? "dark"
      : fillTheme === "light"
        ? "light"
        : effectiveTone === "dark" || builtInDarkBand
          ? "dark"
          : effectiveTone === "white" || effectiveTone === "muted"
            ? "light"
            : undefined);

  const bandStyle =
    hasCustomBg && !bgUrl && bgColor
      ? bannerBgStyle(bgColor)
      : hasPageFill
        ? bannerBgStyle(pageFill)
        : undefined;

  return (
    <div
      data-section-theme={bandAttr}
      className={`relative w-full ${themeClass} ${surfaceClass} ${className}`.trim()}
      style={bandStyle}
    >
      {bgUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgUrl})` }}
          aria-hidden
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
