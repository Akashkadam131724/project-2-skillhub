/**
 * Page-level section band surfaces — stored on site/page theme
 * (`surface_band_fill`, `surface_band_fill_alt`).
 */

import {
  BAND_SURFACE_GRADIENTS,
  DARK_SOLID_PRESETS,
  isBannerGradient,
} from "@/lib/theme/banner-bg";

/** @typedef {{ id: string, label: string, bg: string, theme: "light"|"dark"|null, hint?: string }} BandSurfacePreset */

/** @type {BandSurfacePreset} */
export const BAND_SURFACE_PAGE_DEFAULT = {
  id: "page_default",
  label: "System default",
  bg: "",
  theme: null,
  hint: "White / grey / ink from surface mode only",
};

function solid(label, value, theme = "light") {
  return {
    id: `solid_${label.toLowerCase().replace(/\s+/g, "_")}`,
    label,
    bg: value,
    theme,
  };
}

/** @param {{ id: string, label: string, value: string, hint?: string }} entry */
function bandGrad(entry, theme) {
  return {
    id: entry.id,
    label: entry.label,
    bg: entry.value,
    theme,
    hint: entry.hint,
  };
}

function mapGradList(list, theme) {
  return list.map((e) => bandGrad(e, theme));
}

/** @type {{ id: string, title: string, tone: "light"|"dark", description?: string, presets: BandSurfacePreset[] }[]} */
export const SECTION_BAND_SURFACE_GROUPS = [
  {
    id: "light_solids",
    title: "Light solids",
    tone: "light",
    presets: [
      BAND_SURFACE_PAGE_DEFAULT,
      solid("White", "#ffffff", "light"),
      solid("Off-white", "#f8fafc", "light"),
      solid("Soft grey", "#f1f5f9", "light"),
      solid("Sky soft", "#e0f2fe", "light"),
      solid("Mint soft", "#ecfdf5", "light"),
      solid("Lavender soft", "#f5f3ff", "light"),
    ],
  },
  {
    id: "light_grad_best",
    title: "Light gradients · best singles",
    tone: "light",
    description: "One strong fill for a hero or feature band.",
    presets: mapGradList(BAND_SURFACE_GRADIENTS.light.best, "light"),
  },
  {
    id: "light_grad_alt",
    title: "Light gradients · alternate rows",
    tone: "light",
    description:
      "Soft shifts — use on every other section (e.g. Soft mint ↔ Paper wash).",
    presets: [
      BAND_SURFACE_PAGE_DEFAULT,
      ...mapGradList(BAND_SURFACE_GRADIENTS.light.alternate, "light"),
    ],
  },
  {
    id: "dark_solids",
    title: "Dark solids",
    tone: "dark",
    presets: [
      solid("Ink", "var(--ink)", "dark"),
      ...DARK_SOLID_PRESETS.slice(1, 5).map((p) =>
        solid(p.label, p.value, "dark")
      ),
    ],
  },
  {
    id: "dark_grad_best",
    title: "Dark gradients · best singles",
    tone: "dark",
    description: "One bold dark band — pricing, CTA, stats.",
    presets: mapGradList(BAND_SURFACE_GRADIENTS.dark.best, "dark"),
  },
  {
    id: "dark_grad_alt",
    title: "Dark gradients · alternate rows",
    tone: "dark",
    description: "Vary navy rows — e.g. Midnight ↔ Steel or Forest mist.",
    presets: [
      BAND_SURFACE_PAGE_DEFAULT,
      ...mapGradList(BAND_SURFACE_GRADIENTS.dark.alternate, "dark"),
    ],
  },
];

export const SECTION_BAND_SURFACE_PRESETS = SECTION_BAND_SURFACE_GROUPS.flatMap(
  (g) => g.presets
);

export function normalizeBandBgValue(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function matchBandSurfacePreset(bgColor) {
  const norm = normalizeBandBgValue(bgColor);
  if (!norm) return BAND_SURFACE_PAGE_DEFAULT;
  for (const p of SECTION_BAND_SURFACE_PRESETS) {
    if (!p.bg) continue;
    if (normalizeBandBgValue(p.bg) === norm) return p;
  }
  return null;
}

export function bandSurfaceSwatchStyle(bg) {
  if (!bg) {
    return {
      background:
        "repeating-linear-gradient(-45deg, #e2e8f0 0, #e2e8f0 6px, #f8fafc 6px, #f8fafc 12px)",
    };
  }
  if (isBannerGradient(bg)) {
    return { backgroundImage: bg, backgroundColor: "#f1f5f9" };
  }
  return { backgroundColor: bg };
}

export function applyBandSurfacePreset(preset) {
  if (!preset || preset.id === BAND_SURFACE_PAGE_DEFAULT.id) {
    return "";
  }
  return preset.bg || "";
}

export function pageBandFillFromPreset(preset, { nullable = false } = {}) {
  const v = applyBandSurfacePreset(preset);
  if (!v) return nullable ? null : "";
  return v;
}

export function pageBandThemeForFill(bgColor) {
  const match = matchBandSurfacePreset(bgColor);
  if (match?.theme === "light" || match?.theme === "dark") return match.theme;
  return null;
}
