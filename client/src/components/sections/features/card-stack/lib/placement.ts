import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isCardStackItemShowable } from "./map";
import type { CardStackSectionProps } from "./types";

export function isCardStackPlacementShowable(
  props: CardStackSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "card_stack", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isCardStackItemShowable);
}
