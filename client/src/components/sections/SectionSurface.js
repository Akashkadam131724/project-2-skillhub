"use client";

import { mediaUrl } from "@/lib/cms-api";
import { bannerBgStyle } from "@/lib/banner-bg";

const SURFACE_CLASS = {
  white: "bg-white dark:bg-slate-950",
  muted: "bg-slate-100 dark:bg-slate-900",
  dark: "bg-ink text-white",
  // transparent / null → no class; page bg shows through
};

const SECTION_THEME_CLASS = {
  why_choose: "bg-ink",
  stats: "bg-ink text-white",
  hero_classic:
    "bg-gradient-to-b from-white via-slate-50/90 to-white text-ink dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white",
  hero_split: "bg-white dark:bg-slate-950",
  hero_centered: "bg-slate-50 dark:bg-slate-900",
  hero_minimal: "bg-white dark:bg-slate-950",
  hero_stats: "bg-ink text-white",
  hero_asymmetric: "bg-white dark:bg-slate-950",
  hero_dual_cta:
    "bg-gradient-to-br from-slate-50 via-white to-brand-soft dark:from-slate-950 dark:via-slate-950 dark:to-slate-900",
};

/**
 * Global section shell — section bg, built-in section look, or theme surface tone.
 * Priority: section_bg_* → section built-in theme → surfaceTone (skip if null/transparent).
 */
export default function SectionSurface({
  sectionKey,
  section_bg_color,
  section_bg_img,
  /** @deprecated legacy stats field — prefer section_bg_color */
  legacy_bg_color,
  surfaceTone,
  children,
  className = "",
}) {
  const bgUrl = mediaUrl(section_bg_img);
  const bgColor = String(section_bg_color || legacy_bg_color || "").trim();
  const hasCustomBg = Boolean(bgUrl || bgColor);
  const themeClass = !hasCustomBg ? SECTION_THEME_CLASS[sectionKey] || "" : "";
  const tone =
    surfaceTone && surfaceTone !== "transparent" && surfaceTone !== "none"
      ? surfaceTone
      : null;
  const surfaceClass =
    !hasCustomBg && !themeClass && tone
      ? SURFACE_CLASS[tone] || ""
      : "";

  return (
    <div
      className={`relative w-full ${themeClass} ${surfaceClass} ${className}`.trim()}
      style={
        hasCustomBg && !bgUrl && bgColor
          ? bannerBgStyle(bgColor)
          : undefined
      }
    >
      {bgUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgUrl})` }}
            aria-hidden
          />
        </>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
