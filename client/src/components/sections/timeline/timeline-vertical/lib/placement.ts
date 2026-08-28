import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isTimelineStepShowable } from "./map";
import type { TimelineVerticalSectionProps } from "./types";

export function isTimelineVerticalPlacementShowable(
  props: TimelineVerticalSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "timeline_vertical", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isTimelineStepShowable);
}
