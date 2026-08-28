import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isMetricRailItemShowable } from "./map";
import type { MetricRailSectionProps } from "./types";

export function isMetricRailPlacementShowable(
  props: MetricRailSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "metric_rail", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isMetricRailItemShowable);
}
