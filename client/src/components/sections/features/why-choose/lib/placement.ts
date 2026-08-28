import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isWhyChooseShowable } from "./map";
import type { WhyChooseSectionProps } from "./types";

export function isWhyChoosePlacementShowable(
  props: WhyChooseSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "why_choose", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isWhyChooseShowable);
}
