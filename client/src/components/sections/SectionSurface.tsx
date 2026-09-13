"use client";

import type { CSSProperties, ReactNode } from "react";
import { bannerBgStyle } from "@/lib/theme/banner-bg";
import { pageBandThemeForFill } from "@/lib/sections/section-band-surfaces";
import {
  isPageSurfaceTransparent,
  isSectionDarkBgKey,
  sectionSkipsInheritedBandPaint,
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
  surfaceTone?: string | null;
  surfaceBand?: ResolvedSurfaceBand | null;
  pageTheme?: { surface_mode?: string } | string;
  pageSurfaceMode?: string;
  pageBandFill?: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Global section shell — page surface pattern paints light sections;
 * dark / own-band sections stay transparent here (component owns the bg).
 */
export default function SectionSurface({
  sectionKey,
  surfaceTone,
  surfaceBand,
  pageTheme,
  pageSurfaceMode,
  pageBandFill = "",
  children,
  className = "",
}: SectionSurfaceProps) {
  const pageFill = String(pageBandFill ?? "")
    .trim()
    .replace(/^(undefined|null)$/i, "");
  const resolvedPageTheme =
    pageTheme && typeof pageTheme === "object"
      ? pageTheme
      : { surface_mode: pageSurfaceMode };
  const isPageTransparent = isPageSurfaceTransparent(
    resolveSurfacePattern(resolvedPageTheme)
  );
  const skipInheritedBand = sectionSkipsInheritedBandPaint(sectionKey);
  const allowBandPaint = !isPageTransparent && !skipInheritedBand;
  const hasPageFill = Boolean(allowBandPaint && pageFill);

  const tone =
    allowBandPaint &&
    surfaceTone &&
    surfaceTone !== "transparent" &&
    surfaceTone !== "none"
      ? surfaceTone
      : null;
  const paintTone = skipInheritedBand ? null : tone;
  const paintBand = skipInheritedBand ? null : surfaceBand;

  const surfaceClass =
    allowBandPaint && !hasPageFill && paintTone
      ? surfaceToneBandClass(paintTone)
      : allowBandPaint && !hasPageFill && paintBand
        ? surfaceBandShellClass(paintBand)
        : "";

  const fillTheme = hasPageFill ? pageBandThemeForFill(pageFill) : null;
  const isLightBandTone =
    paintTone === "white" ||
    paintTone === "muted" ||
    String(paintTone || "").startsWith("soft_");
  const isOwnDarkSection = isSectionDarkBgKey(sectionKey);
  const bandAttr = isOwnDarkSection
    ? "dark"
    : allowBandPaint
      ? fillTheme === "dark"
        ? "dark"
        : fillTheme === "light"
          ? "light"
          : paintBand?.theme
            ? paintBand.theme
            : paintTone === "dark" || paintTone === "dark_ink"
              ? "dark"
              : isLightBandTone
                ? "light"
                : undefined
      : undefined;

  const bandStyle: CSSProperties | undefined = hasPageFill
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
      <div className="relative">{children}</div>
    </div>
  );
}
