import { defineSectionBlueprint } from "@/lib/sections/blueprint";

/** Scaffold reference — static phase before full CMS fields. */
export const HERO_GRADIENT_SLIDER_BLUEPRINT = defineSectionBlueprint({
  key: "hero_gradient_slider",
  archetype: "static",
  band: "fixed-dark",
  catalog: {
    name: "Hero — Gradient Slider",
    category: "hero",
    tags: ["hero", "slider", "gradient"],
    surface: "fixed",
  },
});
