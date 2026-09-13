import type { SectionCmsCapabilities } from "@/lib/sections/section-cms-capabilities-types";

/** CMS edit surface for hero_gradient_slider — slides + optional stats. */
export const HERO_GRADIENT_SLIDER_CMS_CAPABILITIES = {
  mode: "content",
  toolbar: {
    navTitle: false,
    sectionImage: false,
    visibility: true,
    removeExtra: true,
  },
  fields: {
    items: true,
  },
} satisfies SectionCmsCapabilities;
