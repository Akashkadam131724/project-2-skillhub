import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isPricingTierShowable } from "./map";
import type { PricingTiersSectionProps } from "./types";

export function isPricingTiersPlacementShowable(
  props: PricingTiersSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "pricing_tiers", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isPricingTierShowable);
}
