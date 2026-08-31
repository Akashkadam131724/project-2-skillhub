/**
 * Section design system — single source for band + surface styling.
 *
 * ## Layers (outside → in)
 * 1. **Page stack** — `SectionSurface` (CMS) sets band background + `data-section-theme="light"|"dark"`.
 * 2. **Band content** — transparent `SectionBand` / `section-band-shell`; copy uses `DS.text.*`.
 * 3. **Light island** — `SectionLightCard` / `data-section-surface="light-card"` resets all
 *    `--card-*`, `--field-*`, and `--ds-btn-*` tokens so white cards/forms look identical on any band.
 *
 * ## Rules
 * - Never put `bg-white` / `dark:bg-slate-*` on the outer `<section>` of a CMS placement.
 * - Band copy: `section-theme-heading` | `muted` | `subtle` (not `text-ink` / `text-white` / `text-slate-*`).
 * - Forms on dark bands: wrap fields in `SectionLightCard` (or `data-section-surface="light-card"`).
 * - Photos / gradients with light type: `SectionMediaOverlay`.
 * - Brand accents (`text-brand`) are OK on any layer.
 *
 * CSS tokens live in `app/section-theme.css` (`--band-*`, `--card-*`, `--field-*`).
 * Buttons: `app/section-buttons.css` + `components/ui/DsButton.js` + `lib/utils/button-types.js`.
 * Tabs: `app/section-tabs.css`.
 */

export const SECTION_SURFACE_LIGHT_CARD = "light-card";
export const SECTION_SURFACE_DARK_OVERLAY = "dark-overlay";
export const SECTION_SURFACE_GLASS_CARD = "glass-card";

export const SECTION_LIGHT_CARD_CLASS = "section-light-card";

/** Band content shell — no background; inherits SectionSurface */
export const SECTION_BAND_SHELL_CLASS = "section-band-shell";

/** White / ink card panel — sets --card-* and paints shell */
export const SECTION_LIGHT_CARD_SHELL_CLASS = "section-light-card-shell";

/** Glass panel on dark bands (FAQ, stat tiles) */
export const SECTION_GLASS_CARD_SHELL_CLASS = "section-glass-card-shell";

export const SECTION_BAND_PADDING_SM =
  "py-14 sm:py-16 lg:py-20";
export const SECTION_BAND_PADDING_LG =
  "py-16 sm:py-20 lg:py-24";

/** Typography + fields — use inside band or inside a surface preset */
export const DS_TEXT = {
  heading: "section-theme-heading",
  muted: "section-theme-muted",
  subtle: "section-theme-subtle",
  placeholder: "section-theme-placeholder",
  eyebrow: "section-ds-eyebrow",
};

export const DS_FIELD = {
  input: "section-field",
  label: "section-field-label",
  checkbox: "section-field-checkbox",
};

export const DS_BADGE = {
  media: "section-media-badge",
  faqIndex: "section-faq-index",
};

/** Design-system buttons — render with DsButton / SectionButtons */
export const DS_BUTTON = {
  base: "section-btn",
  /** Force light palette on white cards inside dark bands */
  surfaceLight: { "data-btn-surface": "light" },
  /** Force glass/dark-band palette (heroes, cinematic bands) */
  surfaceDark: { "data-btn-surface": "dark" },
  /**
   * Tailwind !-class fields — see `ButtonAppearanceFields` in CMS editor.
   * @type {Record<string, string>}
   */
  appearanceFields: {
    bg: "cls_bg",
    text: "cls_text",
    border: "cls_border",
    hoverBg: "cls_hover_bg",
    hoverText: "cls_hover_text",
    hoverBorder: "cls_hover_border",
  },
  /**
   * Optional CSS variable overrides — set on button, parent, or via DsButton `custom` prop.
   */
  customTokens: {
    bg: "--ds-btn-custom-bg",
    fg: "--ds-btn-custom-fg",
    border: "--ds-btn-custom-border",
    hoverBg: "--ds-btn-custom-hover-bg",
    hoverFg: "--ds-btn-custom-hover-fg",
    hoverBorder: "--ds-btn-custom-hover-border",
  },
  /**
   * Dark-band CTAs — white primary + white-outline secondary.
   */
  darkCtaSet: [
    { variant: "primary", size: "md", shape: "rounded" },
    { variant: "outline", size: "md", shape: "rounded" },
  ],
  /** @deprecated use darkCtaSet */
  darkCtaPair: [
    { variant: "primary", size: "md", shape: "rounded" },
    { variant: "outline", size: "md", shape: "rounded" },
  ],
};

/** Card / panel shells — use with Tailwind `border`, radius, padding */
export const DS_CARD = {
  /** Contextual card (glass on dark band, solid on light band) */
  ui: "section-ui-card",
  /** Compact chip / pill with card tokens */
  chip: "section-ui-chip",
};

export const DS_BAND = {
  bg: "section-band-bg",
};

/** @deprecated use DS_TEXT.heading */
export const SECTION_ITEM_TITLE_CLASS = DS_TEXT.heading;
/** @deprecated use DS_TEXT.muted */
export const SECTION_ITEM_MUTED_CLASS = DS_TEXT.muted;

export function sectionClassNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Props for a white card surface (testimonials, forms, team cards) */
export function sectionLightCardSurfaceProps(extraClass = "") {
  return {
    "data-section-surface": SECTION_SURFACE_LIGHT_CARD,
    "data-light-surface": "",
    className: sectionClassNames(
      SECTION_LIGHT_CARD_CLASS,
      SECTION_LIGHT_CARD_SHELL_CLASS,
      extraClass
    ),
  };
}

/** Props for image / cinematic overlays */
export function sectionDarkOverlaySurfaceProps(extraClass = "") {
  return {
    "data-section-surface": SECTION_SURFACE_DARK_OVERLAY,
    className: sectionClassNames(extraClass),
  };
}

/** Props for glass cards on dark bands (optional) */
export function sectionGlassCardSurfaceProps(extraClass = "") {
  return {
    "data-section-surface": SECTION_SURFACE_GLASS_CARD,
    className: sectionClassNames(
      SECTION_GLASS_CARD_SHELL_CLASS,
      extraClass
    ),
  };
}

/** Standard decorative brand radial (forms, contact) */
export const SECTION_BRAND_GLOW_STYLE = {
  backgroundImage:
    "radial-gradient(circle at 8% 12%, color-mix(in oklab, var(--brand) 14%, transparent), transparent 38%), radial-gradient(circle at 92% 88%, color-mix(in oklab, var(--brand) 10%, transparent), transparent 36%)",
};

export function sectionBrandGlowClassName() {
  return "section-brand-glow";
}
