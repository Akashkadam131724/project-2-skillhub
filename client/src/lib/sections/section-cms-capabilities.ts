/**
 * Per-section CMS capabilities — what editors can change in the live toolbar / drawers.
 * Each variant owns its config in `lib/cms-capabilities.ts`; register here.
 */
import { HERO_GRADIENT_SLIDER_CMS_CAPABILITIES } from "@/components/sections/hero/hero-gradient-slider/lib/cms-capabilities";
import { resolveSectionBehaviorKey } from "./section-items-config";
import type { SectionCmsCapabilities } from "./section-cms-capabilities-types";

export type {
  SectionCmsCapabilities,
  SectionCmsMode,
  SectionCmsToolbarCapabilities,
} from "./section-cms-capabilities-types";

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

export const SECTION_COMPONENT_CMS_CAPABILITIES: Record<
  string,
  SectionCmsCapabilities
> = {
  hero_gradient_slider: HERO_GRADIENT_SLIDER_CMS_CAPABILITIES,
};

export function getSectionCmsCapabilities(
  sectionKey?: string | null,
  renderKey?: string | null
): SectionCmsCapabilities {
  const behavior = resolveSectionBehaviorKey(sectionKey, renderKey ?? undefined);
  return (
    SECTION_COMPONENT_CMS_CAPABILITIES[behavior] ||
    DEFAULT_SECTION_CMS_CAPABILITIES
  );
}

export function sectionCmsMode(
  sectionKey?: string | null,
  renderKey?: string | null
) {
  return getSectionCmsCapabilities(sectionKey, renderKey).mode;
}

export function sectionCmsStaticHint(
  sectionKey?: string | null,
  renderKey?: string | null
) {
  return getSectionCmsCapabilities(sectionKey, renderKey).staticHint || "";
}

function resolveToolbarFlag(
  value: boolean | "auto",
  autoFn: () => boolean
): boolean {
  if (value === "auto") return autoFn();
  return Boolean(value);
}

export type SectionToolbarVisibility = {
  navTitle: boolean;
  sectionImage: boolean;
  sectionBand: boolean;
  visibility: boolean;
  removeExtra: boolean;
  mode: SectionCmsCapabilities["mode"];
  staticHint: string;
};

/**
 * Resolved toolbar flags for a placement (pass sectionUsesImage for `auto` image).
 */
export function resolveSectionToolbarVisibility(
  sectionKey?: string | null,
  renderKey?: string | null,
  {
    sectionUsesImage = () => false,
  }: { sectionUsesImage?: (key?: string | null, rk?: string | null) => boolean } = {}
): SectionToolbarVisibility {
  const cap = getSectionCmsCapabilities(sectionKey, renderKey);
  const toolbar = cap.toolbar;

  return {
    navTitle: Boolean(toolbar.navTitle),
    sectionImage: resolveToolbarFlag(toolbar.sectionImage, () =>
      sectionUsesImage(sectionKey, renderKey)
    ),
    sectionBand: Boolean(toolbar.sectionBand),
    visibility: Boolean(toolbar.visibility),
    removeExtra: Boolean(toolbar.removeExtra),
    mode: cap.mode,
    staticHint: cap.staticHint || "",
  };
}

/** Whether a field drawer may open (toolbar + future inline edits). */
export function sectionCmsFieldAllowed(
  sectionKey?: string | null,
  renderKey?: string | null,
  field?: string
) {
  const cap = getSectionCmsCapabilities(sectionKey, renderKey);

  if (field === "in_page_nav_title") {
    return Boolean(cap.toolbar.navTitle);
  }
  if (field === "section_img_url") {
    return cap.toolbar.sectionImage !== false;
  }
  if (
    field === "section_band" ||
    field === "section_bg_img" ||
    field === "section_bg_color"
  ) {
    return Boolean(cap.toolbar.sectionBand);
  }
  if (cap.fields && field && field in cap.fields) {
    return Boolean(cap.fields[field]);
  }
  if (cap.mode === "static") {
    return false;
  }
  return true;
}
