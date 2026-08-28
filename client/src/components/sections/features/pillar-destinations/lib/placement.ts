import { isPillarDestinationsItemShowable } from "./map";
import type { PillarDestinationsSectionProps } from "./types";

export function isPillarDestinationsPlacementShowable(
  props: PillarDestinationsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isPillarDestinationsItemShowable);
}
