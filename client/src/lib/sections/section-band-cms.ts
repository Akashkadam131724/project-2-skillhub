/**
 * CMS helpers for section band appearance (background only).
 * Priority matches SectionSurface:
 * 1. Background image (full-bleed; hides default band fill)
 * 2. Background color (band fill when no image)
 * 3. Inherit → page theme surface mode (e.g. alternating)
 */

import {
  surfaceBandPreviewBg,
  surfaceBandPreviewLabel,
  surfacePatternLabel,
} from "@/lib/theme";
import { parseSectionThemeRaw } from "./section-theme";

export const SECTION_BAND_PRIORITY_LINES = [
  "Background image — highest visual priority; replaces the default band fill.",
  "Background color — overrides page surfaces for this section only.",
  "Band theme — catalog default, then template, then page override (light / dark).",
  "Otherwise — follows page theme (surface mode, colors) from Page settings → Theme.",
];

/** Light vs dark for presets / contrast. */
import type { PlacementLike } from "./section-types";

export function surfaceToneToBandTone(surfaceToneOrBand: unknown) {
  const row = surfaceToneOrBand as { theme?: string } | string | null | undefined;
  if (row && typeof row === "object" && row.theme === "dark") return "dark";
  if (row && typeof row === "object" && row.theme === "light") return "light";
  if (row === "dark") return "dark";
  return "light";
}

/**
 * Band tone used for text tokens and bg presets given draft + page placement.
 */
export function effectiveBandToneForDraft(
  draft: { theme?: unknown } | null | undefined,
  inheritedSurfaceBand: unknown,
  inheritedSurfaceTone: unknown
) {
  const theme = parseSectionThemeRaw(draft?.theme);
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  return surfaceToneToBandTone(inheritedSurfaceBand || inheritedSurfaceTone);
}

/** Human-readable effective theme for the band editor header. */
export function effectiveBandThemeInfo(
  draft: { theme?: unknown } | null | undefined,
  {
    inheritedSurfaceBand,
    inheritedSurfaceTone,
    pageTheme,
    pageSurfaceMode,
    pageInk,
  }: {
    inheritedSurfaceBand?: unknown;
    inheritedSurfaceTone?: unknown;
    pageTheme?: unknown;
    pageSurfaceMode?: string;
    pageInk?: string;
  } = {}
) {
  const tone = effectiveBandToneForDraft(
    draft,
    inheritedSurfaceBand,
    inheritedSurfaceTone
  );
  const modeLabel = surfacePatternLabel(pageTheme || { surface_mode: pageSurfaceMode });
  const inherited = inheritedSurfaceBand || inheritedSurfaceTone;
  const band = inheritedSurfaceBand as
    | { theme?: string; label?: string; bg?: string }
    | null
    | undefined;
  let defaultBg = surfaceBandPreviewBg(inherited || { bg: "#ffffff" });
  let detail = `Inherits page surface (${modeLabel}) · ${surfaceBandPreviewLabel(
    band ||
      (inheritedSurfaceTone
        ? {
            label: String(inheritedSurfaceTone),
            bg: surfaceBandPreviewBg(inheritedSurfaceTone),
          }
        : { label: "White", bg: "#ffffff" })
  )}`;

  if (inherited == null) {
    detail = `Inherits page surface (${modeLabel}) · transparent / page background`;
    defaultBg = "transparent";
  } else if (band?.theme === "dark" || inheritedSurfaceTone === "dark") {
    defaultBg = surfaceBandPreviewBg({ bg: "#0f172a" });
  } else if (band?.theme === "dark" || inheritedSurfaceTone === "dark_ink") {
    defaultBg = pageInk || surfaceBandPreviewBg({ bg: "var(--ink)" });
  }

  return {
    tone,
    title: "Page theme",
    detail,
    defaultBg,
    defaultFg: tone === "dark" ? "#ffffff" : "var(--ink)",
  };
}

export function bandDraftFromSection(section: PlacementLike | null | undefined) {
  const s = section || {};
  const data = s.data as { bg_color?: string } | undefined;
  const local =
    s.section_theme_local !== undefined && s.section_theme_local !== null
      ? s.section_theme_local
      : s.section_theme;
  return {
    bgImg: String(s.section_bg_img || "").trim(),
    bgColor: String(s.section_bg_color || data?.bg_color || "").trim(),
    theme: parseSectionThemeRaw(local),
  };
}

export function activeBandSummary(draft: {
  theme?: string;
  bgImg?: string;
  bgColor?: string;
}) {
  const parts = [];
  if (draft.theme && draft.theme !== "inherit") {
    parts.push(`Theme: ${draft.theme}`);
  }
  if (draft.bgImg) parts.push("Image");
  if (draft.bgColor?.trim()) parts.push("Custom color");
  if (!parts.length) return "Inherit page / catalog defaults";
  return parts.join(" · ");
}
