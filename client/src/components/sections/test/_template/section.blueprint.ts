import { defineSectionBlueprint } from "@/lib/sections/blueprint";

/**
 * Rename key + catalog fields when copying this folder.
 * @see components/sections/test/README.md
 */
export const TEMPLATE_BAND_BLUEPRINT = defineSectionBlueprint({
  key: "test_your_section_key",
  archetype: "static",
  band: "page-alt",
  catalog: {
    name: "Your section (test)",
    category: "content",
    tags: ["test"],
  },
});
