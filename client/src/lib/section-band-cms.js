/**
 * CMS helpers for section band appearance (background only).
 * Priority matches SectionSurface:
 * 1. Background image (full-bleed; hides default band fill)
 * 2. Background color (band fill when no image)
 * 3. Inherit → page theme surface mode (e.g. alternating)
 */

import { SURFACE_MODES } from "@/lib/theme";

export const SECTION_BAND_PRIORITY_LINES = [
  "Background image — highest visual priority; replaces the default band fill.",
  "Section background color — overrides page surfaces for this section only.",
  "Otherwise — follows page theme (surface mode, colors) from Page settings → Theme.",
];

/** Light vs dark for presets / contrast (muted & white bands → light). */
export function surfaceToneToBandTone(surfaceTone) {
  if (surfaceTone === "dark") return "dark";
  return "light";
}

/**
 * Band tone used for text tokens and bg presets given draft + page placement.
 */
export function effectiveBandToneForDraft(_draft, inheritedSurfaceTone) {
  return surfaceToneToBandTone(inheritedSurfaceTone);
}

function surfaceModeLabel(mode) {
  const key = String(mode || "alternating").toLowerCase();
  return (
    SURFACE_MODES.find((m) => m.value === key)?.label || "Alternating white / grey"
  );
}

/** Human-readable effective theme for the band editor header. */
export function effectiveBandThemeInfo(
  draft,
  { inheritedSurfaceTone, pageSurfaceMode, pageInk } = {}
) {
  const tone = effectiveBandToneForDraft(draft, inheritedSurfaceTone);
  const modeLabel = surfaceModeLabel(pageSurfaceMode);
  const inherited = inheritedSurfaceTone;
  let defaultBg = "#ffffff";
  let detail = `Inherits page surface (${modeLabel}) · light band`;

  if (inherited === "dark") {
    defaultBg = pageInk || "#0b1f4d";
    detail = `Inherits page surface (${modeLabel}) · dark band on this row`;
  } else if (inherited === "muted") {
    defaultBg = "#f1f5f9";
    detail = `Inherits page surface (${modeLabel}) · muted grey band`;
  } else if (inherited == null) {
    detail = `Inherits page surface (${modeLabel}) · transparent / page background`;
    defaultBg = "transparent";
  }

  return {
    tone,
    title: "Page theme",
    detail,
    defaultBg,
    defaultFg: tone === "dark" ? "#ffffff" : "var(--ink)",
  };
}

export function bandDraftFromSection(section) {
  const s = section || {};
  return {
    bgImg: String(s.section_bg_img || "").trim(),
    bgColor: String(s.section_bg_color || s.data?.bg_color || "").trim(),
  };
}

export function activeBandSummary(draft) {
  const parts = [];
  if (draft.bgImg) parts.push("Image");
  if (draft.bgColor?.trim()) parts.push("Custom color");
  if (!parts.length) return "Page theme (no custom band bg)";
  return parts.join(" · ");
}
