import { defineSectionBlueprint } from "@/lib/sections/blueprint";

/** Homepage gradient slider — CMS slides with optional nested stats. */
export const HERO_GRADIENT_SLIDER_BLUEPRINT = defineSectionBlueprint({
  key: "hero_gradient_slider",
  archetype: "items",
  band: "fixed-dark",
  catalog: {
    name: "Hero — Gradient Slider",
    category: "hero",
    tags: ["hero", "slider", "gradient"],
    surface: "fixed",
  },
});
