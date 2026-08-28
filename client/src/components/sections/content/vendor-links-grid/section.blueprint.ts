import { defineSectionBlueprint } from "@/lib/sections/blueprint";

/** Scaffold reference — copy when adding a hybrid global section. */
export const VENDOR_LINK_GRID_BLUEPRINT = defineSectionBlueprint({
  key: "vendor_link_grid",
  archetype: "hybrid",
  band: "page-alt",
  staticFallback: true,
  inheritDarkBand: true,
  catalog: {
    name: "Vendor Link Grid",
    category: "content",
    tags: ["content", "links", "vendors", "grid"],
    contentScope: "global",
  },
});
