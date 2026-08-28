import type { SectionCmsCapabilities } from "@/lib/sections/section-cms-capabilities-types";

/** Full CMS — section band hidden; groups + logo rows via nested items. */
export const SARDER_ECOSYSTEM_CMS_CAPABILITIES = {
  mode: "content",
  toolbar: {
    navTitle: false,
    sectionImage: true,
    sectionBand: false,
    visibility: true,
    removeExtra: true,
  },
  fields: {
    section_title: true,
    sub_title: true,
    items: true,
  },
} satisfies SectionCmsCapabilities;
