import type { SectionCmsCapabilities } from "@/lib/sections/section-cms-capabilities-types";

/** Full CMS — nested groups + logo rows. */
export const SARDER_ECOSYSTEM_CMS_CAPABILITIES = {
  mode: "content",
  toolbar: {
    navTitle: false,
    sectionImage: true,
    visibility: true,
    removeExtra: true,
  },
  fields: {
    section_title: true,
    sub_title: true,
    items: true,
  },
} satisfies SectionCmsCapabilities;
