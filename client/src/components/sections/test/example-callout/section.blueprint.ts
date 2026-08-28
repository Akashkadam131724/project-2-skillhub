import { defineSectionBlueprint } from "@/lib/sections/blueprint";

/** Sandbox reference — static archetype, page-alt band. */
export const EXAMPLE_CALLOUT_BLUEPRINT = defineSectionBlueprint({
  key: "test_example_callout",
  archetype: "static",
  band: "page-alt",
  catalog: {
    name: "Example callout (test)",
    category: "content",
    tags: ["test", "callout"],
  },
});
