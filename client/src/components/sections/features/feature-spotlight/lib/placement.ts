import { isFeatureSpotlightItemShowable } from "./map";
import type { FeatureSpotlightSectionProps } from "./types";

export function isFeatureSpotlightPlacementShowable(
  props: FeatureSpotlightSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isFeatureSpotlightItemShowable);
}
