import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isKeyBenefitShowable } from "./map";
import type { KeyBenefitsSectionProps } from "./types";

export function isKeyBenefitsPlacementShowable(
  props: KeyBenefitsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "key_benefits", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isKeyBenefitShowable);
}
