import { defineSectionBlueprint } from "@/lib/sections/blueprint";

/** Full CMS — nested groups + logo rows; section band hidden. */
export const SARDER_ECOSYSTEM_BLUEPRINT = defineSectionBlueprint({
  key: "sarder_ecosystem",
  archetype: "hybrid",
  band: "fixed-light",
  catalog: {
    name: "Sarder Ecosystem",
    category: "content",
    tags: ["ecosystem", "logos", "spine", "partners"],
    surface: "fixed",
    usesSectionImage: true,
  },
  cms: {
    toolbar: {
      sectionBand: false,
      sectionImage: true,
    },
    fields: {
      section_title: true,
      sub_title: true,
      items: true,
    },
  },
});
