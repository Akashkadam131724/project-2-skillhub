import { isWebsiteBuildStepShowable } from "./map";
import type { WebsiteBuildStepsSectionProps } from "./types";

export function isWebsiteBuildStepsPlacementShowable(
  props: WebsiteBuildStepsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isWebsiteBuildStepShowable);
}
