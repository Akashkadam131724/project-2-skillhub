import { defineSectionBlueprint } from "@/lib/sections/blueprint";

/** Static phase — CMS fields for groups/items coming later. */
export const SARDER_ECOSYSTEM_BLUEPRINT = defineSectionBlueprint({
  key: "sarder_ecosystem",
  archetype: "static",
  band: "fixed-light",
  catalog: {
    name: "Sarder Ecosystem",
    category: "content",
    tags: ["ecosystem", "logos", "spine", "partners"],
    surface: "fixed",
  },
});
