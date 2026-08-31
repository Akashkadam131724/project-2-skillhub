/**
 * Global section layout — spacing, grid presets, typography classes.
 * Aligns with SectionWrapper (90rem rail) and dev layout ruler.
 *
 * Pick tokens here instead of ad-hoc gap-* / mb-* in section UIs.
 */

export const DS_SPACE = {
  /** Eyebrow → title → subtitle */
  headerStack: "gap-2.5 sm:gap-3",
  /** Space below section header before body */
  headerBody: "mb-8 sm:mb-10",
  /** Vertical stack — tight (FAQ rows, card groups) */
  stackSm: "gap-6",
  /** Vertical stack — default block spacing */
  stackMd: "gap-8",
  /** Vertical stack — split columns, large sections */
  stackLg: "gap-10 lg:gap-12",
  /** Stacked text/media rows */
  stackXl: "gap-16 sm:gap-20 lg:gap-24",
  /** Card / item grids */
  gridGap: "gap-4 sm:gap-5 lg:gap-6",
  gridGapTight: "gap-3 sm:gap-4",
  /** CTA / button rows */
  inlineGap: "gap-4 sm:gap-x-6",
  /** Horizontal logo / marquee tracks */
  trackGap: "gap-x-4 sm:gap-x-5",
} as const;

export type DsSpaceKey = keyof typeof DS_SPACE;

/** Responsive column presets for card grids (use with SectionItemGrid). */
export const DS_GRID = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export type DsGridCols = keyof typeof DS_GRID;

export function sectionGridColsClass(cols: DsGridCols): string {
  return DS_GRID[cols];
}

/**
 * Border radius — one tier per card surface in migrated sections.
 * Avoid ad-hoc `rounded-[*]` on section cards; pick a semantic token.
 */
export const DS_RADIUS = {
  /** Compact tiles — stats, why-choose (~22px) */
  tile: "rounded-[1.35rem]",
  /** FAQ / accordion rows (~20px) */
  accordion: "rounded-[1.25rem]",
  /** Default section cards — training, awards (24px) */
  card: "rounded-[1.5rem]",
  /** Media frames — blog, text-media, tab panels (28px) */
  media: "rounded-[1.75rem]",
  /** Nested cards inside a panel (16px) */
  nested: "rounded-2xl",
  /** Grouped link / vendor panels (12px) */
  panel: "rounded-xl",
  /** Empty-state dashed shells */
  empty: "rounded-3xl",
  /** Icon wells on cards */
  icon: "rounded-2xl",
  iconSm: "rounded-xl",
  /** Badges, pills, decorative orbs */
  pill: "rounded-full",
} as const;

export type DsRadiusKey = keyof typeof DS_RADIUS;

/** Split layout gap presets */
export const DS_SPLIT_GAP = {
  md: "gap-8 lg:gap-12",
  lg: "gap-10 lg:gap-12",
} as const;

export type DsSplitGap = keyof typeof DS_SPLIT_GAP;

/**
 * 12-column grid inside SectionWrapper — aligns with dev layout ruler.
 * Use with SectionSplit `variant="rail"`.
 */
export const DS_RAIL_GRID = {
  shell: "grid w-full grid-cols-12",
} as const;

export const DS_RAIL_COL = {
  /** ~40% copy column */
  copy40: "col-span-12 min-w-0 lg:col-span-5",
  /** ~60% main column */
  main60: "col-span-12 min-w-0 lg:col-span-7",
  copy50: "col-span-12 min-w-0 lg:col-span-6",
  main50: "col-span-12 min-w-0 lg:col-span-6",
  copy60: "col-span-12 min-w-0 lg:col-span-7",
  main40: "col-span-12 min-w-0 lg:col-span-5",
  /** Tabs nav / panel (4 + 8) */
  aside33: "col-span-12 min-w-0 lg:col-span-4",
  main67: "col-span-12 min-w-0 lg:col-span-8",
} as const;

/**
 * Full-bleed hero split — 12-col grid inside SectionWrapper rail.
 * Copy: cols 1–7 · media: absolute right 50% (desktop only).
 */
export const DS_HERO_LAYOUT = {
  grid: "grid w-full grid-cols-12",
  copyCol: "relative z-[1] col-span-12 flex items-center lg:col-span-7",
  copyPad: "py-8 sm:py-12 lg:py-16",
  copyStack: "flex w-full min-w-0 flex-col",
  mediaBleed:
    "absolute inset-y-0 right-0 z-0 hidden w-1/2 overflow-hidden lg:block",
  mediaReserve: "hidden lg:col-span-5 lg:block",
} as const;

/**
 * Typography — composable class strings (pair with DS_TEXT utilities in CSS).
 * Use SectionHeader for the standard block; use these for one-offs inside cards.
 */
export const DS_TYPE = {
  eyebrow:
    "text-brand m-0 text-[11px] font-semibold tracking-[0.22em] uppercase",
  displayTitle:
    "section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl",
  subtitle: "section-theme-muted m-0 max-w-2xl text-base leading-relaxed",
  body: "section-theme-muted m-0 text-base leading-relaxed",
  bodyBlock: "section-theme-muted text-base leading-relaxed",
  /** CMS empty-state placeholders */
  placeholderTitle:
    "section-theme-placeholder m-0 text-3xl leading-tight font-semibold italic sm:text-4xl",
  placeholderSubtitle:
    "section-theme-placeholder m-0 text-base leading-relaxed italic",
  /** Full-bleed dark hero headline */
  heroTitle:
    "m-0 text-[40px] font-semibold leading-tight tracking-tight text-white sm:text-[36px] lg:text-[40px]",
  heroBody: "leading-relaxed text-slate-200 [&>*]:m-0",
} as const;

export function sectionClassNames(
  ...parts: Array<string | false | null | undefined>
) {
  return parts.filter(Boolean).join(" ");
}
