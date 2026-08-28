import { buildInPageNavItems } from "./map";
import type { InPageNavSectionProps } from "./types";

export function isInPageNavPlacementShowable(
  props: InPageNavSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  return buildInPageNavItems(props.navSections).length >= 2;
}
