import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isCurriculumItemShowable } from "./map";
import type { CurriculumSectionProps } from "./types";

export function isCurriculumPlacementShowable(
  props: CurriculumSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "curriculum", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isCurriculumItemShowable);
}
