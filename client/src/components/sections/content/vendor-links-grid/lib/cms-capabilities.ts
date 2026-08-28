import type { SectionCmsCapabilities } from "@/lib/sections/section-cms-capabilities-types";

/** CMS edit surface for vendor_link_grid — left copy, buttons, vendor link items. */
export const VENDOR_LINKS_GRID_CMS_CAPABILITIES = {
  mode: "content",
  toolbar: {
    navTitle: false,
    sectionImage: false,
    sectionBand: true,
    visibility: true,
    removeExtra: true,
  },
  fields: {
    section_title: true,
    body: true,
    buttons: true,
    items: true,
  },
} satisfies SectionCmsCapabilities;
