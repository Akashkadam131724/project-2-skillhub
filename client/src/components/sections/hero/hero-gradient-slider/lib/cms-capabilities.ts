import type { SectionCmsCapabilities } from "@/lib/sections/section-cms-capabilities-types";

/**
 * CMS edit surface for hero_gradient_slider.
 * Static phase — placement visibility only; no band/image/nav fields yet.
 */
export const HERO_GRADIENT_SLIDER_CMS_CAPABILITIES = {
  mode: "static",
  staticHint: "Built-in demo slides — CMS fields coming soon",
  toolbar: {
    navTitle: false,
    sectionImage: false,
    sectionBand: false,
    visibility: true,
    removeExtra: true,
  },
  fields: {},
} satisfies SectionCmsCapabilities;
