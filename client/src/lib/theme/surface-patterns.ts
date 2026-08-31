/**
 * Page section surface patterns — stored on site / page theme as `surface_pattern`.
 * Bands use arbitrary colors (hex, gradients, CSS vars) — no code changes to add colors.
 */

import { isBannerGradient } from "./banner-bg";

export type SurfacePatternLayout = "cycle" | "solid" | "transparent";
export type SurfaceBandDef = {
  id: string;
  label?: string;
  bg: string;
  fg?: string;
};
export type SurfacePattern = {
  layout: SurfacePatternLayout;
  bands: SurfaceBandDef[];
};
export type ResolvedSurfaceBand = {
  bg: string;
  fg: string;
  label: string;
  theme: string;
};

export type SurfaceBandLike = {
  bg?: string;
  fg?: string;
  label?: string;
  theme?: string;
};

type ThemeLike = Record<string, unknown>;

const LEGACY_TONE_BG: Record<string, string> = {
  white: "#ffffff",
  muted: "#f1f5f9",
  dark: "#0f172a",
  dark_ink: "var(--ink)",
  soft_warm: "#faf8f5",
  soft_cool: "#f3f6f9",
  soft_sky: "#eef6fc",
  soft_mint: "#eef9f4",
  soft_lavender: "#f5f3ff",
  soft_sand: "#faf6f0",
  soft_slate: "#eef2f6",
  soft_brand: "color-mix(in srgb, var(--brand-soft, #e8eeff) 42%, white)",
};

const LEGACY_MODE_CYCLES = {
  alternating: ["white", "muted"],
  alt_2x2: ["white", "white", "muted", "muted"],
  alt_3x3: ["white", "white", "white", "muted", "muted", "muted"],
  alt_warm: ["white", "soft_warm"],
  alt_cool: ["white", "soft_cool"],
  alt_sky: ["white", "soft_sky"],
  alt_mint: ["white", "soft_mint"],
  alt_lavender: ["white", "soft_lavender"],
  alt_sand: ["white", "soft_sand"],
  alt_slate: ["white", "soft_slate"],
  alt_brand: ["white", "soft_brand"],
};

const LEGACY_MODE_SOLID = {
  light: "white",
  muted: "muted",
  dark: "dark",
  dark_ink: "dark_ink",
  transparent: null,
};

