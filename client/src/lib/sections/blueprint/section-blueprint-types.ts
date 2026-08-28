import type { SectionCmsCapabilities } from "@/lib/sections/section-cms-capabilities-types";

/** How the section participates in page bands / CMS band editor. */
export type SectionBandProfile =
  | "page-alt"
  | "own-band"
  | "band-skip"
  | "fixed-dark"
  | "fixed-light";

/**
 * Section creation profile — pick one when scaffolding a variant.
 * Maps to cms-capabilities, theme data sets, and catalog defaults.
 */
export type SectionArchetype =
  | "static"
  | "fields"
  | "items"
  | "hybrid"
  | "context";

export type SectionBlueprint = {
  /** Behavior / render key (manifest + component folder) */
  key: string;
  archetype: SectionArchetype;
  band: SectionBandProfile;
  /** Catalog defaults — merged into defineCatalogEntry */
  catalog?: {
    name: string;
    category: string;
    tags?: string[];
    surface?: "alt" | "fixed";
    usesSectionImage?: boolean;
    contentScope?: "global" | "template" | "page";
    renderKey?: string;
  };
  /** Override DEFAULT_SECTION_CMS_CAPABILITIES */
  cms?: Partial<SectionCmsCapabilities>;
  /** Public pages show static demo when CMS fields empty */
  staticFallback?: boolean;
  /** Registry seed hint — default dark when section_theme is inherit */
  inheritDarkBand?: boolean;
};
