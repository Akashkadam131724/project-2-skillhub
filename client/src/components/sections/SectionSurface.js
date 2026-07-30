"use client";

import { mediaUrl } from "@/lib/cms-api";
import { bannerBgStyle } from "@/lib/banner-bg";
import { pageBandThemeForFill } from "@/lib/section-band-surfaces";
import {
  isPageSurfaceTransparent,
  normalizeSectionTheme,
  sectionThemeDataAttribute,
  surfaceToneForSectionTheme,
} from "@/lib/section-theme";
import {
  resolveSurfacePattern,
  surfaceBandStyle,
  surfaceToneBandClass,
} from "@/lib/theme";

/**
 * Global section shell — page/section theme paints the band; sections stay transparent inside.
 */
export default function SectionSurface({
  sectionKey,
  section_bg_color,
  section_bg_img,
  legacy_bg_color,
  surfaceTone,
  surfaceBand,
  sectionTheme = "inherit",
  pageTheme,
  pageSurfaceMode,
  pageBandFill = "",
  children,
  className = "",
}) {
  const bgUrl = mediaUrl(section_bg_img);
  const bgColor = String(section_bg_color || legacy_bg_color || "").trim();
  const pageFill = String(pageBandFill ?? "")
    .trim()
    .replace(/^(undefined|null)$/i, "");
  const hasCustomBg = Boolean(bgUrl || bgColor);
  const resolvedPageTheme =
    pageTheme && typeof pageTheme === "object"
      ? pageTheme
      : { surface_mode: pageSurfaceMode };
  const isPageTransparent = isPageSurfaceTransparent(
    resolveSurfacePattern(resolvedPageTheme)
  );
  const allowBandPaint = !isPageTransparent || hasCustomBg;
  const hasPageFill = Boolean(allowBandPaint && !hasCustomBg && pageFill);

  const themePref = normalizeSectionTheme(
    typeof sectionTheme === "string"
      ? { section_theme: sectionTheme }
      : sectionTheme
  );
  const forcedTone = allowBandPaint
    ? surfaceToneForSectionTheme(themePref)
    : null;
  const hasForcedTheme = forcedTone !== null;

  const tone =
    allowBandPaint &&
    surfaceTone &&
    surfaceTone !== "transparent" &&
    surfaceTone !== "none"
      ? surfaceTone
      : null;
  const effectiveTone = hasForcedTheme ? forcedTone : tone;
  const effectiveBand =
    allowBandPaint && !hasForcedTheme && surfaceBand ? surfaceBand : null;

  const surfaceClass =
    allowBandPaint && !hasCustomBg && !hasPageFill && effectiveTone
      ? surfaceToneBandClass(effectiveTone)
      : allowBandPaint && !hasCustomBg && !hasPageFill && effectiveBand
        ? "section-band-bg"
        : "";

  const themeAttr = allowBandPaint
    ? sectionThemeDataAttribute(themePref)
    : undefined;
  const fillTheme = hasPageFill ? pageBandThemeForFill(pageFill) : null;
  const isLightBandTone =
    effectiveTone === "white" ||
    effectiveTone === "muted" ||
    String(effectiveTone || "").startsWith("soft_");
  const bandAttr =
    allowBandPaint && !hasCustomBg
      ? themeAttr ??
        (fillTheme === "dark"
          ? "dark"
          : fillTheme === "light"
            ? "light"
            : effectiveBand?.theme
              ? effectiveBand.theme
              : effectiveTone === "dark" || effectiveTone === "dark_ink"
                ? "dark"
                : isLightBandTone
                  ? "light"
                  : undefined)
      : undefined;

  const bandStyle =
    hasCustomBg && !bgUrl && bgColor
      ? bannerBgStyle(bgColor)
      : hasPageFill
        ? bannerBgStyle(pageFill)
        : effectiveBand?.bg
          ? surfaceBandStyle(effectiveBand)
          : undefined;

  return (
    <div
      data-section-theme={bandAttr || undefined}
      className={`relative w-full ${surfaceClass} ${className}`.trim()}
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
