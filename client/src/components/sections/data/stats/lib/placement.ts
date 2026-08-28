import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isStatShowable } from "./map";
import type { StatsSectionProps } from "./types";

export function isStatsPlacementShowable(
  props: StatsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "stats", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isStatShowable);
}
