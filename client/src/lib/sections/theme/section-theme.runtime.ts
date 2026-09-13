/**
 * Section theme runtime — parsing, band detection, placement surface resolution.
 * Static key lists live in `./section-theme.data.js`.
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
  SECTION_FIXED_DARK_BAND_KEYS,
  SECTION_FIXED_LIGHT_BAND_KEYS,
  SECTION_FIXED_BAND_THEME_KEYS,
  SECTION_INHERIT_DARK_BAND_KEYS,
  SECTION_OWN_BAND_KEYS,
  SECTION_THEME_BAND_SKIP_KEYS,
} from "./section-theme.data";

export { isPageSurfaceTransparent };

export {
  SECTION_THEME_VALUES,
  SECTION_THEME_OPTIONS,
  SECTION_DARK_BG_KEYS,
  SECTION_THEME_BAND_SKIP_KEYS,
  SECTION_FIXED_BAND_THEME_KEYS,
  SECTION_FIXED_DARK_BAND_KEYS,
  SECTION_FIXED_LIGHT_BAND_KEYS,
  SECTION_OWN_BAND_KEYS,
  SECTION_INHERIT_DARK_BAND_KEYS,
  SECTION_ALTERNATION_SKIP_KEYS,
} from "./section-theme.data";

/** UI / API raw value → canonical theme token. */
export function parseSectionThemeRaw(raw: unknown) {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!v || v === "inherit") return "inherit";
  if (v === "light" || v === "dark") return v;
  return "inherit";
}

/** Value stored at the current edit layer (null/"" = inherit at this layer). */
export function sectionThemeUiValue(raw: unknown) {
  return parseSectionThemeRaw(raw);
}

/**
 * Resolved placement `section_theme` after catalog → template → page cascade.
 * @param {object} placement
 */
export function normalizeSectionTheme(
  placement?: string | PlacementLike | Record<string, unknown> | null
) {
  if (!placement) return "inherit";
  if (typeof placement === "string") {
    return parseSectionThemeRaw(placement);
  }
  const row = placement as PlacementLike & {
    sectionTheme?: unknown;
    data?: { section_theme?: unknown };
  };
  const raw =
    row.section_theme ??
    row.sectionTheme ??
    row.data?.section_theme;
  return parseSectionThemeRaw(raw);
}

/**
 * Registry fallback when every layer is inherit (code default before DB seed).
 */
export function getRegistryDefaultBandTheme(
  sectionKey?: string,
  renderKey?: string
) {
  const key = String(renderKey || sectionKey || "")
    .trim()
    .toLowerCase();
  if (!key) return "inherit";
  if (SECTION_INHERIT_DARK_BAND_KEYS.has(key)) return "dark";
  return "inherit";
}

/**
 * Theme used for rendering bands / tokens — placement cascade only.
 * Registry defaults (SECTION_INHERIT_DARK_BAND_KEYS) are seed hints, not runtime overrides.
 */
export function resolveEffectiveSectionTheme(placement: PlacementLike | null | undefined) {
  return normalizeSectionTheme(placement);
}

/** Maps section theme to SectionSurface tone (null = keep computed tone). */
export function surfaceToneForSectionTheme(theme: string | null | undefined) {
  if (theme === "dark") return "dark";
  if (theme === "light") return "white";
  return null;
}

export function isSectionThemeLightBand(placement: PlacementLike | null | undefined) {
  return normalizeSectionTheme(placement) === "light";
}

/** True when CMS section theme forces a dark band (ink surface + light text). */
export function isSectionThemeDarkBand(placement: PlacementLike | null | undefined) {
  return normalizeSectionTheme(placement) === "dark";
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
 * Order: canonical dark section keys → legacy section_theme → page surface band/tone.
 * Dark-list sections skip striping, so key check must come first.
 */
export function isPlacementDarkBand({
  section_key,
  sectionKey,
  render_key,
  renderKey,
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
}: {
  section_key?: unknown;
  sectionKey?: unknown;
  render_key?: unknown;
  renderKey?: unknown;
  section_theme?: unknown;
  sectionTheme?: unknown;
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
  const t = normalizeSectionTheme({
    section_theme: section_theme ?? sectionTheme,
  });
  if (t === "dark") return true;
  if (t === "light") return false;
  if (band?.theme === "dark") return true;
  if (band?.theme === "light") return false;
  return isSurfaceToneDark(surfaceTone);
}

/**
 * @deprecated Band background comes from SectionSurface / page theme only.
 */
export function sectionSoftLightGradientClass() {
  return "";
}

/** Read theme from common section component props. */
export function sectionThemeFromProps(props: Record<string, unknown> = {}) {
  return normalizeSectionTheme({
    section_theme: props.section_theme ?? props.sectionTheme,
  });
}

export function sectionThemeDataAttribute(
  themeOrPlacement?: string | PlacementLike | Record<string, unknown>
) {
  const t =
    typeof themeOrPlacement === "string"
      ? normalizeSectionTheme({ section_theme: themeOrPlacement })
      : normalizeSectionTheme(themeOrPlacement);
  if (t === "inherit") return undefined;
  return t;
}

/** Band background when section theme forces light/dark (not for inherit). */
export function sectionThemeBandClass(themePref?: string) {
  if (themePref === "dark") return "bg-ink text-white";
  if (themePref === "light") return "bg-white text-slate-800";
  return "";
}

/** Band theme / section bg editors retired — always false. */
export function sectionSupportsBandTheme(_sectionKey?: string, _renderKey?: string) {
  return false;
}

export function sectionFixedBandThemeHint(sectionKey?: string, renderKey?: string) {
  const key = String(renderKey || sectionKey || "")
    .trim()
    .toLowerCase();
  if (SECTION_DARK_BG_KEYS.has(key) || SECTION_FIXED_DARK_BAND_KEYS.has(key)) {
    return "This section always uses a dark background (built into the layout).";
  }
  if (SECTION_FIXED_LIGHT_BAND_KEYS.has(key)) {
    return "This section uses a fixed light palette (built into the layout).";
  }
  return "Section bands are managed by the page surface pattern — not per section.";
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
export function placementAdvancesAlternationIndex(section: PlacementLike | null | undefined) {
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
 * Section band / section_theme / section_bg_* are ignored — only page surface pattern
 * applies, and dark / own-band sections skip striping.
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
  } else if (placementAdvancesAlternationIndex(section)) {
    // Dark / own-band sections still must not consume a stripe slot
  }

  return {
    sectionTheme: "inherit",
    surfaceBand,
    surfaceTone,
    surfaceBandIndex,
  };
}