function newBandId() {
  return `band_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function toneToBand(tone: string, index = 0): SurfaceBandDef {
  const key = String(tone || "white");
  const label = key
    .replace(/^soft_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: `${key}_${index}`,
    label: key === "white" ? "White" : key === "muted" ? "Grey" : label,
    bg: LEGACY_TONE_BG[key] || "#ffffff",
  };
}

function cycleFromTones(tones: string[]) {
  return tones.map((tone, i) => toneToBand(tone, i));
}

/** Default: white / grey alternating cycle. */
export function defaultSurfacePattern(): SurfacePattern {
  return normalizeSurfacePattern({
    layout: "cycle",
    bands: cycleFromTones(["white", "muted"]),
  });
}

export function normalizeSurfacePattern(raw: unknown): SurfacePattern {
  if (!raw || typeof raw !== "object") {
    return defaultSurfacePattern();
  }

  const input = raw as { layout?: string; bands?: unknown[] };
  const layout = ["cycle", "solid", "transparent"].includes(String(input.layout))
    ? (input.layout as SurfacePatternLayout)
    : "cycle";

  if (layout === "transparent") {
    return { layout: "transparent", bands: [] };
  }

  const bands = Array.isArray(input.bands)
    ? input.bands
        .map((band, index) => {
          const row = band as { bg?: unknown; id?: unknown; label?: unknown; fg?: unknown };
          const bg = String(row?.bg ?? "").trim();
          if (!bg) return null;
          return {
            id: String(row?.id || "").trim() || newBandId(),
            label: String(row?.label || "").trim() || `Band ${index + 1}`,
            bg,
            fg: String(row?.fg || "").trim() || "",
          };
        })
        .filter((band) => band != null) as SurfaceBandDef[]
    : [];

  if (layout === "solid") {
    return {
      layout: "solid",
      bands: bands.length ? [bands[0]] : [toneToBand("white")],
    };
  }

  return {
    layout: "cycle",
    bands: bands.length ? bands : cycleFromTones(["white", "muted"]),
  };
}

/** Convert legacy `surface_mode` enum into a pattern (for old saved themes). */
export function legacyPatternFromMode(
  surfaceMode: unknown,
  theme: ThemeLike = {}
): SurfacePattern {
  const mode = String(surfaceMode || "alternating").toLowerCase();

  if (mode === "transparent" || mode === "none") {
    return { layout: "transparent", bands: [] };
  }

  const solidModes = LEGACY_MODE_SOLID as Record<string, string | null>;
  if (solidModes[mode] !== undefined) {
    const tone = solidModes[mode];
    if (!tone) return { layout: "transparent", bands: [] };
    const band = toneToBand(tone);
    if (tone === "dark_ink" && theme.ink) {
      band.bg = String(theme.ink);
      band.label = "Brand ink";
    }
    return { layout: "solid", bands: [band] };
  }

  const cycles = LEGACY_MODE_CYCLES as Record<string, string[]>;
  const cycle = cycles[mode] || cycles.alternating;
  return { layout: "cycle", bands: cycleFromTones(cycle) };
}

/** Resolved pattern from theme (custom pattern wins, else legacy surface_mode). */
export function resolveSurfacePattern(theme: ThemeLike = {}): SurfacePattern {
  const pattern = theme.surface_pattern;
  if (
    pattern &&
    typeof pattern === "object" &&
    Array.isArray((pattern as SurfacePattern).bands)
  ) {
    return normalizeSurfacePattern(pattern);
  }
  return normalizeSurfacePattern(
    legacyPatternFromMode(theme.surface_mode, theme)
  );
}

export function isSurfacePatternTransparent(pattern: unknown) {
  const p = normalizeSurfacePattern(pattern);
  return p.layout === "transparent";
}

export function isPageSurfaceTransparent(themeOrMode: unknown) {
  if (themeOrMode && typeof themeOrMode === "object") {
    return isSurfacePatternTransparent(resolveSurfacePattern(themeOrMode as ThemeLike));
  }
  const mode = String(themeOrMode || "").toLowerCase();
  return mode === "transparent" || mode === "none";
}

function parseHexRgb(hex: string) {
  const s = String(hex || "").trim();
  let h = s.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** Infer light/dark text from a background color string. */
export function bandThemeFromBg(
  bg: string,
  { ink = "#0b1f4d" }: { ink?: string } = {}
): string {
  const value = String(bg || "").trim().toLowerCase();
  if (!value) return "light";
  if (value === "var(--ink)" || value.includes("ink")) return "dark";
  if (
    value.includes("#0f172a") ||
    value.includes("#1e293b") ||
    value.includes("#111827") ||
    value.includes("#0b1f4d")
  ) {
    return "dark";
  }
  if (isBannerGradient(bg)) {
    const darkStops = [
      "#0f172a",
      "#0b1f4d",
      "#111827",
      "#020617",
      "#082f49",
      "#052e16",
      "#1c1917",
      "#312e81",
      "#10100e",
      "#0b0b0a",
      "var(--ink)",
      "rgb(15,",
      "rgb(0, ",
    ];
    if (darkStops.some((stop) => value.includes(stop))) return "dark";

    const hexes = [...value.matchAll(/#([0-9a-f]{3,8})\b/gi)];
    if (hexes.length) {
      const luminances = hexes
        .map((match) => parseHexRgb(`#${match[1]}`))
        .filter((rgb): rgb is { r: number; g: number; b: number } => rgb != null)
        .map(relativeLuminance);
      if (luminances.length) {
        const avg =
          luminances.reduce((sum, lum) => sum + lum, 0) / luminances.length;
        return avg < 0.45 ? "dark" : "light";
      }
    }
    return "light";
  }

  const hexMatch = value.match(/#([0-9a-f]{3,8})\b/i);
  if (hexMatch) {
    const rgb = parseHexRgb(`#${hexMatch[1]}`);
    if (rgb) return relativeLuminance(rgb) < 0.45 ? "dark" : "light";
  }

  const rgbMatch = value.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i
  );
  if (rgbMatch) {
    const rgb = {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
    return relativeLuminance(rgb) < 0.45 ? "dark" : "light";
  }

  return "light";
}

function resolveBandBg(bg: string, { ink }: { ink?: string } = {}) {
  const raw = String(bg || "").trim();
  if (raw === "var(--ink)") return ink || "#0b1f4d";
  return raw;
}

/** Resolve one band definition for rendering. */
export function resolveSurfaceBand(
  band: SurfaceBandDef | null | undefined,
  options: { ink?: string } = {}
): ResolvedSurfaceBand | null {
  if (!band) return null;
  const bg = resolveBandBg(band.bg, options);
  const fg =
    String(band.fg || "").trim() ||
    (bandThemeFromBg(bg, options) === "dark"
      ? "rgba(255,255,255,0.92)"
      : "var(--ink)");
  return {
    bg,
    fg,
    label: band.label || "Band",
    theme: bandThemeFromBg(bg, options),
  };
}

/** Band at placement index for a resolved pattern. */
export function surfaceBandAtIndex(
  pattern: unknown,
  altIndex: number,
  options: { ink?: string } = {}
) {
  const p = normalizeSurfacePattern(pattern);
  if (p.layout === "transparent" || !p.bands.length) return null;
  if (p.layout === "solid") {
    return resolveSurfaceBand(p.bands[0], options);
  }
  const idx = Math.max(0, Number(altIndex) || 0);
  return resolveSurfaceBand(p.bands[idx % p.bands.length], options);
}

