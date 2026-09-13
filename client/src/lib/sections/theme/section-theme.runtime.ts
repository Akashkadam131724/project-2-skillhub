/**
 * Section theme runtime — band detection and placement surface resolution.
 * Static key lists live in `./section-theme.data.ts`.
 */

import {
  isPageSurfaceTransparent,
  resolveSurfacePattern,
  surfaceBandAtIndex,
} from "@/lib/theme";
import type { PlacementLike } from "../section-types";
import {
  SECTION_ALTERNATION_SKIP_KEYS,
  SECTION_DARK_BG_KEYS,
  SECTION_OWN_BAND_KEYS,
  SECTION_THEME_BAND_SKIP_KEYS,
} from "./section-theme.data";

export { isPageSurfaceTransparent };

export {
  SECTION_DARK_BG_KEYS,
  SECTION_THEME_BAND_SKIP_KEYS,
  SECTION_FIXED_BAND_THEME_KEYS,
  SECTION_FIXED_DARK_BAND_KEYS,
  SECTION_FIXED_LIGHT_BAND_KEYS,
  SECTION_OWN_BAND_KEYS,
  SECTION_ALTERNATION_SKIP_KEYS,
} from "./section-theme.data";

export type SectionThemeToken = "inherit" | "light" | "dark";

/** Normalize a light/dark/inherit token (component prop, not a CMS field). */
export function parseSectionThemeToken(raw: unknown): SectionThemeToken {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (v === "light" || v === "dark") return v;
  return "inherit";
}

/** Maps section theme token to SectionSurface tone (null = keep computed tone). */
export function surfaceToneForSectionTheme(theme: string | null | undefined) {
  if (theme === "dark") return "dark";
  if (theme === "light") return "white";
  return null;
}

/** True when surface tone is a dark band (charcoal or brand ink). */
export function isSurfaceToneDark(surfaceTone: unknown) {
  return surfaceTone === "dark" || surfaceTone === "dark_ink";
}

/** True when section key is in the canonical dark-bg list (component-owned dark UI). */
export function isSectionDarkBgKey(sectionKey?: string, renderKey?: string) {
  const key = String(renderKey || sectionKey || "")
    .trim()
    .toLowerCase();
  return Boolean(key && SECTION_DARK_BG_KEYS.has(key));
}

/**
 * Dark UI for buttons / text contrast.
 * Order: canonical dark section keys → page surface band/tone.
 */
export function isPlacementDarkBand({
  section_key,
  sectionKey,
  render_key,
  renderKey,
  surfaceTone,
  surfaceBand,
}: {
  section_key?: unknown;
  sectionKey?: unknown;
  render_key?: unknown;
  renderKey?: unknown;
  surfaceTone?: unknown;
  surfaceBand?: unknown;
} = {}) {
  if (
    isSectionDarkBgKey(
      String(section_key ?? sectionKey ?? ""),
      String(render_key ?? renderKey ?? "")
    )
  ) {
    return true;
  }

  const band =
    surfaceBand && typeof surfaceBand === "object"
      ? (surfaceBand as { theme?: string })
      : undefined;
  if (band?.theme === "dark") return true;
  if (band?.theme === "light") return false;
  return isSurfaceToneDark(surfaceTone);
}

export function sectionThemeDataAttribute(theme?: unknown) {
  const t = parseSectionThemeToken(theme);
  if (t === "inherit") return undefined;
  return t;
}

export function sectionThemeBandClass(themePref?: string) {
  if (themePref === "dark") return "bg-ink text-white";
  if (themePref === "light") return "bg-white text-slate-800";
  return "";
}

/** True when SectionSurface should not paint inherited page band fill. */
export function sectionSkipsInheritedBandPaint(sectionKey?: string) {
  const key = String(sectionKey || "")
    .trim()
    .toLowerCase();
  return (
    SECTION_OWN_BAND_KEYS.has(key) || SECTION_THEME_BAND_SKIP_KEYS.has(key)
  );
}

/**
 * True when a placement should advance the page band alternation counter.
 * Heroes / CTAs with their own band, nav, and overlays do not consume a slot.
 */
export function placementAdvancesAlternationIndex(
  section: PlacementLike | null | undefined
) {
  const key = String(section?.section_key || "")
    .trim()
    .toLowerCase();
  if (!key || SECTION_ALTERNATION_SKIP_KEYS.has(key)) return false;
  if (SECTION_THEME_BAND_SKIP_KEYS.has(key)) return false;
  if (sectionSkipsInheritedBandPaint(key)) return false;
  return true;
}

/**
 * Same surface resolution as live page stack (one placement).
 * Only page surface pattern applies; dark / own-band sections skip striping.
 */
export function computePlacementSurface(
  section: PlacementLike | null | undefined,
  {
    pageTheme,
    pageSurfaceMode,
    altIndex = { current: 0 },
  }: {
    pageTheme?: unknown;
    pageSurfaceMode?: string;
    altIndex?: { current: number };
  } = {}
) {
  const key = String(section?.section_key || "")
    .trim()
    .toLowerCase();
  const isDarkSection = SECTION_DARK_BG_KEYS.has(key);
  const skipStripe = sectionSkipsInheritedBandPaint(key) || isDarkSection;

  const resolvedTheme = (
    pageTheme && typeof pageTheme === "object"
      ? pageTheme
      : { surface_mode: pageSurfaceMode || "custom" }
  ) as Record<string, unknown>;
  const pattern = resolveSurfacePattern(resolvedTheme);
  const isTransparent = isPageSurfaceTransparent(pattern);

  let surfaceBand = null;
  let surfaceTone = null;
  let surfaceBandIndex;

  if (!isTransparent && !skipStripe) {
    const index = altIndex.current;
    surfaceBand = surfaceBandAtIndex(pattern, index, {
      ink: String(resolvedTheme.ink || ""),
    });
    surfaceBandIndex = index;
    if (placementAdvancesAlternationIndex(section)) {
      altIndex.current += 1;
    }
  }

  return {
    sectionTheme: "inherit" as const,
    surfaceBand,
    surfaceTone,
    surfaceBandIndex,
  };
}
