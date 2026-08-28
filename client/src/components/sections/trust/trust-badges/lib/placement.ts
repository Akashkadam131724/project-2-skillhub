import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isTrustBadgeShowable } from "./map";
import type { TrustBadgesSectionProps } from "./types";

export function isTrustBadgesPlacementShowable(
  props: TrustBadgesSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "trust_badges", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isTrustBadgeShowable);
}
