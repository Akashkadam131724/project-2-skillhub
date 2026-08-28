import type { SectionCmsCapabilities } from "./section-cms-capabilities-types";

/** Shared CMS defaults — keep free of section imports to avoid circular deps with blueprint. */
export const DEFAULT_SECTION_CMS_CAPABILITIES: SectionCmsCapabilities = {
  mode: "content",
  toolbar: {
    navTitle: true,
    sectionImage: "auto",
    sectionBand: true,
    visibility: true,
    removeExtra: true,
  },
  fields: {},
};
