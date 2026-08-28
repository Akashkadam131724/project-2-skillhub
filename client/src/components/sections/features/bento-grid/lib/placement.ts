import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isBentoGridCellShowable } from "./map";
import type { BentoGridSectionProps } from "./types";

export function isBentoGridPlacementShowable(
  props: BentoGridSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "bento_grid", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isBentoGridCellShowable);
}
