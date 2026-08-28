import type { SectionCmsCapabilities } from "@/lib/sections/section-cms-capabilities-types";
import { DEFAULT_SECTION_CMS_CAPABILITIES } from "@/lib/sections/section-cms-capabilities-default";
import { defineCatalogEntry } from "@/lib/sections/catalog/define-catalog-entry";
import type { SectionArchetype, SectionBandProfile, SectionBlueprint } from "./section-blueprint-types";

const ARCHETYPE_CMS: Record<SectionArchetype, Partial<SectionCmsCapabilities>> = {
  static: {
    mode: "static",
    staticHint: "Built-in demo content — CMS fields coming soon",
    toolbar: {
      navTitle: false,
      sectionImage: false,
      sectionBand: false,
      visibility: true,
      removeExtra: true,
    },
    fields: {},
  },
  fields: {
    mode: "content",
    toolbar: {
      navTitle: true,
      sectionImage: "auto",
      sectionBand: true,
      visibility: true,
      removeExtra: true,
    },
    fields: {
      section_title: true,
      sub_title: true,
      body: true,
      buttons: true,
    },
  },
  items: {
    mode: "content",
    toolbar: {
      navTitle: true,
      sectionImage: false,
      sectionBand: true,
      visibility: true,
      removeExtra: true,
    },
    fields: {
      section_title: true,
      sub_title: true,
      items: true,
      buttons: true,
    },
  },
  hybrid: {
    mode: "content",
    toolbar: {
      navTitle: false,
      sectionImage: false,
      sectionBand: true,
      visibility: true,
      removeExtra: true,
    },
    fields: {
      section_title: true,
      body: true,
      buttons: true,
      items: true,
    },
  },
  context: {
    mode: "content",
    toolbar: {
      navTitle: false,
      sectionImage: false,
      sectionBand: false,
      visibility: true,
      removeExtra: true,
    },
    fields: {},
  },
};

const BAND_CATALOG_SURFACE: Record<SectionBandProfile, "alt" | "fixed"> = {
  "page-alt": "alt",
  "own-band": "fixed",
  "band-skip": "fixed",
  "fixed-dark": "fixed",
  "fixed-light": "fixed",
};

/** Theme data file hints — apply keys manually when registering (documented on blueprint). */
export const BAND_THEME_HINTS: Record<
  SectionBandProfile,
  { ownBand?: boolean; bandSkip?: boolean; fixedTheme?: boolean; inheritDark?: boolean }
> = {
  "page-alt": {},
  "own-band": { ownBand: true },
  "band-skip": { bandSkip: true },
  "fixed-dark": { ownBand: true, fixedTheme: true },
  "fixed-light": { ownBand: true, fixedTheme: true },
};

export function resolveBlueprintCmsCapabilities(
  blueprint: SectionBlueprint
): SectionCmsCapabilities {
  const base = ARCHETYPE_CMS[blueprint.archetype];
  const cms = blueprint.cms ?? {};
  return {
    mode: cms.mode ?? base.mode ?? DEFAULT_SECTION_CMS_CAPABILITIES.mode,
    staticHint: cms.staticHint ?? base.staticHint,
    toolbar: {
      ...DEFAULT_SECTION_CMS_CAPABILITIES.toolbar,
      ...base.toolbar,
      ...cms.toolbar,
    },
    fields: { ...base.fields, ...cms.fields },
  };
}

export function resolveBlueprintCatalogEntry(blueprint: SectionBlueprint) {
  const cat = blueprint.catalog;
  if (!cat) {
    throw new Error(`Blueprint ${blueprint.key} missing catalog metadata`);
  }
  const surface =
    cat.surface ?? BAND_CATALOG_SURFACE[blueprint.band] ?? "alt";
  return defineCatalogEntry({
    key: blueprint.key,
    name: cat.name,
    category: cat.category,
    tags: cat.tags,
    surface,
    usesSectionImage: cat.usesSectionImage ?? false,
    contentScope: cat.contentScope,
    renderKey: cat.renderKey,
  });
}

export function defineSectionBlueprint(blueprint: SectionBlueprint): SectionBlueprint {
  return blueprint;
}