export function surfacePatternLabel(themeOrPattern: unknown) {
  const pattern =
    themeOrPattern &&
    typeof themeOrPattern === "object" &&
    "layout" in themeOrPattern
      ? normalizeSurfacePattern(themeOrPattern)
      : resolveSurfacePattern((themeOrPattern as ThemeLike) || {});

  if (pattern.layout === "transparent") return "No surface (transparent)";
  if (pattern.layout === "solid") {
    return `All sections · ${pattern.bands[0]?.label || "one color"}`;
  }
  const names = pattern.bands.map((b) => b.label).join(" → ");
  return `Repeating · ${names}`;
}

/** @deprecated Use resolveSurfacePattern + surfaceBandAtIndex */
export function surfaceModeLabel(mode: unknown) {
  return surfacePatternLabel(legacyPatternFromMode(mode));
}

/** @deprecated Use surfaceBandAtIndex */
export function surfaceToneForMode(surfaceMode: unknown, altIndex: number) {
  const pattern = legacyPatternFromMode(surfaceMode);
  const band = surfaceBandAtIndex(pattern, altIndex);
  if (!band) return null;
  const match = Object.entries(LEGACY_TONE_BG).find(([, bg]) => bg === band.bg);
  return match?.[0] || "white";
}

export function isSurfaceBandLight(surfaceBand: SurfaceBandLike | null | undefined) {
  if (!surfaceBand) return true;
  return surfaceBand.theme !== "dark";
}

/** @deprecated */
export function isSurfaceToneLight(surfaceTone: unknown) {
  return (
    surfaceTone === "white" ||
    surfaceTone === "muted" ||
    String(surfaceTone || "").startsWith("soft_")
  );
}

const SURFACE_BAND_CLASS: Record<string, string> = {
  white: "section-band-bg",
  muted: "section-band-bg section-band-bg--muted",
  dark: "section-band-bg section-band-bg--dark",
  dark_ink: "section-band-bg section-band-bg--dark-ink",
};

/** CSS shell class for a resolved surface band (pattern-driven rows). */
export function surfaceBandShellClass(surfaceBand: SurfaceBandLike | null | undefined) {
  if (!surfaceBand?.bg) return "section-band-bg";
  const bg = String(surfaceBand.bg).trim().toLowerCase();
  for (const [tone, value] of Object.entries(LEGACY_TONE_BG)) {
    if (String(value).trim().toLowerCase() === bg) {
      return surfaceToneBandClass(tone);
    }
  }
  return "section-band-bg";
}

/** Legacy token → CSS class (section theme overrides only). */
export function surfaceToneBandClass(tone: unknown) {
  if (!tone) return "";
  if (SURFACE_BAND_CLASS[String(tone)]) return SURFACE_BAND_CLASS[String(tone)];
  const key = String(tone);
  if (key.startsWith("soft_")) {
    return `section-band-bg section-band-bg--${key.replace(/_/g, "-")}`;
  }
  return "";
}

export function surfaceBandStyle(surfaceBand: SurfaceBandLike | null | undefined) {
  if (!surfaceBand?.bg) return undefined;
  const bg = surfaceBand.bg;
  if (isBannerGradient(bg) || String(bg).toLowerCase().includes("gradient(")) {
    return {
      backgroundImage: bg,
      backgroundColor: surfaceBand.theme === "dark" ? "#0f172a" : "#ffffff",
      color: surfaceBand.fg,
    };
  }
  return {
    backgroundColor: bg,
    color: surfaceBand.fg,
  };
}

export function surfaceBandPreviewBg(surfaceBandOrTone: unknown) {
  if (surfaceBandOrTone && typeof surfaceBandOrTone === "object") {
    return (surfaceBandOrTone as ResolvedSurfaceBand).bg || "#ffffff";
  }
  return LEGACY_TONE_BG[String(surfaceBandOrTone)] || "#ffffff";
}

export function surfaceBandPreviewLabel(surfaceBand: SurfaceBandLike | null | undefined) {
  if (!surfaceBand) return "transparent / page background";
  return `${surfaceBand.label || "custom"} band`;
}

/** @deprecated */
export function surfaceTonePreviewBg(surfaceTone: unknown) {
  return LEGACY_TONE_BG[String(surfaceTone)] || "#ffffff";
}

/** @deprecated */
export function surfaceTonePreviewLabel(surfaceTone: unknown) {
  if (surfaceTone === "muted") return "muted grey band";
  if (surfaceTone === "dark") return "dark band on this row";
  if (surfaceTone === "dark_ink") return "brand ink dark band";
  if (String(surfaceTone || "").startsWith("soft_")) {
    const slug = String(surfaceTone).replace(/^soft_/, "").replace(/_/g, " ");
    return `soft ${slug} band`;
  }
  return "light band";
}

// Kept for imports that referenced preset lists — map to pattern labels.
export const SURFACE_MODES = [{ value: "custom", label: "Custom pattern", group: "custom" }];
export const SURFACE_MODE_GROUPS = [];
export const SURFACE_MODE_VALUES = ["custom"];
