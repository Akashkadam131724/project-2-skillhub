import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isPartnerLogoShowable } from "./map";
import { PARTNER_LOGOS } from "./partner-logos";
import type { PartnersMarqueeSectionProps } from "./types";

export function isPartnersMarqueePlacementShowable(
  props: PartnersMarqueeSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "partners_marquee", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  if (items.some(isPartnerLogoShowable)) return true;
  return PARTNER_LOGOS.length > 0;
}
