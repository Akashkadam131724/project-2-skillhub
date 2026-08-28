import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isComparisonItemShowable } from "./map";
import type { ComparisonTableSectionProps } from "./types";

export function isComparisonPlacementShowable(
  props: ComparisonTableSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "comparison_table", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isComparisonItemShowable);
}
