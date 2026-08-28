"use client";

import type { CSSProperties, ReactNode } from "react";
import { mediaUrl } from "@/lib/api/cms-api";
import { bannerBgStyle } from "@/lib/theme/banner-bg";
import { pageBandThemeForFill } from "@/lib/sections/section-band-surfaces";
import {
  isPageSurfaceTransparent,
  normalizeSectionTheme,
  sectionSkipsInheritedBandPaint,
  sectionThemeBandClass,
  sectionThemeDataAttribute,
  surfaceToneForSectionTheme,
} from "@/lib/sections/section-theme";
import {
  resolveSurfacePattern,
  surfaceBandShellClass,
  surfaceBandStyle,
  surfaceToneBandClass,
} from "@/lib/theme";

type ResolvedSurfaceBand = {
  bg?: string;
  theme?: "light" | "dark";
};

export type SectionSurfaceProps = {
  sectionKey?: string;
  section_bg_color?: string;
  section_bg_img?: string;
  legacy_bg_color?: string;
  surfaceTone?: string | null;
  surfaceBand?: ResolvedSurfaceBand | null;
  sectionTheme?: string | Record<string, unknown>;
  pageTheme?: { surface_mode?: string } | string;
  pageSurfaceMode?: string;
  pageBandFill?: string;
  children?: ReactNode;
  className?: string;
};

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
}: SectionSurfaceProps) {
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
  const skipInheritedBand =
    sectionSkipsInheritedBandPaint(sectionKey) &&
    !hasCustomBg &&
    !hasPageFill &&
    themePref === "inherit";

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
  const paintTone = skipInheritedBand ? (hasForcedTheme ? forcedTone : null) : effectiveTone;
  const paintBand = skipInheritedBand ? null : effectiveBand;

  const surfaceClass =
    allowBandPaint && !hasCustomBg && !hasPageFill && paintTone
      ? surfaceToneBandClass(paintTone)
      : allowBandPaint && !hasCustomBg && !hasPageFill && paintBand
        ? surfaceBandShellClass(paintBand)
        : skipInheritedBand && hasForcedTheme
          ? sectionThemeBandClass(themePref)
          : "";

  const themeAttr = allowBandPaint
    ? sectionThemeDataAttribute(themePref)
    : undefined;
  const fillTheme = hasPageFill ? pageBandThemeForFill(pageFill) : null;
  const isLightBandTone =
    paintTone === "white" ||
    paintTone === "muted" ||
    String(paintTone || "").startsWith("soft_");
  const bandAttr =
    allowBandPaint && !hasCustomBg
      ? skipInheritedBand
        ? themeAttr
        : themeAttr ??
          (fillTheme === "dark"
            ? "dark"
            : fillTheme === "light"
              ? "light"
              : paintBand?.theme
                ? paintBand.theme
                : paintTone === "dark" || paintTone === "dark_ink"
                  ? "dark"
                  : isLightBandTone
                    ? "light"
                    : undefined)
      : undefined;

  const bandStyle: CSSProperties | undefined =
    hasCustomBg && !bgUrl && bgColor
      ? (bannerBgStyle(bgColor) as CSSProperties)
      : hasPageFill
        ? (bannerBgStyle(pageFill) as CSSProperties)
        : paintBand?.bg
          ? (surfaceBandStyle(paintBand) as CSSProperties)
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
