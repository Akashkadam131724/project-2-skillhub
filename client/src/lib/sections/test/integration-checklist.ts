import type { SectionBlueprint } from "@/lib/sections/blueprint";

export type SectionIntegrationStep = {
  id: string;
  label: string;
  file: string;
  /** Skip for static-only prototypes in `sections/test/` */
  optional?: boolean;
};

/** Files to touch when promoting a test section to production. */
export const SECTION_INTEGRATION_STEPS: SectionIntegrationStep[] = [
  {
    id: "blueprint",
    label: "section.blueprint.ts — archetype + band",
    file: "components/sections/<folder>/section.blueprint.ts",
    optional: true,
  },
  {
    id: "ui",
    label: "Ui + Static + Public + Section adapters",
    file: "components/sections/<folder>/",
  },
  {
    id: "catalog",
    label: "defineCatalogEntry row",
    file: "lib/sections/section-catalog.entries.js",
  },
  {
    id: "server-catalog",
    label: "Server CMS catalog mirror",
    file: "server/src/modules/cms/section.catalog.js",
  },
  {
    id: "manifest",
    label: "loadPublic / loadStatic",
    file: "lib/sections/section-manifest.ts",
  },
  {
    id: "registry-sync",
    label: "Eager Section component for live edit",
    file: "lib/sections/section-registry-sync.js",
    optional: true,
  },
  {
    id: "items-config",
    label: "items[] field config",
    file: "lib/sections/configs/index.js",
    optional: true,
  },
  {
    id: "cms-capabilities",
    label: "Toolbar + fields registry",
    file: "lib/sections/section-cms-capabilities.ts",
    optional: true,
  },
  {
    id: "theme",
    label: "Band theme sets (own-band, inherit-dark, etc.)",
    file: "lib/sections/theme/section-theme.data.js",
    optional: true,
  },
  {
    id: "user-guide",
    label: "Preview page with build + CMS steps",
    file: "app/(public)/user-guide/test/<slug>/page.tsx",
    optional: true,
  },
];

export type TestSectionEntry = {
  slug: string;
  key: string;
  name: string;
  folder: string;
  blueprint?: SectionBlueprint;
};

/** Registered prototypes living under `components/sections/test/`. */
export const TEST_SECTION_ENTRIES: TestSectionEntry[] = [
  {
    slug: "example-callout",
    key: "test_example_callout",
    name: "Example callout",
    folder: "components/sections/test/example-callout",
  },
];

export function stepsForBlueprint(blueprint: SectionBlueprint): SectionIntegrationStep[] {
  const archetype = blueprint.archetype;
  return SECTION_INTEGRATION_STEPS.filter((step) => {
    if (step.id === "registry-sync" && archetype === "static") return false;
    if (step.id === "items-config" && archetype !== "items" && archetype !== "hybrid") {
      return false;
    }
    if (step.id === "cms-capabilities" && archetype === "static") return false;
    return true;
  });
}
